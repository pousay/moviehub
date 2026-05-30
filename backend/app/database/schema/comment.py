from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from backend.app.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"), nullable=False)
    reply_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("comments.id"), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="comments")
    media: Mapped["Media"] = relationship(back_populates="comments")
    parent_reply: Mapped[Optional["Comment"]] = relationship(
        back_populates="replies", remote_side="Comment.id"
    )
    replies: Mapped[list["Comment"]] = relationship(back_populates="parent_reply")
