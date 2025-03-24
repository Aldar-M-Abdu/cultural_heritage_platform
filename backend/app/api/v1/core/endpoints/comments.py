from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import Comment
from app.api.v1.core.schemas import CommentCreate, CommentSchema  # Ensure CommentCreate is imported
from uuid import UUID  # Added UUID import

router = APIRouter(prefix="/api/comments")

@router.post("/", response_model=CommentSchema)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    new_comment = Comment(**comment.dict())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/{item_id}", response_model=list[CommentSchema])
def get_comments(item_id: UUID, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.cultural_item_id == item_id).all()

@router.delete("/{comment_id}")
def delete_comment(comment_id: UUID, db: Session = Depends(get_db)):  # Updated to UUID
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(db_comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
