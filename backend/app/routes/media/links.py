from fastapi import Depends, HTTPException, status
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
from backend.app.auth.admin import is_admin
from backend.app.database.schema import User, Media
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Tuple, Optional, Literal

router = APIRouter(
    prefix="/links",
    dependencies=[Depends(HTTPBearer())],
)

security = HTTPBearer()


def check_if_media_exists(media: Optional[Media]) -> Literal[True]:
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No Media Was Found"
        )

    return True


@router.post("/new", response_model=MediaCreateResponseModel)
async def new_link(
    media: MediaCreateModel,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    media_dict = media.model_dump()

    media_db = Media(**media_dict)
    db.add(media_db)
    await db.commit()
    await db.refresh(media_db)

    return MediaCreateResponseModel.model_validate(media_db)


@router.put("/update", response_model=MediaUpdateResponseModel)
async def update_link(
    media_id: int,
    request: MediaUpdateModel,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    media: Media = result.scalars().first()

    check_if_media_exists(media)

    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(media, field, value)

    db.add(media)
    await db.commit()
    await db.refresh(media)

    return MediaUpdateResponseModel.model_validate(media)


@router.delete("/delete")
async def delete_link(
    media_id: int,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    media: Media = result.scalars().first()

    check_if_media_exists(media)

    await db.delete(media)
    await db.commit()
    await db.refresh(media)

    return MediaUpdateResponseModel.model_validate(media)
