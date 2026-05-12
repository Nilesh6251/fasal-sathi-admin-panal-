from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_disease():
    return []
@router.get("/analytics")
def get_disease_analytics():
    return {"total": 0}
