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
    if os.getenv("TESTING") == "1":
        SECRET_KEY = "testsecret123"
    else:
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
    password = password.strip()
    password = password.encode("utf-8")[:72]
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_password = plain_password.strip()
    plain_password = plain_password.encode("utf-8")[:72]
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

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ==========================
# REFRESH TOKEN (OPAQUE)
# ==========================

def generate_refresh_token() -> str:

    return secrets.token_urlsafe(64)


def hash_token(token: str) -> str:

    return hashlib.sha256(token.encode()).hexdigest()


def refresh_token_expiry() -> datetime:

    return datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)