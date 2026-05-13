from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta, date
from typing import List
from database import get_db
import auth, models

router = APIRouter()


def _month_label(dt: date) -> str:
    return dt.strftime("%b")


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    """Return real aggregated stats from the database."""
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    # Users
    total_users = db.query(func.count(models.User.id)).filter(models.User.role == "user").scalar() or 0
    active_users = db.query(func.count(models.User.id)).filter(
        models.User.role == "user", models.User.is_active == True
    ).scalar() or 0
    new_users_this_week = db.query(func.count(models.User.id)).filter(
        models.User.created_at >= week_ago
    ).scalar() or 0

    # Farmer Verifications
    verified_farmers = db.query(func.count(models.FarmerVerification.id)).filter(
        models.FarmerVerification.status == "approved"
    ).scalar() or 0
    pending_verifications = db.query(func.count(models.FarmerVerification.id)).filter(
        models.FarmerVerification.status == "pending"
    ).scalar() or 0

    # Farms
    total_farms = db.query(func.count(models.Farm.id)).scalar() or 0

    # Crops
    total_crops = db.query(func.count(models.Crop.id)).scalar() or 0

    # Schemes
    today = date.today()
    running_schemes = db.query(func.count(models.Scheme.id)).filter(
        models.Scheme.status == "running"
    ).scalar() or 0
    upcoming_schemes = db.query(func.count(models.Scheme.id)).filter(
        models.Scheme.status == "upcoming"
    ).scalar() or 0

    # Schemes expiring soon (within 7 days)
    expiring_soon = db.query(func.count(models.Scheme.id)).filter(
        models.Scheme.status == "running",
        models.Scheme.end_date != None,
        models.Scheme.end_date <= (today + timedelta(days=7))
    ).scalar() or 0

    return {
        "total_users": total_users,
        "active_users": active_users,
        "new_users_this_week": new_users_this_week,
        "verified_farmers": verified_farmers,
        "pending_verifications": pending_verifications,
        "total_farms": total_farms,
        "total_crops": total_crops,
        "running_schemes": running_schemes,
        "upcoming_schemes": upcoming_schemes,
        "expiring_soon": expiring_soon,
    }


@router.get("/user-growth")
def get_user_growth(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    """Monthly user registration counts for the last N months."""
    now = datetime.utcnow()
    result = []
    for i in range(5, -1, -1):
        month_start = (now.replace(day=1) - timedelta(days=30 * i))
        month_end = (now.replace(day=1) - timedelta(days=30 * (i - 1))) if i > 0 else now
        count = db.query(func.count(models.User.id)).filter(
            models.User.created_at >= month_start,
            models.User.created_at < month_end
        ).scalar() or 0
        result.append({"month": _month_label(month_start.date()), "users": count})
    return result


@router.get("/scheme-activity")
def get_scheme_activity(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    """Breakdown of schemes by status."""
    statuses = ["upcoming", "running", "ended"]
    result = []
    for s in statuses:
        count = db.query(func.count(models.Scheme.id)).filter(models.Scheme.status == s).scalar() or 0
        result.append({"status": s.capitalize(), "count": count})
    return result


@router.get("/verification-stats")
def get_verification_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    """Farmer verification breakdown."""
    statuses = ["pending", "approved", "rejected"]
    result = {}
    for s in statuses:
        count = db.query(func.count(models.FarmerVerification.id)).filter(
            models.FarmerVerification.status == s
        ).scalar() or 0
        result[s] = count
    return result


@router.get("/recent-activity")
def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    """Recent platform activity (new users + farmer verifications + schemes)."""
    events = []

    # Recent users
    recent_users = db.query(models.User).filter(models.User.role == "user").order_by(
        models.User.created_at.desc()
    ).limit(5).all()
    for u in recent_users:
        events.append({
            "type": "user_registered",
            "title": f"New farmer registered: {u.name}",
            "time": u.created_at.isoformat(),
            "category": "user",
        })

    # Recent farmer verifications
    recent_verif = db.query(models.FarmerVerification).order_by(
        models.FarmerVerification.submitted_at.desc()
    ).limit(5).all()
    for v in recent_verif:
        label = "submitted" if v.status == "pending" else v.status
        events.append({
            "type": f"farmer_{label}",
            "title": f"Farmer verification {label}: {v.farmer_name}",
            "time": (v.reviewed_at or v.submitted_at).isoformat(),
            "category": "verification",
        })

    # Recent schemes
    recent_schemes = db.query(models.Scheme).order_by(
        models.Scheme.created_at.desc()
    ).limit(3).all()
    for s in recent_schemes:
        events.append({
            "type": "scheme_created",
            "title": f"Scheme added: {s.name}",
            "time": s.created_at.isoformat(),
            "category": "scheme",
        })

    # Sort by time desc
    events.sort(key=lambda x: x["time"], reverse=True)
    return events[:limit]
