from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

import httpx

from ..config import Settings
from ..logging import get_logger
from ..models import Order

log = get_logger("services.sheets")


@dataclass
class SheetsResult:
    ok: bool
    detail: str | None = None


class SheetsWebhookClient:
    def __init__(self, settings: Settings, http: httpx.AsyncClient | None = None) -> None:
        self.settings = settings
        self._http = http

    @property
    def enabled(self) -> bool:
        return bool(self.settings.sheets_webhook_url and self.settings.sheets_webhook_secret)

    def _body(self, order: Order, notes: str = "") -> dict[str, Any]:
        return {
            "order_ref": order.order_ref,
            "status": order.status,
            "customer_name": order.customer_name,
            "customer_phone": order.customer_phone_e164,
            "items": [
                {
                    "sku": i.sku,
                    "title_ar": i.title_ar,
                    "qty": i.bundle_size,
                    "line_total_kwd": float(i.line_total_kwd),
                    "is_upsell": bool(i.is_upsell),
                }
                for i in order.items
            ],
            "subtotal_kwd": float(order.subtotal_kwd),
            "upsell_total_kwd": float(order.upsell_total_kwd),
            "shipping_kwd": float(order.shipping_kwd),
            "grand_total_kwd": float(order.grand_total_kwd),
            "currency": order.currency,
            "utm": {
                "source": order.utm_source,
                "medium": order.utm_medium,
                "campaign": order.utm_campaign,
                "content": order.utm_content,
            },
            "landing_url": order.landing_url,
            "referrer": order.referrer,
            "codnetwork_status": order.codnetwork_status,
            "notes": notes,
        }

    async def push(self, order: Order, notes: str = "") -> SheetsResult:
        if not self.enabled:
            return SheetsResult(ok=False, detail="sheets webhook not configured")
        assert self._http is not None, "http client required"

        url = self.settings.sheets_webhook_url
        params = {"secret": self.settings.sheets_webhook_secret}
        body = self._body(order, notes=notes)
        last_error: str | None = None
        for attempt, delay in enumerate([0, 1.0, 3.0]):
            if delay:
                await asyncio.sleep(delay)
            try:
                resp = await self._http.post(
                    url, params=params, json=body, timeout=10.0, follow_redirects=True
                )
            except httpx.HTTPError as e:
                last_error = f"network error: {e}"
                log.warning(
                    "sheets.network_error",
                    order_ref=order.order_ref,
                    attempt=attempt + 1,
                    error=last_error,
                )
                continue
            if 200 <= resp.status_code < 300:
                try:
                    parsed = resp.json()
                except ValueError:
                    parsed = {}
                if isinstance(parsed, dict) and parsed.get("ok") is False:
                    last_error = str(parsed)
                    log.warning(
                        "sheets.app_script_error",
                        order_ref=order.order_ref,
                        detail=last_error,
                    )
                    continue
                order.sheets_webhook_sent_at = datetime.now(UTC).isoformat()
                order.sheets_webhook_status = "ok"
                return SheetsResult(ok=True)
            last_error = f"http {resp.status_code}: {resp.text[:300]}"
        order.sheets_webhook_status = "failed"
        return SheetsResult(ok=False, detail=last_error)


__all__ = ["SheetsResult", "SheetsWebhookClient"]
