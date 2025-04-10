from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from app.api.v1.api import api_router
from app.db_setup import engine, Base
from app.api.v1.core.endpoints import authentication, users, user_favorites, cultural_items, blog_posts
from app.settings import settings

app = FastAPI(
    title="Cultural Heritage Platform API",
    description="API for Cultural Heritage Platform",
    version="1.0.0",
)

# Setup CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # React frontend
    "http://localhost:8080",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
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

# Include the blog_posts router
app.include_router(blog_posts.router)

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
