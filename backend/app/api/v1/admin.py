from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime

from app.database import SessionLocal
from app import models, schemas
from app.logging_config import logger
from app.services import log_action
from app.core.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


# ====================================================
# DATABASE DEPENDENCY
# ====================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()





# ====================================================
# ADMIN - RISK ANALYSIS
# ====================================================

@router.get("/risky-users")
def admin_get_risky_users(
    threshold: int = Query(3, ge=1),
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):

    users = db.query(models.User).all()

    results = []

    for user in users:
        fraud_count = db.query(models.Transaction).filter(
            models.Transaction.user_id == user.id,
            models.Transaction.is_fraud == True
        ).count()

        if fraud_count >= threshold:
            results.append({
                "user_id": user.id,
                "email": user.email,
                "company": user.company,
                "fraud_cases": fraud_count
            })

    return results


# ====================================================
# ADMIN - SYSTEM ANALYTICS
# ====================================================

@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):

    total_users = db.query(models.User).count()

    total_transactions = db.query(models.Transaction).count()

    fraud_cases = db.query(models.Transaction).filter(
        models.Transaction.is_fraud == True
    ).count()

    fraud_rate = (
        (fraud_cases / total_transactions * 100)
        if total_transactions else 0
    )

    return {
        "total_users": total_users,
        "total_transactions": total_transactions,
        "fraud_cases": fraud_cases,
        "fraud_rate_percent": round(fraud_rate, 2),
    }


# ====================================================
# ADMIN - VIEW TRANSACTION DETAILS
# ====================================================

@router.get("/transactions", response_model=schemas.PaginatedAdminTransactions)
def get_admin_transactions(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    query = (
        db.query(models.Transaction)
        .options(joinedload(models.Transaction.user))  # 🔥 THIS IS KEY
    )

    total = query.count()

    transactions = (
        query.order_by(models.Transaction.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    result = []

    for tx in transactions:
        result.append({
            "id": tx.id,

            # 👇 USER DATA
            "full_name": tx.user.full_name if tx.user else None,
            "email": tx.user.email if tx.user else None,

            # 👇 TRANSACTION DATA
            "amount": tx.amount,
            "currency": tx.currency,
            "country": tx.country,
            "tx_type": tx.tx_type,

            "is_fraud": tx.is_fraud,
            "fraud_risk": tx.fraud_risk,
            "fraud_label": tx.fraud_label,
            "fraud_reason": tx.fraud_reason,
            "created_at": tx.created_at,

            "merchant_category": tx.merchant_category,
            "device_used": tx.device_used,
            "payment_channel": tx.payment_channel,
        })

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": result
    }

    # ====================================================
    # ADMIN - GET USERS (FIX)
    # ====================================================


@router.get("/users", response_model=schemas.PaginatedUsers)
def get_admin_users(
        limit: int = Query(100, ge=1, le=500),
        offset: int = Query(0, ge=0),
        db: Session = Depends(get_db),
        admin: models.User = Depends(get_current_admin),
):
    query = db.query(models.User)

    total = query.count()

    users = (
        query
        .order_by(models.User.id.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": users
    }

# ====================================================
# ACTIVATE USER
# ====================================================

@router.patch("/users/{user_id}/activate", response_model=schemas.AdminUserOut)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_deleted:
        return user

    user.is_deleted = False
    user.deleted_at = None

    db.commit()
    db.refresh(user)

    log_action(db, "USER_ACTIVATED", user.email)

    logger.info(
        f"USER_ACTIVATED | user={user.email} | by_admin={admin.email}"
    )

    return user


# ====================================================
# DEACTIVATE USER
# ====================================================

@router.patch("/users/{user_id}/deactivate", response_model=schemas.AdminUserOut)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_deleted:
        return user

    user.is_deleted = True
    user.deleted_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    log_action(db, "USER_DEACTIVATED", user.email)

    logger.info(
        f"USER_DEACTIVATED | user={user.email} | by_admin={admin.email}"
    )

    return user