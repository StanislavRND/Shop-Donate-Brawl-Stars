"""Integration tests for the main auth scenarios (in-memory SQLite, cookie-based)."""

import pytest

EMAIL = "user@example.com"
USERNAME = "testuser"
PASSWORD = "SuperSecret123"


def register_payload(
    email: str = EMAIL, username: str = USERNAME, password: str = PASSWORD
) -> dict:
    return {"email": email, "username": username, "password": password}


async def register_and_verify(
    client, email_service, email: str = EMAIL, username: str = USERNAME
) -> None:
    response = await client.post(
        "/api/v1/auth/register", json=register_payload(email, username)
    )
    assert response.status_code == 201
    code = email_service.codes[email]
    response = await client.post(
        "/api/v1/auth/verify-email", json={"email": email, "code": code}
    )
    assert response.status_code == 200


async def login(client, login: str = EMAIL) -> None:
    response = await client.post(
        "/api/v1/auth/login", json={"login": login, "password": PASSWORD}
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_register_sends_verification_code(client, email_service) -> None:
    response = await client.post("/api/v1/auth/register", json=register_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == EMAIL
    assert body["username"] == USERNAME
    assert body["is_verified"] is False
    # A 6-digit code was "sent"
    assert email_service.codes[EMAIL].isdigit()
    assert len(email_service.codes[EMAIL]) == 6


@pytest.mark.asyncio
async def test_register_invalid_payload(client) -> None:
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "username": "a", "password": "123"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_duplicate_verified_email(client, email_service) -> None:
    await register_and_verify(client, email_service)
    response = await client.post(
        "/api/v1/auth/register", json=register_payload(username="otheruser")
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_register_duplicate_username(client, email_service) -> None:
    await register_and_verify(client, email_service)
    response = await client.post(
        "/api/v1/auth/register",
        json=register_payload(email="other@example.com"),
    )
    assert response.status_code == 409
    assert "имя пользователя" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_verify_email_wrong_code(client, email_service) -> None:
    await client.post("/api/v1/auth/register", json=register_payload())
    response = await client.post(
        "/api/v1/auth/verify-email", json={"email": EMAIL, "code": "000000"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_verify_email_success(client, email_service) -> None:
    await client.post("/api/v1/auth/register", json=register_payload())
    code = email_service.codes[EMAIL]
    response = await client.post(
        "/api/v1/auth/verify-email", json={"email": EMAIL, "code": code}
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_resend_verification(client, email_service) -> None:
    await client.post("/api/v1/auth/register", json=register_payload())
    first_code = email_service.codes[EMAIL]
    response = await client.post(
        "/api/v1/auth/resend-verification", json={"email": EMAIL}
    )
    assert response.status_code == 200
    assert email_service.codes[EMAIL] != first_code


@pytest.mark.asyncio
async def test_login_unverified_user_forbidden(client) -> None:
    await client.post("/api/v1/auth/register", json=register_payload())
    response = await client.post(
        "/api/v1/auth/login", json={"login": EMAIL, "password": PASSWORD}
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_login_wrong_password(client, email_service) -> None:
    await register_and_verify(client, email_service)
    response = await client.post(
        "/api/v1/auth/login", json={"login": EMAIL, "password": "WrongPassword1"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_by_username(client, email_service) -> None:
    await register_and_verify(client, email_service)
    response = await client.post(
        "/api/v1/auth/login", json={"login": USERNAME, "password": PASSWORD}
    )
    assert response.status_code == 200
    assert response.json()["user"]["username"] == USERNAME


@pytest.mark.asyncio
async def test_login_sets_httponly_cookies_and_no_tokens_in_body(
    client, email_service
) -> None:
    await register_and_verify(client, email_service)
    response = await client.post(
        "/api/v1/auth/login", json={"login": EMAIL, "password": PASSWORD}
    )
    assert response.status_code == 200

    # Tokens must NOT be exposed in the response body
    body = response.json()
    assert "access_token" not in body
    assert "refresh_token" not in body
    assert body["user"]["email"] == EMAIL

    # HttpOnly cookies are set
    set_cookies = "; ".join(response.headers.get_list("set-cookie"))
    assert "access_token=" in set_cookies
    assert "refresh_token=" in set_cookies
    assert "HttpOnly" in set_cookies
    assert "samesite=lax" in set_cookies.lower()


@pytest.mark.asyncio
async def test_me_uses_access_token_cookie(client, email_service) -> None:
    await register_and_verify(client, email_service)
    await login(client)

    me = await client.get("/api/v1/users/me")
    assert me.status_code == 200
    assert me.json()["email"] == EMAIL
    assert me.json()["username"] == USERNAME


@pytest.mark.asyncio
async def test_me_without_token_unauthorized(client) -> None:
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_with_garbage_cookie_unauthorized(client, email_service) -> None:
    await register_and_verify(client, email_service)
    await login(client)
    client.cookies.set("access_token", "garbage")
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_without_cookie_unauthorized(client) -> None:
    response = await client.post("/api/v1/auth/refresh")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_rotates_cookie_without_body(client, email_service) -> None:
    await register_and_verify(client, email_service)
    await login(client)
    old_refresh = client.cookies.get("refresh_token")

    # No body: the refresh token comes from the HttpOnly cookie
    refreshed = await client.post("/api/v1/auth/refresh")
    assert refreshed.status_code == 200
    assert refreshed.json()["user"]["email"] == EMAIL

    new_refresh = client.cookies.get("refresh_token")
    assert new_refresh != old_refresh

    # New access token cookie works
    me = await client.get("/api/v1/users/me")
    assert me.status_code == 200

    # The rotated (old) refresh token is revoked
    client.cookies.set("refresh_token", old_refresh)
    reuse = await client.post("/api/v1/auth/refresh")
    assert reuse.status_code == 401


@pytest.mark.asyncio
async def test_logout_revokes_tokens_and_clears_cookies(client, email_service) -> None:
    await register_and_verify(client, email_service)
    await login(client)

    logout = await client.post("/api/v1/auth/logout")
    assert logout.status_code == 200
    assert client.cookies.get("refresh_token") is None

    # Refresh with the cleared cookie fails
    refresh = await client.post("/api/v1/auth/refresh")
    assert refresh.status_code == 401


@pytest.mark.asyncio
async def test_logout_requires_auth(client) -> None:
    response = await client.post("/api/v1/auth/logout")
    assert response.status_code == 401
