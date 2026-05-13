import os
import shutil
from datetime import date, datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

import models, schemas, auth
from database import get_db
from config import UPLOAD_DIR

router = APIRouter()

SCHEME_UPLOAD_DIR = os.path.join(UPLOAD_DIR, "schemes")
os.makedirs(SCHEME_UPLOAD_DIR, exist_ok=True)


def _auto_update_status(scheme: models.Scheme) -> None:
    """Auto-correct status based on current date."""
    today = date.today()
    if scheme.status == "ended":
        return  # respect manually ended schemes
    if scheme.end_date and today > scheme.end_date:
        scheme.status = "ended"
    elif scheme.start_date and today >= scheme.start_date:
        scheme.status = "running"
    else:
        scheme.status = "upcoming"


# ── CREATE ───────────────────────────────────────────────────────────────────

@router.post("/", response_model=schemas.SchemeResponse, status_code=status.HTTP_201_CREATED)
async def create_scheme(
    name: str = Form(...),
    short_description: str = Form(...),
    full_description: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    last_date_to_apply: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    min_age: Optional[int] = Form(None),
    max_age: Optional[int] = Form(None),
    gender: Optional[str] = Form("all"),
    caste: Optional[str] = Form("all"),
    state: Optional[str] = Form("All India"),
    apply_link: Optional[str] = Form(None),
    scheme_status: Optional[str] = Form("upcoming"),
    banner: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    banner_path: Optional[str] = None
    if banner and banner.filename:
        ext = os.path.splitext(banner.filename)[1]
        filename = f"scheme_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}{ext}"
        file_path = os.path.join(SCHEME_UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(banner.file, f)
        banner_path = f"uploads/schemes/{filename}"

    def parse_date(d: Optional[str]) -> Optional[date]:
        if d:
            try:
                return date.fromisoformat(d)
            except ValueError:
                return None
        return None

    scheme = models.Scheme(
        name=name,
        short_description=short_description,
        full_description=full_description,
        banner_image=banner_path,
        start_date=parse_date(start_date),
        last_date_to_apply=parse_date(last_date_to_apply),
        end_date=parse_date(end_date),
        min_age=min_age,
        max_age=max_age,
        gender=gender,
        caste=caste,
        state=state,
        apply_link=apply_link,
        status=scheme_status or "upcoming",
    )
    _auto_update_status(scheme)
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme


# ── LIST ─────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[schemas.SchemeResponse])
def list_schemes(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    query = db.query(models.Scheme)
    schemes = query.all()

    # Auto-update statuses based on current date
    for s in schemes:
        old = s.status
        _auto_update_status(s)
        if old != s.status:
            db.add(s)
    db.commit()

    # Re-query after auto-update
    query = db.query(models.Scheme)
    if status_filter:
        query = query.filter(models.Scheme.status == status_filter)
    if search:
        query = query.filter(models.Scheme.name.ilike(f"%{search}%"))
    return query.order_by(models.Scheme.created_at.desc()).all()


# ── GET ONE ───────────────────────────────────────────────────────────────────

@router.get("/{scheme_id}", response_model=schemas.SchemeResponse)
def get_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


# ── UPDATE ────────────────────────────────────────────────────────────────────

@router.put("/{scheme_id}", response_model=schemas.SchemeResponse)
async def update_scheme(
    scheme_id: int,
    name: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    full_description: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    last_date_to_apply: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    min_age: Optional[int] = Form(None),
    max_age: Optional[int] = Form(None),
    gender: Optional[str] = Form(None),
    caste: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    apply_link: Optional[str] = Form(None),
    scheme_status: Optional[str] = Form(None),
    banner: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    def parse_date(d: Optional[str]) -> Optional[date]:
        if d:
            try:
                return date.fromisoformat(d)
            except ValueError:
                return None
        return None

    if name is not None: scheme.name = name
    if short_description is not None: scheme.short_description = short_description
    if full_description is not None: scheme.full_description = full_description
    if start_date is not None: scheme.start_date = parse_date(start_date)
    if last_date_to_apply is not None: scheme.last_date_to_apply = parse_date(last_date_to_apply)
    if end_date is not None: scheme.end_date = parse_date(end_date)
    if min_age is not None: scheme.min_age = min_age
    if max_age is not None: scheme.max_age = max_age
    if gender is not None: scheme.gender = gender
    if caste is not None: scheme.caste = caste
    if state is not None: scheme.state = state
    if apply_link is not None: scheme.apply_link = apply_link
    if scheme_status is not None: scheme.status = scheme_status

    if banner and banner.filename:
        ext = os.path.splitext(banner.filename)[1]
        filename = f"scheme_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}{ext}"
        file_path = os.path.join(SCHEME_UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(banner.file, f)
        scheme.banner_image = f"uploads/schemes/{filename}"

    scheme.updated_at = datetime.utcnow()
    _auto_update_status(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme


# ── DELETE ────────────────────────────────────────────────────────────────────

@router.delete("/{scheme_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    db.delete(scheme)
    db.commit()


# ── MARK ENDED ────────────────────────────────────────────────────────────────

@router.patch("/{scheme_id}/end", response_model=schemas.SchemeResponse)
def mark_scheme_ended(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    scheme.status = "ended"
    scheme.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(scheme)
    return scheme


# ── PUBLISH (upcoming → running) ──────────────────────────────────────────────

@router.patch("/{scheme_id}/publish", response_model=schemas.SchemeResponse)
def publish_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    scheme.status = "running"
    scheme.start_date = date.today()
    scheme.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(scheme)
    return scheme
