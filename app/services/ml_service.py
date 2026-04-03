import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime

# ===============================
# LOAD MODELS
# ===============================

BASE_PATH = Path(__file__).resolve().parents[2] / "ml"

# Old models
ISO_MODEL_PATH = BASE_PATH / "model.pkl"
RF_MODEL_PATH = BASE_PATH / "random_forest.pkl"

# New XGBoost model
XGB_MODEL_PATH = BASE_PATH / "fraud_detection_xgboost.pkl"

with open(ISO_MODEL_PATH, "rb") as f:
    isolation_model = pickle.load(f)

with open(RF_MODEL_PATH, "rb") as f:
    rf_model = pickle.load(f)

with open(XGB_MODEL_PATH, "rb") as f:
    xgb_data = pickle.load(f)

xgb_model = xgb_data["model"]
xgb_columns = xgb_data["columns"]


# ===============================
# OLD FEATURE ENGINEERING
# ===============================

def extract_features(amount, is_new_country, tx_type):
    hour = datetime.utcnow().hour
    tx_code = 1 if tx_type == "debit" else 0
    return np.array([[amount, int(is_new_country), tx_code, hour]])


# ===============================
# NEW XGBOOST PREPROCESSING
# ===============================

def prepare_xgb_input(tx):
    data = {
        "amount": tx.amount,
        "currency": tx.currency,
        "location": tx.country,
        "transaction_type": tx.tx_type,
        "merchant_category": tx.merchant_category,
        "device_used": tx.device_used,
        "payment_channel": tx.payment_channel,
    }

    df = pd.DataFrame([data])
    df = pd.get_dummies(df)

    for col in xgb_columns:
        if col not in df:
            df[col] = 0

    df = df[xgb_columns]

    return df


# ===============================
# FINAL FRAUD PREDICTION
# ===============================

def predict_fraud(tx, is_new_country=False):

    risk = 0
    reasons = []

    # -------------------------------
    # Isolation Forest
    # -------------------------------
    iso_pred = isolation_model.predict([[tx.amount]])

    if iso_pred[0] == -1:
        risk += 30
        reasons.append("Anomalous transaction")

    # -------------------------------
    # Random Forest (old model)
    # -------------------------------
    features = extract_features(tx.amount, is_new_country, tx.tx_type)
    rf_proba = rf_model.predict_proba(features)[0][1]

    if rf_proba > 0.7:
        risk += 30
        reasons.append("Baseline ML risk")

    elif rf_proba > 0.4:
        risk += 15
        reasons.append("Moderate ML risk")

    # -------------------------------
    # XGBoost (new model)
    # -------------------------------
    xgb_df = prepare_xgb_input(tx)
    xgb_proba = xgb_model.predict_proba(xgb_df)[0][1]

    if xgb_proba > 0.6:
        risk += 50
        reasons.append("Advanced ML detection")

    elif xgb_proba > 0.4:
        risk += 25
        reasons.append("Moderate advanced risk")

    # -------------------------------
    # RULE ENGINE
    # -------------------------------
    if tx.amount > 1_000_000:
        risk += 40
        reasons.append("Extremely large transaction")

    elif tx.amount > 10_000:
        risk += 20
        reasons.append("Large transaction")

    if is_new_country:
        risk += 20
        reasons.append("New country")

    if tx.tx_type == "debit":
        risk += 10
        reasons.append("Money out")

    # -------------------------------
    # FINAL DECISION
    # -------------------------------
    is_fraud = risk >= 50

    # Convert to confidence (0–1 scale)
    confidence = min(risk / 100, 1.0)

    return is_fraud, confidence