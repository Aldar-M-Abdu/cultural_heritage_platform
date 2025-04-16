from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.api import api_router
from app.settings import settings
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Cultural Heritage Platform API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Common Vite port 
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    settings.FRONTEND_HOST,
    # Add any other domains that need access to your API
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Error handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP error: {exc.detail} (status_code={exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )

# Include the API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# A root endpoint for health checks
@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Welcome to the Cultural Heritage Platform API"}

# Request logging middleware with static file path handling
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Skip logging for static files like favicon.ico
    if request.url.path == "/favicon.ico" or request.url.path.startswith("/static/"):
        return await call_next(request)
    
    # Log the request
    logger.info(f"{request.client.host}:{request.client.port} - \"{request.method} {request.url.path} HTTP/1.1\"")
    
    # Process the request
    response = await call_next(request)
    
    # Log the response status
    logger.info(f"{request.client.host}:{request.client.port} - \"{request.method} {request.url.path} HTTP/1.1\" {response.status_code}")
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
