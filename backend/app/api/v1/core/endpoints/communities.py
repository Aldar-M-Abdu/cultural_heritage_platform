from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload

from app.db_setup import get_db
from app.api.v1.core.models import Community, Discussion, DiscussionComment, User
from app.api.v1.core.schemas import (
    CommunityCreate, CommunityUpdate, CommunityResponse,
    DiscussionCreate, DiscussionUpdate, DiscussionResponse,
    DiscussionCommentCreate, DiscussionCommentUpdate, DiscussionCommentResponse
)
from app.security import get_current_active_user, get_admin_user, get_optional_user

router = APIRouter()

@router.get("/", response_model=List[CommunityResponse])
def get_communities(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get all communities"""
    communities = db.query(Community).offset(skip).limit(limit).all()
    return communities

@router.post("/", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED)
def create_community(
    community_data: CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Only admins can create communities
):
    """Create a new community"""
    # Set current user as moderator if not specified
    if not community_data.moderator_id:
        community_data.moderator_id = current_user.id
        
    community = Community(**community_data.dict())
    db.add(community)
    db.commit()
    db.refresh(community)
    return community

@router.get("/{community_id}", response_model=CommunityResponse)
def get_community(
    community_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific community by ID"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with ID {community_id} not found"
        )
    return community

@router.get("/slug/{slug}", response_model=CommunityResponse)
def get_community_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get a specific community by slug"""
    community = db.query(Community).filter(Community.slug == slug).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with slug '{slug}' not found"
        )
    return community

@router.put("/{community_id}", response_model=CommunityResponse)
def update_community(
    community_id: UUID,
    community_data: CommunityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Only admins can update communities
):
    """Update a specific community"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with ID {community_id} not found"
        )
    
    # Update community fields
    update_data = community_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(community, key, value)
    
    db.commit()
    db.refresh(community)
    return community

@router.delete("/{community_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_community(
    community_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Only admins can delete communities
):
    """Delete a specific community"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with ID {community_id} not found"
        )
    
    db.delete(community)
    db.commit()
    return None

@router.get("/{community_id}/discussions", response_model=List[DiscussionResponse])
def get_community_discussions(
    community_id: UUID,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all discussions for a specific community"""
    # Verify community exists
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with ID {community_id} not found"
        )
    
    # Build query with author information
    query = db.query(Discussion).filter(Discussion.community_id == community_id)
    
    # Apply category filter if provided
    if category and category != "all":
        query = query.filter(Discussion.category == category)
        
    # Apply search filter if provided
    if search:
        query = query.filter(
            (Discussion.title.ilike(f"%{search}%")) | 
            (Discussion.content.ilike(f"%{search}%"))
        )
    
    # Order by pinned first, then by most recent
    query = query.order_by(Discussion.is_pinned.desc(), Discussion.updated_at.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Eager load author data
    query = query.options(joinedload(Discussion.author))
    
    # Execute query
    discussions = query.all()
    
    # Add comment count for each discussion
    for discussion in discussions:
        discussion.comment_count = db.query(func.count(DiscussionComment.id))\
            .filter(DiscussionComment.discussion_id == discussion.id).scalar() or 0
    
    return discussions

@router.post("/{community_id}/discussions", response_model=DiscussionResponse, status_code=status.HTTP_201_CREATED)
def create_discussion(
    community_id: UUID,
    discussion_data: DiscussionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)  # Must be logged in to create discussions
):
    """Create a new discussion in a specific community"""
    # Verify community exists
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community with ID {community_id} not found"
        )
    
    # Override community_id with path parameter to ensure consistency
    discussion_data_dict = discussion_data.dict()
    discussion_data_dict["community_id"] = community_id
    discussion_data_dict["author_id"] = current_user.id
    
    discussion = Discussion(**discussion_data_dict)
    db.add(discussion)
    db.commit()
    db.refresh(discussion)
    
    # Add author to response
    discussion.author = current_user
    discussion.comment_count = 0
    
    return discussion
