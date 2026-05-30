from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Watchlist(Base):
    __tablename__ = "watchlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="watchlist")
    media: Mapped["Media"] = relationship(back_populates="watchlists")
