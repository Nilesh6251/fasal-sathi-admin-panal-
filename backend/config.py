import os

# Fasal Sathi Configuration
PORT = 5000
JWT_SECRET = "fasal_sathi_super_secret_key_2024"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 7

# SQLite Database
DATABASE_URL = "sqlite:///./dev.db"

# CORS
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
]

# Uploads
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
