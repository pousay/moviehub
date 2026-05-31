from fastapi import Depends, status, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.database.connection import get_db
from backend.app.database.schema import User
from backend.app.models.user import UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from backend.app.auth.user.hash import decode_token, create_access_token
from backend.app.models.tokens import TokenTypes, AccessToken
from typing import Tuple

security = HTTPBearer()


async def check_refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    refresh_token = credentials.credentials
    data = decode_token(refresh_token, TokenTypes.REFRESH.value)

    result = await db.execute(select(User).filter_by(refresh_token=refresh_token))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="token not found"
        )

    new_access_token = create_access_token(
        {"user_id": user.id, "username": data["username"]}
    )
    user.access_token = new_access_token
    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        refresh_token=user.refresh_token,
        access_token=user.access_token,
        exp_at=user.exp_at,
    )


async def check_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Tuple[AccessToken, User]:
    access_token = credentials.credentials
    data = decode_token(access_token, TokenTypes.ACCESS.value)

    result = await db.execute(
        select(User)
        .filter_by(access_token=access_token)
        .options(selectinload(User.profile))
    )
    user: User = result.scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="token not found"
        )

    return AccessToken(**data, access_token=access_token), user
