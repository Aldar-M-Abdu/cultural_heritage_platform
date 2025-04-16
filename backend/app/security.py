import base64
from datetime import UTC, datetime, timedelta, timezone
from random import SystemRandom
from typing import Annotated, Optional
from uuid import UUID
import logging

from app.api.v1.core.models import Token, User
from app.db_setup import get_db
from app.settings import settings
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

# Set up the UTC timezone constant
UTC = timezone.utc

# Configure logger
logger = logging.getLogger(__name__)

# Fix tokenUrl to match actual API structure - include the full path that matches the frontend
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_ENTROPY = 32
_sysrand = SystemRandom()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def token_bytes(nbytes=None) -> bytes:
    if nbytes is None:
        nbytes = DEFAULT_ENTROPY
    return _sysrand.randbytes(nbytes)


def token_urlsafe(nbytes=None) -> str:
    tok = token_bytes(nbytes)
    return base64.urlsafe_b64encode(tok).rstrip(b"=").decode("ascii")


def create_database_token(user_id: UUID, db: Session) -> Token:
    """Create a new database token for a user"""
    # Generate secure token
    token_value = token_urlsafe(32)
    
    # Make sure to use timezone-aware datetime
    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Create new token
    db_token = Token(
        user_id=user_id,
        token=token_value,
        expires_at=expires_at,
        created_at=now
    )
    
    # Add and commit
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    
    return db_token


def verify_token_access(token_str: str, db: Session) -> Token:
    try:
        # Add debug logging
        logger.debug(f"Verifying token access: {token_str[:10]}...")
        
        # Ensure we're using timezone-aware datetime for comparison
        current_time = datetime.now(UTC)
        
        token = (
            db.execute(
                select(Token).where(
                    Token.token == token_str,
                    Token.expires_at > current_time,
                    Token.is_revoked == False,
                )
            )
            .scalars()
            .first()
        )
        
        if not token:
            logger.warning(f"Token not found or expired: {token_str[:10]}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalid or expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Ensure the user relationship is loaded
        try:
            db.refresh(token, attribute_names=['user'])
        except Exception as refresh_error:
            logger.warning(f"Error refreshing token: {refresh_error}")
            # Try alternative method to get user if refresh fails
            from app.api.v1.core.models import User
            user = db.execute(select(User).where(User.id == token.user_id)).scalar_one_or_none()
            if user:
                token.user = user
        
        if not token.user:
            logger.warning(f"User not found for token: {token_str[:10]}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Check if token is about to expire and extend it if needed
        # Ensure we use timezone-aware datetime for comparison
        # Convert expires_at to timezone-aware if it's not already
        if token.expires_at.tzinfo is None:
            token_expires_at = token.expires_at.replace(tzinfo=UTC)
        else:
            token_expires_at = token.expires_at
            
        time_until_expiry = token_expires_at - current_time
        # If token will expire in less than 10% of its original lifetime, extend it
        if time_until_expiry < timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 0.1):
            token.expires_at = current_time + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            db.commit()
            logger.info(f"Extended token expiry for user {token.user_id}")
            
        logger.debug(f"Token verified successfully for user {token.user_id}")
        return token
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in verify_token_access: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], 
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
) -> User:
    """Get the current user from the token"""
    # Try to get token from multiple sources
    final_token = token
    
    # If no token from oauth2_scheme, try to extract from Authorization header
    if not final_token and authorization:
        try:
            # Handle different formats of Authorization header
            if " " in authorization:
                auth_type, auth_token = authorization.split(" ", 1)
                if auth_type.lower() == "bearer":
                    final_token = auth_token
                    logger.debug(f"Extracted token from Authorization header: {final_token[:10]}...")
            else:
                # Handle case where the entire header might be the token
                final_token = authorization
                logger.debug(f"Using entire Authorization header as token: {final_token[:10]}...")
        except Exception as e:
            logger.error(f"Error extracting token from Authorization header: {e}")
    
    if not final_token:
        logger.warning("No token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Clean the token - remove any whitespace, quotes or other artifacts
    final_token = final_token.strip().strip('"\'')
    
    logger.debug(f"Validating token: {final_token[:10]}...")    
    
    try:
        token_obj = verify_token_access(token_str=final_token, db=db)
        user = token_obj.user
        
        if not user:
            logger.warning(f"No user found for token: {final_token[:10]}")
            # Try to fetch user directly from database
            user = db.execute(select(User).where(User.id == token_obj.user_id)).scalar_one_or_none()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
                
            # Attach user to token object
            token_obj.user = user
        
        logger.debug(f"Successfully authenticated user: {user.id}")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_current_user: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


def get_current_superuser(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized. Admin privileges required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


# Add alias for get_current_superuser to maintain compatibility
def get_admin_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    return get_current_superuser(current_user)


def revoke_token(token: Annotated[str, Depends(oauth2_scheme)], db: Session) -> None:
    db_token = db.execute(
        select(Token).where(Token.token == token)
    ).scalars().first()
    if db_token:
        db_token.is_revoked = True
        db.commit()


def get_current_token(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> Token:
    token = verify_token_access(token_str=token, db=db)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Similar to get_current_user but doesn't raise an exception if no valid token is provided."""
    if token is None:
        return None
    
    try:
        token_obj = verify_token_access(token_str=token, db=db)
        return token_obj.user
    except HTTPException:
        return None