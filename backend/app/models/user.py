from pydantic import BaseModel
from .profile import ProfileModel
from .watchlist import WatchlistModel
from datetime import datetime
from typing import Optional


class BaseUserModel(BaseModel):
    username: str
    password: str


class UserModel(BaseUserModel):
    id: int
    profile: ProfileModel
    watchlist: WatchlistModel
    exp_at: Optional[datetime]
    created_at: datetime
    is_admin: bool
    refresh_token: str
    access_token: str


class UserRequest(BaseUserModel):
    pass


class UserResponse(BaseModel):
    id: int
    username: str
    refresh_token: str
    access_token: str
    exp_at: Optional[datetime]
