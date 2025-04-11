from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    cultural_items,
    tags,
    media,
    users,
    events
)

api_router = APIRouter()
api_router.include_router(cultural_items.router, prefix="/cultural-items")
api_router.include_router(tags.router, prefix="/tags")
api_router.include_router(media.router, prefix="/media")
api_router.include_router(users.router, prefix="/users")
api_router.include_router(events.router, prefix="/events")  # Include events router
