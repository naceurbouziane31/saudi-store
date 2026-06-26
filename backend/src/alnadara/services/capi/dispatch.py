from __future__ import annotations

from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...config import Settings
from ...logging import get_logger
from ...models.event_log import EventLog
from ._common import CapiPayload, DispatchResult
from .meta import MetaCapiClient
from .snap import SnapCapiClient
from .tiktok import TikTokCapiClient

log = get_logger("capi.dispatch")


async def dispatch_capi(
    settings: Settings,
    session: AsyncSession,
    *,
    payload: CapiPayload,
    reference: str,
) -> list[DispatchResult]:
    """Fan-out a single canonical event to Meta + TikTok + Snap.

    Idempotency hint: callers pass `reference = order_ref` (for Purchase) or a
    `session_id-event_name` for pre-purchase events. We record one row per
    platform attempt in `event_log` so failed sends can be replayed.
    """
    async with httpx.AsyncClient() as http:
        meta_client = MetaCapiClient(settings, http)
        tt_client = TikTokCapiClient(settings, http)
        snap_client = SnapCapiClient(settings, http)
        results = [
            await meta_client.send(payload),
            await tt_client.send(payload),
            await snap_client.send(payload),
        ]

    for r in results:
        if await _already_logged_ok(session, payload.event_name, reference, r.platform):
            continue
        session.add(
            EventLog(
                event_type=f"capi.{r.platform}.{payload.event_name}",
                reference=reference,
                payload={
                    "platform": r.platform,
                    "event": payload.event_name,
                    "http_status": r.http_status,
                    "detail": r.detail,
                },
                status={"ok": "sent", "skipped": "skipped"}.get(r.status, "failed"),
                attempts=1,
                last_error=r.detail if r.status == "failed" else None,
            )
        )
    await session.commit()
    return results


async def _already_logged_ok(
    session: AsyncSession,
    event_name: str,
    reference: str,
    platform: str,
) -> bool:
    stmt = select(EventLog.id).where(
        EventLog.event_type == f"capi.{platform}.{event_name}",
        EventLog.reference == reference,
        EventLog.status == "sent",
    )
    return (await session.scalar(stmt)) is not None


def build_purchase_payload_from_order(
    order: Any,
    event_ids: dict[str, str] | None,
    event_time_unix: int,
    site_url: str | None,
) -> CapiPayload:
    from decimal import Decimal

    from ._common import CapiContent, CapiUser

    contents = [
        CapiContent(
            sku=i.sku,
            title=i.title_ar,
            quantity=1,
            unit_price_kwd=Decimal(i.unit_price_kwd),
        )
        for i in order.items
    ]
    ids = event_ids or {}
    return CapiPayload(
        event_name="purchase",
        event_time_unix=event_time_unix,
        event_source_url=(
            f"{site_url.rstrip('/')}/thank-you?order={order.order_ref}" if site_url else None
        ),
        event_id_meta=ids.get("meta"),
        event_id_tiktok=ids.get("tiktok"),
        event_id_snap=ids.get("snap"),
        order_ref=order.order_ref,
        value_kwd=Decimal(order.grand_total_kwd),
        contents=contents,
        user=CapiUser(
            ip=order.ip_address,
            user_agent=order.user_agent,
            fbp=order.fbp,
            fbc=order.fbc,
            ttp=order.ttp,
            ttclid=order.ttclid,
            scid=order.scid,
            sccid=order.sccid,
            phone_e164=order.customer_phone_e164,
            first_name=order.customer_name.split(" ")[0] if order.customer_name else None,
        ),
    )


__all__ = [
    "build_purchase_payload_from_order",
    "dispatch_capi",
]
