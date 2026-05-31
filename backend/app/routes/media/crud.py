from fastapi import Depends
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import (
    MediaResponseModel,
    AccessToken,
    MediaCreateModel,
    MediaCreateResponseModel,
    MediaUpdateModel,
    MediaUpdateResponseModel,
)
from backend.app.auth.user import check_access_token
from backend.app.database.schema import User, Media
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
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

    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    media = result.scalars().first()

    return MediaResponseModel.model_validate(media)


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


@router.put("/update", response_model=MediaUpdateResponseModel)
async def put_profile(
    media_id: int,
    request: MediaUpdateModel,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    media: Media = result.scalars().first()

    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(media, field, value)

    db.add(media)
    await db.commit()
    await db.refresh(media)

    return MediaUpdateResponseModel.model_validate(media)
