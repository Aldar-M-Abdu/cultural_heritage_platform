from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging
from contextlib import contextmanager
from dotenv import load_dotenv  # Add this import

# Configure logging to avoid duplicate messages
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)

# Set SQLAlchemy logging level to WARNING to reduce verbosity
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

# Load environment variables from .env file
load_dotenv()  # Add this line

# Create Base class for models
Base = declarative_base()

# Get DB URL from environment variable
DATABASE_URL = os.getenv("DB_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")  # Add validation

# Get debug flag from environment to control SQLAlchemy logging
DEBUG_MODE = os.getenv("DEBUG_MODE", "False").lower() in ("true", "1", "t")

# Create SQLAlchemy engine with better connection pooling and timeout settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,            # Detect disconnections
    pool_recycle=3600,             # Recycle connections after an hour
    pool_size=20,                  # Increase connection pool size
    max_overflow=30,               # Allow more connections when needed
    echo=DEBUG_MODE,               # Only log SQL queries in debug mode
    connect_args={"connect_timeout": 30}  # Increased timeout to 30 seconds
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def is_db_connected():
    """Check if the database is connected and available"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            row = result.fetchone()
            logging.debug(f"Database connection test result: {row}")
            return True
    except Exception as e:
        logging.error(f"Database connection check failed: {str(e)}")
        return False

def init_db():
    """Initialize the database with tables"""
    try:
        # Import here to avoid circular imports
        from app.api.v1.core.models import Base as ModelsBase
        ModelsBase.metadata.create_all(bind=engine)
        logging.info("Database tables created successfully")
    except Exception as e:
        logging.error(f"Database initialization failed: {str(e)}")
        raise

def get_db():
    """Get database session with improved error handling and retry logic"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        db = SessionLocal()
        try:
            # Test the connection
            if not is_db_connected():
                retry_count += 1
                logging.warning(f"Database connection failed, attempt {retry_count} of {max_retries}")
                db.close()
                if retry_count == max_retries:
                    raise Exception("Failed to connect to database after maximum retries")
                continue
            
            yield db
            break
        except Exception as e:
            logging.error(f"Database session error: {str(e)}")
            db.rollback()
            raise
        finally:
            db.close()

@contextmanager
def get_db_context():
    """Context manager version of get_db for use outside of FastAPI dependency injection"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        db = SessionLocal()
        try:
            # Test the connection
            if not is_db_connected():
                retry_count += 1
                logging.warning(f"Database connection failed, attempt {retry_count} of {max_retries}")
                db.close()
                if retry_count == max_retries:
                    raise Exception("Failed to connect to database after maximum retries")
                continue
            
            yield db
            break
        except Exception as e:
            logging.error(f"Database session error: {str(e)}")
            db.rollback()
            raise
        finally:
            db.close()
