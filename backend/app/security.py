import secrets
from datetime import datetime, timedelta
from typing import Optional, Union
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.settings import settings
from app.db_setup import get_db
from app.api.v1.core.models import User, Token
from app.api.v1.core.schemas import TokenData
from app.utils import create_access_token, decode_token  # Ensure utils is correctly imported

# Password and authentication
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = OAuth2PasswordBearer(tokenUrl="/api/auth/login")  # Updated to use OAuth2PasswordBearer


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_db_token(db: Session, user_id: int):
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    db_token = Token(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    return token


def get_current_user(db: Session = Depends(get_db), token: str = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = decode_token(token)  # Updated to use correct function
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    db_token = db.query(Token).filter(
        Token.token == token,
        Token.expires_at > datetime.utcnow(),
        Token.is_revoked == False
    ).first()
    
    if not db_token:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise credentials_exception
        
    return user


def revoke_token(db: Session, token: str):
    db_token = db.query(Token).filter(Token.token == token).first()
    if db_token:
        db_token.is_revoked = True
        db.commit()


def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_admin_user(current_user: User = Depends(get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user