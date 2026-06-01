from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class CommentCreateModel(BaseModel):
    content: str
    reply_id: Optional[int] = None


class CommentModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    media_id: int
    reply_id: Optional[int] = None
    replies: Optional[List["CommentModel"]] = None


class CommentUpdateModel(BaseModel):
    content: str


class CommentDeleteResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int


CommentModel.model_rebuild()
