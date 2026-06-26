from __future__ import annotations

from typing import Any

import httpx

from ...config import Settings
from ...logging import get_logger
from ._common import CANONICAL_TO_SNAP, CapiPayload, DispatchResult
from .hashing import hash_email, hash_ip, hash_name, hash_phone_snap

log = get_logger("capi.snap")

SNAP_URL = "https://tr.snapchat.com/v3/{pixel_id}/events"


class SnapCapiClient:
    def __init__(self, settings: Settings, http: httpx.AsyncClient) -> None:
        self.settings = settings
        self.http = http

    def _user(self, p: CapiPayload) -> dict[str, Any]:
        u = p.user
        out: dict[str, Any] = {}
        if u.phone_e164:
            out["ph"] = [hash_phone_snap(u.phone_e164)]
        if u.email:
            out["em"] = [hash_email(u.email)]
        if u.first_name:
            out["fn"] = [hash_name(u.first_name)]
        if u.ip:
            out["hashed_ip_address"] = hash_ip(u.ip)
        if u.user_agent:
            out["user_agent"] = u.user_agent
        if u.scid:
            out["sc_cookie1"] = u.scid
        if u.sccid:
            out["sc_click_id"] = u.sccid
        return out

    def build_payload(self, p: CapiPayload) -> dict[str, Any]:
        event_name = CANONICAL_TO_SNAP.get(p.event_name, p.event_name.upper())
        event: dict[str, Any] = {
            "event_name": event_name,
            "event_time": p.event_time_unix,
            "action_source": "web",
            "user_data": self._user(p),
            "custom_data": {
                "currency": p.currency,
                "value": float(p.value_kwd),
                "contents": [
                    {
                        "id": c.sku,
                        "quantity": c.quantity,
                        "item_price": float(c.unit_price_kwd),
                    }
                    for c in p.contents
                ],
                "content_category": "Beauty",
                **({"transaction_id": p.order_ref, "order_id": p.order_ref} if p.order_ref else {}),
            },
        }
        if p.event_id_snap:
            event["event_id"] = p.event_id_snap
        if p.event_source_url:
            event["event_source_url"] = p.event_source_url
        return {"data": [event]}

    async def send(self, payload: CapiPayload) -> DispatchResult:
        if not self.settings.snap_pixel_id or not self.settings.snap_capi_access_token:
            return DispatchResult(
                platform="snap", status="skipped", detail="snap credentials not set"
            )
        url = SNAP_URL.format(pixel_id=self.settings.snap_pixel_id)
        params = {"access_token": self.settings.snap_capi_access_token}
        body = self.build_payload(payload)
        try:
            resp = await self.http.post(url, params=params, json=body, timeout=8.0)
        except httpx.HTTPError as e:
            log.warning("capi.snap.network_error", error=str(e))
            return DispatchResult(platform="snap", status="failed", detail=str(e))
        ok = 200 <= resp.status_code < 300
        return DispatchResult(
            platform="snap",
            status="ok" if ok else "failed",
            http_status=resp.status_code,
            detail=None if ok else resp.text[:500],
        )
