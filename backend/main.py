from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base, SessionLocal
import models, auth
from config import CORS_ORIGINS, UPLOAD_DIR
from routers import auth as auth_router, dashboard as dashboard_router

# Auto-create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fasal Sathi Backend", version="1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Mount Routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard_router.router, prefix="/api/dashboard", tags=["Dashboard"])

from routers import users, products, chatbot, weather, schemes, support, reports, sellers, notifications, disease, ai_config
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Schemes"])
app.include_router(support.router, prefix="/api/support", tags=["Support"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(sellers.router, prefix="/api/sellers", tags=["Sellers"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(disease.router, prefix="/api/disease", tags=["Disease"])
app.include_router(ai_config.router, prefix="/api/ai-config", tags=["AI Config"])

# Global Exception Handler
from fastapi.responses import JSONResponse
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred", "details": str(exc)},
    )

# Create default admin user on startup
def create_default_admin():
    db = SessionLocal()
    admin_exists = db.query(models.User).filter(models.User.email == "admin@fasalsathi.com").first()
    if not admin_exists:
        hashed_password = auth.get_password_hash("admin123")
        new_admin = models.User(
            name="Super Admin",
            email="admin@fasalsathi.com",
            password_hash=hashed_password,
            role="admin",
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        print("✅ Default Admin created: admin@fasalsathi.com / admin123")
    db.close()

@app.on_event("startup")
def startup_event():
    create_default_admin()
    print("🚀 Fasal Sathi FastAPI Backend Started!")

@app.get("/")
def read_root():
    return {"message": "Welcome to Fasal Sathi API. Go to /docs for Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
