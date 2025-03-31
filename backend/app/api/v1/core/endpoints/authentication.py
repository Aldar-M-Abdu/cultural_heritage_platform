from typing import Annotated
from datetime import timedelta

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
from fastapi import APIRouter, Depends, Form, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

router = APIRouter(tags=["auth"], prefix="/v1/auth")


@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> TokenSchema:
    user = (
        db.execute(
            select(User).where(User.username == form_data.username),
        )
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_database_token(user_id=user.id, db=db)
    return {"access_token": access_token.token, "token_type": "bearer"}


@router.post("/login")
def login_alternate(
    username: str = Form(None),
    password: str = Form(None),
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()] = None,
    db: Session = Depends(get_db),
) -> TokenSchema:
    """Alternative login endpoint that accepts either form fields or OAuth2 form."""
    if username and password and not form_data:
        # Create OAuth2PasswordRequestForm object manually
        class CustomFormData:
            def __init__(self, username, password):
                self.username = username
                self.password = password
                self.scope = ""
                self.client_id = None
                self.client_secret = None
        
        form_data = CustomFormData(username, password)
    
    if not form_data or not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password required"
        )
    
    # Redirect to the standard login function
    return login(form_data, db)


@router.delete("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    db.execute(delete(Token).where(Token.token == current_token.token))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/user/create", status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserRegisterSchema, db: Session = Depends(get_db)
) -> UserOutSchema:
    hashed_password = hash_password(user.password)
    # Map first_name and last_name to full_name
    user_data = user.model_dump(exclude={"password"})
    # Create full_name from first_name and last_name
    full_name = f"{user_data.pop('first_name', '')} {user_data.pop('last_name', '')}".strip()
    # Use email as username if not provided
    username = user_data.get('username', user_data.get('email'))
    
    new_user = User(
        username=username,
        email=user_data.get('email'),
        full_name=full_name,
        hashed_password=hashed_password
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )


@router.put("/user/update", response_model=UserOutSchema)
def update_user(
    user: UserRegisterSchema,
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
        
    user_data = user.model_dump(exclude_unset=True, exclude={"password"})
    
    # Handle first_name and last_name if provided
    if "first_name" in user_data or "last_name" in user_data:
        first_name = user_data.pop("first_name", "")
        last_name = user_data.pop("last_name", "")
        if first_name or last_name:
            current_name_parts = (current_user.full_name or "").split(" ", 1)
            current_first = current_name_parts[0] if current_name_parts else ""
            current_last = current_name_parts[1] if len(current_name_parts) > 1 else ""
            
            new_first = first_name if first_name else current_first
            new_last = last_name if last_name else current_last
            
            current_user.full_name = f"{new_first} {new_last}".strip()
            
    # Update the rest of the fields
    for key, value in user_data.items():
        if hasattr(current_user, key):
            setattr(current_user, key, value)
            
    # Handle password separately
    if hasattr(user, "password") and user.password:
        current_user.hashed_password = hash_password(user.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/user/delete", status_code=status.HTTP_204_NO_CONTENT)
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


@router.post("/token/refresh")
def refresh_token(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh functionality is disabled",
    )