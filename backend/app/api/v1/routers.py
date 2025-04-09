from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    cultural_items,
    user_favorites,
    comments,
    blog_posts  # Add import for blog_posts
    # Import other endpoint modules as needed
)

router = APIRouter()

# Register routers with their correct prefixes
router.include_router(cultural_items.router, prefix="/api/v1/items")
router.include_router(user_favorites.router, prefix="/api/v1/favorites")
router.include_router(comments.router, prefix="/api/v1/comments")
router.include_router(blog_posts.router, prefix="/api/v1/blog")  # Add blog router
# Add other routers as needed
