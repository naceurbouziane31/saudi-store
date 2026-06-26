from __future__ import annotations

import asyncio
import contextlib
from dataclasses import dataclass
from typing import Any

import httpx

from ..config import Settings
from ..logging import get_logger
from ..models import Order

log = get_logger("services.codnetwork")


@dataclass
class CodNetworkResult:
    external_id: str | None
    status: str
    raw: dict[str, Any]
    ok: bool
    detail: str | None = None


class CodNetworkClient:
    """COD Network adapter.

    The exact create-order schema is not publicly indexable; this adapter
    builds a sensible payload that matches the patterns described in
    docs/16-codnetwork-integration.md. When the real API key + dashboard
    access are provided, this file is the ONLY place that needs to be
    adjusted — the rest of the system is shielded.
    """

    def __init__(self, settings: Settings, http: httpx.AsyncClient | None = None) -> None:
        self.settings = settings
        self.base = settings.codnetwork_api_base.rstrip("/")
        self.token = settings.codnetwork_api_key
        self.outlet_id = settings.codnetwork_brand_id
        self.mode = settings.codnetwork_mode
        self._http = http

    @property
    def is_mock(self) -> bool:
        return self.settings.is_codnetwork_mock

    def _payload(self, order: Order) -> dict[str, Any]:
        return {
            "external_reference": order.order_ref,
            "store": {
                "name": "Al Nadara",
                "domain": "alnadara.shop",
                **({"outlet_id": self.outlet_id} if self.outlet_id else {}),
            },
            "customer": {
                "name": order.customer_name,
                "phone": order.customer_phone_e164,
                "country": "KW",
            },
            "shipping_address": None,
            "items": [
                {
                    "sku": i.sku,
                    "name_ar": i.title_ar,
                    "quantity": 1,
                    "bundle_size": i.bundle_size,
                    "unit_price": float(i.unit_price_kwd),
                    "line_total": float(i.line_total_kwd),
                    "currency": "KWD",
                }
                for i in order.items
            ],
            "totals": {
                "subtotal": float(order.subtotal_kwd),
                "upsell": float(order.upsell_total_kwd),
                "shipping": float(order.shipping_kwd),
                "grand_total": float(order.grand_total_kwd),
                "currency": "KWD",
            },
            "payment": {"method": "cod"},
            "metadata": {
                "utm_source": order.utm_source,
                "utm_medium": order.utm_medium,
                "utm_campaign": order.utm_campaign,
                "utm_content": order.utm_content,
                "landing_url": order.landing_url,
                "referrer": order.referrer,
            },
        }

    def _url(self) -> str:
        return f"{self.base}/v1/{'leads' if self.mode == 'lead' else 'orders'}"

    def _headers(self) -> dict[str, str]:
        # COD Network's docs show both Bearer and X-API-Key style auth depending
        # on the dashboard generation date. Default to Authorization: Bearer …
        # and let the operator flip to X-API-Key if their dashboard says so.
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def create_order(self, order: Order) -> CodNetworkResult:
        payload = self._payload(order)
        if self.is_mock:
            external_id = f"mock-{order.order_ref}"
            log.info("codnetwork.mock.create_order", order_ref=order.order_ref)
            return CodNetworkResult(
                external_id=external_id, status="confirmed", raw={"mock": True}, ok=True
            )

        assert self._http is not None, "http client must be injected for live mode"
        last_error: str | None = None
        for attempt, delay in enumerate([0, 1.0, 3.0, 9.0]):  # 4 attempts with backoff
            if delay:
                await asyncio.sleep(delay)
            try:
                resp = await self._http.post(
                    self._url(), json=payload, headers=self._headers(), timeout=10.0
                )
            except httpx.HTTPError as e:
                last_error = f"network error: {e}"
                log.warning(
                    "codnetwork.network_error",
                    order_ref=order.order_ref,
                    attempt=attempt + 1,
                    error=last_error,
                )
                continue
            if 200 <= resp.status_code < 300:
                data: dict[str, Any] = {}
                with contextlib.suppress(ValueError):
                    data = resp.json()
                external_id = data.get("id") or data.get("reference") or order.order_ref
                return CodNetworkResult(
                    external_id=str(external_id),
                    status=str(data.get("status", "pending")),
                    raw=data,
                    ok=True,
                )
            if 400 <= resp.status_code < 500:
                detail = resp.text[:500]
                log.error(
                    "codnetwork.client_error",
                    order_ref=order.order_ref,
                    status=resp.status_code,
                    body=detail,
                )
                return CodNetworkResult(
                    external_id=None,
                    status="failed",
                    raw={"status": resp.status_code, "body": detail},
                    ok=False,
                    detail=detail,
                )
            last_error = f"http {resp.status_code}: {resp.text[:300]}"

        return CodNetworkResult(
            external_id=None,
            status="failed",
            raw={"error": last_error},
            ok=False,
            detail=last_error,
        )


__all__ = ["CodNetworkClient", "CodNetworkResult"]
