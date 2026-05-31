from pydantic import BaseModel, NameEmail, Field
from typing import Optional


class BaseProfile(BaseModel):
    fullname: Optional[str] = Field(None)
    email: Optional[NameEmail] = Field(None)
    sex: Optional[bool] = Field(None)  # 1 men 0 female
    phone: Optional[str] = Field(None, max_length=20)


class ProfileModel(BaseProfile):
    id: int
    user_id: int


class ProfileResponse(ProfileModel):
    username: Optional[str]


class ProfileRequest(BaseProfile):
    pass
