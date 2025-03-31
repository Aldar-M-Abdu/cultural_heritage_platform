from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import Item
from app.api.v1.core.schemas import ItemCreate, ItemUpdate, Item as ItemSchema

router = APIRouter(tags=["items"], prefix="/items")

@router.get("/", response_model=list[ItemSchema])
def get_items(db: Session = Depends(get_db)) -> list[ItemSchema]:
    return db.execute(select(Item)).scalars().all()

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
