from fastapi import Depends
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import ProfileResponse, ProfileRequest, AccessToken
from backend.app.auth.user import check_access_token
from backend.app.database.schema import User, Profile
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Tuple

router = APIRouter(
    prefix="/user",
    dependencies=[Depends(HTTPBearer())],
)

security = HTTPBearer()


@router.get("/profile")
async def get_profile(
    data: Tuple[AccessToken, User] = Depends(check_access_token),
):
    _token, user = data

    return ProfileResponse(**user.profile.__dict__, username=user.username)


@router.put("/profile", response_model=ProfileResponse)
async def put_profile(
    request: ProfileRequest,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data
    profile: Profile = user.profile
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return ProfileResponse(**user.profile.__dict__, username=user.username)
