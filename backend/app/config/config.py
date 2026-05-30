from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

path = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=path)


settings = Settings()

__all__ = ["settings"]
