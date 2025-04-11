from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    cultural_items,
    comments,
    blog_posts  # Keep this import
)

# Import user_favorites and authentication directly to avoid circular imports
from app.api.v1.core.endpoints import user_favorites
from app.api.v1.core.endpoints import authentication
from app.api.v1.core.endpoints import users

router = APIRouter()

# Register routers with their correct prefixes
router.include_router(cultural_items.router)  # Cultural items router already has its prefix
router.include_router(user_favorites.router, prefix="/favorites")
router.include_router(comments.router, prefix="/comments")
router.include_router(blog_posts.router, prefix="/blog")  # Keep blog router
router.include_router(authentication.router, prefix="/auth")  # Add authentication router
router.include_router(users.router)  # Add users router without prefix (already has /users prefix)
