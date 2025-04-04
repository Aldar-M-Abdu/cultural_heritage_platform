import logging
import signal
import asyncio
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from app.api.v1.routers import router
from app.settings import settings
from app.db_setup import init_db, is_db_connected
from app.api.v1.core.endpoints import authentication, cultural_items, comments

# Load environment variables from .env file
load_dotenv()

# Validate DATABASE_URL
if not os.getenv("DB_URL"):
    logging.error("DATABASE_URL environment variable is not set. Please check your .env file.")
    raise ValueError("DATABASE_URL environment variable is required but not set.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

def log_startup_config(app: FastAPI):
    """Log all routes for debugging purposes"""
    for route in app.routes:
        path = getattr(route, "path", None)
        name = getattr(route, "name", None)
        methods = getattr(route, "methods", None)
        if path:
            logging.info(f"Route: {path}, Name: {name}, Methods: {methods}")

# Lifespan function for initializing resources
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize the database
    try:
        # Check DB connection before initializing
        if not is_db_connected():
            logging.warning("Database connection failed - will retry on first request")
        else:
            init_db()
            logging.info("Database initialized successfully")
        
        log_startup_config(app)
    except Exception as e:
        logging.error(f"Failed to initialize database: {str(e)}")
        # Don't re-raise the exception - this allows the app to start even with DB issues
    
    try:
        # Yield control to the application
        yield
    except (KeyboardInterrupt, asyncio.CancelledError) as e:
        # Just log the shutdown event, but don't do anything else that might raise exceptions
        logging.info(f"Application shutdown initiated by {type(e).__name__}")
    except Exception as e:
        logging.error(f"Unhandled exception during application lifecycle: {str(e)}")
    finally:
        # Shutdown: cleanup resources if needed
        logging.info("Shutting down application")

# Create FastAPI app with enhanced error handling
app = FastAPI(
    lifespan=lifespan, 
    title="Cultural Heritage API",
    description="API documentation for the Cultural Heritage Platform",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc UI
    openapi_url="/openapi.json"  # OpenAPI schema
)

# Function to customize OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Cultural Heritage API",
        version="1.0.0",
        description="API documentation for the Cultural Heritage Platform",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Modified middleware: Skip API routes and documentation routes to prevent redirect loops
@app.middleware("http")
async def redirect_trailing_slash(request, call_next):
    # Skip API routes and documentation routes to prevent redirect loops
    if request.url.path.startswith("/api/") or request.url.path in ["/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)
    
    if not request.url.path.endswith("/") and request.url.path != "/":
        return RedirectResponse(url=f"{request.url.path}/", status_code=307)
    return await call_next(request)

# Include API router with all endpoints
app.include_router(router, prefix="/api/v1")
app.include_router(authentication.router, prefix="/api/v1/auth")
app.include_router(cultural_items.router, prefix="/api/v1/cultural-items")
app.include_router(comments.router, prefix="/api/v1/comments")

# Fix CORS middleware to allow multiple frontend URLs
frontend_urls = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000"  # Backup URL for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Cultural Heritage Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)