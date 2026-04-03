from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re
from enum import Enum


# ====================================================
# PASSWORD VALIDATION
# ====================================================

def validate_password_strength(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", value):
        raise ValueError("Password must contain at least one uppercase letter")

    if not re.search(r"[a-z]", value):
        raise ValueError("Password must contain at least one lowercase letter")

    if not re.search(r"[0-9]", value):
        raise ValueError("Password must contain at least one number")

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        raise ValueError("Password must contain at least one special character")

    return value


# ====================================================
# AUTH
# ====================================================

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    company: Optional[str] = None

    @validator("email")
    def email_must_start_lowercase(cls, v):
        if not v[0].islower():
            raise ValueError("Email must start with a lowercase letter")
        return v

    @validator("password")
    def password_strength(cls, v):
        return validate_password_strength(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
#------------------------------------------------------------------
# TRAINED MODEL COLUMN CALLS
#-------------------------------------------------------------
class MerchantCategory(str, Enum):
    utilities = "utilities"
    online = "online"
    other = "other"

class DeviceUsed(str, Enum):
    mobile = "mobile"
    atm = "atm"
    pos = "pos"

class PaymentChannel(str, Enum):
        card = "card"
        ach = "ACH"
        wire = "wire"
# ====================================================
# PROFILE
# ====================================================

class UserProfileOut(BaseModel):
    email: str
    full_name: Optional[str]
    phone: Optional[str]
    company: Optional[str]

    email_notifications: bool
    fraud_alerts: bool
    weekly_reports: bool
    system_updates: bool

    is_deleted: bool

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

    email_notifications: Optional[bool] = None
    fraud_alerts: Optional[bool] = None
    weekly_reports: Optional[bool] = None
    system_updates: Optional[bool] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @validator("new_password")
    def new_password_strength(cls, v):
        return validate_password_strength(v)


# ====================================================
# TRANSACTIONS (USER VIEW)
# ====================================================

class TransactionType(str, Enum):
    debit = "debit"
    credit = "credit"

# schemas.py

class TransactionCreate(BaseModel):
    amount: float
    currency: str
    country: Optional[str] = None
    tx_type: TransactionType
    merchant_category: MerchantCategory
    device_used: DeviceUsed
    payment_channel: PaymentChannel

class TransactionOut(BaseModel):
    id: int
    amount: float
    currency: str
    country: str
    tx_type: Optional[str] = None

    is_fraud: bool
    fraud_risk: float
    fraud_label: str
    fraud_reason: Optional[str]
    created_at: datetime

    merchant_category: MerchantCategory
    device_used: DeviceUsed
    payment_channel: PaymentChannel

    class Config:
        from_attributes = True






class TransactionRequest(BaseModel):
    amount: float
    tx_type: TransactionType  # Use Enum instead of int for transaction type
    merchant_category: str
    device_used: str  # Device used (mobile/desktop)
    payment_channel: str  # Payment channel (card, ACH, etc.)

# ====================================================
# ADMIN USERS
# ====================================================

class AdminUserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    phone: Optional[str]
    company: Optional[str]

    is_admin: bool
    is_deleted: bool

    email_notifications: bool
    fraud_alerts: bool
    weekly_reports: bool
    system_updates: bool


    class Config:
        from_attributes = True





class AdminTransactionOut(BaseModel):
    id: int

    full_name: Optional[str]
    email: Optional[str]

    amount: float
    currency: str
    country: str
    tx_type: Optional[str] = None

    is_fraud: bool
    fraud_risk: float
    fraud_label: str
    fraud_reason: Optional[str]
    created_at: datetime

    merchant_category: str
    device_used: str
    payment_channel: str

    class Config:
        from_attributes = True





class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None


# ====================================================
# PAGINATION RESPONSES
# ====================================================

class PaginatedTransactions(BaseModel):
    total: int
    limit: int
    offset: int
    data: list[TransactionOut]


class PaginatedUsers(BaseModel):
    total: int
    limit: int
    offset: int
    data: list[AdminUserOut]

class PaginatedAdminTransactions(BaseModel):
    total: int
    limit: int
    offset: int
    data: list[AdminTransactionOut]