import uuid
from datetime import datetime
from typing import List, Optional
from enum import Enum
from sqlalchemy import Table, Column, ForeignKey, func, String, Text, Boolean, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    """Base class for all models"""
    pass

# Association table for tags and cultural items
cultural_item_tag = Table(
    'cultural_item_tag',
    Base.metadata,
    Column('cultural_item_id', UUID(as_uuid=True), ForeignKey('cultural_items.id')),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'))
)

# Association table for events and cultural items
event_cultural_item = Table(
    'event_cultural_item',
    Base.metadata,
    Column('event_id', UUID(as_uuid=True), ForeignKey('events.id')),
    Column('cultural_item_id', UUID(as_uuid=True), ForeignKey('cultural_items.id'))
)

class CulturalItem(Base):
    __tablename__ = "cultural_items"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    time_period: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Media
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    video_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    audio_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Historical significance
    historical_significance: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Feature flag
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # View tracking
    view_count: Mapped[int] = mapped_column(default=0)
    
    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tags: Mapped[List["Tag"]] = relationship(secondary=cultural_item_tag, back_populates="cultural_items")
    media: Mapped[List["Media"]] = relationship(back_populates="cultural_item")
    comments: Mapped[List["Comment"]] = relationship(back_populates="cultural_item")
    events: Mapped[List["Event"]] = relationship(secondary=event_cultural_item, back_populates="cultural_items")
    favorites: Mapped[List["UserFavorite"]] = relationship(back_populates="cultural_item")


class Tag(Base):
    __tablename__ = "tags"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    
    # Relationships
    cultural_items: Mapped[List["CulturalItem"]] = relationship(secondary=cultural_item_tag, back_populates="tags")


class Media(Base):
    __tablename__ = "media"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    media_type: Mapped[str] = mapped_column(String(50), nullable=False)  # image, video, audio, document
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Foreign keys
    cultural_item_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('cultural_items.id'))
    
    # Relationships
    cultural_item: Mapped["CulturalItem"] = relationship(back_populates="media")


class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Profile fields
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Added profile image field
    
    # Relationships
    tokens: Mapped[List["Token"]] = relationship()
    favorites: Mapped[List["UserFavorite"]] = relationship(back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")


class Token(Base):
    __tablename__ = "tokens"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    token: Mapped[str] = mapped_column(String, unique=True, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Comment(Base):
    __tablename__ = "comments"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    cultural_item_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=True)
    parent_comment_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey('comments.id'), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User")
    cultural_item: Mapped[Optional["CulturalItem"]] = relationship(back_populates="comments")
    replies: Mapped[List["Comment"]] = relationship("Comment", backref="parent_comment", remote_side=[id])


class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category_name: Mapped[str] = mapped_column(String(100), nullable=False)
    author_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author: Mapped["User"] = relationship("User")
    # Category is stored directly as category_name string

class Category(Base):
    __tablename__ = "categories"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)    
    
    # Remove the problematic relationship - BlogPost now uses category_name directly
    # blog_posts: Mapped[List["BlogPost"]] = relationship(back_populates="category")


class Contribution(Base):
    __tablename__ = "contributions"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    cultural_item_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=False)
    contribution_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "edit", "add", "delete"
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User")
    cultural_item: Mapped["CulturalItem"] = relationship("CulturalItem")


class Event(Base):
    __tablename__ = "events"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_free: Mapped[bool] = mapped_column(Boolean, default=False)
    event_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Relationships
    cultural_items: Mapped[List["CulturalItem"]] = relationship(secondary=event_cultural_item, back_populates="events")


class UserFavorite(Base):
    __tablename__ = "user_favorites"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    cultural_item_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="favorites")
    cultural_item: Mapped["CulturalItem"] = relationship(back_populates="favorites")
    
    # Unique constraint to prevent duplicates
    __table_args__ = (
        UniqueConstraint('user_id', 'cultural_item_id', name='unique_user_favorite'),
    )


class Notification(Base):
    __tablename__ = "notifications"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    notification_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "comment", "favorite", "system"
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Optional references to related content
    cultural_item_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey('cultural_items.id'), nullable=True)
    comment_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey('comments.id'), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="notifications")
    cultural_item: Mapped[Optional["CulturalItem"]] = relationship("CulturalItem")
    comment: Mapped[Optional["Comment"]] = relationship("Comment")