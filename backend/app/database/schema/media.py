from sqlalchemy import Integer, String, Float, Enum, func, DateTime, Text
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base
from typing import ForwardRef, Optional
from backend.app.utils import MediaTypes

Link = ForwardRef("Link")
Watchlist = ForwardRef("Watchlist")
Comment = ForwardRef("Comment")


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    imdb_id: Mapped[Optional[str]] = mapped_column(
        String(20), nullable=True, unique=True
    )
    tmdb_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, unique=True)
    type: Mapped[str] = mapped_column(Enum(MediaTypes), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    imdb_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    tmdb_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    imdb_votes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    tmdb_votes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    popularity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    overview: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tagline: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    genres: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    poster: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    backdrop: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    total_seasons: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_episodes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    links: Mapped[list[Link]] = relationship(back_populates="media")
    watchlists: Mapped[list[Watchlist]] = relationship(back_populates="media")
    comments: Mapped[list[Comment]] = relationship(back_populates="media")
