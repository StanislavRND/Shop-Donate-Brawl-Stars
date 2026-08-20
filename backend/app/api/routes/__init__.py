from fastapi import APIRouter

from app.api.routes import auth, health, users

# The health router is mounted at the root in app.main so that
# `GET /health` works without a prefix.
api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
