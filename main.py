from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager
from fastapi_swagger import patch_fastapi
from backend.app.routes import (
    user_auth_router,
    user_profile_router,
    media_crud_router,
    media_links_router,
    watchlist_router,
    comment_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n\t started \n\t")
    yield
    print("\n\t ended \n\t")


tags = [{"name": "moviehub api", "description": "task management"}]

app = FastAPI(
    docs_url=None,
    openapi_tags=tags,
    swagger_ui_oauth2_redirect_url=None,
    lifespan=lifespan,
)
patch_fastapi(app, docs_url="/docs")


app.include_router(user_auth_router)
app.include_router(user_profile_router)
app.include_router(media_crud_router)
app.include_router(media_links_router)
app.include_router(watchlist_router)
app.include_router(comment_router)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
