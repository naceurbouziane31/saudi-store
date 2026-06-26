from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ...config import Settings, get_settings
from ...db import get_session
from ...logging import get_logger
from ...schemas.tracking import PlatformResult, TrackingEventIn, TrackingResponse
from ...services.capi._common import CapiContent, CapiPayload, CapiUser
from ...services.capi.dispatch import dispatch_capi

log = get_logger("api.tracking")
router = APIRouter(prefix="/v1/tracking", tags=["tracking"])


def _client_ip(req: Request) -> str | None:
    xff = req.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return req.client.host if req.client else None


@router.post("/event", response_model=TrackingResponse)
async def post_tracking_event(
    payload: TrackingEventIn,
    request: Request,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> TrackingResponse:
    ids = payload.event_ids or {}
    ip = payload.user.ip or _client_ip(request)
    ua = payload.user.user_agent or request.headers.get("user-agent")
    contents = [
        CapiContent(
            sku=c.id,
            title=c.id,  # frontend doesn't always send a title for pre-purchase events
            quantity=c.quantity,
            unit_price_kwd=Decimal(str(c.item_price)),
        )
        for c in payload.custom.contents
    ]
    capi = CapiPayload(
        event_name=payload.event_name,
        event_time_unix=payload.event_time_unix,
        event_source_url=payload.event_source_url,
        event_id_meta=ids.get("meta"),
        event_id_tiktok=ids.get("tiktok"),
        event_id_snap=ids.get("snap"),
        order_ref=payload.custom.order_id,
        value_kwd=Decimal(str(payload.custom.value)),
        currency=payload.custom.currency,
        contents=contents,
        user=CapiUser(
            ip=ip,
            user_agent=ua,
            fbp=payload.user.fbp,
            fbc=payload.user.fbc,
            ttp=payload.user.ttp,
            ttclid=payload.user.ttclid,
            scid=payload.user.scid,
            sccid=payload.user.sccid,
            phone_e164=payload.user.phone_e164,
            email=payload.user.email,
        ),
    )
    reference = payload.custom.order_id or (
        ids.get("meta") or ids.get("tiktok") or ids.get("snap") or "anon"
    )
    results = await dispatch_capi(settings, session, payload=capi, reference=reference)
    return TrackingResponse(
        results={
            r.platform: PlatformResult(
                status=r.status if r.status in {"ok", "failed", "skipped"} else "failed",
                detail=r.detail,
            )
            for r in results
        }
    )


__all__ = ["router"]
