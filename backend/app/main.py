from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1.core.endpoints import authentication, users, user_favorites
from app.settings import settings

app = FastAPI(
    title="Cultural Heritage Platform API",
    description="API for the Cultural Heritage Platform",
    version="0.1.0",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API v1 router
api_v1 = APIRouter(prefix="/api/v1")

# Add endpoints to API v1 router
api_v1.include_router(authentication.router, prefix="/auth", tags=["auth"])
api_v1.include_router(users.router, prefix="/users", tags=["users"])
api_v1.include_router(user_favorites.router, prefix="/favorites", tags=["favorites"])

# Include other routers from your application here
# e.g. api_v1.include_router(cultural_items_router, prefix="/cultural-items", tags=["cultural-items"])
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
