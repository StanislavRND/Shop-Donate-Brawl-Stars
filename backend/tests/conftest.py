from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

from app.api.deps import get_email_service
from app.db.base import Base
from app.db.session import get_db
from app.main import app


class DummyEmailService:
    """Captures verification codes instead of sending real emails."""

    def __init__(self) -> None:
        self.codes: dict[str, str] = {}

    async def send_verification_email(self, to_email: str, code: str) -> None:
        self.codes[to_email] = code


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(
        "sqlite+aiosqlite://",  # in-memory
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        yield session

    await engine.dispose()


@pytest.fixture
def email_service() -> DummyEmailService:
    return DummyEmailService()


@pytest.fixture
async def client(
    db_session: AsyncSession, email_service: DummyEmailService
) -> AsyncGenerator[AsyncClient, None]:
    """HTTP client bound to the app with an in-memory DB and fake email service."""

    async def get_db_override() -> AsyncGenerator[AsyncSession, None]:
        try:
            yield db_session
            await db_session.commit()
        except Exception:
            await db_session.rollback()
            raise

    app.dependency_overrides[get_db] = get_db_override
    app.dependency_overrides[get_email_service] = lambda: email_service
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
