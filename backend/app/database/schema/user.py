from datetime import datetime
from sqlalchemy import Integer, String, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base
from typing import Optional, ForwardRef

Profile = ForwardRef("Profile")
Watchlist = ForwardRef("Watchlist")
Comment = ForwardRef("Comment")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    refresh_token: Mapped[str] = mapped_column(String, nullable=True)
    access_token: Mapped[str] = mapped_column(String, nullable=True)
    exp_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True  # None = never expires
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),  # ← set by DB on insert
        nullable=False,
    )
    profile: Mapped[Profile] = relationship(back_populates="user", uselist=False)
    watchlist: Mapped[list[Watchlist]] = relationship(back_populates="user")
    comments: Mapped[list[Comment]] = relationship(back_populates="user")

    def __repr__(self):
        return f"User(id={self.id}, username='{self.username}')"
