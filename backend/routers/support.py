from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_support_tickets():
    return []
