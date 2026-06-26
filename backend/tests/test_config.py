from __future__ import annotations

from alnadara.config import _normalize_db_url


def test_normalize_db_url_easypanel_style() -> None:
    raw = "postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable"
    assert (
        _normalize_db_url(raw)
        == "postgresql+asyncpg://alnadara:alnadara@alnadara_database:5432/alnadara"
    )


def test_normalize_db_url_postgresql_scheme() -> None:
    raw = "postgresql://user:pass@host:5432/db"
    assert _normalize_db_url(raw) == "postgresql+asyncpg://user:pass@host:5432/db"


def test_normalize_db_url_keeps_other_query() -> None:
    raw = "postgres://u:p@h:5432/d?application_name=alnadara&sslmode=disable"
    assert _normalize_db_url(raw) == "postgresql+asyncpg://u:p@h:5432/d?application_name=alnadara"
