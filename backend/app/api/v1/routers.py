from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    users, 
    items, 
    cultural_items, 
    comments,
    authentication,
    placeholders
)

router = APIRouter()

# Include all endpoint routers
router.include_router(users.router, prefix="/api/v1/users")
router.include_router(items.router, prefix="/api/v1/items")
router.include_router(cultural_items.router, prefix="/api/v1/cultural-items")
router.include_router(comments.router, prefix="/api/v1/comments")
router.include_router(authentication.router, prefix="/api/v1/auth")
router.include_router(placeholders.router, prefix="/api/v1/placeholder")
