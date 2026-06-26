from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _normalize_db_url(raw: str) -> str:
    """Normalize an EasyPanel/Postgres-style URL to a SQLAlchemy async URL.

    `postgres://user:pass@host:5432/db?sslmode=disable`
    becomes
    `postgresql+asyncpg://user:pass@host:5432/db`
    """
    url = raw
    if url.startswith("postgres://"):
        url = "postgresql+asyncpg://" + url[len("postgres://") :]
    elif url.startswith("postgresql://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://") :]
    if "?sslmode=disable" in url:
        url = url.replace("?sslmode=disable", "")
    if "&sslmode=disable" in url:
        url = url.replace("&sslmode=disable", "")
    return url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- App ---
    app_env: Literal["development", "staging", "production", "test"] = "production"
    debug: bool = False
    secret_key: str = "change-me"

    # --- HTTP ---
    allowed_origins: str = "https://alnadara.shop"
    internal_api_key: str = "change-me"

    # --- DB ---
    database_url: str = (
        "postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable"
    )

    # --- COD Network ---
    codnetwork_api_base: str = "https://api.codnetwork.com"
    codnetwork_api_key: str = ""
    codnetwork_brand_id: str = ""
    codnetwork_mode: Literal["lead", "order"] = "lead"
    codnetwork_webhook_secret: str = ""

    # --- Meta ---
    meta_pixel_id: str = ""
    meta_capi_access_token: str = ""
    meta_test_event_code: str = ""

    # --- TikTok ---
    tiktok_pixel_id: str = ""
    tiktok_capi_access_token: str = ""

    # --- Snap ---
    snap_pixel_id: str = ""
    snap_capi_access_token: str = ""

    # --- Sheets ---
    sheets_webhook_url: str = ""
    sheets_webhook_secret: str = ""

    # --- Notifications ---
    whatsapp_support_number: str = "+96550001234"
    support_email: str = "support@alnadara.shop"

    # --- Misc ---
    site_url: str = "https://alnadara.shop"

    @field_validator("database_url", mode="after")
    @classmethod
    def normalize_db(cls, v: str) -> str:
        return _normalize_db_url(v)

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def is_codnetwork_mock(self) -> bool:
        return self.codnetwork_api_key.strip().lower() in {"", "mock"}


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


__all__ = ["Settings", "get_settings"]
