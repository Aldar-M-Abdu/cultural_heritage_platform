from fastapi.middleware.cors import CORSMiddleware

# Update CORS middleware to allow the frontend URL from environment variable
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Support both development and production URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
