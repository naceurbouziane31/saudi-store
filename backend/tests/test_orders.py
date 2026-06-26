from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_create_order_happy_path(client) -> None:
    payload = {
        "customer": {"name": "نورة العجمي", "phone": "50001234"},
        "items": [{"sku": "GUM-2", "qty": 1}],
    }
    resp = await client.post("/v1/orders", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["order_ref"].startswith("NAD-")
    assert body["status"] == "pending"
    assert body["currency"] == "KWD"
    assert body["payment_method"] == "cod"
    assert float(body["subtotal_kwd"]) == 29.0
    assert float(body["grand_total_kwd"]) == 29.0
    assert body["items"][0]["sku"] == "GUM-2"


@pytest.mark.asyncio
async def test_create_order_unknown_sku(client) -> None:
    payload = {
        "customer": {"name": "نورة", "phone": "50001234"},
        "items": [{"sku": "XYZ-1", "qty": 1}],
    }
    resp = await client.post("/v1/orders", json=payload)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_order_invalid_phone(client) -> None:
    payload = {
        "customer": {"name": "نورة", "phone": "40001234"},
        "items": [{"sku": "GUM-1", "qty": 1}],
    }
    resp = await client.post("/v1/orders", json=payload)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_honeypot_silently_accepted(client) -> None:
    payload = {
        "customer": {"name": "نورة", "phone": "50001234"},
        "items": [{"sku": "GUM-1", "qty": 1}],
        "honeypot": "i-am-a-bot",
    }
    resp = await client.post("/v1/orders", json=payload)
    assert resp.status_code == 200
    body = resp.json()
    assert body["order_ref"] == "HP-IGNORED"


@pytest.mark.asyncio
async def test_upsell_once_then_conflict(client) -> None:
    create = await client.post(
        "/v1/orders",
        json={
            "customer": {"name": "دانة", "phone": "50009999"},
            "items": [{"sku": "GUM-1", "qty": 1}],
        },
    )
    assert create.status_code == 200, create.text
    ref = create.json()["order_ref"]

    first = await client.post(f"/v1/orders/{ref}/upsell", json={"sku": "UPS-9-MAS"})
    assert first.status_code == 200, first.text
    assert float(first.json()["upsell_total_kwd"]) == 9.0
    assert float(first.json()["grand_total_kwd"]) == 28.0  # 19 base + 9 upsell

    second = await client.post(f"/v1/orders/{ref}/upsell", json={"sku": "UPS-9-MAS"})
    assert second.status_code == 409


@pytest.mark.asyncio
async def test_upsell_unknown_order(client) -> None:
    resp = await client.post("/v1/orders/NAD-2026-000000/upsell", json={"sku": "UPS-9-GUM"})
    assert resp.status_code == 404
