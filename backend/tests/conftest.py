from __future__ import annotations

import os
from collections.abc import AsyncIterator

import pytest

os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("SECRET_KEY", "test")
os.environ.setdefault("INTERNAL_API_KEY", "test")
os.environ.setdefault("CODNETWORK_API_KEY", "mock")
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

# Settings cache must be cleared after env mutation.
from alnadara.config import get_settings

get_settings.cache_clear()


@pytest.fixture
async def client() -> AsyncIterator[object]:
    from httpx import ASGITransport, AsyncClient

    from alnadara.main import create_app

    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
