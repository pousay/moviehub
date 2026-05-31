import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from backend.app.config import settings
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from backend.app.models import TokenTypes


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        hours=settings.ACCESS_EXP_HOURS
    )
    payload["type"] = TokenTypes.ACCESS.value
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_EXP_DAYS
    )
    payload["type"] = TokenTypes.REFRESH.value
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str, valid_type: str):
    try:
        token: dict = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="expired token"
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"unknown token > {e}"
        )

    if (_type := token.get("type")) is None or _type != valid_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    return token
