from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import Comment, User
from app.api.v1.core.schemas import CommentCreate, CommentSchema

# Fix: Remove duplicate API prefix, it's already added in main.py
router = APIRouter(tags=["comments"])

@router.post("/", response_model=CommentSchema, status_code=status.HTTP_201_CREATED, operation_id="create_new_comment_v1")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)) -> CommentSchema:
    new_comment = Comment(**comment.model_dump())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

# Fix: Corrected route pattern to match frontend API call
@router.get("/{item_id}", response_model=list[CommentSchema], operation_id="list_comments_by_cultural_item_v1")
def get_comments(
    item_id: UUID = Path(..., description="ID of the cultural item to fetch comments for"), 
    db: Session = Depends(get_db)
) -> list[CommentSchema]:
    try:
        # Get all comments for this item, including user details
        comments = db.execute(
            select(Comment)
            .where(Comment.cultural_item_id == item_id)
            .where(Comment.parent_comment_id == None)  # Only get top-level comments
            .order_by(Comment.created_at.desc())
        ).scalars().all()
        
        # Load all replies for each comment
        for comment in comments:
            # Ensure each comment has a 'replies' attribute even if empty
            if not hasattr(comment, 'replies') or comment.replies is None:
                comment.replies = []
        
        # Convert SQLAlchemy objects to dictionaries to avoid '_sa_instance_state' error
        result = []
        for comment in comments:
            # Create a dictionary with the comment attributes
            comment_dict = {
                "id": comment.id,
                "text": comment.text,
                "created_at": comment.created_at,
                "user_id": comment.user_id,
                "cultural_item_id": comment.cultural_item_id,
                "replies": []
            }
            
            # Add replies if any
            if hasattr(comment, 'replies') and comment.replies:
                for reply in comment.replies:
                    reply_dict = {
                        "id": reply.id,
                        "text": reply.text,
                        "created_at": reply.created_at,
                        "user_id": reply.user_id,
                        "cultural_item_id": reply.cultural_item_id,
                        "parent_comment_id": reply.parent_comment_id
                    }
                    comment_dict["replies"].append(reply_dict)
            
            result.append(comment_dict)
        
        return result
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.error(f"Error fetching comments for item {item_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching comments: {str(e)}"
        )

@router.post("/{comment_id}/replies", response_model=CommentSchema, status_code=status.HTTP_201_CREATED, operation_id="reply_to_comment_v1")
def reply_to_comment(comment_id: UUID, reply: CommentCreate, db: Session = Depends(get_db)) -> CommentSchema:
    parent_comment = db.execute(select(Comment).where(Comment.id == comment_id)).scalars().first()
    if not parent_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent comment not found")
    
    # Create reply with parent_comment_id set
    reply_data = reply.model_dump()
    reply_data["parent_comment_id"] = comment_id
    reply_data["cultural_item_id"] = parent_comment.cultural_item_id
    
    new_reply = Comment(**reply_data)
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)
    return new_reply

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_comment_by_id_v1")
def delete_comment(comment_id: UUID, db: Session = Depends(get_db)):
    db_comment = db.execute(select(Comment).where(Comment.id == comment_id)).scalars().first()
    if not db_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    db.execute(delete(Comment).where(Comment.id == comment_id))
    db.commit()
    return {"message": "Comment deleted successfully"}
