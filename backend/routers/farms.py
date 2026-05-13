from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from database import get_db
import auth, models, schemas

router = APIRouter()


@router.get("/", response_model=dict)
def list_farms(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    state: Optional[str] = None,
    is_verified: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    query = db.query(models.Farm)
    if search:
        query = query.filter(
            models.Farm.farm_name.ilike(f"%{search}%") |
            models.Farm.owner_name.ilike(f"%{search}%") |
            models.Farm.location.ilike(f"%{search}%")
        )
    if state:
        query = query.filter(models.Farm.state == state)
    if is_verified is not None:
        query = query.filter(models.Farm.is_verified == is_verified)

    total = query.count()
    farms = query.order_by(models.Farm.registered_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "pages": (total + page_size - 1) // page_size,
        "data": [schemas.FarmResponse.model_validate(f).model_dump() for f in farms],
    }


@router.post("/", response_model=schemas.FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(
    farm: schemas.FarmCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    new_farm = models.Farm(**farm.model_dump())
    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)
    return new_farm


@router.patch("/{farm_id}/verify", response_model=schemas.FarmResponse)
def verify_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    farm = db.query(models.Farm).filter(models.Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    farm.is_verified = True
    db.commit()
    db.refresh(farm)
    return farm


@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    farm = db.query(models.Farm).filter(models.Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    db.delete(farm)
    db.commit()


@router.get("/stats")
def farm_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    total = db.query(func.count(models.Farm.id)).scalar() or 0
    verified = db.query(func.count(models.Farm.id)).filter(models.Farm.is_verified == True).scalar() or 0
    by_state = db.query(models.Farm.state, func.count(models.Farm.id)).group_by(models.Farm.state).all()
    by_crop = db.query(models.Farm.primary_crop, func.count(models.Farm.id)).filter(
        models.Farm.primary_crop != None
    ).group_by(models.Farm.primary_crop).order_by(func.count(models.Farm.id).desc()).limit(5).all()

    return {
        "total": total,
        "verified": verified,
        "by_state": [{"state": s or "Unknown", "count": c} for s, c in by_state],
        "top_crops": [{"crop": cr or "Unknown", "count": c} for cr, c in by_crop],
    }
