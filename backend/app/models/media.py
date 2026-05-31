from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from .link import LinkModel
from backend.app.utils import MediaTypes


class MediaCreateModel(BaseModel):
    model_config = ConfigDict(use_enum_values=True)
    type: MediaTypes
    title: str
    year: int
    rate: float
    detail: str
    duration: int
    country: str


class MediaModel(MediaCreateModel):
    id: int
    links: Optional[List[LinkModel]]


class MediaUpdateModel(BaseModel):
    model_config = ConfigDict(use_enum_values=True)
    type: Optional[MediaTypes]
    links: Optional[List[LinkModel]]
    title: Optional[str]
    year: Optional[int]
    rate: Optional[float]
    detail: Optional[str]
    duration: Optional[int]
    country: Optional[str]


class MediaCreateResponseModel(MediaCreateModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    id: int
    type: str


class MediaResponseModel(MediaModel):
    pass
