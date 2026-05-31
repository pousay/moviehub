from sqlalchemy import Integer, String, Float, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base
import enum
from typing import ForwardRef

Link = ForwardRef("Link")
Watchlist = ForwardRef("Watchlist")
Comment = ForwardRef("Comment")


class MediaType(enum.Enum):
    series = "series"
    movie = "movie"


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(Enum(MediaType), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    detail: Mapped[str] = mapped_column(String(1000), nullable=True)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)  # minutes
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    links: Mapped[list[Link]] = relationship(back_populates="media")
    watchlists: Mapped[list[Watchlist]] = relationship(back_populates="media")
    comments: Mapped[list[Comment]] = relationship(back_populates="media")
