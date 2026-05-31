from fastapi import Depends
from backend.app.database import get_db
from sqlalchemy.orm import Session
from backend.app.database.schema import User
from backend.app.models.user import UserRequest, UserResponse
from backend.app.auth.user.tokens import create_access_token, create_refresh_token
from backend.app.auth.user.pswd import hash_password


async def signup_user(
    request: UserRequest, db: Session = Depends(get_db)
) -> UserResponse:
    user = User(username=request.username, password=hash_password(request.password))
    access_token = create_access_token({"id": user.id, "username": user.username})
    refresh_token = create_refresh_token({"id": user.id, "username": user.username})

    user.access_token = access_token
    user.refresh_token = refresh_token

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        refresh_token=user.refresh_token,
        access_token=user.access_token,
        exp_at=user.exp_at,
    )
