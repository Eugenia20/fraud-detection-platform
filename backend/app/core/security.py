from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta

from app.database import SessionLocal
from app import models, auth
from app.logging_config import logger

bearer_scheme = HTTPBearer()


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# JWT Token Validator - Decodes and checks for expiration
def validate_jwt_token(token: str):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = payload.get("sub")

        # Check if the token is expired
        exp = payload.get("exp")
        if exp and datetime.utcfromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token has expired")

        return user_id
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})


# Get Current User - Retrieves the current user from the token
def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
        db: Session = Depends(get_db),
):
    user_id = validate_jwt_token(credentials.credentials)

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if user.is_deleted:
        raise HTTPException(status_code=403, detail="Account is inactive")

    logger.info(f"User {user.email} authenticated successfully")

    return user


# Get Current Admin - Ensures that the user has admin privileges
def get_current_admin(
        current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    logger.info(f"Admin {current_user.email} accessed admin endpoint")

    return current_user