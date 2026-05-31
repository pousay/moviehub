from fastapi import FastAPI, Depends
from fastapi.routing import APIRouter
from backend.app.models.user import UserResponse

from backend.app.auth.user import signup_user, login_user

router = APIRouter(prefix="/user")


@router.post("/login")
async def login(resp: UserResponse = Depends(login_user)):
    return resp


@router.post("/signup")
async def signup(resp: UserResponse = Depends(signup_user)):
    return resp
