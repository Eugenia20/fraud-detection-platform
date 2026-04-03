from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.logging_config import logger
from app.services.ml_service import predict_fraud

from app.core.security import get_current_user
from typing import Optional

router = APIRouter(prefix="/transactions", tags=["Transactions"])




# =========================
# DATABASE DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# CREATE TRANSACTION
# =========================

@router.post("", response_model=schemas.TransactionOut)
def create_transaction(
    tx: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # 👉 ML prediction
    is_fraud, confidence = predict_fraud(tx)

    # ✅ CALCULATE LABEL FIRST
    if confidence >= 0.7:
        fraud_label = "high"
    elif confidence >= 0.4:
        fraud_label = "medium"
    else:
        fraud_label = "low"

    # ✅ CALCULATE REASON FIRST
    fraud_reason = (
        f"ML risk score: {round(confidence, 2)}"
        if is_fraud else
        "Normal transaction pattern"
    )

    # ✅ THEN CREATE OBJECT
    new_tx = models.Transaction(
        amount=tx.amount,
        currency=tx.currency,
        country=tx.country,
        tx_type=tx.tx_type,

        is_fraud=is_fraud,
        fraud_risk=int(confidence * 100),
        fraud_label=fraud_label,
        fraud_reason=fraud_reason,

        user_id=current_user.id,

        merchant_category=tx.merchant_category,
        device_used=tx.device_used,
        payment_channel=tx.payment_channel
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    logger.info(
        f"TRANSACTION_CREATED | user={current_user.email} | "
        f"amount={tx.amount} | fraud_risk={confidence}"
    )

    return new_tx

# =========================
# GET USER TRANSACTIONS
# =========================

@router.get("", response_model=schemas.PaginatedTransactions)
def get_transactions(
    fraud_only: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id)

    if fraud_only is not None:
        query = query.filter(models.Transaction.is_fraud == fraud_only)

    total = query.count()

    transactions = query.order_by(models.Transaction.created_at.desc()).limit(limit).offset(offset).all()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": transactions
    }