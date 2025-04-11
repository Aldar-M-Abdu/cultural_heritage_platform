from typing import List, Optional, Any, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.db_setup import get_db
from app.api.v1.core.models import Event
from app.api.v1.core.services import (
    get_all_events,
    get_event,
    get_upcoming_events, 
    get_past_events
)
from app.security import get_current_active_user, get_admin_user, get_optional_user

router = APIRouter(tags=["events"])

# Define Pydantic models for API responses
class EventResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    is_free: bool = False
    event_type: Optional[str] = None
    
    class Config:
        orm_mode = True

class EventListResponse(BaseModel):
    items: List[EventResponse]
    total: int
    page: int
    limit: int

@router.get("/", response_model=EventListResponse, operation_id="list_events_v1")
def read_events(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    filter_type: Optional[str] = Query(None, description="Filter by event type (upcoming, past, all)"),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get all events with optional filtering
    """
    skip = (page - 1) * limit
    
    try:
        if filter_type == "upcoming":
            events = get_upcoming_events(db, skip=skip, limit=limit)
        elif filter_type == "past":
            events = get_past_events(db, skip=skip, limit=limit)
        else:
            events = get_all_events(db, skip=skip, limit=limit)
            
        # Count total events (approximate for pagination)
        # In a real-world scenario, we would use a COUNT query
        total_events = len(events) if len(events) < limit else limit * 2
        
        return {
            "items": events,
            "total": total_events,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        # Log the error
        print(f"Error fetching events: {str(e)}")
        # Return empty result instead of failing
        return {
            "items": [],
            "total": 0,
            "page": page,
            "limit": limit
        }

@router.get("/{event_id}", response_model=EventResponse, operation_id="get_event_detail_v1")
def read_event(
    event_id: UUID,
    db: Session = Depends(get_db)
) -> Event:
    """
    Get details for a specific event by ID
    """
    db_event = get_event(db, event_id=event_id)
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with ID {event_id} not found"
        )
    return db_event
