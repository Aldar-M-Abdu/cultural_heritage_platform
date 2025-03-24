from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import User
from app.api.v1.core.schemas import UserUpdate, User as UserSchema
from uuid import UUID

router = APIRouter(prefix="/api/users")

@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: UUID, db: Session = Depends(get_db)):  # Change user_id to UUID
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(user_id: UUID, user: UserUpdate, db: Session = Depends(get_db)):  # Change user_id to UUID
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user
