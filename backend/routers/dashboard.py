from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import auth, models

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    # Mock data for dashboard
    return {
        "total_users": 1500,
        "active_products": 340,
        "total_sales": 50000,
        "pending_orders": 24,
        "revenue_growth": 12.5
    }

@router.get("/revenue-chart")
def get_revenue_chart(current_user: models.User = Depends(auth.get_current_admin)):
    return [
        {"name": "Jan", "revenue": 4000},
        {"name": "Feb", "revenue": 3000},
        {"name": "Mar", "revenue": 5000},
        {"name": "Apr", "revenue": 4500},
        {"name": "May", "revenue": 6000},
    ]
