from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.api.v1 import routers
from app.settings import settings
from app.db_setup import engine
from app.api.v1.core.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

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

# Include API router
app.include_router(routers.router, prefix=settings.API_PREFIX)


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
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    except asyncio.exceptions.CancelledError:
        pass