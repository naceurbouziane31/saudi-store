from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any


@dataclass
class CapiContent:
    sku: str
    title: str
    quantity: int
    unit_price_kwd: Decimal


@dataclass
class CapiUser:
    ip: str | None = None
    user_agent: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    scid: str | None = None
    sccid: str | None = None
    phone_e164: str | None = None
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None


@dataclass
class CapiPayload:
    event_name: str  # canonical: page_view | view_content | add_to_cart | initiate_checkout | lead | purchase
    event_time_unix: int
    event_source_url: str | None = None
    event_id_meta: str | None = None
    event_id_tiktok: str | None = None
    event_id_snap: str | None = None
    order_ref: str | None = None
    value_kwd: Decimal = field(default_factory=lambda: Decimal("0.000"))
    currency: str = "KWD"
    contents: list[CapiContent] = field(default_factory=list)
    user: CapiUser = field(default_factory=CapiUser)


CANONICAL_TO_META: dict[str, str] = {
    "page_view": "PageView",
    "view_content": "ViewContent",
    "add_to_cart": "AddToCart",
    "initiate_checkout": "InitiateCheckout",
    "lead": "Lead",
    "purchase": "Purchase",
    "upsell_impression": "ViewContent",
    "upsell_accept": "AddToCart",
}

CANONICAL_TO_TIKTOK: dict[str, str] = {
    "page_view": "Pageview",
    "view_content": "ViewContent",
    "add_to_cart": "AddToCart",
    "initiate_checkout": "InitiateCheckout",
    "lead": "SubmitForm",
    "purchase": "CompletePayment",
    "upsell_impression": "ViewContent",
    "upsell_accept": "AddToCart",
}

CANONICAL_TO_SNAP: dict[str, str] = {
    "page_view": "PAGE_VIEW",
    "view_content": "VIEW_CONTENT",
    "add_to_cart": "ADD_CART",
    "initiate_checkout": "START_CHECKOUT",
    "lead": "SIGN_UP",
    "purchase": "PURCHASE",
    "upsell_impression": "VIEW_CONTENT",
    "upsell_accept": "ADD_CART",
}


@dataclass
class DispatchResult:
    platform: str
    status: str  # "ok" | "failed" | "skipped"
    http_status: int | None = None
    detail: str | None = None
    raw: Any | None = None
