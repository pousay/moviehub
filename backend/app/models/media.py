from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from .link import BaseLinkModel
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
    links: Optional[List[BaseLinkModel]]


class MediaUpdateModel(BaseModel):
    model_config = ConfigDict(use_enum_values=True)
    type: Optional[MediaTypes] = Field(None)
    links: Optional[List[BaseLinkModel]] = Field(None)
    title: Optional[str] = Field(None)
    year: Optional[int] = Field(None)
    rate: Optional[float] = Field(None)
    detail: Optional[str] = Field(None)
    duration: Optional[int] = Field(None)
    country: Optional[str] = Field(None)


class MediaCreateResponseModel(MediaCreateModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    id: int
    type: str


class MediaResponseModel(MediaModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    type: str


class MediaUpdateResponseModel(MediaUpdateModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    id: int
    type: str


class MediaDeleteResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    id: int
