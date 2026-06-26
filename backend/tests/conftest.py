from __future__ import annotations

import asyncio
import os
import sys
from collections.abc import AsyncIterator
from pathlib import Path

os.environ["APP_ENV"] = "test"
os.environ["DEBUG"] = "true"
os.environ["SECRET_KEY"] = "test"
os.environ["INTERNAL_API_KEY"] = "test"
os.environ["CODNETWORK_API_KEY"] = "mock"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000"

_TEST_DB = Path("test.sqlite3")
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_TEST_DB.resolve()}"

import pytest  # noqa: E402

from alnadara.config import get_settings  # noqa: E402

get_settings.cache_clear()


@pytest.fixture(scope="session", autouse=True)
def _prepare_database() -> None:
    """Run alembic migrations + seed once for the whole test session."""
    if _TEST_DB.exists():
        _TEST_DB.unlink()

    from alembic import command
    from alembic.config import Config

    cfg_path = Path(__file__).resolve().parents[1] / "alembic.ini"
    cfg = Config(str(cfg_path))
    cfg.set_main_option("script_location", str(cfg_path.parent / "alembic"))
    sys.path.insert(0, str(cfg_path.parent / "src"))
    command.upgrade(cfg, "head")

    from alnadara.db import get_sessionmaker
    from alnadara.seed.products_seed import seed_catalog

    async def _seed() -> None:
        sm = get_sessionmaker()
        async with sm() as session:
            await seed_catalog(session)

    asyncio.run(_seed())
    yield
    if _TEST_DB.exists():
        _TEST_DB.unlink()


@pytest.fixture
async def client() -> AsyncIterator[object]:
    from httpx import ASGITransport, AsyncClient

    from alnadara.main import create_app

    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
