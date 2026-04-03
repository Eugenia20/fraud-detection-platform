from fastapi import APIRouter, Depends
from app import models, schemas
from app.core.security import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=schemas.UserProfileOut)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user