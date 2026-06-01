from pydantic import BaseModel, ConfigDict
from typing import Optional
from .media import MediaResponseModel


class WatchlistCreateModel(BaseModel):
    media_id: int
    user_id: int


class WatchlistModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    media_id: int
    media: Optional[MediaResponseModel] = None


class WatchlistCreateReposnseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    media_id: int


class WatchlistDeleteResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
