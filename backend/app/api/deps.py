"""Shared FastAPI dependencies."""

import uuid
from typing import Annotated

import jwt
from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.email_service import EmailService

SettingsDep = Annotated[Settings, Depends(get_settings)]
DBDep = Annotated[AsyncSession, Depends(get_db)]

# Bearer scheme is kept as a fallback (e.g. manual testing via Swagger);
# the primary source of the access token is the HttpOnly cookie.
bearer_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login", auto_error=False
)


async def get_current_user(
    db: DBDep,
    access_token: Annotated[str | None, Cookie()] = None,
    bearer_token: Annotated[str | None, Depends(bearer_scheme)] = None,
) -> User:
    """Validate the access token (cookie first, Authorization header as fallback)
    and return the active user."""
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учётные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = access_token or bearer_token
    if not token:
        raise credentials_exc

    try:
        payload = decode_token(token)
    except jwt.PyJWTError:
        raise credentials_exc from None

    if payload.get("type") != "access":
        raise credentials_exc
    try:
        user_id = uuid.UUID(str(payload.get("sub")))
    except (TypeError, ValueError):
        raise credentials_exc from None

    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise credentials_exc
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_email_service(settings: SettingsDep) -> EmailService:
    return EmailService(settings)


EmailServiceDep = Annotated[EmailService, Depends(get_email_service)]


def get_auth_service(db: DBDep, email_service: EmailServiceDep) -> AuthService:
    return AuthService(db, email_service)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
