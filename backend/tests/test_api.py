import jwt as pyjwt
import pytest

from app.core.config import settings
from app.core.security import create_access_token, decode_token


@pytest.mark.asyncio
async def test_root(client) -> None:
    response = await client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["message"].endswith("is running")
    assert body["health"] == "/health"


@pytest.mark.asyncio
async def test_health(client) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"
    assert body["app"] == settings.APP_NAME


def test_jwt_roundtrip() -> None:
    token = create_access_token("user-1")
    payload = decode_token(token)
    assert payload["sub"] == "user-1"
    assert payload["type"] == "access"


def test_jwt_tampered_token_rejected() -> None:
    token = create_access_token("user-1")
    with pytest.raises(pyjwt.PyJWTError):
        decode_token(token + "x")
