from sqlalchemy import Integer, ForeignKey, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, ForwardRef
from backend.app.database import Base
from datetime import datetime

User = ForwardRef("User")
Media = ForwardRef("Media")
Comment = ForwardRef("Comment")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content: Mapped[str] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"), nullable=False)
    reply_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("comments.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        server_default=None,
        onupdate=func.now(),
        nullable=True,
    )
    user: Mapped[User] = relationship(back_populates="comments")
    media: Mapped[Media] = relationship(back_populates="comments")
    parent_reply: Mapped[Optional[Comment]] = relationship(
        back_populates="replies", remote_side="Comment.id"
    )
    replies: Mapped[list[Comment]] = relationship(back_populates="parent_reply")

    @property
    def user_username(self):
        return self.user.username
