from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base, SessionLocal
import models, auth
from config import CORS_ORIGINS, UPLOAD_DIR
from routers import auth as auth_router, dashboard as dashboard_router
from routers import farmers as farmers_router
from routers import farms as farms_router
from routers import admin_notifications as admin_notif_router

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
app.include_router(farmers_router.router, prefix="/api/farmers", tags=["Farmers Verification"])
app.include_router(farms_router.router, prefix="/api/farms", tags=["Farms"])
app.include_router(admin_notif_router.router, prefix="/api/admin-notifications", tags=["Admin Notifications"])

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

def seed_demo_farmer_verifications():
    """Seed some mock farmer verification records for testing."""
    db = SessionLocal()
    count = db.query(models.FarmerVerification).count()
    if count == 0:
        demo = [
            models.FarmerVerification(farmer_name="Ramesh Kumar", phone="9876543210", email="ramesh@gmail.com", location="Maharashtra", status="pending"),
            models.FarmerVerification(farmer_name="Sunita Devi", phone="8765432109", email="sunita@gmail.com", location="Uttar Pradesh", status="pending"),
            models.FarmerVerification(farmer_name="Gurpreet Singh", phone="7654321098", email="gurpreet@gmail.com", location="Punjab", status="pending"),
            models.FarmerVerification(farmer_name="Meena Patel", phone="6543210987", email="meena@gmail.com", location="Gujarat", status="approved"),
            models.FarmerVerification(farmer_name="Arjun Rao", phone="9988776655", email="arjun@gmail.com", location="Karnataka", status="rejected"),
        ]
        db.add_all(demo)
        db.commit()
        print("✅ Demo farmer verifications seeded.")
    db.close()

def seed_demo_farms():
    """Seed demo farms and crops."""
    db = SessionLocal()
    if db.query(models.Farm).count() == 0:
        farms = [
            models.Farm(farm_name="Ramesh Wheat Farm", owner_name="Ramesh Kumar", owner_phone="9876543210", location="Nagpur", state="Maharashtra", district="Nagpur", area_acres=12.5, primary_crop="Wheat", soil_type="loam", is_verified=True),
            models.Farm(farm_name="Green Valley Agro", owner_name="Sunita Devi", owner_phone="8765432109", location="Lucknow", state="Uttar Pradesh", district="Lucknow", area_acres=8.0, primary_crop="Rice", soil_type="clay", is_verified=True),
            models.Farm(farm_name="Punjab Harvest Fields", owner_name="Gurpreet Singh", owner_phone="7654321098", location="Amritsar", state="Punjab", district="Amritsar", area_acres=25.0, primary_crop="Wheat", soil_type="loam", is_verified=False),
            models.Farm(farm_name="Patel Agri Land", owner_name="Meena Patel", owner_phone="6543210987", location="Surat", state="Gujarat", district="Surat", area_acres=6.5, primary_crop="Cotton", soil_type="sandy", is_verified=True),
            models.Farm(farm_name="Deccan Crop Zone", owner_name="Arjun Rao", owner_phone="9988776655", location="Hyderabad", state="Telangana", district="Ranga Reddy", area_acres=15.0, primary_crop="Soybean", soil_type="loam", is_verified=False),
            models.Farm(farm_name="MP Grain Fields", owner_name="Vikram Verma", owner_phone="8877665544", location="Bhopal", state="Madhya Pradesh", district="Bhopal", area_acres=20.0, primary_crop="Soybean", soil_type="clay", is_verified=True),
        ]
        db.add_all(farms)
        db.commit()
        # Add crops
        crops = [
            models.Crop(crop_name="Wheat", category="cereal", season="rabi", state="Maharashtra", status="growing", area_acres=12.5),
            models.Crop(crop_name="Rice", category="cereal", season="kharif", state="Uttar Pradesh", status="harvested", area_acres=8.0),
            models.Crop(crop_name="Wheat", category="cereal", season="rabi", state="Punjab", status="growing", area_acres=25.0),
            models.Crop(crop_name="Cotton", category="oilseed", season="kharif", state="Gujarat", status="growing", area_acres=6.5),
            models.Crop(crop_name="Soybean", category="oilseed", season="kharif", state="Telangana", status="growing", area_acres=15.0),
            models.Crop(crop_name="Soybean", category="oilseed", season="kharif", state="Madhya Pradesh", status="harvested", area_acres=20.0),
            models.Crop(crop_name="Tomato", category="vegetable", season="rabi", state="Maharashtra", status="growing", area_acres=3.0),
            models.Crop(crop_name="Onion", category="vegetable", season="rabi", state="Maharashtra", status="growing", area_acres=2.5),
        ]
        db.add_all(crops)
        db.commit()
        print("✅ Demo farms and crops seeded.")
    db.close()

@app.on_event("startup")
def startup_event():
    create_default_admin()
    seed_demo_farmer_verifications()
    seed_demo_farms()
    print("🚀 Fasal Sathi FastAPI Backend Started!")

@app.get("/")
def read_root():
    return {"message": "Welcome to Fasal Sathi API. Go to /docs for Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
