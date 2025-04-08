from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    cultural_items,
    user_favorites,
    comments
    # Import other endpoint modules as needed
)

router = APIRouter()

# Register routers with their correct prefixes
router.include_router(cultural_items.router, prefix="/api/v1/items")
router.include_router(user_favorites.router, prefix="/api/v1/favorites")
router.include_router(comments.router, prefix="/api/v1/comments")
# Add other routers as needed
