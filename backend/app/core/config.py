from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "Vanta Shop API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # PostgreSQL
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "shop_donate"
    # Optional full override of the SQLAlchemy URL (used in tests / CI)
    DATABASE_URL: str | None = None

    @property
    def database_url(self) -> str:
        """Async SQLAlchemy URL (asyncpg driver for PostgreSQL)."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # JWT / OAuth2
    JWT_SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Email verification codes
    EMAIL_VERIFICATION_CODE_EXPIRE_MINUTES: int = 10

    # SMTP
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@example.com"
    SMTP_FROM_NAME: str = "Vanta Shop"
    SMTP_STARTTLS: bool = True

    # CORS: comma-separated list of allowed origins, e.g. "http://localhost:5173,https://example.com"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Auth cookies
    COOKIES_SECURE: bool = False  # True in production: cookies only sent over HTTPS
    COOKIES_SAMESITE: str = "lax"  # "none" if the frontend is served from a different domain
    COOKIES_DOMAIN: str | None = None  # e.g. ".example.com"; None = current host only

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor — use as a FastAPI dependency."""
    return Settings()


settings = get_settings()
