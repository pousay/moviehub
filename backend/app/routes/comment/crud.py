from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.routing import APIRouter
from backend.app.models import (
    AccessToken,
    CommentCreateModel,
    CommentModel,
    CommentUpdateModel,
    CommentDeleteResponseModel,
    CommentUpdateResponseModel,
)
from backend.app.auth.user import check_access_token
from backend.app.database.schema import User, Comment, Media
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Tuple, Optional, Literal, List

router = APIRouter(
    prefix="/comment",
    dependencies=[Depends(HTTPBearer())],
)


def check_if_comment_exists(comment: Optional[Comment]) -> Literal[True]:
    if comment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found"
        )
    return True


def check_comment_ownership(comment: Comment, user: User) -> Literal[True]:
    if comment.user_id != user.id or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own comments",
        )
    return True


@router.get("/get", response_model=List[CommentModel])
async def get_comments(
    media_id: int,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    media = (await db.execute(select(Media).filter_by(id=media_id))).scalars().first()
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )

    result = await db.execute(
        select(Comment)
        .filter_by(media_id=media_id)
        .options(
            selectinload(Comment.replies).selectinload(Comment.user),
        )
    )
    comments = result.scalars().all()
    return [CommentModel.model_validate(c) for c in comments]


@router.post("/new", response_model=CommentModel)
async def create_comment(
    media_id: int,
    request: CommentCreateModel,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    media = (await db.execute(select(Media).filter_by(id=media_id))).scalars().first()
    if media is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )

    if request.reply_id is not None:
        parent = (
            (await db.execute(select(Comment).filter_by(id=request.reply_id)))
            .scalars()
            .first()
        )
        if parent is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Parent comment not found"
            )

    comment = Comment(user_id=user.id, media_id=media_id, **request.model_dump())
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    result = await db.execute(
        select(Comment).filter_by(id=comment.id).options(selectinload(Comment.replies))
    )
    comment = result.scalars().first()
    return CommentModel.model_validate(comment)


@router.put("/update", response_model=CommentUpdateResponseModel)
async def update_comment(
    comment_id: int,
    request: CommentUpdateModel,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    comment = (
        (
            await db.execute(
                select(Comment)
                .filter_by(id=comment_id)
                .options(selectinload(Comment.replies))
            )
        )
        .scalars()
        .first()
    )

    check_if_comment_exists(comment)
    check_comment_ownership(comment, user)

    comment.content = request.content
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    return CommentUpdateResponseModel.model_validate(comment)


@router.delete("/delete", response_model=CommentDeleteResponseModel)
async def delete_comment(
    comment_id: int,
    data: Tuple[AccessToken, User] = Depends(check_access_token),
    db: AsyncSession = Depends(get_db),
):
    _token, user = data

    comment = (
        (await db.execute(select(Comment).filter_by(id=comment_id))).scalars().first()
    )

    check_if_comment_exists(comment)
    check_comment_ownership(comment, user)

    await db.delete(comment)
    await db.commit()
    return CommentDeleteResponseModel.model_validate(comment)
