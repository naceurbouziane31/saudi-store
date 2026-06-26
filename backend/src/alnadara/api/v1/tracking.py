from __future__ import annotations

from fastapi import APIRouter

from ...logging import get_logger
from ...schemas.tracking import PlatformResult, TrackingEventIn, TrackingResponse

log = get_logger("api.tracking")
router = APIRouter(prefix="/v1/tracking", tags=["tracking"])


@router.post("/event", response_model=TrackingResponse)
async def post_tracking_event(payload: TrackingEventIn) -> TrackingResponse:
    """Server-side CAPI forwarder.

    PR5 connects this to Meta / TikTok / Snap CAPI clients. For now we acknowledge
    the event so the frontend code path is exercisable end-to-end against the
    real backend.
    """
    log.info(
        "tracking.event.received",
        event_name=payload.event_name,
        ids=list(payload.event_ids.keys()),
    )
    return TrackingResponse(
        results={
            "meta": PlatformResult(status="skipped", detail="capi disabled (PR5)"),
            "tiktok": PlatformResult(status="skipped", detail="capi disabled (PR5)"),
            "snap": PlatformResult(status="skipped", detail="capi disabled (PR5)"),
        }
    )


__all__ = ["router"]
