from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    fullname: Mapped[str] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=True)
    sex: Mapped[bool] = mapped_column(Boolean, nullable=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)

    user: Mapped["User"] = relationship(back_populates="profile")
