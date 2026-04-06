from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import time
import os
from app.database import engine
from app import models
from app.logging_config import logger
from app.api.v1.router import api_router
from app.core.config import MAX_REQUESTS, GLOBAL_WINDOW
import pickle
from pathlib import Path

# ====================================================
# LOAD THE TRAINED MODEL
# ====================================================
# Path to the saved trained model
BASE_DIR = Path(__file__).resolve().parents[1]  # app/
model_path = BASE_DIR / "ml" / "fraud_detection_xgboost.pkl"

# Load the model when the app starts
with open(model_path, "rb") as f:
    model = pickle.load(f)

# ====================================================
# DATABASE INITIALIZATION
# ====================================================

if os.getenv("TESTING") != "1":
    models.Base.metadata.create_all(bind=engine)


# ====================================================
# APPLICATION INIT
# ====================================================

app = FastAPI(
    title="Financial Transaction Monitoring & Fraud Detection API",
    version="1.0.0"
)


# ====================================================
# RATE LIMITING
# ====================================================

request_counter = defaultdict(list)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):

    # Disable rate limiting during tests
    if os.getenv("TESTING") == "1":
        return await call_next(request)

    ip = request.client.host
    now = time.time()

    request_counter[ip] = [
        t for t in request_counter[ip] if now - t < GLOBAL_WINDOW
    ]

    if len(request_counter[ip]) >= MAX_REQUESTS:
        logger.warning(f"RATE_LIMIT_EXCEEDED | ip={ip}")
        raise HTTPException(status_code=429, detail="Too many requests")

    request_counter[ip].append(now)

    response = await call_next(request)
    return response

# ====================================================
# CORS
# ====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====================================================
# SYSTEM ENDPOINTS
# ====================================================

@app.get("/", tags=["System"])
def root():
    return {"message": "Finance Fraud Monitoring API running"}


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok"}


# ====================================================
# REGISTER API ROUTES
# ====================================================

app.include_router(api_router, prefix="/api/v1")