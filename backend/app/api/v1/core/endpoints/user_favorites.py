from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db_setup import get_db
from app.api.v1.core.models import UserFavorite, User, CulturalItem
from app.api.v1.core.schemas import UserFavorite as UserFavoriteSchema, UserFavoriteCreate
from app.security import get_current_active_user

router = APIRouter(tags=["user_favorites"])

@router.get("/", response_model=List[UserFavoriteSchema])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> List[UserFavoriteSchema]:
    """Get all favorites for the current user"""
    favorites = db.execute(
        select(UserFavorite).where(UserFavorite.user_id == current_user.id)
    ).scalars().all()
    return favorites

@router.post("/", response_model=UserFavoriteSchema, status_code=status.HTTP_201_CREATED)
def add_favorite(
    favorite: UserFavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> UserFavoriteSchema:
    """Add a cultural item to the user's favorites"""
    # Check if the cultural item exists
    item = db.execute(
        select(CulturalItem).where(CulturalItem.id == favorite.cultural_item_id)
    ).scalars().first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cultural item with ID {favorite.cultural_item_id} not found"
        )
    
    # Create the favorite
    db_favorite = UserFavorite(
        user_id=current_user.id,
        cultural_item_id=favorite.cultural_item_id
    )
    
    try:
        db.add(db_favorite)
        db.commit()
        db.refresh(db_favorite)
        return db_favorite
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This item is already in your favorites"
        )

@router.delete("/{cultural_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Response:
    """Remove a cultural item from the user's favorites"""
    # Check if the favorite exists
    favorite = db.execute(
        select(UserFavorite).where(
            UserFavorite.user_id == current_user.id,
            UserFavorite.cultural_item_id == cultural_item_id
        )
    ).scalars().first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This item is not in your favorites"
        )
    
    # Delete the favorite
    db.delete(favorite)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/check/{cultural_item_id}", response_model=dict)
def check_favorite(
    cultural_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Check if a cultural item is in the user's favorites"""
    favorite = db.execute(
        select(UserFavorite).where(
            UserFavorite.user_id == current_user.id,
            UserFavorite.cultural_item_id == cultural_item_id
        )
    ).scalars().first()
    
    return {"is_favorite": favorite is not None}
