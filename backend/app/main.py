from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.main import api_router

app = FastAPI(
    title="Cultural Heritage Platform API",
    description="API for managing cultural heritage data",
    version="0.1.0",
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cultural Heritage Platform API"}
