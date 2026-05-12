from fastapi import APIRouter
router = APIRouter()
@router.post("/chat")
def chat():
    return {"message": "Hello from Chatbot"}
