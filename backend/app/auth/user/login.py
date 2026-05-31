from fastapi import Depends, HTTPException, status
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.database.schema import User
from backend.app.models import UserRequest, UserResponse
from backend.app.auth.user.hash import create_access_token, create_refresh_token
from backend.app.auth.user.pswd import verify_password


async def login_user(
    request: UserRequest, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    result = await db.execute(select(User).filter_by(username=request.username))
    user = result.scalars().first()

    if user is None or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token({"user_id": user.id, "username": user.username})
    refresh_token = create_refresh_token(
        {"user_id": user.id, "username": user.username}
    )

    user.access_token = access_token
    user.refresh_token = refresh_token

    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        refresh_token=user.refresh_token,
        access_token=user.access_token,
        exp_at=user.exp_at,
    )
