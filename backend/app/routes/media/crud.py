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
    MediaDeleteResponseModel,
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
    prefix="/media",
    dependencies=[Depends(HTTPBearer())],
)

security = HTTPBearer()


def check_if_media_exists(media: Optional[Media]) -> Literal[True]:
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No Media Was Found"
        )

    return True


@router.get("/get", response_model=MediaResponseModel)
async def get_media(
    data: Tuple[AccessToken, User] = Depends(check_access_token),  # all users
    db: AsyncSession = Depends(get_db),
    media_id: int = 0,
):
    _token, user = data

    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    media = result.scalars().first()

    check_if_media_exists(media)

    return MediaResponseModel.model_validate(media)


@router.get("/search", response_model=list[MediaResponseModel])
async def search_media(
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
    query: str = None,
):
    if query is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="BAD QUERY")
    _token, user = data

    result = await db.execute(
        select(Media)
        .filter(Media.title.ilike(f"%{query}%"))
        .options(selectinload(Media.links))
    )
    media_list = result.scalars().all()

    return [MediaResponseModel.model_validate(m) for m in media_list]


@router.post("/new", response_model=MediaCreateResponseModel)
async def create_media(
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
async def put_media(
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


@router.delete("/delete", response_model=MediaDeleteResponseModel)
async def delete_media(
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

    return MediaDeleteResponseModel.model_validate(media)


"""no bug till here"""
