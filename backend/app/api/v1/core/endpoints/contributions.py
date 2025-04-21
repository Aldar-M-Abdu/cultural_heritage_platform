from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.db_setup import get_db
from app.api.v1.core.models import Contribution, User, CulturalItem
from app.api.v1.core.schemas import ContributionResponse
from app.security import get_current_active_user

router = APIRouter(tags=["contributions"])

@router.get("/users/me/contributions", response_model=List[ContributionResponse])
def get_user_contributions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all contributions made by the currently authenticated user."""
    contributions = db.query(Contribution)\
        .options(joinedload(Contribution.cultural_item))\
        .filter(Contribution.user_id == current_user.id)\
        .order_by(Contribution.timestamp.desc())\
        .all()
    
    # Add the user object to each contribution
    for contribution in contributions:
        contribution.user = current_user
    
    return contributions 