"""Authentication business logic: registration, email verification, login,
refresh token rotation/revocation."""

import uuid
from datetime import timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    codes_match,
    generate_refresh_token,
    generate_verification_code,
    hash_password,
    hash_token,
    hash_verification_code,
    verify_password,
)
from app.db.base import utc_now
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.services.email_service import EmailService


class AuthService:
    def __init__(self, session: AsyncSession, email_service: EmailService) -> None:
        self.session = session
        self.email_service = email_service
        self.users = UserRepository(session)
        self.refresh_tokens = RefreshTokenRepository(session)

    # --- Registration & email verification ---

    async def register(self, data: UserCreate) -> User:
        username_owner = await self.users.get_by_username(data.username)
        if username_owner is not None and username_owner.email != data.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Это имя пользователя уже занято",
            )

        existing = await self.users.get_by_email(data.email)
        if existing is not None:
            if existing.is_verified:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Пользователь с таким email уже зарегистрирован",
                )
            # Unverified account: allow re-registering — update credentials and resend code
            existing.username = data.username
            existing.hashed_password = hash_password(data.password)
            user = existing
        else:
            user = await self.users.create(
                data.email, data.username, hash_password(data.password)
            )

        await self._issue_verification_code(user)
        return user

    async def _issue_verification_code(self, user: User) -> None:
        code = generate_verification_code()
        user.email_verification_code_hash = hash_verification_code(code)
        user.email_verification_expires_at = utc_now() + timedelta(
            minutes=settings.EMAIL_VERIFICATION_CODE_EXPIRE_MINUTES
        )
        await self.email_service.send_verification_email(user.email, code)

    async def verify_email(self, email: str, code: str) -> User:
        user = await self.users.get_by_email(email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if user.is_verified:
            return user

        expires_at = user.email_verification_expires_at
        if expires_at is not None and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        stored_hash = user.email_verification_code_hash
        if (
            stored_hash is None
            or expires_at is None
            or expires_at <= utc_now()
            or not codes_match(code, stored_hash)
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный или истёкший код подтверждения",
            )

        user.is_verified = True
        user.email_verification_code_hash = None
        user.email_verification_expires_at = None
        return user

    async def resend_verification(self, email: str) -> User:
        user = await self.users.get_by_email(email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email уже подтверждён",
            )
        await self._issue_verification_code(user)
        return user

    # --- Login / tokens ---

    async def login(self, login: str, password: str) -> tuple[User, str]:
        """Validate credentials (login = email or username), return (user, raw refresh token)."""
        user = await self.users.get_by_login(login)
        if user is None or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный логин или пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Аккаунт заблокирован",
            )
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email не подтверждён",
            )
        refresh_token = await self._issue_refresh_token(user)
        return user, refresh_token

    async def _issue_refresh_token(self, user: User) -> str:
        raw_token = generate_refresh_token()
        await self.refresh_tokens.create(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=utc_now() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        )
        return raw_token

    async def refresh(self, raw_refresh_token: str) -> tuple[User, str]:
        """Rotate a refresh token: revoke the old one, issue a new pair."""
        stored = await self.refresh_tokens.get_by_hash(hash_token(raw_refresh_token))
        if stored is None or stored.revoked or stored.is_expired:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Недействительный refresh токен",
            )

        user = await self.users.get_by_id(stored.user_id)
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Недействительный refresh токен",
            )

        await self.refresh_tokens.revoke(stored)
        new_token = await self._issue_refresh_token(user)
        return user, new_token

    async def logout(self, user: User) -> None:
        """Revoke all refresh tokens of the user."""
        await self.refresh_tokens.revoke_all_for_user(user.id)
