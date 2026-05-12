from fastapi import APIRouter
router = APIRouter()
@router.get("/")
def get_sellers():
    return []
@router.post("/{id}/approve")
def approve_seller(id: int):
    return {"status": "approved", "id": id}
