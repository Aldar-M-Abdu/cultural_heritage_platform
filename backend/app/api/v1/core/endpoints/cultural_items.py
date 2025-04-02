from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.db_setup import get_db
from app.api.v1.core.models import User
from app.api.v1.core.schemas import (
    CulturalItem,
    CulturalItemCreate,
    CulturalItemDetail,
    CulturalItemUpdate,
    Tag,
    MediaCreate,
    Media,
)
from app.api.v1.core import services
from app.security import get_current_active_user, get_admin_user, get_optional_user

router = APIRouter(tags=["cultural_items"])

@router.get("/", response_model=List[CulturalItem], operation_id="list_cultural_items")
def read_cultural_items(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.get_cultural_items(db, skip=skip, limit=limit)


@router.get("/search", response_model=List[CulturalItem], operation_id="search_items")
def search_cultural_items(
    query: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.search_cultural_items(db, query=query, skip=skip, limit=limit)


@router.get("/tags", response_model=List[Tag], operation_id="list_item_tags")
def read_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[Tag]:
    return services.get_all_tags(db, skip=skip, limit=limit)


@router.get("/tags/{tag_name}", response_model=List[CulturalItem], operation_id="get_items_by_tag")
def read_cultural_items_by_tag(
    tag_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.get_cultural_items_by_tag(db, tag_name=tag_name, skip=skip, limit=limit)


@router.get("/regions/{region}", response_model=List[CulturalItem], operation_id="get_items_by_region")
def read_cultural_items_by_region(
    region: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.get_cultural_items_by_region(db, region=region, skip=skip, limit=limit)


@router.get("/time-periods/{time_period}", response_model=List[CulturalItem], operation_id="get_items_by_period")
def read_cultural_items_by_time_period(
    time_period: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.get_cultural_items_by_time_period(db, time_period=time_period, skip=skip, limit=limit)


@router.get("/featured", response_model=List[CulturalItem], operation_id="get_featured_items")
def read_featured_cultural_items(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    return services.get_featured_cultural_items(db, skip=skip, limit=limit)


@router.get("/{cultural_item_id}", response_model=CulturalItemDetail, operation_id="get_item_by_id")
def read_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
) -> CulturalItemDetail:
    db_item = services.get_cultural_item(db, cultural_item_id=cultural_item_id)
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return db_item


@router.post("/", response_model=CulturalItem, status_code=status.HTTP_201_CREATED, operation_id="create_new_item")
def create_cultural_item(
    item: CulturalItemCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> CulturalItem:
    return services.create_cultural_item(db=db, item=item)


@router.post("/media", response_model=Media, status_code=status.HTTP_201_CREATED, operation_id="upload_item_media")
def create_media(
    media: MediaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Media:
    cultural_item = services.get_cultural_item(db, cultural_item_id=media.cultural_item_id)
    if not cultural_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return services.create_media(db=db, media=media)


@router.put("/{cultural_item_id}", response_model=CulturalItem, operation_id="update_item")
def update_cultural_item(
    cultural_item_id: UUID,
    item: CulturalItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> CulturalItem:
    db_item = services.update_cultural_item(db, cultural_item_id=cultural_item_id, item=item)
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return db_item


@router.delete("/{cultural_item_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_item")
def delete_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> Response:
    deleted = services.delete_cultural_item(db, cultural_item_id=cultural_item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)