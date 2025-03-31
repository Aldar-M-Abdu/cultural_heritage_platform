from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
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

router = APIRouter(tags=["cultural_items"], prefix="/cultural-items")


@router.get("/", response_model=List[CulturalItem])
def read_cultural_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    return services.get_cultural_items(db, skip=skip, limit=limit)


@router.get("/search", response_model=List[CulturalItem])
def search_cultural_items(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    return services.search_cultural_items(db, query=query, skip=skip, limit=limit)


@router.get("/tags", response_model=List[Tag])
def read_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[Tag]:
    return services.get_all_tags(db, skip=skip, limit=limit)


@router.get("/tags/{tag_name}", response_model=List[CulturalItem])
def read_cultural_items_by_tag(
    tag_name: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    return services.get_cultural_items_by_tag(db, tag_name=tag_name, skip=skip, limit=limit)


@router.get("/regions/{region}", response_model=List[CulturalItem])
def read_cultural_items_by_region(
    region: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    return services.get_cultural_items_by_region(db, region=region, skip=skip, limit=limit)


@router.get("/time-periods/{time_period}", response_model=List[CulturalItem])
def read_cultural_items_by_time_period(
    time_period: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    return services.get_cultural_items_by_time_period(db, time_period=time_period, skip=skip, limit=limit)


@router.get("/{cultural_item_id}", response_model=CulturalItemDetail)
def read_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
) -> CulturalItemDetail:
    db_item = services.get_cultural_item(db, cultural_item_id=cultural_item_id)
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return db_item


@router.post("/", response_model=CulturalItem, status_code=status.HTTP_201_CREATED)
def create_cultural_item(
    item: CulturalItemCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> CulturalItem:
    return services.create_cultural_item(db=db, item=item)


@router.post("/media", response_model=Media, status_code=status.HTTP_201_CREATED)
def create_media(
    media: MediaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Media:
    cultural_item = services.get_cultural_item(db, cultural_item_id=media.cultural_item_id)
    if not cultural_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return services.create_media(db=db, media=media)


@router.put("/{cultural_item_id}", response_model=CulturalItem)
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


@router.delete("/{cultural_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> Response:
    deleted = services.delete_cultural_item(db, cultural_item_id=cultural_item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)