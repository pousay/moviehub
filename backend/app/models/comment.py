from pydantic import BaseModel
from .user import UserModel
from typing import Optional


class CommentModel(BaseModel):
    id: int
    user_id: int
    media_id: int
    reply_id: Optional[int]
    parent_reply: Optional["CommentModel"]
    user: UserModel


CommentModel.model_rebuild()
