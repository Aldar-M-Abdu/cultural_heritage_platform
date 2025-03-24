from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.api.v1 import routers  # Ensure correct imports
from app.settings import settings
from app.api.v1.core.endpoints import users, items, cultural_items, comments, authentication

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers with tags
app.include_router(routers.router, prefix=settings.API_PREFIX, tags=["General"])
app.include_router(users.router, prefix=settings.API_PREFIX, tags=["Users"])
app.include_router(items.router, prefix=settings.API_PREFIX, tags=["Items"])
app.include_router(cultural_items.router, prefix=settings.API_PREFIX, tags=["Cultural Items"])
app.include_router(comments.router, prefix=settings.API_PREFIX, tags=["Comments"])
app.include_router(authentication.router, prefix=settings.API_PREFIX, tags=["Authentication"])

@app.get("/")
def root():
    return {
        "message": "Welcome to the Cultural Heritage Platform API",
        "docs": "/docs",
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except asyncio.exceptions.CancelledError:
        pass