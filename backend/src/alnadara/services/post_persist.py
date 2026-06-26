from __future__ import annotations

import time
from typing import TYPE_CHECKING, Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..db import get_sessionmaker
from ..logging import get_logger
from ..models import EventLog, Order
from .capi.dispatch import build_purchase_payload_from_order, dispatch_capi
from .codnetwork import CodNetworkClient
from .sheets_webhook import SheetsWebhookClient

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

log = get_logger("post_persist")


async def _load_order(session: AsyncSession, order_ref: str) -> Order | None:
    from sqlalchemy.orm import selectinload

    stmt = select(Order).where(Order.order_ref == order_ref).options(selectinload(Order.items))
    result: Order | None = await session.scalar(stmt)
    return result


async def _record_event(
    session: AsyncSession,
    *,
    event_type: str,
    reference: str,
    payload: dict[str, Any],
    ok: bool,
    detail: str | None,
) -> None:
    session.add(
        EventLog(
            event_type=event_type,
            reference=reference,
            payload=payload,
            status="sent" if ok else "failed",
            attempts=1,
            last_error=detail if not ok else None,
        )
    )
    await session.commit()


async def run_order_pipeline(order_ref: str) -> None:
    """Background task: COD Network → Google Sheets → Meta/TikTok/Snap CAPI.

    Safe to retry — each downstream integration writes its outcome to
    `event_log` so manual replay (PR for admin endpoints, v1.1) can detect
    and avoid duplicates.
    """
    settings = get_settings()
    sm = get_sessionmaker()
    async with sm() as session:
        order = await _load_order(session, order_ref)
        if order is None:
            log.warning("post_persist.order_missing", order_ref=order_ref)
            return

        async with httpx.AsyncClient() as http:
            # 1) COD Network
            cod = CodNetworkClient(settings, http=http)
            cod_result = await cod.create_order(order)
            if cod_result.ok:
                order.codnetwork_order_id = cod_result.external_id
                order.codnetwork_status = cod_result.status
            await _record_event(
                session,
                event_type="codnetwork.create_order",
                reference=order_ref,
                payload={
                    "ok": cod_result.ok,
                    "external_id": cod_result.external_id,
                    "status": cod_result.status,
                },
                ok=cod_result.ok,
                detail=cod_result.detail,
            )

            # 2) Sheets
            sheets = SheetsWebhookClient(settings, http=http)
            if sheets.enabled:
                s_result = await sheets.push(order)
                await session.flush()
                await _record_event(
                    session,
                    event_type="sheets.webhook",
                    reference=order_ref,
                    payload={"ok": s_result.ok},
                    ok=s_result.ok,
                    detail=s_result.detail,
                )

        # 3) CAPI fan-out (Meta/TikTok/Snap Purchase)
        event_ids: dict[str, str] = order.event_ids or {}
        if not event_ids:
            event_ids = {
                "meta": f"meta-pur-{order_ref}",
                "tiktok": f"tiktok-pur-{order_ref}",
                "snap": f"snap-pur-{order_ref}",
            }
        payload = build_purchase_payload_from_order(
            order=order,
            event_ids=event_ids,
            event_time_unix=int(time.time()),
            site_url=settings.site_url,
        )
        await dispatch_capi(settings, session, payload=payload, reference=order_ref)
        log.info("post_persist.done", order_ref=order_ref)


def background_pipeline_factory() -> Callable[[str], Awaitable[None]]:
    return run_order_pipeline


__all__ = ["background_pipeline_factory", "run_order_pipeline"]
