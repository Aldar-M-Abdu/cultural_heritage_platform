from typing import Annotated, Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.db_setup import get_db
from app.api.v1.core.models import User, Contribution
from app.api.v1.core.schemas import UserUpdate, UserOutSchema, ContributionResponse
from app.security import get_current_active_user
import shutil
import os
from pathlib import Path

router = APIRouter(tags=["users"], prefix="/users")

# Define where profile images will be stored
UPLOAD_DIR = Path("static/profile_images")
# Ensure the directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# IMPORTANT: Place /me endpoint BEFORE the /{user_id} endpoint to avoid conflicts
@router.get("/me", response_model=UserOutSchema)
def get_current_user(
    current_user: User = Depends(get_current_active_user)
) -> UserOutSchema:
    """Get the currently authenticated user's details."""
    # Make sure to return the user correctly formatted as UserOutSchema
    return UserOutSchema.model_validate(current_user)

@router.put("/me", response_model=UserOutSchema)
def update_current_user(
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> UserOutSchema:
    """Update the current user's profile"""
    db_user = db.execute(select(User).where(User.id == current_user.id)).scalars().first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    # Make sure to return properly formatted user data
    return UserOutSchema.model_validate(db_user)

@router.get("/{user_id}", response_model=UserOutSchema)
def get_user(
    user_id: UUID, db: Session = Depends(get_db)
) -> UserOutSchema:
    user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    return user

@router.put("/{user_id}", response_model=UserOutSchema)
def update_user(
    user_id: UUID, 
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> UserOutSchema:
    # Check permissions - user can only update their own profile unless they're an admin
    if str(current_user.id) != str(user_id) and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's profile"
        )
    
    db_user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return UserOutSchema.model_validate(db_user)

@router.post("/{user_id}/profile-image", response_model=UserOutSchema)
async def upload_profile_image(
    user_id: UUID,
    profile_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a profile image for the user"""
    # Check if the user exists
    db_user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Check if the current user is authorized to update this profile
    if str(current_user.id) != str(user_id) and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's profile"
        )
    
    # Validate file type (only allow images)
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if profile_image.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files (JPEG, PNG, GIF) are allowed"
        )
    
    # Generate a unique filename
    file_extension = profile_image.filename.split(".")[-1]
    new_filename = f"{user_id}_{profile_image.filename}"
    file_path = UPLOAD_DIR / new_filename
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(profile_image.file, buffer)
    
    # Update the user's profile image URL
    image_url = f"/static/profile_images/{new_filename}"
    db_user.profile_image = image_url
    db.commit()
    db.refresh(db_user)
    
    return db_user

# This endpoint has been moved to contributions.py
# @router.get("/me/contributions", response_model=List[ContributionResponse])
# def get_user_contributions(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user)
# ):
#     """Get all contributions made by the currently authenticated user."""
#     contributions = db.query(Contribution)\
#         .options(joinedload(Contribution.cultural_item))\
#         .filter(Contribution.user_id == current_user.id)\
#         .order_by(Contribution.timestamp.desc())\
#         .all()
#     
#     # Add the user object to each contribution
#     for contribution in contributions:
#         contribution.user = current_user
#     
#     return contributions
