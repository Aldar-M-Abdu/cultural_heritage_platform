from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import delete, select, func
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import Item
from app.api.v1.core.schemas import ItemCreate, ItemUpdate, Item as ItemSchema
from typing import Optional, List, Dict, Any

# Changed prefix to avoid conflict with cultural_items endpoint
router = APIRouter(tags=["items"], prefix="/items")

@router.get("/", response_model=Dict[str, Any])
def get_items(
    db: Session = Depends(get_db),
    page: Optional[int] = Query(1, ge=1),
    limit: Optional[int] = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    region: Optional[str] = None,
    period: Optional[str] = None,
    tag: Optional[str] = None,
    sort: Optional[str] = None,
    excludeId: Optional[int] = None
) -> Dict[str, Any]:
    query = select(Item)
    
    # Apply filters if provided
    if search:
        query = query.filter(Item.title.ilike(f"%{search}%") | 
                            Item.description.ilike(f"%{search}%") |
                            Item.region.ilike(f"%{search}%") |
                            Item.materials.ilike(f"%{search}%"))
    
    if region:
        query = query.filter(Item.region == region)
    
    if period:
        query = query.filter(Item.time_period == period)
        
    if tag:
        # This is simplified - in a real app you'd need a proper tag relationship
        query = query.filter(func.lower(Item.tags).contains(func.lower(tag)))
    
    if excludeId:
        query = query.filter(Item.id != excludeId)
        
    # Calculate total count
    total_count = db.execute(select(func.count()).select_from(query.subquery())).scalar()
    
    # Apply sorting
    if sort == 'created_at':
        query = query.order_by(Item.created_at.desc())
    
    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    # Execute query
    items = db.execute(query).scalars().all()
    
    # Calculate pagination info
    total_pages = (total_count + limit - 1) // limit  # Ceiling division
    
    return {
        "items": items,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total_count,
            "totalPages": total_pages
        }
    }

@router.get("/featured", response_model=Dict[str, Any])
def get_featured_items(db: Session = Depends(get_db)) -> Dict[str, Any]:
    query = select(Item).limit(3)
    items = db.execute(query).scalars().all()
    
    return {
        "items": items,
        "total": len(items)
    }

@router.post("/", response_model=ItemSchema, status_code=status.HTTP_201_CREATED)
def create_item(item: ItemCreate, db: Session = Depends(get_db)) -> ItemSchema:
    new_item = Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{item_id}", response_model=ItemSchema)
def get_item(item_id: int, db: Session = Depends(get_db)) -> ItemSchema:
    item = db.execute(select(Item).where(Item.id == item_id)).scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=ItemSchema)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)) -> ItemSchema:
    db_item = db.execute(select(Item).where(Item.id == item_id)).scalars().first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    for key, value in item.model_dump(exclude_unset=True).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.execute(select(Item).where(Item.id == item_id)).scalars().first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.execute(delete(Item).where(Item.id == item_id))
    db.commit()
    return {"message": "Item deleted successfully"}
