from __future__ import annotations

from decimal import Decimal

import httpx
import pytest

from alnadara.config import get_settings
from alnadara.services.capi._common import CapiContent, CapiPayload, CapiUser
from alnadara.services.capi.meta import MetaCapiClient
from alnadara.services.capi.snap import SnapCapiClient
from alnadara.services.capi.tiktok import TikTokCapiClient


def _payload() -> CapiPayload:
    return CapiPayload(
        event_name="purchase",
        event_time_unix=1700000000,
        event_id_meta="meta-pur-NAD-2026-000001",
        event_id_tiktok="tiktok-pur-NAD-2026-000001",
        event_id_snap="snap-pur-NAD-2026-000001",
        order_ref="NAD-2026-000001",
        value_kwd=Decimal("38.000"),
        currency="KWD",
        contents=[
            CapiContent(
                sku="GUM-2", title="علكات كولاجين", quantity=1, unit_price_kwd=Decimal("14.500")
            ),
            CapiContent(
                sku="UPS-9-MAS", title="ماسك كولاجين", quantity=1, unit_price_kwd=Decimal("9.000")
            ),
        ],
        user=CapiUser(
            ip="1.2.3.4",
            user_agent="Mozilla/5.0",
            phone_e164="+96550001234",
            fbp="fb.1.1700",
            ttp="tt-1700",
            scid="sc-1700",
        ),
    )


@pytest.mark.asyncio
async def test_meta_payload_shape() -> None:
    settings = get_settings()
    async with httpx.AsyncClient() as http:
        client = MetaCapiClient(settings, http)
        body = client.build_payload(_payload())
    event = body["data"][0]
    assert event["event_name"] == "Purchase"
    assert event["event_id"] == "meta-pur-NAD-2026-000001"
    assert event["action_source"] == "website"
    assert event["custom_data"]["currency"] == "KWD"
    assert event["custom_data"]["value"] == 38.0
    assert event["custom_data"]["order_id"] == "NAD-2026-000001"
    # Meta phone must be a hashed digits-only value, not raw.
    assert event["user_data"]["ph"][0] != "+96550001234"
    assert len(event["user_data"]["ph"][0]) == 64


@pytest.mark.asyncio
async def test_tiktok_payload_shape() -> None:
    settings = get_settings()
    async with httpx.AsyncClient() as http:
        client = TikTokCapiClient(settings, http)
        body = client.build_payload(_payload())
    assert body["event_source"] == "web"
    event = body["data"][0]
    assert event["event"] == "CompletePayment"
    assert event["event_id"] == "tiktok-pur-NAD-2026-000001"
    # TikTok phone hash is of E.164 with '+'.
    assert len(event["user"]["phone_number"]) == 64
    assert event["properties"]["order_id"] == "NAD-2026-000001"


@pytest.mark.asyncio
async def test_snap_payload_shape() -> None:
    settings = get_settings()
    async with httpx.AsyncClient() as http:
        client = SnapCapiClient(settings, http)
        body = client.build_payload(_payload())
    event = body["data"][0]
    assert event["event_name"] == "PURCHASE"  # uppercase
    assert event["event_id"] == "snap-pur-NAD-2026-000001"
    # Snap requires transaction_id = order_id = order_ref.
    assert event["custom_data"]["transaction_id"] == "NAD-2026-000001"
    assert event["custom_data"]["order_id"] == "NAD-2026-000001"


@pytest.mark.asyncio
async def test_clients_skip_when_credentials_missing() -> None:
    settings = get_settings()
    assert settings.meta_capi_access_token == ""
    async with httpx.AsyncClient() as http:
        meta = MetaCapiClient(settings, http)
        result = await meta.send(_payload())
    assert result.status == "skipped"
