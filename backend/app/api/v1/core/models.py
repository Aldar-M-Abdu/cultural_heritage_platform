import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Table, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  # Define Base here

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
    comments = relationship("Comment", back_populates="cultural_item")
    events = relationship("Event", secondary="event_cultural_item", back_populates="cultural_items")


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
    is_active = Column(Boolean, default=True)  # Updated to Boolean
    is_admin = Column(Boolean, default=False)  # Updated to Boolean
    created_at = Column(DateTime, default=datetime.utcnow)


class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))  # Ensure UUID type consistency
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    cultural_item_id = Column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=True)
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey('comments.id'), nullable=True)
    
    # Relationships
    user = relationship("User")
    cultural_item = relationship("CulturalItem", back_populates="comments")
    replies = relationship("Comment", backref="parent_comment", remote_side=[id])


class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("Category", back_populates="blog_posts")
    author = relationship("User")
    

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    
    # Relationships
    blog_posts = relationship("BlogPost", back_populates="category")


class Contribution(Base):
    __tablename__ = "contributions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    cultural_item_id = Column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=False)
    contribution_type = Column(String(50), nullable=False)  # e.g., "edit", "add", "delete"
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    cultural_item = relationship("CulturalItem")


class Event(Base):
    __tablename__ = "events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    cultural_items = relationship("CulturalItem", secondary="event_cultural_item", back_populates="events")


# Association table for events and cultural items
event_cultural_item = Table(
    'event_cultural_item',
    Base.metadata,
    Column('event_id', UUID(as_uuid=True), ForeignKey('events.id')),
    Column('cultural_item_id', UUID(as_uuid=True), ForeignKey('cultural_items.id'))
)

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)