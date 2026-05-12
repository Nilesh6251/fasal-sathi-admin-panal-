from fastapi import APIRouter
router = APIRouter()
@router.post("/bulk")
def send_bulk_notification():
    return {"status": "success"}
