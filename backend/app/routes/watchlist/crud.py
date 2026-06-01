from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import (
    AccessToken,
    WatchlistCreateResponseModel,
    WatchlistModel,
    WatchlistDeleteResponseModel,
)
from backend.app.auth.user import check_access_token
from backend.app.database.schema import User, Watchlist, Media
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Tuple, Optional, Literal, List

router = APIRouter(
    prefix="/watchlist",
    dependencies=[Depends(HTTPBearer())],
)


def check_if_watchlist_exists(
    watchlist: Optional[Watchlist], must_exists: bool = True
) -> Literal[True]:
    if must_exists:
        if watchlist is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found"
            )
        return True

    if watchlist is None:
        return True

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Media already in watchlist",
    )


async def check_if_media_exists(media_id: int, db: AsyncSession) -> Literal[True]:
    result = await db.execute(select(Media).filter_by(id=media_id))
    media = result.scalars().first()
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )
    return True


@router.get("/get", response_model=List[WatchlistModel])
async def get_watchlist(
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data
    result = await db.execute(
        select(Watchlist)
        .filter_by(user_id=user.id)
        .options(selectinload(Watchlist.media).selectinload(Media.links))
    )
    watchlists = result.scalars().all()
    return [WatchlistModel.model_validate(w) for w in watchlists]


@router.post("/new", response_model=WatchlistCreateResponseModel)
async def create_watchlist(
    media_id: int,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    await check_if_media_exists(media_id, db)

    existing = (
        (
            await db.execute(
                select(Watchlist).filter_by(user_id=user.id, media_id=media_id)
            )
        )
        .scalars()
        .first()
    )
    check_if_watchlist_exists(existing, False)

    watchlist = Watchlist(user_id=user.id, media_id=media_id)
    db.add(watchlist)
    await db.commit()
    await db.refresh(watchlist)

    return WatchlistCreateResponseModel.model_validate(watchlist)


@router.delete("/delete", response_model=WatchlistDeleteResponseModel)
async def delete_from_watchlist(
    watchlist_id: int,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    watchlist = (
        (
            await db.execute(
                select(Watchlist).filter_by(id=watchlist_id, user_id=user.id)
            )
        )
        .scalars()
        .first()
    )

    check_if_watchlist_exists(watchlist, True)
    await db.delete(watchlist)
    await db.commit()
    return WatchlistDeleteResponseModel.model_validate(watchlist)
