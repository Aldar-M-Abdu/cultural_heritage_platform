from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.api.v1.core.models import (
    CulturalItem,
    Tag,
    Media,
    cultural_item_tag,
    Category,
    Event,
)
from app.api.v1.core.schemas import (
    CulturalItemCreate,
    CulturalItemUpdate,
    MediaCreate,
)

def get_cultural_items(db: Session, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    """Get cultural items with improved querying and debugging"""
    try:
        # First check if there are any items in the database
        count = db.query(func.count(CulturalItem.id)).scalar()
        print(f"Total cultural items in database: {count}")
        
        # If no items found, log this for debugging
        if count == 0:
            print("WARNING: No cultural items found in database!")
            return []
        
        # Apply pagination with a larger limit if needed
        if count < 100:
            # If fewer than 100 items, return all of them
            result = db.query(CulturalItem).all()
        else:
            # Otherwise paginate normally
            result = db.query(CulturalItem).offset(skip).limit(limit).all()
        
        print(f"Retrieved {len(result)} cultural items")
        return result
    except Exception as e:
        print(f"Error retrieving cultural items: {str(e)}")
        # Return empty list on error rather than raising exception
        # This prevents the API from crashing but logs the error
        return []

def search_cultural_items(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    search = f"%{query}%"
    return db.query(CulturalItem).filter(
        or_(
            CulturalItem.title.ilike(search),
            CulturalItem.description.ilike(search),
            CulturalItem.region.ilike(search),
            CulturalItem.time_period.ilike(search),
            CulturalItem.historical_significance.ilike(search)
        )
    ).offset(skip).limit(limit).all()

def get_all_tags(db: Session, skip: int = 0, limit: int = 100) -> List[Tag]:
    return db.query(Tag).offset(skip).limit(limit).all()

def get_cultural_items_by_tag(db: Session, tag_name: str, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if not tag:
        return []
    return tag.cultural_items[skip:skip + limit]

def get_cultural_items_by_region(db: Session, region: str, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    return db.query(CulturalItem).filter(CulturalItem.region.ilike(f"%{region}%")).offset(skip).limit(limit).all()

def get_cultural_items_by_time_period(db: Session, time_period: str, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    return db.query(CulturalItem).filter(CulturalItem.time_period.ilike(f"%{time_period}%")).offset(skip).limit(limit).all()

def get_featured_cultural_items(db: Session, skip: int = 0, limit: int = 10) -> List[CulturalItem]:
    """Get cultural items that are marked as featured."""
    return db.query(CulturalItem).filter(CulturalItem.is_featured == True).offset(skip).limit(limit).all()

def get_cultural_item(db: Session, cultural_item_id: UUID) -> Optional[CulturalItem]:
    return db.query(CulturalItem).filter(CulturalItem.id == cultural_item_id).first()

def create_cultural_item(db: Session, item: CulturalItemCreate) -> CulturalItem:
    # Extract tag IDs to associate with the cultural item
    tag_ids = item.tag_ids if hasattr(item, 'tag_ids') else []
    
    # Create the cultural item
    db_item = CulturalItem(
        title=item.title,
        description=item.description,
        time_period=item.time_period,
        region=item.region,
        image_url=item.image_url,
        video_url=item.video_url,
        audio_url=item.audio_url,
        historical_significance=item.historical_significance,
        is_featured=item.is_featured if hasattr(item, 'is_featured') else False
    )
    
    # Add tags
    if tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        db_item.tags = tags
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_media(db: Session, media: MediaCreate) -> Media:
    db_media = Media(
        url=media.url,
        media_type=media.media_type,
        title=media.title,
        description=media.description,
        cultural_item_id=media.cultural_item_id
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

def update_cultural_item(db: Session, cultural_item_id: UUID, item: CulturalItemUpdate, current_user=None) -> Optional[CulturalItem]:
    db_item = get_cultural_item(db, cultural_item_id)
    if not db_item:
        return None
    
    # Update fields
    for key, value in item.dict(exclude_unset=True).items():
        if key == 'tag_ids':
            # Handle tags separately
            if value:
                tags = db.query(Tag).filter(Tag.id.in_(value)).all()
                db_item.tags = tags
        else:
            setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_cultural_item(db: Session, cultural_item_id: UUID) -> bool:
    db_item = get_cultural_item(db, cultural_item_id=cultural_item_id)
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True

def get_data_source_statistics(db: Session) -> dict:
    """Get statistics about data sources in the database"""
    total_items = db.query(func.count(CulturalItem.id)).scalar()
    
    # Count items that likely came from Getty (based on URL pattern)
    getty_items = db.query(func.count(CulturalItem.id)).filter(
        CulturalItem.image_url.like('%getty.edu%')
    ).scalar()
    
    # Count mock/other items
    other_items = total_items - getty_items
    
    return {
        "total_items": total_items,
        "getty_items": getty_items,
        "other_items": other_items
    }

def get_cultural_items_by_source(db: Session, source: str, skip: int = 0, limit: int = 100) -> List[CulturalItem]:
    """Get cultural items filtered by their data source"""
    if source.lower() == 'getty':
        return db.query(CulturalItem).filter(
            CulturalItem.image_url.like('%getty.edu%')
        ).offset(skip).limit(limit).all()
    elif source.lower() == 'mock':
        return db.query(CulturalItem).filter(
            ~CulturalItem.image_url.like('%getty.edu%')
        ).offset(skip).limit(limit).all()
    else:
        return get_cultural_items(db, skip, limit)

def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    """Get all blog post categories"""
    return db.query(Category).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: UUID) -> Optional[Category]:
    """Get a specific category by ID"""
    return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    """Get a specific category by name"""
    return db.query(Category).filter(Category.name == name).first()

def create_category(db: Session, name: str) -> Category:
    """Create a new blog post category"""
    db_category = Category(name=name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_all_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    """Get all events"""
    return db.query(Event).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: UUID) -> Optional[Event]:
    """Get a specific event by ID"""
    return db.query(Event).filter(Event.id == event_id).first()

def get_upcoming_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    """Get upcoming events (where start_date is in the future)"""
    from datetime import datetime
    now = datetime.utcnow()
    return db.query(Event).filter(Event.start_date > now).order_by(Event.start_date).offset(skip).limit(limit).all()

def get_past_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    """Get past events (where start_date is in the past)"""
    from datetime import datetime
    now = datetime.utcnow()
    return db.query(Event).filter(Event.start_date <= now).order_by(Event.start_date.desc()).offset(skip).limit(limit).all()
