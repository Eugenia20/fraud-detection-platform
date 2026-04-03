from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import SessionLocal
from app import models, schemas, auth
from app.services import log_action
from app.logging_config import logger

router = APIRouter(tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# CREATE USER
# =========================

@router.post("/users")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    if db.query(models.User).filter(
        models.User.email == user.email
    ).first():
        raise HTTPException(status_code=400, detail="Unable to create account")

    db_user = models.User(
        email=user.email,
        hashed_password=auth.hash_password(user.password),
        full_name=user.full_name,
        phone=user.phone,
        company=user.company,
    )

    db.add(db_user)
    db.commit()

    logger.info(f"USER_CREATED | email={user.email}")

    return {"message": "User created successfully"}


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user: schemas.UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):

    db_user = db.query(models.User).filter(
        models.User.email == user.email.lower()
    ).first()

    if not db_user:
        logger.warning(f"LOGIN_FAILED | email={user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # account locked
    if db_user.locked_until and db_user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=403,
            detail="Account temporarily locked due to multiple failed attempts"
        )

    # wrong password
    if not auth.verify_password(user.password, db_user.hashed_password):

        db_user.failed_attempts += 1

        if db_user.failed_attempts >= 5:
            db_user.locked_until = datetime.utcnow() + timedelta(minutes=10)

            log_action(db, "ACCOUNT_LOCKED", db_user.email)
            logger.warning(f"ACCOUNT_LOCKED | user={db_user.email}")

        db.commit()

        raise HTTPException(status_code=401, detail="Invalid credentials")

    db_user.failed_attempts = 0
    db_user.locked_until = None
    db.commit()

    access_token = auth.create_access_token(
        user_id=db_user.id,
        email=db_user.email,
        is_admin=db_user.is_admin
    )

    refresh_token = auth.generate_refresh_token()

    db.add(
        models.RefreshToken(
            user_id=db_user.id,
            token_hash=auth.hash_token(refresh_token),
            expires_at=auth.refresh_token_expiry(),
        )
    )

    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
    )

    log_action(db, "LOGIN_SUCCESS", db_user.email)
    logger.info(f"LOGIN_SUCCESS | user={db_user.email}")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": db_user.is_admin,
    }


# =========================
# REFRESH TOKEN
# =========================

@router.post("/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):

    token = request.cookies.get("refresh_token")

    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    hashed = auth.hash_token(token)

    token_entry = db.query(models.RefreshToken).filter(
        models.RefreshToken.token_hash == hashed,
        models.RefreshToken.revoked == False,
    ).first()

    if not token_entry or token_entry.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = db.query(models.User).filter(
        models.User.id == token_entry.user_id
    ).first()

    token_entry.revoked = True

    new_refresh = auth.generate_refresh_token()

    db.add(
        models.RefreshToken(
            user_id=user.id,
            token_hash=auth.hash_token(new_refresh),
            expires_at=auth.refresh_token_expiry(),
        )
    )

    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
    )

    new_access_token = auth.create_access_token(
        user_id=user.id,
        email=user.email,
        is_admin=user.is_admin
    )

    logger.info(f"TOKEN_REFRESHED | user={user.email}")

    return {"access_token": new_access_token}


# =========================
# LOGOUT
# =========================

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):

    token = request.cookies.get("refresh_token")

    if token:
        hashed = auth.hash_token(token)

        entry = db.query(models.RefreshToken).filter(
            models.RefreshToken.token_hash == hashed
        ).first()

        if entry:
            entry.revoked = True
            db.commit()

    response.delete_cookie("refresh_token")

    logger.info("LOGOUT")

    return {"message": "Logged out successfully"}