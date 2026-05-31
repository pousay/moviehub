from fastapi import Depends
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import (
    MediaResponseModel,
    AccessToken,
    MediaCreateModel,
    MediaCreateResponseModel,
)
from backend.app.auth.user import check_access_token
from backend.app.database.schema import User, Media
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Tuple

router = APIRouter(
    prefix="/media",
    dependencies=[Depends(HTTPBearer())],
)

security = HTTPBearer()


@router.get("/get", response_model=MediaResponseModel)
async def get_media(
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
    media_id: int = 0,
):
    _token, user = data

    result = await db.execute(select(Media).filter_by(id=media_id))
    media = result.scalars().first()

    return MediaResponseModel(**media.__dict__, username=user.username)


@router.post("/new", response_model=MediaCreateResponseModel)
async def get_media(
    media: MediaCreateModel,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    media_dict = media.model_dump()

    media_db = Media(**media_dict)
    db.add(media_db)
    await db.commit()
    await db.refresh(media_db)

    return MediaCreateResponseModel.model_validate(media_db)


# @router.put("/profile", response_model=ProfileResponse)
# async def put_profile(
#     request: ProfileRequest,
#     data: Tuple[AccessToken, User] = Depends(check_access_token),
#     db: AsyncSession = Depends(get_db),
# ):
#     _token, user = data
#     profile: Profile = user.profile
#     for field, value in request.model_dump(exclude_unset=True).items():
#         setattr(profile, field, value)
#     db.add(profile)
#     await db.commit()
#     await db.refresh(profile)
#     return ProfileResponse(**user.profile.__dict__, username=user.username)
