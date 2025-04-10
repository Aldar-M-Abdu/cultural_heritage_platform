from fastapi import APIRouter
from app.api.v1.endpoints import items, users, auth, comments, tags, media, favorites, notifications, blog_posts
from app.api.v1.core.endpoints import cultural_items, user_favorites

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/cultural-items", tags=["items"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(favorites.router, prefix="/user-favorites", tags=["favorites"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(blog_posts.router, prefix="/blog-posts", tags=["blog"])
api_router.include_router(cultural_items.router, prefix="/cultural-items", tags=["cultural_items"])
api_router.include_router(user_favorites.router, prefix="/favorites", tags=["user_favorites"])
