from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.models import User
from app.security import get_password_hash

router = APIRouter()

@router.post("/register")
def register_user(username: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = get_password_hash(password)
    new_user = User(username=username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"user": {"id": new_user.id, "username": new_user.username}}
