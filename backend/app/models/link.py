from pydantic import BaseModel


class BaseLinkModel(BaseModel)
    id: int
    media_id: int
    url: str
    season: int
    episode: int


class ResponseLinkModel(BaseLinkModel) : pass 

class RequestCreateLinkModel(BaseLinkModel) : 
    pass

class RequestUpdateLinkModel(BaseLinkModel) :
    pass

