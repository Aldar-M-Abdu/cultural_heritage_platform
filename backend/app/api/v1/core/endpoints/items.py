from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy import delete, select, func
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import CulturalItem
from app.api.v1.core.schemas import ItemCreate, ItemUpdate, Item as ItemSchema, CulturalItem as CulturalItemSchema, CulturalItemCreate
from typing import Optional, List, Dict, Any
from uuid import UUID

router = APIRouter(tags=["items"])

@router.get("/", response_model=Dict[str, Any])
def get_items(
    db: Session = Depends(get_db),
    page: Optional[int] = Query(1, ge=1),
    limit: Optional[int] = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort: Optional[str] = None,
    excludeId: Optional[UUID] = None
) -> Dict[str, Any]:
    query = db.query(CulturalItem)

    if search:
        query = query.filter(
            CulturalItem.title.ilike(f"%{search}%") | 
            CulturalItem.description.ilike(f"%{search}%") |
            CulturalItem.region.ilike(f"%{search}%")
        )
    if category:
        query = query.filter(CulturalItem.region == category)
    if excludeId:
        query = query.filter(CulturalItem.id != excludeId)

    total_count = query.count()

    if sort == 'created_at':
        query = query.order_by(CulturalItem.created_at.desc())

    items = query.offset((page - 1) * limit).limit(limit).all()

    total_pages = (total_count + limit - 1) // limit

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
    items = db.query(CulturalItem).filter(CulturalItem.is_featured == True).order_by(CulturalItem.created_at.desc()).limit(3).all()
    return {
        "items": items,
        "total": len(items)
    }

@router.post("/", response_model=CulturalItemSchema, status_code=status.HTTP_201_CREATED)
def create_item(item: CulturalItemCreate, db: Session = Depends(get_db)) -> CulturalItemSchema:
    new_item = CulturalItem(
        title=item.title,
        description=item.description,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{item_id}", response_model=CulturalItemSchema)
def get_item(item_id: UUID, db: Session = Depends(get_db)) -> CulturalItemSchema:
    item = db.execute(select(CulturalItem).where(CulturalItem.id == item_id)).scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=CulturalItemSchema)
def update_item(item_id: UUID, item: ItemUpdate, db: Session = Depends(get_db)) -> CulturalItemSchema:
    db_item = db.execute(select(CulturalItem).where(CulturalItem.id == item_id)).scalars().first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    
    if item.name is not None:
        db_item.title = item.name
    if item.description is not None:
        db_item.description = item.description
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: UUID, db: Session = Depends(get_db)) -> Response:
    db_item = db.execute(select(CulturalItem).where(CulturalItem.id == item_id)).scalars().first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
