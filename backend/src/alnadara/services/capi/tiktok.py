from __future__ import annotations

from typing import Any

import httpx

from ...config import Settings
from ...logging import get_logger
from ._common import CANONICAL_TO_TIKTOK, CapiPayload, DispatchResult
from .hashing import hash_email, hash_phone_tiktok

log = get_logger("capi.tiktok")

TIKTOK_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


class TikTokCapiClient:
    def __init__(self, settings: Settings, http: httpx.AsyncClient) -> None:
        self.settings = settings
        self.http = http

    def _user(self, p: CapiPayload) -> dict[str, Any]:
        u = p.user
        out: dict[str, Any] = {}
        if u.phone_e164:
            out["phone_number"] = hash_phone_tiktok(u.phone_e164)
        if u.email:
            out["email"] = hash_email(u.email)
        if u.ttp:
            out["ttp"] = u.ttp
        if u.ttclid:
            out["ttclid"] = u.ttclid
        if u.ip:
            out["ip"] = u.ip
        if u.user_agent:
            out["user_agent"] = u.user_agent
        return out

    def build_payload(self, p: CapiPayload) -> dict[str, Any]:
        event_name = CANONICAL_TO_TIKTOK.get(p.event_name, p.event_name)
        data_event: dict[str, Any] = {
            "event": event_name,
            "event_time": p.event_time_unix,
            "user": self._user(p),
            "properties": {
                "currency": p.currency,
                "value": float(p.value_kwd),
                "contents": [
                    {
                        "content_id": c.sku,
                        "content_name": c.title,
                        "quantity": c.quantity,
                        "price": float(c.unit_price_kwd),
                    }
                    for c in p.contents
                ],
                "content_type": "product",
                **({"order_id": p.order_ref} if p.order_ref else {}),
            },
        }
        if p.event_id_tiktok:
            data_event["event_id"] = p.event_id_tiktok
        if p.event_source_url:
            data_event["page"] = {"url": p.event_source_url}
        return {
            "event_source": "web",
            "event_source_id": self.settings.tiktok_pixel_id,
            "data": [data_event],
        }

    async def send(self, payload: CapiPayload) -> DispatchResult:
        if not self.settings.tiktok_pixel_id or not self.settings.tiktok_capi_access_token:
            return DispatchResult(
                platform="tiktok", status="skipped", detail="tiktok credentials not set"
            )
        body = self.build_payload(payload)
        headers = {"Access-Token": self.settings.tiktok_capi_access_token}
        try:
            resp = await self.http.post(TIKTOK_URL, json=body, headers=headers, timeout=8.0)
        except httpx.HTTPError as e:
            log.warning("capi.tiktok.network_error", error=str(e))
            return DispatchResult(platform="tiktok", status="failed", detail=str(e))
        ok = 200 <= resp.status_code < 300
        return DispatchResult(
            platform="tiktok",
            status="ok" if ok else "failed",
            http_status=resp.status_code,
            detail=None if ok else resp.text[:500],
        )
