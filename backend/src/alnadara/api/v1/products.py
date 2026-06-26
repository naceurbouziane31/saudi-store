from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ...db import get_session
from ...models import Product
from ...schemas.product import ProductOut, ProductsList

router = APIRouter(prefix="/v1/products", tags=["products"])


def _product_to_out(p: Product) -> ProductOut:
    payload: dict[str, Any] = {
        "id": p.id,
        "slug": p.slug,
        "title_ar": p.title_ar,
        "subtitle_ar": p.subtitle_ar,
        "short_description_ar": p.short_description_ar,
        "origin_country": p.origin_country,
        "ingredients": p.ingredients_ar or [],
        "benefits": p.benefits_ar or [],
        "usage_ar": p.usage_ar,
        "who_is_for_ar": p.who_is_for_ar,
        "who_is_not_for_ar": p.who_is_not_for_ar,
        "variants": [
            {
                "sku": v.sku,
                "bundle_size": v.bundle_size,
                "label_ar": v.label_ar,
                "price_kwd": v.price_kwd,
                "compare_at_price_kwd": v.compare_at_price_kwd,
                "is_upsell_offer": v.is_upsell_offer,
                "stock_qty": v.stock_qty,
            }
            for v in p.variants
            if not v.is_upsell_offer
        ],
    }
    return ProductOut.model_validate(payload)


@router.get("", response_model=ProductsList)
async def list_products(session: AsyncSession = Depends(get_session)) -> ProductsList:
    stmt = (
        select(Product)
        .where(Product.is_active.is_(True))
        .options(selectinload(Product.variants))
        .order_by(Product.order)
    )
    rows = (await session.execute(stmt)).scalars().all()
    return ProductsList(products=[_product_to_out(p) for p in rows])


@router.get("/{slug}", response_model=ProductOut)
async def get_product(slug: str, session: AsyncSession = Depends(get_session)) -> ProductOut:
    stmt = (
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(selectinload(Product.variants))
    )
    product = await session.scalar(stmt)
    if not product:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "NOT_FOUND", "message": "product not found"}},
        )
    return _product_to_out(product)


__all__ = ["router"]
