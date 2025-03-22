 import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Table, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db_setup import Base

# Association table for tags and cultural items
cultural_item_tag = Table(
    'cultural_item_tag',
    Base.metadata,
    Column('cultural_item_id', UUID(as_uuid=True), ForeignKey('cultural_items.id')),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'))
)

class CulturalItem(Base):
    __tablename__ = "cultural_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    time_period = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    
    # Media
    image_url = Column(String(255), nullable=True)
    video_url = Column(String(255), nullable=True)
    audio_url = Column(String(255), nullable=True)
    
    # Historical significance
    historical_significance = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tags = relationship("Tag", secondary=cultural_item_tag, back_populates="cultural_items")
    media = relationship("Media", back_populates="cultural_item")


class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False, unique=True, index=True)
    
    # Relationships
    cultural_items = relationship("CulturalItem", secondary=cultural_item_tag, back_populates="tags")


class Media(Base):
    __tablename__ = "media"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String(255), nullable=False)
    media_type = Column(String(50), nullable=False)  # image, video, audio, document
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign keys
    cultural_item_id = Column(UUID(as_uuid=True), ForeignKey('cultural_items.id'))
    
    # Relationships
    cultural_item = relationship("CulturalItem", back_populates="media")


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Integer, default=1)
    is_admin = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())