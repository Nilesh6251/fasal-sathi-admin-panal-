from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_ai_config():
    return {"model": "default"}
@router.post("/")
def update_ai_config():
    return {"status": "updated"}
