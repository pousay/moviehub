# config.py
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from backend.app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)

async_local = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_local() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
