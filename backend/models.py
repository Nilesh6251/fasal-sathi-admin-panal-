from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Date, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user") # admin, user, seller
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    stock = Column(Integer)
    category = Column(String)
    seller_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

# Add more models as needed for reports, schemes, support tickets, etc.

class Scheme(Base):
    __tablename__ = "schemes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    short_description = Column(String, nullable=False)
    full_description = Column(Text, nullable=True)
    banner_image = Column(String, nullable=True)  # relative path e.g. uploads/schemes/img.jpg
    start_date = Column(Date, nullable=True)
    last_date_to_apply = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    # Eligibility
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)   # all / male / female / other
    caste = Column(String, nullable=True)    # all / general / obc / sc / st
    state = Column(String, nullable=True)    # "All India" or specific state
    apply_link = Column(String, nullable=True)
    status = Column(String, default="upcoming")  # upcoming / running / ended
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FarmerVerification(Base):
    __tablename__ = "farmer_verifications"
    id = Column(Integer, primary_key=True, index=True)
    farmer_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    location = Column(String, nullable=True)
    farmer_id_image = Column(String, nullable=True)  # path to uploaded ID image
    status = Column(String, default="pending")  # pending / approved / rejected
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)


class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    farm_name = Column(String, nullable=False, index=True)
    owner_name = Column(String, nullable=False)
    owner_phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    area_acres = Column(Float, nullable=True)
    primary_crop = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)  # clay / loam / sandy / silt
    is_verified = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=True)  # cereal / vegetable / fruit / pulse / oilseed
    season = Column(String, nullable=True)    # kharif / rabi / zaid
    state = Column(String, nullable=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sown_date = Column(Date, nullable=True)
    harvest_date = Column(Date, nullable=True)
    area_acres = Column(Float, nullable=True)
    status = Column(String, default="growing")  # growing / harvested / failed
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)      # e.g. SCHEME_CREATED, FARMER_APPROVED
    entity_type = Column(String, nullable=True)  # scheme / farmer / user
    entity_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    admin_email = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AdminNotification(Base):
    __tablename__ = "admin_notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    category = Column(String, default="general")  # verification / scheme / user / system
    is_read = Column(Boolean, default=False)
    link = Column(String, nullable=True)          # optional route to navigate to
    created_at = Column(DateTime, default=datetime.utcnow)
