from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload

from app.db_setup import get_db
from app.api.v1.core.models import Discussion, DiscussionComment, User
from app.api.v1.core.schemas import (
    DiscussionResponse, DiscussionUpdate,
    DiscussionCommentCreate, DiscussionCommentUpdate, DiscussionCommentResponse
)
from app.security import get_current_active_user, get_admin_user, get_optional_user

router = APIRouter()

@router.get("/{discussion_id}", response_model=DiscussionResponse)
def get_discussion(
    discussion_id: UUID,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get a specific discussion by ID with author information"""
    # Load discussion with author data
    discussion = db.query(Discussion).options(joinedload(Discussion.author)).filter(Discussion.id == discussion_id).first()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discussion with ID {discussion_id} not found"
        )
    
    # Increment view count
    discussion.view_count += 1
    db.commit()
    
    # Calculate comment count
    discussion.comment_count = db.query(func.count(DiscussionComment.id))\
        .filter(DiscussionComment.discussion_id == discussion_id).scalar() or 0
    
    return discussion

@router.put("/{discussion_id}", response_model=DiscussionResponse)
def update_discussion(
    discussion_id: UUID,
    discussion_data: DiscussionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a specific discussion"""
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discussion with ID {discussion_id} not found"
        )
    
    # Check if user is author or admin
    if discussion.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this discussion"
        )
    
    # Update discussion fields
    update_data = discussion_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(discussion, key, value)
    
    db.commit()
    db.refresh(discussion)
    
    # Add author to response
    discussion.author = current_user
    discussion.comment_count = db.query(func.count(DiscussionComment.id))\
        .filter(DiscussionComment.discussion_id == discussion_id).scalar() or 0
    
    return discussion

@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_discussion(
    discussion_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a specific discussion"""
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discussion with ID {discussion_id} not found"
        )
    
    # Check if user is author or admin
    if discussion.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this discussion"
        )
    
    # Delete all comments first (cascade delete not always reliable)
    db.query(DiscussionComment).filter(DiscussionComment.discussion_id == discussion_id).delete()
    
    # Then delete the discussion
    db.delete(discussion)
    db.commit()
    
    return None

@router.get("/{discussion_id}/comments", response_model=List[DiscussionCommentResponse])
def get_discussion_comments(
    discussion_id: UUID,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500)
):
    """Get all comments for a specific discussion"""
    # Verify discussion exists
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discussion with ID {discussion_id} not found"
        )
    
    # Get all top-level comments (no parent)
    comments = db.query(DiscussionComment)\
        .options(joinedload(DiscussionComment.author))\
        .filter(DiscussionComment.discussion_id == discussion_id)\
        .filter(DiscussionComment.parent_id.is_(None))\
        .order_by(DiscussionComment.created_at.asc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # For each comment, load its replies
    for comment in comments:
        replies = db.query(DiscussionComment)\
            .options(joinedload(DiscussionComment.author))\
            .filter(DiscussionComment.parent_id == comment.id)\
            .order_by(DiscussionComment.created_at.asc())\
            .all()
        comment.replies = replies
    
    return comments

@router.post("/{discussion_id}/comments", response_model=DiscussionCommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    discussion_id: UUID,
    comment_data: DiscussionCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new comment for a specific discussion"""
    # Verify discussion exists
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discussion with ID {discussion_id} not found"
        )
    
    # Verify parent comment exists if provided
    if comment_data.parent_id:
        parent_comment = db.query(DiscussionComment).filter(DiscussionComment.id == comment_data.parent_id).first()
        if not parent_comment or parent_comment.discussion_id != discussion_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parent comment not found or not part of this discussion"
            )
    
    # Override discussion_id with path parameter
    comment_dict = comment_data.dict()
    comment_dict["discussion_id"] = discussion_id
    comment_dict["author_id"] = current_user.id
    
    comment = DiscussionComment(**comment_dict)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    # Add author to response
    comment.author = current_user
    comment.replies = []
    
    # Update the discussion's updated_at timestamp to show activity
    discussion.updated_at = comment.created_at
    db.commit()
    
    return comment

@router.put("/comments/{comment_id}", response_model=DiscussionCommentResponse)
def update_comment(
    comment_id: UUID,
    comment_data: DiscussionCommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a specific comment"""
    comment = db.query(DiscussionComment).options(joinedload(DiscussionComment.author)).filter(DiscussionComment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID {comment_id} not found"
        )
    
    # Check if user is author or admin
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    # Update comment content
    update_data = comment_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(comment, key, value)
    
    db.commit()
    db.refresh(comment)
    
    # Load replies for the response
    replies = db.query(DiscussionComment)\
        .options(joinedload(DiscussionComment.author))\
        .filter(DiscussionComment.parent_id == comment_id)\
        .order_by(DiscussionComment.created_at.asc())\
        .all()
    comment.replies = replies
    
    return comment

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a specific comment"""
    comment = db.query(DiscussionComment).filter(DiscussionComment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID {comment_id} not found"
        )
    
    # Check if user is author or admin
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    # Delete all replies first
    db.query(DiscussionComment).filter(DiscussionComment.parent_id == comment_id).delete()
    
    # Then delete the comment
    db.delete(comment)
    db.commit()
    
    return None
