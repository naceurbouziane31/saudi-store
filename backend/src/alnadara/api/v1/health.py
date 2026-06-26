from __future__ import annotations

from fastapi import APIRouter, Response
from sqlalchemy import text

from ...db import get_sessionmaker

router = APIRouter(tags=["health"])


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok", "version": "1.0.0"}


@router.get("/readyz")
async def readyz(response: Response) -> dict[str, str]:
    sm = get_sessionmaker()
    try:
        async with sm() as s:
            await s.execute(text("SELECT 1"))
    except Exception:
        response.status_code = 503
        return {"status": "degraded", "db": "down"}
    return {"status": "ok", "db": "ok"}


__all__ = ["router"]
