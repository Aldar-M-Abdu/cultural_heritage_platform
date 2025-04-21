import logging
import signal
import asyncio
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles  # Add this import
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from app.api.v1.api import api_router  # Updated to use api_router from api.py
from app.settings import settings
from app.db_setup import init_db, is_db_connected

# Load environment variables from .env file
load_dotenv()

# Validate DB_URL
if not os.getenv("DB_URL"):
    logging.error("DB_URL environment variable is not set. Please check your .env file.")
    raise ValueError("DB_URL environment variable is required but not set.")

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
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Check DB connection before initializing
            if not is_db_connected():
                retry_count += 1
                logging.warning(f"Database connection failed, attempt {retry_count} of {max_retries}")
                if retry_count == max_retries:
                    logging.error("Failed to connect to database after maximum retries")
                    break
                await asyncio.sleep(2)  # Wait before retrying
                continue
            
            init_db()
            logging.info("Database initialized successfully")
            break
        except Exception as e:
            retry_count += 1
            logging.error(f"Failed to initialize database (attempt {retry_count}): {str(e)}")
            if retry_count == max_retries:
                logging.error("Failed to initialize database after maximum retries")
                break
            await asyncio.sleep(2)  # Wait before retrying
    
    log_startup_config(app)
    
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

# Modified middleware: Skip API routes, documentation routes, and static files to prevent redirect loops
@app.middleware("http")
async def redirect_trailing_slash(request, call_next):
    # Skip API routes, documentation routes, and static files to prevent redirect loops
    if (request.url.path.startswith("/api/") or 
        request.url.path in ["/docs", "/redoc", "/openapi.json"] or
        request.url.path == "/favicon.ico" or
        "." in request.url.path.split("/")[-1]):  # Skip files with extensions
        return await call_next(request)
    
    if not request.url.path.endswith("/") and request.url.path != "/":
        return RedirectResponse(url=f"{request.url.path}/", status_code=307)
    return await call_next(request)

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    logging.info(f"Creating static directory at: {static_dir}")
    os.makedirs(static_dir)

# Mount static files directory for serving user uploads
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API router with all endpoints
app.include_router(api_router, prefix="/api/v1")  # Updated to use api_router

# Fix CORS middleware to allow multiple frontend URLs
frontend_urls = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000",  # Backup URL for development
    "http://localhost:5174"   # Another possible dev URL
]

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=600  # Cache preflight requests for 10 minutes
)

# Remove the custom OPTIONS middleware as it's redundant with the CORSMiddleware
# The CORSMiddleware handles preflight requests properly

@app.get("/")
def root():
    return {"message": "Welcome to the Cultural Heritage Platform API"}

# Add a redirect for the user-contributions endpoint
@app.get("/api/v1/users/me/contributions", include_in_schema=False)
async def redirect_user_contributions():
    """Redirect to the contributions endpoint"""
    return RedirectResponse(url="/api/v1/users/me/contributions", status_code=307)

# Add a redirect for the users/me PUT endpoint
@app.put("/api/v1/users/me", include_in_schema=False)
async def redirect_update_current_user():
    """Redirect to the users/me endpoint"""
    return RedirectResponse(url="/api/v1/users/users/me", status_code=307)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)