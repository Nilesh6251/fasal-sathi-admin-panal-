from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# --- Auth & Users ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Products ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    category: str

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    seller_id: int
    created_at: datetime
    class Config:
        from_attributes = True


# --- Schemes ---
class SchemeCreate(BaseModel):
    name: str
    short_description: str
    full_description: Optional[str] = None
    start_date: Optional[date] = None
    last_date_to_apply: Optional[date] = None
    end_date: Optional[date] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = "all"
    caste: Optional[str] = "all"
    state: Optional[str] = "All India"
    apply_link: Optional[str] = None
    status: Optional[str] = "upcoming"

class SchemeUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    start_date: Optional[date] = None
    last_date_to_apply: Optional[date] = None
    end_date: Optional[date] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = None
    caste: Optional[str] = None
    state: Optional[str] = None
    apply_link: Optional[str] = None
    status: Optional[str] = None

class SchemeResponse(BaseModel):
    id: int
    name: str
    short_description: str
    full_description: Optional[str] = None
    banner_image: Optional[str] = None
    start_date: Optional[date] = None
    last_date_to_apply: Optional[date] = None
    end_date: Optional[date] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = None
    caste: Optional[str] = None
    state: Optional[str] = None
    apply_link: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# --- Farmer Verification ---
class FarmerVerificationResponse(BaseModel):
    id: int
    farmer_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    farmer_id_image: Optional[str] = None
    status: str
    user_id: Optional[int] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# --- Farms ---
class FarmBase(BaseModel):
    farm_name: str
    owner_name: str
    owner_phone: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    area_acres: Optional[float] = None
    primary_crop: Optional[str] = None
    soil_type: Optional[str] = None

class FarmCreate(FarmBase):
    pass

class FarmResponse(FarmBase):
    id: int
    is_verified: bool
    user_id: Optional[int] = None
    registered_at: datetime
    class Config:
        from_attributes = True


# --- Crops ---
class CropResponse(BaseModel):
    id: int
    crop_name: str
    category: Optional[str] = None
    season: Optional[str] = None
    state: Optional[str] = None
    status: str
    area_acres: Optional[float] = None
    created_at: datetime
    class Config:
        from_attributes = True


# --- Admin Notifications ---
class AdminNotificationResponse(BaseModel):
    id: int
    title: str
    message: Optional[str] = None
    category: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

