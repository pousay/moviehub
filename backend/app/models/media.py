from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from .link import BaseLinkModel
from backend.app.utils import MediaTypes
from datetime import datetime


class MediaCreateModel(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: MediaTypes
    title: str
    year: int
    duration: int
    country: Optional[str] = Field(None)

    imdb_id: Optional[str] = Field(None)
    tmdb_id: Optional[int] = Field(None)

    imdb_rate: Optional[float] = Field(None)
    tmdb_rate: Optional[float] = Field(None)
    imdb_votes: Optional[int] = Field(None)
    tmdb_votes: Optional[int] = Field(None)
    popularity: Optional[float] = Field(None)

    overview: Optional[str] = Field(None)
    tagline: Optional[str] = Field(None)
    genres: Optional[str] = Field(None)

    poster: Optional[str] = Field(None)
    backdrop: Optional[str] = Field(None)

    total_seasons: Optional[int] = Field(None)
    total_episodes: Optional[int] = Field(None)


class MediaModel(MediaCreateModel):
    id: int
    links: Optional[List[BaseLinkModel]] = Field(None)


class MediaUpdateModel(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Optional[MediaTypes] = Field(None)
    title: Optional[str] = Field(None)
    year: Optional[int] = Field(None)
    duration: Optional[int] = Field(None)
    country: Optional[str] = Field(None)

    imdb_id: Optional[str] = Field(None)
    tmdb_id: Optional[int] = Field(None)

    imdb_rate: Optional[float] = Field(None)
    tmdb_rate: Optional[float] = Field(None)
    imdb_votes: Optional[int] = Field(None)
    tmdb_votes: Optional[int] = Field(None)
    popularity: Optional[float] = Field(None)

    overview: Optional[str] = Field(None)
    tagline: Optional[str] = Field(None)
    genres: Optional[str] = Field(None)

    poster: Optional[str] = Field(None)
    backdrop: Optional[str] = Field(None)

    total_seasons: Optional[int] = Field(None)
    total_episodes: Optional[int] = Field(None)

    links: Optional[List[BaseLinkModel]] = Field(None)


class MediaCreateResponseModel(MediaCreateModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    id: int
    type: str
    created_at: datetime


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
