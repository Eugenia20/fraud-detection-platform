from fastapi import APIRouter

from . import auth
from . import transactions
from . import admin
from . import profile

api_router = APIRouter()

# Authentication
api_router.include_router(auth.router)

# User Transactions
api_router.include_router(transactions.router)

# Administration
api_router.include_router(admin.router)

# User Profile
api_router.include_router(profile.router)