from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    users, 
    items, 
    cultural_items, 
    comments,
    authentication
)

router = APIRouter()

# Include all endpoint routers
router.include_router(users.router, prefix="/users")
router.include_router(items.router, prefix="/items")
router.include_router(cultural_items.router, prefix="/cultural-items")
router.include_router(comments.router, prefix="/comments")
router.include_router(authentication.router, prefix="/auth")
