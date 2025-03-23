from fastapi import APIRouter
from app.api.v1.core.endpoints import cultural_items
from app.api.v1.auth import router as auth_router

router = APIRouter()

router.include_router(cultural_items.router, prefix="/cultural-items", tags=["cultural-items"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
