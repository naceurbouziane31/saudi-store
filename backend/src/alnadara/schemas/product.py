from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class IngredientOut(BaseModel):
    name: str
    role: str
    country: str | None = None


class VariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sku: str
    bundle_size: int
    label_ar: str
    price_kwd: Decimal
    compare_at_price_kwd: Decimal | None = None
    is_upsell_offer: bool = False
    stock_qty: int | None = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title_ar: str
    subtitle_ar: str | None = None
    short_description_ar: str | None = None
    origin_country: str | None = None
    ingredients: list[IngredientOut] = Field(default_factory=list)
    benefits: list[str] = Field(default_factory=list)
    usage_ar: str | None = None
    who_is_for_ar: str | None = None
    who_is_not_for_ar: str | None = None
    variants: list[VariantOut] = Field(default_factory=list)


class ProductsList(BaseModel):
    products: list[ProductOut]
