from __future__ import annotations

import sys

import uvicorn


def main() -> int:
    uvicorn.run(
        "alnadara.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
