from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, text
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from app.db_setup import get_db
from app.api.v1.core.models import BlogPost, User
from app.api.v1.core.schemas import BlogPostResponse, BlogPostCreate, BlogPostUpdate
from app.security import get_current_active_user, get_admin_user, get_optional_user

# Update router to include the prefix that matches the frontend request
router = APIRouter(
    prefix="/api/v1/blog-posts",
    tags=["blog"]
)

# Simplified categories endpoint
@router.get("/categories", response_model=List[Dict[str, Any]])
def get_blog_categories(db: Session = Depends(get_db)):
    """Get all blog categories with post counts"""
    try:
        # Use text() for SQL query to ensure compatibility
        query = text("""
            SELECT DISTINCT category_name as name, COUNT(id) as post_count 
            FROM blog_posts 
            GROUP BY category_name
        """)
        results = db.execute(query).all()
        
        # Process results into the expected format
        categories = [{"id": name, "name": name, "post_count": count} for name, count in results]
        
        # If no results found, return fallback categories
        if not categories:
            return [
                {"id": "news", "name": "News", "post_count": 0},
                {"id": "research", "name": "Research", "post_count": 0},
                {"id": "exhibitions", "name": "Exhibitions", "post_count": 0},
                {"id": "conservation", "name": "Conservation", "post_count": 0}
            ]
        
        return categories
    except Exception as e:
        # Log the error but return fallback categories
        print(f"Error fetching blog categories: {str(e)}")
        return [
            {"id": "news", "name": "News", "post_count": 0},
            {"id": "research", "name": "Research", "post_count": 0},
            {"id": "exhibitions", "name": "Exhibitions", "post_count": 0},
            {"id": "conservation", "name": "Conservation", "post_count": 0}
        ]

# Simplified blog posts endpoint with better error handling
@router.get("/", response_model=List[BlogPostResponse])
def get_blog_posts(
    db: Session = Depends(get_db),
    skip: int = Query(0, alias="skip"),
    limit: int = Query(10, alias="limit"),
    category_id: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """Get all blog posts with optional filtering"""
    try:
        # Build query with proper joins
        query = select(BlogPost).join(User, BlogPost.author_id == User.id)
        
        # Apply filtering
        if category_id and category_id != 'all':
            query = query.filter(BlogPost.category_name == category_id)
        
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
        
        # Add eager loading of author
        query = query.options(joinedload(BlogPost.author))
        
        # Execute query
        posts = db.execute(query).scalars().all()
        
        # Transform the result to match expected format
        result = []
        for post in posts:
            post_dict = {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "category_name": post.category_name,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "author_id": post.author_id,
                "author": {
                    "id": post.author_id,
                    "username": post.author.username,
                    "full_name": post.author.full_name
                },
                "category": {
                    "id": post.category_name,
                    "name": post.category_name
                }
            }
            result.append(post_dict)
        
        return result
    except Exception as e:
        print(f"Error fetching blog posts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve blog posts: {str(e)}"
        )

# Get a specific post by ID
@router.get("/{post_id}", response_model=BlogPostResponse)
def get_blog_post(
    post_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific blog post by ID"""
    try:
        # Use single query with join to load author data
        query = select(BlogPost).where(BlogPost.id == post_id).options(joinedload(BlogPost.author))
        post = db.execute(query).unique().scalar_one_or_none()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Blog post with ID {post_id} not found"
            )
        
        # Transform to expected format
        result = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "category_name": post.category_name,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author_id": post.author_id,
            "author": {
                "id": post.author_id,
                "username": post.author.username,
                "full_name": post.author.full_name
            },
            "category": {
                "id": post.category_name,
                "name": post.category_name
            }
        }
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching blog post {post_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Update the post creation endpoint to match potential frontend requests
@router.post("/", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_blog_post_direct(
    blog_post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new blog post (admin only) - direct endpoint"""
    return create_blog_post(blog_post, db, current_user)

@router.post("/posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_blog_post(
    blog_post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new blog post (admin only)"""
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
