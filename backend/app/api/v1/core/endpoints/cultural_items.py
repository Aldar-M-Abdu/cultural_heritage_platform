from typing import List, Optional, Literal
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.db_setup import get_db
from app.api.v1.core.models import CulturalItem as DbCulturalItem, User, Media as DbMedia, Tag as DbTag
from app.api.v1.core.schemas import (
    CulturalItem,
    CulturalItemCreate,
    CulturalItemDetail,
    CulturalItemUpdate,
    Tag,
    MediaCreate,
    Media,
)
from app.api.v1.core.services import (
    get_cultural_items,
    search_cultural_items,
    get_all_tags,
    get_cultural_items_by_tag,
    get_cultural_items_by_region,
    get_cultural_items_by_time_period,
    get_featured_cultural_items,
    get_cultural_item,
    create_cultural_item,
    create_media,
    update_cultural_item,
    delete_cultural_item
)
from app.security import get_current_active_user, get_admin_user, get_optional_user
import random

router = APIRouter(tags=["cultural_items"])

@router.get("/", response_model=List[CulturalItem])
def get_cultural_items(
    sort: str = "created_at",
    limit: int = 10,
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    """Fetch cultural items with optional sorting and limit."""
    items = db.query(DbCulturalItem).order_by(getattr(DbCulturalItem, sort).desc()).limit(limit).all()
    return items

@router.get("/search", response_model=List[CulturalItem], operation_id="search_cultural_items_v1")
def search_items(
    query: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured items"),
    region: Optional[str] = Query(None, description="Filter by region"),
    time_period: Optional[str] = Query(None, description="Filter by time period"),
    sort_by: Optional[Literal["title", "created_at"]] = Query("created_at", description="Sort by field"),
    sort_order: Optional[Literal["asc", "desc"]] = Query("desc", description="Sort order"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    items = search_cultural_items(db, query=query, skip=skip, limit=limit)
    
    # Apply filters
    if is_featured is not None:
        items = [item for item in items if item.is_featured == is_featured]
    if region:
        items = [item for item in items if item.region and region.lower() in item.region.lower()]
    if time_period:
        items = [item for item in items if item.time_period and time_period.lower() in item.time_period.lower()]
    
    # Apply sorting
    reverse = sort_order == "desc"
    if sort_by == "title":
        return sorted(items, key=lambda x: x.title.lower(), reverse=reverse)
    else:  # default to created_at
        return sorted(items, key=lambda x: x.created_at, reverse=reverse)

@router.get("/random", response_model=List[CulturalItem], operation_id="get_random_cultural_items_v1")
def get_random_cultural_items(
    count: int = Query(5, ge=1, le=20, description="Number of random items to return"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    """
    Get random cultural items. Useful for homepage showcases or recommendations.
    """
    all_items = get_cultural_items(db, skip=0, limit=100)
    if len(all_items) <= count:
        return all_items
    return random.sample(all_items, count)

@router.get("/tags", response_model=List[Tag], operation_id="list_tags_v1")
def read_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[Tag]:
    return get_all_tags(db, skip=skip, limit=limit)

@router.get("/tags/{tag_name}", response_model=List[CulturalItem], operation_id="get_cultural_items_by_tag_v1")
def read_cultural_items_by_tag(
    tag_name: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured items"),
    region: Optional[str] = Query(None, description="Filter by region"),
    time_period: Optional[str] = Query(None, description="Filter by time period"),
    sort_by: Optional[Literal["title", "created_at"]] = Query("created_at", description="Sort by field"),
    sort_order: Optional[Literal["asc", "desc"]] = Query("desc", description="Sort order"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    items = get_cultural_items_by_tag(db, tag_name=tag_name, skip=skip, limit=limit)
    
    # Apply filters
    if is_featured is not None:
        items = [item for item in items if item.is_featured == is_featured]
    if region:
        items = [item for item in items if item.region and region.lower() in item.region.lower()]
    if time_period:
        items = [item for item in items if item.time_period and time_period.lower() in item.time_period.lower()]
    
    # Apply sorting
    reverse = sort_order == "desc"
    if sort_by == "title":
        return sorted(items, key=lambda x: x.title.lower(), reverse=reverse)
    else:  # default to created_at
        return sorted(items, key=lambda x: x.created_at, reverse=reverse)

@router.get("/regions/{region}", response_model=List[CulturalItem], operation_id="get_cultural_items_by_region_v1")
def read_cultural_items_by_region(
    region: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured items"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    items = get_cultural_items_by_region(db, region=region, skip=skip, limit=limit)
    if is_featured is not None:
        items = [item for item in items if item.is_featured == is_featured]
    return sorted(items, key=lambda x: x.created_at, reverse=True)

@router.get("/time-periods/{time_period}", response_model=List[CulturalItem], operation_id="get_cultural_items_by_time_period_v1")
def read_cultural_items_by_time_period(
    time_period: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured items"),
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    skip = (page - 1) * limit
    items = get_cultural_items_by_time_period(db, time_period=time_period, skip=skip, limit=limit)
    if is_featured is not None:
        items = [item for item in items if item.is_featured == is_featured]
    return sorted(items, key=lambda x: x.created_at, reverse=True)

@router.get("/featured", response_model=List[CulturalItem], operation_id="get_featured_cultural_items_v1")
def read_featured_cultural_items(
    db: Session = Depends(get_db),
) -> List[CulturalItem]:
    """
    Get featured cultural items.
    """
    items = get_featured_cultural_items(db)
    return items

@router.get("/{cultural_item_id}", response_model=CulturalItemDetail, operation_id="get_cultural_item_detail_v1")
def read_cultural_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
) -> CulturalItemDetail:
    db_item = get_cultural_item(db, cultural_item_id=cultural_item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Cultural item with ID {cultural_item_id} not found"
        )
    return db_item

@router.post("/", response_model=CulturalItem, status_code=status.HTTP_201_CREATED, operation_id="create_new_cultural_item_v1")
def create_new_cultural_item(
    item: CulturalItemCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> CulturalItem:
    return create_cultural_item(db=db, item=item)

@router.post("/media", response_model=Media, status_code=status.HTTP_201_CREATED, operation_id="create_media_for_cultural_item_v1")
def create_new_media(
    media: MediaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Media:
    cultural_item = get_cultural_item(db, cultural_item_id=media.cultural_item_id)
    if not cultural_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    
    # Create media using the appropriate model structure
    return create_media(db=db, media=media)

@router.put("/{cultural_item_id}", response_model=CulturalItem, operation_id="update_existing_cultural_item_v1")
def update_item(
    cultural_item_id: UUID,
    item: CulturalItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> CulturalItem:
    db_item = update_cultural_item(db, cultural_item_id=cultural_item_id, item=item)
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return db_item

@router.delete("/{cultural_item_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_existing_cultural_item_v1")
def delete_item(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> Response:
    deleted = delete_cultural_item(db, cultural_item_id=cultural_item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cultural item not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)