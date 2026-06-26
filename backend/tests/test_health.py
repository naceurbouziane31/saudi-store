from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_healthz_returns_ok(client) -> None:
    resp = await client.get("/healthz")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert "version" in body
