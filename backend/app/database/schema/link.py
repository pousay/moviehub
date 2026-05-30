from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Link(Base):
    __tablename__ = "links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    season: Mapped[int] = mapped_column(Integer, nullable=True)  # None for movies
    episode: Mapped[int] = mapped_column(Integer, nullable=True)  # None for movies

    media: Mapped["Media"] = relationship(back_populates="links")
