from typing import Tuple
from backend.app.auth.user import check_access_token
from fastapi import Depends
from backend.app.database import get_db
from backend.app.database.schema import User
from backend.app.models import AccessToken
from sqlalchemy.ext.asyncio import AsyncSession


async def is_admin(
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    token, user = data
    
