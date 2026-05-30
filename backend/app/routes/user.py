from fastapi import FastAPI, Depends
from fastapi.routing import APIRouter
from backend.app.models.user import UserRequest

from backend.app.auth.user import signup_user

router = APIRouter(prefix="/user")


@router.post("/login")
async def login(request: UserRequest):
    return {"message": "Login successful"}


@router.post("/signup")
async def signup(dic: dict = Depends(signup_user)):
    return dic
