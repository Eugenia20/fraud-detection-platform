from sqlalchemy import Column, Integer, Float, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ====================================================
# USER
# ====================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # ---------------- Authentication ----------------
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

    # 🔐 Brute Force Protection
    failed_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)

    # ---------------- Profile Info ----------------
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)

    # ---------------- Notification Preferences ----------------
    email_notifications = Column(Boolean, default=True)
    fraud_alerts = Column(Boolean, default=True)
    weekly_reports = Column(Boolean, default=False)
    system_updates = Column(Boolean, default=True)

    # ---------------- Soft Delete ----------------
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)

    # ---------------- Relationships ----------------
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")


# ====================================================
# TRANSACTION
# ====================================================
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    country = Column(String, nullable=True)
    tx_type = Column(String, nullable=False)  # Transaction type (deposit/withdrawal)

    # Added new fields for merchant category, device used, and payment channel
    merchant_category = Column(String, nullable=False) # Merchant category
    device_used = Column(String, nullable=True)  # Device used (mobile/desktop)
    payment_channel = Column(String, nullable=True)  # Payment channel (card, ACH, etc.)

    # Fraud-related fields
    is_fraud = Column(Boolean, default=False, index=True)
    fraud_risk = Column(Integer, default=0, index=True)
    fraud_label = Column(String, default="low")

    fraud_reason = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="transactions")

@property
def full_name(self):
    return self.user.full_name if self.user else None

@property
def email(self):
    return self.user.email if self.user else None



# ====================================================
# AUDIT LOG
# ====================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    user_email = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ====================================================
# FRAUD LOG
# ====================================================

class FraudLog(Base):
    __tablename__ = "fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, nullable=False)
    fraud_label = Column(String, nullable=False)
    reasons = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ====================================================
# REFRESH TOKEN (Secure Session Management)
# ====================================================

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False, unique=True)

    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")

