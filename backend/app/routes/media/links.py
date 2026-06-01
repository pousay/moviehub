from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import (
    ResponseLinkModel,
    RequestCreateLinkModel,
    RequestUpdateLinkModel,
    ResponseCreateLinkModel,
    ResponseDeleteLinkModel,
    ResponseUpdateLinkModel,
    AccessToken,
)
from backend.app.auth.admin import is_admin
from backend.app.database.schema import User, Link, Media
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


async def get_media(db: AsyncSession, media_id) -> Optional[Media]:
    result = await db.execute(
        select(Media).filter_by(id=media_id).options(selectinload(Media.links))
    )
    return result.scalars().first()


async def check_if_media_exists(db: AsyncSession, media_id: int) -> Literal[True]:
    media = await get_media(db, media_id)
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No Media Was Found"
        )

    return True


@router.post("/new", response_model=ResponseCreateLinkModel)
async def new_link(
    link: RequestCreateLinkModel,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    await check_if_media_exists(db, link.media_id)

    link_dict = link.model_dump()

    link_db = Link(**link_dict)
    db.add(link_db)
    await db.commit()
    await db.refresh(link_db)

    return ResponseCreateLinkModel.model_validate(link_db)


@router.put("/update", response_model=ResponseUpdateLinkModel)
async def update_link(
    link_id: int,
    request: RequestUpdateLinkModel,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    result = await db.execute(select(Link).filter_by(id=link_id))
    link: Link = result.scalars().first()

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Link not found"
        )

    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(link, field, value)

    db.add(link)
    await db.commit()
    await db.refresh(link)

    return ResponseUpdateLinkModel.model_validate(link)


@router.delete("/delete", response_model=ResponseDeleteLinkModel)
async def delete_link(
    link_id: int,
    data: Tuple[AccessToken, User] = Depends(is_admin),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    result = await db.execute(select(Link).filter_by(id=link_id))
    link: Link = result.scalars().first()

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Link not found"
        )

    await db.delete(link)
    await db.commit()

    return ResponseDeleteLinkModel.model_validate(link)
