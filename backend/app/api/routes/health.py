from typing import Annotated, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import SettingsDep
from app.db.session import get_db

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    database: str


@router.get("/health", response_model=HealthResponse)
async def health_check(
    settings: SettingsDep,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Any:
    database = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        database = "error"

    return HealthResponse(
        status="ok" if database == "ok" else "degraded",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        database=database,
    )
