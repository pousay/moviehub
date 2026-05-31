from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.routing import APIRouter
from backend.app.models.user import UserResponse
from backend.app.auth.user import signup_user, login_user, refresh

router = APIRouter(prefix="/user")

security = HTTPBearer()


@router.post("/login")
async def login(resp: UserResponse = Depends(login_user)):
    return resp


@router.post("/signup")
async def signup(resp: UserResponse = Depends(signup_user)):
    return resp


@router.post("/refresh")
async def refresh(resp: UserResponse = Depends(refresh)):
    return resp
