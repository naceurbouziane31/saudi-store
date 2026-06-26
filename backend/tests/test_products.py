from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_list_products_returns_three(client) -> None:
    resp = await client.get("/v1/products")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["products"]) == 3
    slugs = {p["slug"] for p in body["products"]}
    assert slugs == {
        "nature-bounty-collagen-gummies",
        "sakura-japanese-shampoo",
        "overnight-collagen-mask",
    }
    # Variants returned for catalog browsing must exclude upsell offers.
    for p in body["products"]:
        skus = {v["sku"] for v in p["variants"]}
        assert len(skus) == 3
        assert not any(s.startswith("UPS-") for s in skus)


@pytest.mark.asyncio
async def test_get_product_by_slug(client) -> None:
    resp = await client.get("/v1/products/sakura-japanese-shampoo")
    assert resp.status_code == 200
    body = resp.json()
    assert body["slug"] == "sakura-japanese-shampoo"
    assert any(v["sku"] == "SHA-2" for v in body["variants"])


@pytest.mark.asyncio
async def test_get_product_unknown(client) -> None:
    resp = await client.get("/v1/products/does-not-exist")
    assert resp.status_code == 404
