from __future__ import annotations

from typing import Any

import httpx

from ...config import Settings
from ...logging import get_logger
from ._common import CANONICAL_TO_META, CapiPayload, DispatchResult
from .hashing import hash_email, hash_phone_meta

log = get_logger("capi.meta")

GRAPH_URL = "https://graph.facebook.com/v18.0/{pixel_id}/events"


class MetaCapiClient:
    def __init__(self, settings: Settings, http: httpx.AsyncClient) -> None:
        self.settings = settings
        self.http = http

    def _user_data(self, p: CapiPayload) -> dict[str, Any]:
        u = p.user
        data: dict[str, Any] = {}
        if u.phone_e164:
            data["ph"] = [hash_phone_meta(u.phone_e164)]
        if u.email:
            data["em"] = [hash_email(u.email)]
        if u.ip:
            data["client_ip_address"] = u.ip
        if u.user_agent:
            data["client_user_agent"] = u.user_agent
        if u.fbp:
            data["fbp"] = u.fbp
        if u.fbc:
            data["fbc"] = u.fbc
        return data

    def _custom_data(self, p: CapiPayload) -> dict[str, Any]:
        return {
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
            "content_type": "product",
            **({"order_id": p.order_ref} if p.order_ref else {}),
        }

    def build_payload(self, p: CapiPayload) -> dict[str, Any]:
        event_name = CANONICAL_TO_META.get(p.event_name, p.event_name)
        event: dict[str, Any] = {
            "event_name": event_name,
            "event_time": p.event_time_unix,
            "action_source": "website",
            "user_data": self._user_data(p),
            "custom_data": self._custom_data(p),
        }
        if p.event_id_meta:
            event["event_id"] = p.event_id_meta
        if p.event_source_url:
            event["event_source_url"] = p.event_source_url
        body: dict[str, Any] = {"data": [event]}
        if self.settings.meta_test_event_code:
            body["test_event_code"] = self.settings.meta_test_event_code
        return body

    async def send(self, payload: CapiPayload) -> DispatchResult:
        if not self.settings.meta_pixel_id or not self.settings.meta_capi_access_token:
            return DispatchResult(
                platform="meta", status="skipped", detail="meta credentials not set"
            )
        url = GRAPH_URL.format(pixel_id=self.settings.meta_pixel_id)
        params = {"access_token": self.settings.meta_capi_access_token}
        body = self.build_payload(payload)
        try:
            resp = await self.http.post(url, params=params, json=body, timeout=8.0)
        except httpx.HTTPError as e:
            log.warning("capi.meta.network_error", error=str(e))
            return DispatchResult(platform="meta", status="failed", detail=str(e))
        ok = 200 <= resp.status_code < 300
        return DispatchResult(
            platform="meta",
            status="ok" if ok else "failed",
            http_status=resp.status_code,
            detail=None if ok else resp.text[:500],
        )
