from __future__ import annotations

import asyncio
import sys

from ..db import get_sessionmaker
from ..logging import configure_logging, get_logger
from ..seed.products_seed import seed_catalog

log = get_logger("seed")


async def run() -> None:
    sm = get_sessionmaker()
    async with sm() as session:
        products_added, variants_added = await seed_catalog(session)
    log.info(
        "seed.done",
        products_added=products_added,
        variants_added=variants_added,
    )


def main() -> int:
    configure_logging(debug=True)
    asyncio.run(run())
    return 0


if __name__ == "__main__":
    sys.exit(main())
