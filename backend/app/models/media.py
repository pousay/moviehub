from pydantic import BaseModel
from typing import List
from .link import LinkModel
from backend.app.utils import MediaTypes


class MediaModel(BaseModel):
    id: int
    type: MediaTypes
    links: List[LinkModel]
    title: int
    year: int
    rate: float
    detail: str
    duration: int  # minutes
    country: str
