from typing import Annotated
from datetime import timedelta, datetime
import secrets

from app.api.v1.core.models import Token, User
from app.api.v1.core.schemas import (
    TokenSchema,
    UserOutSchema,
    UserRegisterSchema,
)
from app.db_setup import get_db
from app.security import (
    create_database_token,
    get_current_token,
    hash_password,
    verify_password,
)
from fastapi import APIRouter, Depends, Form, HTTPException, Response, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

router = APIRouter(tags=["auth"])


@router.post("/token", operation_id="get_access_token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> TokenSchema:
    user = (
        db.execute(
            select(User).where(
                # Check both username and email fields
                (User.username == form_data.username) | (User.email == form_data.username)
            )
        )
        .scalars()
        .first()
    )
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_database_token(user_id=user.id, db=db)
    return {"access_token": access_token.token, "token_type": "bearer"}


@router.post("/login-alternate", operation_id="alternate_login")
def login_alternate(
    username: str = Form(...),  # Ensure username is required
    password: str = Form(...),  # Ensure password is required
    db: Session = Depends(get_db),
) -> TokenSchema:
    user = (
        db.execute(
            select(User).where(
                # Check both username and email fields
                (User.username == username) | (User.email == username)
            )
        )
        .scalars()
        .first()
    )
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_database_token(user_id=user.id, db=db)
    return {"access_token": access_token.token, "token_type": "bearer"}


@router.delete("/logout", status_code=status.HTTP_204_NO_CONTENT, operation_id="logout_user")
def logout(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    db.execute(delete(Token).where(Token.token == current_token.token))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/register", response_model=UserOutSchema, status_code=status.HTTP_201_CREATED, operation_id="register_user")
async def register_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db)
) -> UserOutSchema:
    # Check if email already exists
    if db.execute(select(User).where(User.email == email)).scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )
    
    # Check if username already exists
    if db.execute(select(User).where(User.username == username)).scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken",
        )
    
    # Create new user
    hashed_password = hash_password(password)
    new_user = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
    )

    # Add user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Handle profile image if provided
    if profile_image:
        try:
            # Create the directory if it doesn't exist
            from pathlib import Path
            UPLOAD_DIR = Path("static/profile_images")
            UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            file_extension = profile_image.filename.split(".")[-1]
            new_filename = f"{new_user.id}_{profile_image.filename}"
            file_path = UPLOAD_DIR / new_filename
            
            with open(file_path, "wb") as buffer:
                contents = await profile_image.read()
                buffer.write(contents)
            
            # Update user with profile image path
            image_url = f"/static/profile_images/{new_filename}"
            new_user.profile_image = image_url
            db.commit()
            db.refresh(new_user)
        except Exception as e:
            # Log error but don't fail the registration
            print(f"Error saving profile image: {e}")
    
    # Also generate and return a token for immediate login
    access_token = create_database_token(user_id=new_user.id, db=db)
    
    return new_user


@router.put("/update-profile", response_model=UserOutSchema, operation_id="update_user_profile")
async def update_user(
    username: str = Form(None),
    email: str = Form(None),
    password: str = Form(None),
    full_name: str = Form(None),
    profile_image: UploadFile = File(None),
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    current_user = (
        db.execute(select(User).where(User.id == current_token.user_id))
        .scalars()
        .first()
    )
    
    if not current_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Check if email is being updated and is already taken by another user
    if email and email != current_user.email:
        existing_user = db.execute(
            select(User).where(User.email == email, User.id != current_user.id)
        ).scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )
        current_user.email = email
    
    # Check if username is being updated and is already taken by another user
    if username and username != current_user.username:
        existing_user = db.execute(
            select(User).where(User.username == username, User.id != current_user.id)
        ).scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is already taken",
            )
        current_user.username = username
    
    # Update full_name if provided
    if full_name:
        current_user.full_name = full_name
    
    # Update password if provided
    if password:
        current_user.hashed_password = hash_password(password)
    
    # Handle profile image upload
    if profile_image:
        try:
            # Create the directory if it doesn't exist
            from pathlib import Path
            UPLOAD_DIR = Path("static/profile_images")
            UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            new_filename = f"{current_user.id}_{profile_image.filename}"
            file_path = UPLOAD_DIR / new_filename
            
            with open(file_path, "wb") as buffer:
                contents = await profile_image.read()
                buffer.write(contents)
            
            # Update user with profile image path
            image_url = f"/static/profile_images/{new_filename}"
            current_user.profile_image = image_url
        except Exception as e:
            # Log error but don't fail the update
            print(f"Error saving profile image: {e}")
    
    # Commit changes
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/delete-account", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_user_account")
def delete_user(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    current_user = (
        db.execute(select(User).where(User.id == current_token.user_id))
        .scalars()
        .first()
    )
    
    if not current_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    db.delete(current_user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/refresh-token", operation_id="refresh_token")
def refresh_token(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh functionality is disabled",
    )


@router.post("/password-reset", status_code=status.HTTP_200_OK, operation_id="request_password_reset_email")
def request_password_reset(email: str = Form(...), db: Session = Depends(get_db)):
    """Send a password reset email with a token"""
    user = db.execute(select(User).where(User.email == email)).scalars().first()
    
    if not user:
        # To prevent user enumeration, always return success even if email not found
        return {"detail": "If your email is registered, you will receive a password reset link"}
    
    # Generate unique token (could use UUID or other secure method)
    reset_token = secrets.token_urlsafe(32)
    
    # Store token in database with expiration (e.g., 24 hours)
    # This is a simplified example - in a real app, you'd use a proper password_reset table
    user.reset_token = reset_token
    user.reset_token_expires = datetime.now() + timedelta(hours=24)
    db.commit()
    
    # In a real app, you would send an email here with a link like:
    # f"{frontend_url}/reset-password?token={reset_token}"
    
    return {"detail": "Password reset link sent"}


@router.post("/password-reset/confirm", status_code=status.HTTP_200_OK, operation_id="confirm_password_reset")
def confirm_password_reset(token: str = Form(...), new_password: str = Form(...), db: Session = Depends(get_db)):
    """Reset password using the token from email"""
    user = db.execute(
        select(User).where(
            User.reset_token == token,
            User.reset_token_expires > datetime.now()
        )
    ).scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password
    user.hashed_password = hash_password(new_password)
    
    # Clear reset token
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    return {"detail": "Password has been reset successfully"}


@router.put("/change-password", status_code=status.HTTP_200_OK, operation_id="change_password")
def change_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db)
):
    """Change password when user is logged in"""
    user = db.execute(select(User).where(User.id == current_token.user_id)).scalars().first()
    
    if not user or not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    user.hashed_password = hash_password(new_password)
    db.commit()
    return {"detail": "Password changed successfully"}


@router.get("/current-user", response_model=UserOutSchema, operation_id="get_current_user_details")
def get_current_user(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
) -> UserOutSchema:
    user = (
        db.execute(select(User).where(User.id == current_token.user_id))
        .scalars()
        .first()
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    return user