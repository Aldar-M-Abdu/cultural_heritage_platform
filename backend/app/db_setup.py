from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging
from contextlib import contextmanager

from app.api.v1.core.models import Base

# Get DB URL from environment variable
DATABASE_URL = os.getenv("DB_URL", "postgresql+psycopg2://postgres:postgres123@localhost:5432/cultural_heritage_db")

# Create SQLAlchemy engine with better connection pooling and timeout settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Detect disconnections
    pool_recycle=3600,   # Recycle connections after an hour
    connect_args={"connect_timeout": 5}  # Connection timeout in seconds
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def is_db_connected():
    """Check if the database is connected and available"""
    try:
        # Try to connect and execute a simple query with a timeout
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logging.error(f"Database connection check failed: {str(e)}")
        return False

def init_db():
    """Initialize the database with tables"""
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables created successfully")
    except Exception as e:
        logging.error(f"Database initialization failed: {str(e)}")
        raise

def get_db():
    """Get database session with improved error handling"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logging.error(f"Database session error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

@contextmanager
def get_db_context():
    """Context manager version of get_db for use outside of FastAPI dependency injection"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logging.error(f"Database session error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()
