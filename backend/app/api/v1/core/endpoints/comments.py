from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import Comment
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

@router.get("/{cultural_item_id}", response_model=list[CommentSchema], operation_id="list_comments_by_cultural_item_v1")
def get_comments(item_id: UUID, db: Session = Depends(get_db)) -> list[CommentSchema]:
    return db.execute(select(Comment).where(Comment.cultural_item_id == item_id)).scalars().all()

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_comment_by_id_v1")
def delete_comment(comment_id: UUID, db: Session = Depends(get_db)):
    db_comment = db.execute(select(Comment).where(Comment.id == comment_id)).scalars().first()
    if not db_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    db.execute(delete(Comment).where(Comment.id == comment_id))
    db.commit()
    return {"message": "Comment deleted successfully"}
