from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
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
    Media
)
from app.api.v1.core import services
from app.security import get_current_active_user, get_admin_user  # Ensure security is correctly imported

router = APIRouter()


@router.get("/", response_model=List[CulturalItem])
def read_cultural_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = services.get_cultural_items(db, skip=skip, limit=limit)
    return items


@router.get("/search/", response_model=List[CulturalItem])
def search_cultural_items(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = services.search_cultural_items(db, query=query, skip=skip, limit=limit)
    return items


@router.get("/tags/", response_model=List[Tag])
def read_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    tags = services.get_all_tags(db, skip=skip, limit=limit)
    return tags


@router.get("/tag/{tag_name}", response_model=List[CulturalItem])
def read_cultural_items_by_tag(
    tag_name: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = services.get_cultural_items_by_tag(db, tag_name=tag_name, skip=skip, limit=limit)
    return items


@router.get("/region/{region}", response_model=List[CulturalItem])
def read_cultural_items_by_region(
    region: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = services.get_cultural_items_by_region(db, region=region, skip=skip, limit=limit)
    return items


@router.get("/time-period/{time_period}", response_model=List[CulturalItem])
def read_cultural_items_by_time_period(
    time_period: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = services.get_cultural_items_by_time_period(db, time_period=time_period, skip=skip, limit=limit)
    return items


@router.get("/{cultural_item_id}", response_model=CulturalItemDetail)
def read_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db)
):
    db_item = services.get_cultural_item(db, cultural_item_id=cultural_item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Cultural item not found")
    return db_item


@router.post("/", response_model=CulturalItem)
def create_cultural_item(
    item: CulturalItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return services.create_cultural_item(db=db, item=item)


@router.post("/media/", response_model=Media)
def create_media(
    media: MediaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if cultural item exists
    cultural_item = services.get_cultural_item(db, cultural_item_id=media.cultural_item_id)
    if not cultural_item:
        raise HTTPException(status_code=404, detail="Cultural item not found")
    
    return services.create_media(db=db, media=media)


@router.put("/{cultural_item_id}", response_model=CulturalItem)
def update_cultural_item(
    cultural_item_id: UUID,
    item: CulturalItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_item = services.update_cultural_item(db, cultural_item_id=cultural_item_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Cultural item not found")
    return db_item


@router.delete("/{cultural_item_id}")
def delete_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    deleted = services.delete_cultural_item(db, cultural_item_id=cultural_item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cultural item not found")
    return {"success": True}