from pydantic import BaseModel, NameEmail


class ProfileModel(BaseModel):
    id: int
    user_id: int
    fullname: str
    email: NameEmail
    sex: bool  # 1 men 0 female
    phone: str
