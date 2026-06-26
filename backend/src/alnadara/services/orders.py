from __future__ import annotations

from collections.abc import Iterable
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Order, OrderItem, ProductVariant
from ..utils.ids import generate_order_ref
from .pricing import PricedOrder, PricingError, price_skus


async def _next_unique_order_ref(session: AsyncSession, max_attempts: int = 5) -> str:
    for _ in range(max_attempts):
        candidate = generate_order_ref()
        exists = await session.scalar(select(Order.id).where(Order.order_ref == candidate))
        if exists is None:
            return candidate
    return generate_order_ref()


async def create_order(
    session: AsyncSession,
    *,
    customer_name: str,
    customer_phone_e164: str,
    item_skus: Iterable[str],
    ip_address: str | None = None,
    user_agent: str | None = None,
    meta: dict[str, Any] | None = None,
    event_ids: dict[str, str] | None = None,
) -> Order:
    meta = meta or {}
    priced: PricedOrder = await price_skus(session, item_skus)
    order_ref = await _next_unique_order_ref(session)

    order = Order(
        order_ref=order_ref,
        customer_name=customer_name,
        customer_phone_e164=customer_phone_e164,
        ip_address=ip_address,
        user_agent=user_agent,
        fbp=meta.get("fbp"),
        fbc=meta.get("fbc"),
        ttp=meta.get("ttp"),
        ttclid=meta.get("ttclid"),
        scid=meta.get("scid"),
        sccid=meta.get("sccid"),
        utm_source=meta.get("utm_source"),
        utm_medium=meta.get("utm_medium"),
        utm_campaign=meta.get("utm_campaign"),
        utm_content=meta.get("utm_content"),
        utm_term=meta.get("utm_term"),
        landing_url=meta.get("landing_url"),
        referrer=meta.get("referrer"),
        subtotal_kwd=priced.subtotal_kwd,
        upsell_total_kwd=priced.upsell_total_kwd,
        shipping_kwd=priced.shipping_kwd,
        grand_total_kwd=priced.grand_total_kwd,
        currency="KWD",
        payment_method="cod",
        status="pending",
        event_ids=event_ids or {},
        upsell_applied=any(p.is_upsell for p in priced.items),
    )
    session.add(order)
    await session.flush()  # populate order.id

    for line in priced.items:
        session.add(
            OrderItem(
                order_id=order.id,
                product_id=line.product_id,
                variant_id=line.variant_id,
                sku=line.sku,
                title_ar=line.title_ar,
                bundle_size=line.bundle_size,
                unit_price_kwd=line.unit_price_kwd,
                line_total_kwd=line.line_total_kwd,
                is_upsell=line.is_upsell,
            )
        )

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise

    await session.refresh(order, attribute_names=["items"])
    return order


async def add_upsell_to_order(
    session: AsyncSession,
    *,
    order_ref: str,
    upsell_sku: str,
) -> Order | str:
    """Returns the updated Order, or an error code string ('NOT_FOUND' | 'UPSELL_ALREADY_APPLIED' | 'INVALID_SKU')."""
    order = await session.scalar(
        select(Order).where(Order.order_ref == order_ref).execution_options(populate_existing=True)
    )
    if order is None:
        return "NOT_FOUND"
    if order.upsell_applied:
        return "UPSELL_ALREADY_APPLIED"

    variant = await session.scalar(
        select(ProductVariant).where(
            ProductVariant.sku == upsell_sku, ProductVariant.is_upsell_offer.is_(True)
        )
    )
    if variant is None:
        return "INVALID_SKU"

    line_total = Decimal(variant.price_kwd).quantize(Decimal("0.001"))
    item = OrderItem(
        order_id=order.id,
        product_id=variant.product_id,
        variant_id=variant.id,
        sku=variant.sku,
        title_ar=variant.label_ar,
        bundle_size=variant.bundle_size,
        unit_price_kwd=line_total,
        line_total_kwd=line_total,
        is_upsell=True,
    )
    session.add(item)
    order.upsell_total_kwd = (order.upsell_total_kwd or Decimal("0.000")) + line_total
    order.grand_total_kwd = (order.grand_total_kwd or Decimal("0.000")) + line_total
    order.upsell_applied = True
    await session.commit()
    await session.refresh(order, attribute_names=["items"])
    return order


def order_to_response_dict(order: Order) -> dict[str, Any]:
    return {
        "order_ref": order.order_ref,
        "status": order.status,
        "items": [
            {
                "sku": i.sku,
                "title_ar": i.title_ar,
                "bundle_size": i.bundle_size,
                "unit_price_kwd": str(i.unit_price_kwd),
                "line_total_kwd": str(i.line_total_kwd),
            }
            for i in order.items
        ],
        "subtotal_kwd": str(order.subtotal_kwd),
        "upsell_total_kwd": str(order.upsell_total_kwd),
        "shipping_kwd": str(order.shipping_kwd),
        "grand_total_kwd": str(order.grand_total_kwd),
        "currency": order.currency,
        "payment_method": order.payment_method,
    }


__all__ = [
    "PricingError",
    "add_upsell_to_order",
    "create_order",
    "order_to_response_dict",
]
