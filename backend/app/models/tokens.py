from pydantic import BaseModel
from enum import Enum


class TokenTypes(Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class BaseToken(BaseModel):
    user_id: int
    username: str
    exp: int
    type: TokenTypes


class AccessToken(BaseToken):
    access_token: str  # add on


class RefreshToken(BaseToken):
    refresh_token: str
