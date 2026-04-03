from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import secrets
import hashlib
from dotenv import load_dotenv
import os

# ==========================
# LOAD ENVIRONMENT VARIABLES
# ==========================

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in environment variables")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# ==========================
# PASSWORD CONTEXT
# ==========================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==========================
# PASSWORD HANDLING
# ==========================

def hash_password(password: str) -> str:
    """
    Hash password securely using bcrypt.
    Bcrypt supports maximum 72 bytes.
    """
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password cannot exceed 72 characters")

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against stored hash.
    """
    if len(plain_password.encode("utf-8")) > 72:
        return False

    return pwd_context.verify(plain_password, hashed_password)


# ==========================
# ACCESS TOKEN (JWT)
# ==========================

def create_access_token(
    user_id: int,
    email: str,
    is_admin: bool = False,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create secure JWT access token.

    Payload includes:
    - sub (user id)
    - email
    - role
    - iat
    - exp
    """

    now = datetime.utcnow()
    expire = now + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": "admin" if is_admin else "user",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    """
    Decode and validate JWT access token.
    Returns payload or None if invalid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ==========================
# REFRESH TOKEN (OPAQUE)
# ==========================

def generate_refresh_token() -> str:
    """
    Generate secure random refresh token.
    """
    return secrets.token_urlsafe(64)


def hash_token(token: str) -> str:
    """
    Hash refresh token before storing in DB.
    """
    return hashlib.sha256(token.encode()).hexdigest()


def refresh_token_expiry() -> datetime:
    """
    Calculate refresh token expiry date.
    """
    return datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)