import base64
from datetime import UTC, datetime, timedelta
from random import SystemRandom
from typing import Annotated, Optional
from uuid import UUID

from app.api.v1.core.models import Token, User
from app.db_setup import get_db
from app.settings import settings
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

# Fix tokenUrl to match actual API structure
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
    randomized_token = token_urlsafe()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_token = Token(token=randomized_token, user_id=user_id, expires_at=expires_at)
    db.add(new_token)
    db.commit()
    return new_token


def verify_token_access(token_str: str, db: Session) -> Token:
    max_age = timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    token = (
        db.execute(
            select(Token).where(
                Token.token == token_str,
                Token.expires_at > datetime.now(UTC),
                Token.created_at >= datetime.now(UTC) - max_age,  # Fixed attribute name
                Token.is_revoked == False,
            )
        )
        .scalars()
        .first()
    )
    if not token:
        # Log token validation failure for debugging
        print(f"Token validation failed for token: {token_str}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> User:
    token = verify_token_access(token_str=token, db=db)
    user = token.user
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


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