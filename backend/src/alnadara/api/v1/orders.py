from __future__ import annotations

from collections.abc import Iterable
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, BackgroundTasks, Depends, Header, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from ...db import get_session
from ...logging import get_logger
from ...schemas.order import (
    OrderCreate,
    OrderItemOut,
    OrderOut,
    UpsellRequest,
    UpsellResponse,
)
from ...services.orders import (
    add_upsell_to_order,
    create_order,
)
from ...services.pricing import PricingError
from ...utils.phone import normalize_kuwait_local, to_e164

log = get_logger("api.orders")
router = APIRouter(prefix="/v1/orders", tags=["orders"])


def _items_to_out(items: Iterable[Any]) -> list[OrderItemOut]:
    out: list[OrderItemOut] = []
    for i in items:
        out.append(
            OrderItemOut(
                sku=i.sku,
                title_ar=i.title_ar,
                bundle_size=i.bundle_size,
                unit_price_kwd=Decimal(i.unit_price_kwd),
                line_total_kwd=Decimal(i.line_total_kwd),
            )
        )
    return out


def _client_ip(req: Request) -> str | None:
    xff = req.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    if req.client:
        return req.client.host
    return None


@router.post(
    "",
    response_model=OrderOut,
    responses={
        422: {"description": "validation error"},
        429: {"description": "rate limited"},
    },
)
async def post_order(
    payload: OrderCreate,
    request: Request,
    response: Response,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> OrderOut:
    if payload.honeypot:
        log.info("orders.honeypot_dropped")
        return OrderOut(
            order_ref="HP-IGNORED",
            status="ignored",
            items=[],
            subtotal_kwd=Decimal("0.000"),
            upsell_total_kwd=Decimal("0.000"),
            shipping_kwd=Decimal("0.000"),
            grand_total_kwd=Decimal("0.000"),
            currency="KWD",
            payment_method="cod",
        )

    phone_local = normalize_kuwait_local(payload.customer.phone)
    if not phone_local:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "PHONE_INVALID", "message": "phone invalid"}},
        )
    phone_e164 = to_e164(phone_local) or f"+965{phone_local}"

    try:
        order = await create_order(
            session,
            customer_name=payload.customer.name,
            customer_phone_e164=phone_e164,
            item_skus=[i.sku for i in payload.items],
            ip_address=_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            meta=payload.meta.model_dump(exclude_none=True) if payload.meta else None,
            event_ids=payload.event_ids.model_dump(exclude_none=True)
            if payload.event_ids
            else None,
        )
    except PricingError as e:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": e.code, "message": e.message}},
        ) from e

    log.info(
        "orders.created",
        order_ref=order.order_ref,
        items=len(order.items),
        grand_total_kwd=str(order.grand_total_kwd),
    )

    # PR5 hook: dispatch_capi + push_to_codnetwork + push_to_sheets via BackgroundTasks.
    background.add_task(_no_op_post_persist, order.order_ref)

    response.headers["Cache-Control"] = "no-store"
    if idempotency_key:
        response.headers["X-Idempotency-Key-Echo"] = idempotency_key

    return OrderOut(
        order_ref=order.order_ref,
        status=order.status,
        items=_items_to_out(order.items),
        subtotal_kwd=Decimal(order.subtotal_kwd),
        upsell_total_kwd=Decimal(order.upsell_total_kwd),
        shipping_kwd=Decimal(order.shipping_kwd),
        grand_total_kwd=Decimal(order.grand_total_kwd),
        currency=order.currency,
        payment_method=order.payment_method,
    )


async def _no_op_post_persist(order_ref: str) -> None:
    log.info("orders.post_persist.placeholder", order_ref=order_ref)


@router.post(
    "/{order_ref}/upsell",
    response_model=UpsellResponse,
    responses={
        404: {"description": "order not found"},
        409: {"description": "upsell already applied"},
        422: {"description": "validation error"},
    },
)
async def post_upsell(
    order_ref: str,
    payload: UpsellRequest,
    response: Response,
    session: AsyncSession = Depends(get_session),
) -> UpsellResponse:
    result = await add_upsell_to_order(session, order_ref=order_ref, upsell_sku=payload.sku)
    if isinstance(result, str):
        if result == "NOT_FOUND":
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "order not found"}},
            )
        if result == "UPSELL_ALREADY_APPLIED":
            raise HTTPException(
                status_code=409,
                detail={
                    "error": {"code": "UPSELL_ALREADY_APPLIED", "message": "upsell already applied"}
                },
            )
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_SKU", "message": "upsell sku invalid"}},
        )

    response.headers["Cache-Control"] = "no-store"
    return UpsellResponse(
        order_ref=result.order_ref,
        upsell_added=True,
        upsell_total_kwd=Decimal(result.upsell_total_kwd),
        grand_total_kwd=Decimal(result.grand_total_kwd),
    )


__all__ = ["router"]
