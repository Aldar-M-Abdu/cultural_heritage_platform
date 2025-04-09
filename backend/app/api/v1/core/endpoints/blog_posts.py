from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from app.db_setup import get_db
from app.api.v1.core.models import BlogPost, User
from app.api.v1.core.schemas import BlogPostResponse, BlogPostCreate, BlogPostUpdate
from app.security import get_current_active_user, get_admin_user, get_optional_user

# Change router to use blog prefix instead of posts
router = APIRouter(tags=["blog"])

# This endpoint will be accessible at /api/v1/blog/categories
@router.get("/categories", response_model=List[dict])
def get_blog_categories(db: Session = Depends(get_db)):
    """Get all blog categories with post counts"""
    results = db.execute(
        select(
            BlogPost.category_name.distinct().label("name"),
            func.count(BlogPost.id).label("post_count")
        )
        .group_by(BlogPost.category_name)
    ).all()
    
    return [{"id": name, "name": name, "post_count": count} for name, count in results]

# This endpoint will be accessible at /api/v1/blog/posts
@router.get("/posts", response_model=List[BlogPostResponse])
def get_blog_posts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """Get all blog posts with optional filtering"""
    query = select(BlogPost).options(
        joinedload(BlogPost.author)
    )
    
    # Apply filters using category_name instead of category_id
    if category and category != 'all':
        query = query.where(BlogPost.category_name == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.where(
            (BlogPost.title.ilike(search_term)) | (BlogPost.content.ilike(search_term))
        )
    
    # Apply sorting
    if sort_by == "title":
        sort_col = BlogPost.title
    elif sort_by == "updated_at":
        sort_col = BlogPost.updated_at
    else:
        sort_col = BlogPost.created_at
        
    if sort_order.lower() == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    posts = db.execute(query).scalars().all()
    return posts

# This endpoint will be accessible at /api/v1/blog/posts/{post_id}
@router.get("/posts/{post_id}", response_model=BlogPostResponse)
def get_blog_post(
    post_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific blog post by ID"""
    post = db.execute(
        select(BlogPost)
        .where(BlogPost.id == post_id)
        .options(
            joinedload(BlogPost.author)
        )
    ).scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog post with ID {post_id} not found"
        )
    
    return post

@router.post("/posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_blog_post(
    blog_post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new blog post (admin only)"""
    # Create post directly with category_name (no need to check category_id)
    new_post = BlogPost(
        title=blog_post.title,
        content=blog_post.content,
        category_name=blog_post.category_name,  # Changed from category_id
        author_id=current_user.id
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return new_post

@router.put("/posts/{post_id}", response_model=BlogPostResponse)
def update_blog_post(
    post_id: UUID,
    post_update: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update an existing blog post (admin only)"""
    post = db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    ).scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog post with ID {post_id} not found"
        )
    
    # Update fields
    update_data = post_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(post, key, value)
    
    post.updated_at = datetime.utcnow()  # Update the timestamp
    
    db.commit()
    db.refresh(post)
    
    return post

@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog_post(
    post_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Delete a blog post (admin only)"""
    post = db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    ).scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog post with ID {post_id} not found"
        )
    
    db.delete(post)
    db.commit()
    
    return None
