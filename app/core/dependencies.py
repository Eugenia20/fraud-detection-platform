from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import SessionLocal
from app import models, auth

bearer_scheme = HTTPBearer()


# ====================================================
# DATABASE SESSION
# ====================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ====================================================
# CURRENT USER
# ====================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):

    try:
        payload = jwt.decode(
            credentials.credentials,
            auth.SECRET_KEY,
            algorithms=[auth.ALGORITHM],
        )
        user_id = payload.get("sub")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(models.User).filter(
        models.User.id == int(user_id)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if user.is_deleted:
        raise HTTPException(status_code=403, detail="Account is inactive")

    return user


# ====================================================
# ADMIN CHECK
# ====================================================

def get_current_admin(
    current_user: models.User = Depends(get_current_user)
):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    return current_user