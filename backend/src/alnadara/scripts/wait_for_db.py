from __future__ import annotations

import asyncio
import sys

from sqlalchemy import text

from ..config import get_settings
from ..db import get_sessionmaker


async def _ping() -> None:
    sm = get_sessionmaker()
    async with sm() as s:
        await s.execute(text("SELECT 1"))


async def wait(max_attempts: int = 30, delay_seconds: float = 1.5) -> None:
    last_error: Exception | None = None
    for attempt in range(1, max_attempts + 1):
        try:
            await _ping()
            print(f"[wait_for_db] connected on attempt {attempt}", flush=True)
            return
        except Exception as e:
            last_error = e
            print(
                f"[wait_for_db] attempt {attempt}/{max_attempts} failed: {e!r}",
                flush=True,
            )
            await asyncio.sleep(delay_seconds)
    raise SystemExit(f"DB unreachable after {max_attempts} attempts: {last_error!r}")


def main() -> int:
    get_settings()
    asyncio.run(wait())
    return 0


if __name__ == "__main__":
    sys.exit(main())
