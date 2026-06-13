from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class CommentCreateModel(BaseModel):
    content: str
    reply_id: Optional[int] = None


class CommentUserModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str


class CommentModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    user_id: int
    media_id: int
    user: CommentUserModel
    reply_id: Optional[int] = None
    replies: Optional[List["CommentModel"]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class CommentUpdateModel(BaseModel):
    content: str


class CommentUpdateResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str


class CommentDeleteResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int


CommentModel.model_rebuild()
