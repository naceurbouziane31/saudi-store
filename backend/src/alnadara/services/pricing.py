from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Product, ProductVariant


class PricingError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class PricedLine:
    sku: str
    title_ar: str
    bundle_size: int
    unit_price_kwd: Decimal
    line_total_kwd: Decimal
    product_id: int
    variant_id: int
    is_upsell: bool


@dataclass(frozen=True)
class PricedOrder:
    items: list[PricedLine]
    subtotal_kwd: Decimal
    upsell_total_kwd: Decimal
    shipping_kwd: Decimal
    grand_total_kwd: Decimal


async def price_skus(
    session: AsyncSession,
    skus: Iterable[str],
) -> PricedOrder:
    sku_list = [s.upper() for s in skus]
    if not sku_list:
        raise PricingError("EMPTY_CART", "Cart is empty.")

    stmt = (
        select(ProductVariant, Product)
        .join(Product, Product.id == ProductVariant.product_id)
        .where(ProductVariant.sku.in_(sku_list), ProductVariant.is_active.is_(True))
    )
    rows = (await session.execute(stmt)).all()
    found = {variant.sku: (variant, product) for variant, product in rows}

    missing = [s for s in sku_list if s not in found]
    if missing:
        raise PricingError("SKU_NOT_FOUND", f"Unknown SKU(s): {', '.join(missing)}")

    priced: list[PricedLine] = []
    subtotal = Decimal("0.000")
    upsell_total = Decimal("0.000")
    for sku in sku_list:
        variant, product = found[sku]
        if variant.stock_qty is not None and variant.stock_qty <= 0:
            raise PricingError("OUT_OF_STOCK", f"Out of stock: {sku}")
        line_total = Decimal(variant.price_kwd).quantize(Decimal("0.001"))
        unit = (line_total / Decimal(variant.bundle_size)).quantize(Decimal("0.001"))
        priced.append(
            PricedLine(
                sku=variant.sku,
                title_ar=product.title_ar,
                bundle_size=variant.bundle_size,
                unit_price_kwd=unit,
                line_total_kwd=line_total,
                product_id=product.id,
                variant_id=variant.id,
                is_upsell=bool(variant.is_upsell_offer),
            )
        )
        if variant.is_upsell_offer:
            upsell_total += line_total
        else:
            subtotal += line_total

    shipping = Decimal("0.000")
    grand_total = subtotal + upsell_total + shipping
    return PricedOrder(
        items=priced,
        subtotal_kwd=subtotal,
        upsell_total_kwd=upsell_total,
        shipping_kwd=shipping,
        grand_total_kwd=grand_total,
    )
