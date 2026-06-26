from __future__ import annotations

from decimal import Decimal

import pytest

from alnadara.db import get_sessionmaker
from alnadara.services.pricing import PricingError, price_skus


@pytest.mark.asyncio
async def test_price_skus_two_pack_gummies() -> None:
    sm = get_sessionmaker()
    async with sm() as session:
        priced = await price_skus(session, ["GUM-2"])
    assert priced.subtotal_kwd == Decimal("29.000")
    assert priced.grand_total_kwd == Decimal("29.000")
    assert priced.items[0].unit_price_kwd == Decimal("14.500")


@pytest.mark.asyncio
async def test_price_skus_with_upsell() -> None:
    sm = get_sessionmaker()
    async with sm() as session:
        priced = await price_skus(session, ["SHA-3", "UPS-9-MAS"])
    assert priced.subtotal_kwd == Decimal("39.000")
    assert priced.upsell_total_kwd == Decimal("9.000")
    assert priced.grand_total_kwd == Decimal("48.000")


@pytest.mark.asyncio
async def test_price_skus_unknown_raises() -> None:
    sm = get_sessionmaker()
    async with sm() as session:
        with pytest.raises(PricingError) as ei:
            await price_skus(session, ["NOPE-1"])
        assert ei.value.code == "SKU_NOT_FOUND"
