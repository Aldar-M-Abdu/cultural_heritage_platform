from fastapi import APIRouter
from app.api.v1.core.endpoints import (
    cultural_items, user_favorites, events, communities, discussions, blog_posts,
    comments, users, authentication, notifications
)
from fastapi.responses import RedirectResponse

api_router = APIRouter()

# Use endpoints from core instead of mixing old and new
api_router.include_router(authentication.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cultural_items.router, prefix="/cultural-items", tags=["cultural_items"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(user_favorites.router, prefix="/favorites", tags=["user_favorites"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(blog_posts.router, prefix="/blog", tags=["blog"])  # Use /blog consistent with frontend
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(communities.router, prefix="/communities", tags=["communities"])
api_router.include_router(discussions.router, prefix="/discussions", tags=["discussions"])

# Add redirects for common mismatched routes
@api_router.get("/blog-posts{path:path}", include_in_schema=False)
async def redirect_blog_posts(path: str):
    """Redirect /blog-posts endpoints to /blog endpoints"""
    return RedirectResponse(url=f"/api/v1/blog{path}", status_code=301)
