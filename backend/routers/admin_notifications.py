"""Admin Notifications router — in-app notification bell management."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import auth, models, schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.AdminNotificationResponse])
def list_notifications(
    unread_only: bool = False,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    query = db.query(models.AdminNotification)
    if unread_only:
        query = query.filter(models.AdminNotification.is_read == False)
    return query.order_by(models.AdminNotification.created_at.desc()).limit(limit).all()


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    count = db.query(models.AdminNotification).filter(
        models.AdminNotification.is_read == False
    ).count()
    return {"count": count}


@router.patch("/{notif_id}/read")
def mark_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    notif = db.query(models.AdminNotification).filter(models.AdminNotification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"ok": True}


@router.patch("/mark-all-read")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    db.query(models.AdminNotification).filter(
        models.AdminNotification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"ok": True}


@router.post("/", response_model=schemas.AdminNotificationResponse)
def create_notification(
    title: str,
    message: str = "",
    category: str = "general",
    link: str = "",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    """Create a new admin notification (used internally by other routers)."""
    notif = models.AdminNotification(
        title=title,
        message=message or None,
        category=category,
        link=link or None,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
