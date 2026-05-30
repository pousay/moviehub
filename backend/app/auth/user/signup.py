from fastapi import Depends
from backend.app.database import get_db
from sqlalchemy.orm import Session
from backend.app.database.schema import User
from backend.app.models.user import UserRequest, UserResponse


async def signup_user(
    request: UserRequest, db: Session = Depends(get_db)
) -> UserResponse:
    user = User(username=request.username, password=request.password)

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        username=user.username,
        refresh_token=user.refresh_token,
        access_token=user.access_token,
        exp_at=user.exp_at,
    )
