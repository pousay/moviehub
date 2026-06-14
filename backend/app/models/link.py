from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from backend.app.utils import LinkLanguage


class RequestCreateLinkModel(BaseModel):
    media_id: int
    url: str
    season: Optional[int] = Field(None)
    quality: Optional[str] = Field(None)
    codec: Optional[str] = Field(None)
    language: Optional[LinkLanguage] = Field(None)
    size: Optional[str] = Field(None)


class BaseLinkModel(RequestCreateLinkModel):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ResponseLinkModel(BaseLinkModel):
    pass


class RequestUpdateLinkModel(BaseModel):
    url: Optional[str] = Field(None)
    season: Optional[int] = Field(None)
    quality: Optional[str] = Field(None)
    codec: Optional[str] = Field(None)
    language: Optional[LinkLanguage] = Field(None)
    size: Optional[str] = Field(None)


class ResponseCreateLinkModel(BaseLinkModel):
    model_config = ConfigDict(from_attributes=True)


class ResponseUpdateLinkModel(ResponseCreateLinkModel):
    pass


class ResponseDeleteLinkModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
