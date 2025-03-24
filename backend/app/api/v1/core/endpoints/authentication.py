from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.settings import settings
from app.db_setup import get_db
from app.api.v1.core.models import User
from app.api.v1.core.schemas import Token, UserCreate, User as UserSchema
from app.utils import create_access_token
from app.security import get_password_hash, security  # Ensure security is correctly imported

# Update router to include prefix
router = APIRouter(prefix="/api/auth")

# Update endpoint paths to align with frontend expectations
@router.post("/login")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Login functionality is disabled"
    )

@router.post("/logout")
async def logout():
    """
    Handles user logout.
    """
    # Ensure this function is properly implemented and does not return a string directly.
    return {"message": "Successfully logged out"}

@router.post("/refresh-token")
def refresh_token(
    token: str = Depends(security),  # Use the security dependency to extract the token
    db: Session = Depends(get_db)
):
    # Implement token refresh logic here
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh functionality is disabled"
    )

@router.post("/register", response_model=UserSchema)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
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

@router.put("/update", response_model=UserSchema)
def update_user(user: UserCreate, token: str = Depends(security), db: Session = Depends(get_db)):
    current_user = db.query(User).filter(User.username == token).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/delete")
def delete_user(token: str = Depends(security), db: Session = Depends(get_db)):
    current_user = db.query(User).filter(User.username == token).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(current_user)
    db.commit()
    return {"message": "User account deleted successfully"}