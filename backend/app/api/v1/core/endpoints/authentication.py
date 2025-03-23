from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.settings import settings
from app.db_setup import get_db
from models import User
from security import authenticate_user, create_access_token, get_password_hash
from schemas import Token, UserCreate, User as UserSchema
from app.security import security, revoke_token  # Ensure these are imported

# Update router to include prefix
router = APIRouter(prefix="/api/auth")

# Update endpoint paths to align with frontend expectations
@router.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(token: str = Depends(security), db: Session = Depends(get_db)):
    revoke_token(db, token)  # Corrected function call
    return {"message": "Successfully logged out"}

@router.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"Registering user: {user.username}, email: {user.email}")
        # Check if username or email already exists
        db_user = db.query(User).filter(
            (User.username == user.username) | (User.email == user.email)
        ).first()
        
        if db_user:
            if db_user.username == user.username:
                raise HTTPException(
                    status_code=400, 
                    detail="Username already registered"
                )
            else:
                raise HTTPException(
                    status_code=400, 
                    detail="Email already registered"
                )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password,
            full_name=user.full_name,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )