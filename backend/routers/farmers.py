import os
import shutil
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

import models, schemas, auth
from database import get_db
from config import UPLOAD_DIR

router = APIRouter()

FARMER_ID_UPLOAD_DIR = os.path.join(UPLOAD_DIR, "farmer_ids")
os.makedirs(FARMER_ID_UPLOAD_DIR, exist_ok=True)


# ── LIST PENDING ──────────────────────────────────────────────────────────────

@router.get("/pending", response_model=List[schemas.FarmerVerificationResponse])
def get_pending_farmers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    return (
        db.query(models.FarmerVerification)
        .filter(models.FarmerVerification.status == "pending")
        .order_by(models.FarmerVerification.submitted_at.desc())
        .all()
    )


@router.get("/", response_model=List[schemas.FarmerVerificationResponse])
def list_all_farmers(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    query = db.query(models.FarmerVerification)
    if status_filter:
        query = query.filter(models.FarmerVerification.status == status_filter)
    return query.order_by(models.FarmerVerification.submitted_at.desc()).all()


# ── APPROVE ───────────────────────────────────────────────────────────────────

@router.patch("/{farmer_id}/approve", response_model=schemas.FarmerVerificationResponse)
def approve_farmer(
    farmer_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    record = db.query(models.FarmerVerification).filter(models.FarmerVerification.id == farmer_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Farmer verification record not found")
    record.status = "approved"
    record.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(record)
    return record


# ── REJECT ────────────────────────────────────────────────────────────────────

@router.patch("/{farmer_id}/reject", response_model=schemas.FarmerVerificationResponse)
def reject_farmer(
    farmer_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    record = db.query(models.FarmerVerification).filter(models.FarmerVerification.id == farmer_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Farmer verification record not found")
    record.status = "rejected"
    record.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(record)
    return record


# ── CREATE (seed / demo submission) ──────────────────────────────────────────

@router.post("/", response_model=schemas.FarmerVerificationResponse, status_code=status.HTTP_201_CREATED)
async def submit_farmer_verification(
    farmer_name: str = Form(...),
    phone: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    farmer_id_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_path: Optional[str] = None
    if farmer_id_image and farmer_id_image.filename:
        ext = os.path.splitext(farmer_id_image.filename)[1]
        filename = f"farmer_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}{ext}"
        file_path = os.path.join(FARMER_ID_UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(farmer_id_image.file, f)
        image_path = f"uploads/farmer_ids/{filename}"

    record = models.FarmerVerification(
        farmer_name=farmer_name,
        phone=phone,
        email=email,
        location=location,
        farmer_id_image=image_path,
        status="pending",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
