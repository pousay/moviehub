from fastapi import Depends
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.schema import User, Profile
from backend.app.models.user import UserRequest, UserResponse
from backend.app.auth.user.hash import create_access_token, create_refresh_token
from backend.app.auth.user.pswd import hash_password


async def signup_user(
    request: UserRequest, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    user = User(username=request.username, password=hash_password(request.password))

    db.add(user)
    # required for id generation
    await db.flush()

    access_token = create_access_token({"user_id": user.id, "username": user.username})
    refresh_token = create_refresh_token(
        {"user_id": user.id, "username": user.username}
    )
    user.access_token = access_token
    user.refresh_token = refresh_token

    user_profile = Profile(
        user_id=user.id,
    )

    db.add(user_profile)
    await db.commit()
    await db.refresh(user)
    await db.refresh(user_profile)

    return UserResponse(
        id=user.id,
        username=user.username,
        refresh_token=user.refresh_token,
        access_token=user.access_token,
        exp_at=user.exp_at,
    )
