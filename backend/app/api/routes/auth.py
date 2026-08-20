from typing import Annotated

from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.api.deps import AuthServiceDep, CurrentUser
from app.core.config import settings
from app.core.security import create_access_token
from app.schemas.auth import (
    AuthResponse,
    EmailVerifyRequest,
    LoginRequest,
    MessageResponse,
    ResendVerificationRequest,
)
from app.schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_COOKIE = "access_token"
REFRESH_TOKEN_COOKIE = "refresh_token"


def _cookie_kwargs() -> dict:
    return {
        "httponly": True,
        "secure": settings.COOKIES_SECURE,
        "samesite": settings.COOKIES_SAMESITE,
        "domain": settings.COOKIES_DOMAIN or None,
        "path": "/",
    }


def set_auth_cookies(response: Response, user, refresh_token: str) -> None:
    access_token = create_access_token(subject=str(user.id))
    response.set_cookie(
        ACCESS_TOKEN_COOKIE,
        access_token,
        max_age=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **_cookie_kwargs(),
    )
    response.set_cookie(
        REFRESH_TOKEN_COOKIE,
        refresh_token,
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        **_cookie_kwargs(),
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_TOKEN_COOKIE, **_cookie_kwargs())
    response.delete_cookie(REFRESH_TOKEN_COOKIE, **_cookie_kwargs())


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, service: AuthServiceDep) -> UserRead:
    """Register a new user and send a verification code to their email."""
    user = await service.register(data)
    return UserRead.model_validate(user)


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    data: EmailVerifyRequest, service: AuthServiceDep
) -> MessageResponse:
    await service.verify_email(data.email, data.code)
    return MessageResponse(message="Email успешно подтверждён")


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    data: ResendVerificationRequest, service: AuthServiceDep
) -> MessageResponse:
    await service.resend_verification(data.email)
    return MessageResponse(message="Код подтверждения отправлен")


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, response: Response, service: AuthServiceDep) -> AuthResponse:
    """Login with email or username via a JSON body.

    Tokens are set as HttpOnly cookies, not returned in the body.
    """
    user, refresh_token = await service.login(data.login, data.password)
    set_auth_cookies(response, user, refresh_token)
    return AuthResponse(user=UserRead.model_validate(user))


@router.post("/refresh", response_model=AuthResponse)
async def refresh(
    response: Response,
    service: AuthServiceDep,
    refresh_token: Annotated[str | None, Cookie()] = None,
) -> AuthResponse:
    """Rotate tokens: the refresh token is read from the HttpOnly cookie,
    new tokens are set as cookies."""
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh токен отсутствует",
        )
    user, new_refresh_token = await service.refresh(refresh_token)
    set_auth_cookies(response, user, new_refresh_token)
    return AuthResponse(user=UserRead.model_validate(user))


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response, user: CurrentUser, service: AuthServiceDep) -> MessageResponse:
    """Revoke all refresh tokens of the user and clear auth cookies."""
    await service.logout(user)
    clear_auth_cookies(response)
    return MessageResponse(message="Вы вышли из системы")
