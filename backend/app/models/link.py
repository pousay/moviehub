from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class RequestCreateLinkModel(BaseModel):
    media_id: int
    url: str
    season: Optional[int] = Field(None)
    episode: Optional[int] = Field(None)


class BaseLinkModel(RequestCreateLinkModel):
    id: int


class ResponseLinkModel(BaseLinkModel):
    pass


class RequestUpdateLinkModel(BaseLinkModel):
    pass


class ResponseCreateLinkModel(BaseLinkModel):
    model_config = ConfigDict(from_attributes=True)
