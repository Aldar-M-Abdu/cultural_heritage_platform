from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1.core.endpoints import authentication, users, user_favorites, cultural_items, blog_posts
from app.settings import settings
from app.api.v1.api import api_router

app = FastAPI(
    title="Cultural Heritage API",
    description="API for cultural heritage platform",
    version="1.0.0",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API router with the /api/v1 prefix
app.include_router(api_router, prefix="/api/v1")

# Create API v1 router
api_v1 = APIRouter(prefix="/api/v1")

# Add endpoints to API v1 router
api_v1.include_router(authentication.router, prefix="/auth", tags=["auth"])
api_v1.include_router(users.router, prefix="/users", tags=["users"])
api_v1.include_router(user_favorites.router, prefix="/favorites", tags=["favorites"])
api_v1.include_router(cultural_items.router, prefix="/cultural-items", tags=["cultural-items"])
api_v1.include_router(blog_posts.router, prefix="/blog", tags=["blog"])  # Add this line

# Include other routers from your application here
# e.g. api_v1.include_router(notifications_router, prefix="/notifications", tags=["notifications"])

# Include API v1 router in the app
app.include_router(api_v1)

# Mount static files (for profile images, etc.)
os.makedirs("static/profile_images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root path welcome message
@app.get("/", tags=["root"])
async def root():
    """Welcome message for the API root."""
    return {
        "message": "Welcome to the Cultural Heritage Platform API",
        "documentation": "/docs",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
