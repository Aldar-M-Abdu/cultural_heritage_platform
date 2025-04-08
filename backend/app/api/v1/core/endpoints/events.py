from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

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

@router.get("/", response_model=List[Event], operation_id="list_events_v1")
def read_events(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Number of items per page"),
    filter_type: Optional[str] = Query(None, description="Filter by event type (upcoming, past, all)"),
    db: Session = Depends(get_db)
) -> List[Event]:
    """
    Get all events with optional filtering
    """
    skip = (page - 1) * limit
    
    if filter_type == "upcoming":
        return get_upcoming_events(db, skip=skip, limit=limit)
    elif filter_type == "past":
        return get_past_events(db, skip=skip, limit=limit)
    else:
        return get_all_events(db, skip=skip, limit=limit)

@router.get("/{event_id}", response_model=Event, operation_id="get_event_detail_v1")
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
