from __future__ import annotations

import re
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

SKU_RE = re.compile(r"^([A-Z]{3}-[1-3]|UPS-9-[A-Z]{3})$")


class CustomerIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str

    @field_validator("name", mode="after")
    @classmethod
    def trim_name(cls, v: str) -> str:
        cleaned = v.strip()
        if any(ch.isdigit() for ch in cleaned):
            raise ValueError("name must not contain digits")
        return cleaned


class CartItemIn(BaseModel):
    sku: str
    qty: int = Field(default=1, ge=1, le=10)

    @field_validator("sku", mode="after")
    @classmethod
    def sku_format(cls, v: str) -> str:
        if not SKU_RE.match(v):
            raise ValueError("sku format invalid")
        return v


class EventIds(BaseModel):
    meta: str | None = None
    tiktok: str | None = None
    snap: str | None = None


class OrderMetaIn(BaseModel):
    model_config = ConfigDict(extra="ignore")

    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    scid: str | None = None
    sccid: str | None = None
    user_agent: str | None = None
    ip: str | None = None
    landing_url: str | None = None
    referrer: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_content: str | None = None
    utm_term: str | None = None


class OrderCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    customer: CustomerIn
    items: list[CartItemIn] = Field(min_length=1, max_length=10)
    meta: OrderMetaIn | None = None
    event_ids: EventIds | None = None
    honeypot: str | None = None


class OrderItemOut(BaseModel):
    sku: str
    title_ar: str
    bundle_size: int
    unit_price_kwd: Decimal
    line_total_kwd: Decimal


class OrderOut(BaseModel):
    order_ref: str
    status: str
    items: list[OrderItemOut]
    subtotal_kwd: Decimal
    upsell_total_kwd: Decimal
    shipping_kwd: Decimal
    grand_total_kwd: Decimal
    currency: str
    payment_method: str


class UpsellRequest(BaseModel):
    sku: str

    @field_validator("sku", mode="after")
    @classmethod
    def sku_format(cls, v: str) -> str:
        if not v.startswith("UPS-9-"):
            raise ValueError("upsell sku must start with UPS-9-")
        return v


class UpsellResponse(BaseModel):
    order_ref: str
    upsell_added: bool
    upsell_total_kwd: Decimal
    grand_total_kwd: Decimal


class ErrorBody(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody
