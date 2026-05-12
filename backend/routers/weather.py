from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_weather():
    return {"temp": 25, "condition": "Sunny"}
