from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.db_setup import get_db
from app.api.v1.core.models import Notification, User
from app.api.v1.core.schemas import NotificationResponse, NotificationUpdate
from app.security import get_current_active_user

router = APIRouter(tags=["notifications"])

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
) -> List[NotificationResponse]:
    """Get notifications for the current user"""
    query = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.where(Notification.is_read == False)
    
    query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
    
    notifications = db.execute(query).scalars().all()
    return notifications

@router.get("/unread-count", response_model=dict)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Get count of unread notifications for the current user."""
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    return {"unread_count": count}

@router.put("/{notification_id}", response_model=NotificationResponse)
def update_notification(
    notification_id: UUID,
    notification_update: NotificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> NotificationResponse:
    """Mark a notification as read/unread"""
    notification = db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    ).scalars().first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with ID {notification_id} not found"
        )
    
    # Update the notification
    notification.is_read = notification_update.is_read
    db.commit()
    db.refresh(notification)
    
    return notification

@router.put("/mark-all-read", response_model=dict)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Mark all notifications as read for the current user"""
    result = db.execute(
        update(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
        .values(is_read=True)
    )
    
    db.commit()
    
    return {"message": "All notifications marked as read", "count": result.rowcount}

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Response:
    """Delete a notification"""
    notification = db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    ).scalars().first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with ID {notification_id} not found"
        )
    
    db.delete(notification)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)
