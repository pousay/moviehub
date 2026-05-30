from pydantic import BaseModel, NameEmail
from .media import MediaModel


class WatchlistModel(BaseModel):
    id: int
    user_id: int
    media_id: int
    media: MediaModel
