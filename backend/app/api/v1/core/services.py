from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.api.v1.core.models import CulturalItem, Tag, Media
from app.api.v1.core.schemas import CulturalItemCreate, CulturalItemUpdate, MediaCreate


def get_cultural_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CulturalItem).offset(skip).limit(limit).all()


def get_cultural_item(db: Session, cultural_item_id: UUID):
    return db.query(CulturalItem).filter(CulturalItem.id == cultural_item_id).first()


def create_cultural_item(db: Session, item: CulturalItemCreate):
    db_item = CulturalItem(
        title=item.title,
        description=item.description,
        time_period=item.time_period,
        region=item.region,
        image_url=item.image_url,
        video_url=item.video_url,
        audio_url=item.audio_url,
        historical_significance=item.historical_significance,
    )
    
    # Handle tags
    if item.tags:
        for tag_name in item.tags:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.flush()
            db_item.tags.append(tag)
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_cultural_item(db: Session, cultural_item_id: UUID, item: CulturalItemUpdate):
    db_item = get_cultural_item(db, cultural_item_id)
    if not db_item:
        return None
    
    # Update fields if provided
    update_data = item.dict(exclude_unset=True)
    
    # Handle tags separately
    if "tags" in update_data:
        tags = update_data.pop("tags")
        db_item.tags = []  # Remove existing tags
        
        if tags:
            for tag_name in tags:
                tag = db.query(Tag).filter(Tag.name == tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.add(tag)
                    db.flush()
                db_item.tags.append(tag)
    
    # Update other fields
    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_cultural_item(db: Session, cultural_item_id: UUID):
    db_item = get_cultural_item(db, cultural_item_id)
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True


def create_media(db: Session, media: MediaCreate):
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


def get_all_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tag).offset(skip).limit(limit).all()


def search_cultural_items(db: Session, query: str, skip: int = 0, limit: int = 100):
    search = f"%{query}%"
    return db.query(CulturalItem).filter(
        CulturalItem.title.ilike(search) | CulturalItem.description.ilike(search)
    ).offset(skip).limit(limit).all()


def get_cultural_items_by_tag(db: Session, tag_name: str, skip: int = 0, limit: int = 100):
    return db.query(CulturalItem).join(CulturalItem.tags).filter(
        Tag.name == tag_name
    ).offset(skip).limit(limit).all()


def get_cultural_items_by_region(db: Session, region: str, skip: int = 0, limit: int = 100):
    return db.query(CulturalItem).filter(
        CulturalItem.region == region
    ).offset(skip).limit(limit).all()


def get_cultural_items_by_time_period(db: Session, time_period: str, skip: int = 0, limit: int = 100):
    return db.query(CulturalItem).filter(
        CulturalItem.time_period == time_period
    ).offset(skip).limit(limit).all()