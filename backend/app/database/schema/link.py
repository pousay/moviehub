from sqlalchemy import Integer, String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base
from typing import ForwardRef, Optional
from backend.app.utils import LinkLanguage

Media = ForwardRef("Media")


class Link(Base):
    __tablename__ = "links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"), nullable=False)

    url: Mapped[str] = mapped_column(String(500), nullable=False)
    season: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    quality: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    codec: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    language: Mapped[Optional[str]] = mapped_column(Enum(LinkLanguage), nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    media: Mapped[Media] = relationship(back_populates="links")
