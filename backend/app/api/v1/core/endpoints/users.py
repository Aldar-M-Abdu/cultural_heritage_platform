from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import User
from app.api.v1.core.schemas import UserUpdate, User as UserSchema

router = APIRouter(tags=["users"], prefix="/users")

@router.get("/{user_id}", response_model=UserSchema)
def get_user(
    user_id: UUID, db: Session = Depends(get_db)
) -> UserSchema:
    user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: UUID, user: UserUpdate, db: Session = Depends(get_db)
) -> UserSchema:
    db_user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user
