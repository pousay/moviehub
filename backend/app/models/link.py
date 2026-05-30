from pydantic import BaseModel


class LinkModel(BaseModel):
    id: int
    media_id: int
    url: str
    season: int
    episode: int
