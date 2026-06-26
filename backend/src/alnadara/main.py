from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .api.v1 import health as health_v1
from .config import Settings, get_settings
from .logging import configure_logging, get_logger

log = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    log.info("api.starting", env=app.state.settings.app_env)
    yield
    log.info("api.stopping")


def create_app(settings: Settings | None = None) -> FastAPI:
    s = settings or get_settings()
    configure_logging(debug=s.debug)

    app = FastAPI(
        title="Al Nadara API",
        version="1.0.0",
        docs_url="/docs" if s.debug else None,
        redoc_url=None,
        openapi_url="/openapi.json" if s.debug else None,
        lifespan=lifespan,
    )
    app.state.settings = s

    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.allowed_origins_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Idempotency-Key",
            "X-Request-Id",
            "X-Pixel-Browser-Id",
            "X-Pixel-Click-Id",
        ],
    )
    app.add_middleware(GZipMiddleware, minimum_size=1024)

    app.include_router(health_v1.router)

    return app


app = create_app()

__all__ = ["app", "create_app"]
