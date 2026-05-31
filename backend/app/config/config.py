from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

path = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_EXP_HOURS: int
    REFRESH_EXP_DAYS: int

    model_config = SettingsConfigDict(env_file=path)


settings = Settings()

__all__ = ["settings"]
