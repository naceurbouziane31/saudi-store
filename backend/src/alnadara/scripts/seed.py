from __future__ import annotations

import asyncio
import sys

from ..logging import configure_logging, get_logger

log = get_logger("seed")


async def run() -> None:
    log.info("seed.start", note="catalog seeding lands with the product models PR")


def main() -> int:
    configure_logging(debug=True)
    asyncio.run(run())
    return 0


if __name__ == "__main__":
    sys.exit(main())
