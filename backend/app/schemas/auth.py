from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class AuthResponse(BaseModel):
    """Login/refresh response: tokens are set as HttpOnly cookies, not returned here."""

    user: UserRead


class LoginRequest(BaseModel):
    login: str = Field(
        min_length=3,
        max_length=320,
        description="Email или имя пользователя",
    )
    password: str = Field(min_length=1, max_length=72)


class EmailVerifyRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=12)


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class MessageResponse(BaseModel):
    message: str
