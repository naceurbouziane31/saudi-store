from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Boolean, CheckConstraint, Index, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .order_item import OrderItem


class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("grand_total_kwd >= 0", name="grand_total_nonneg"),
        Index("ix_orders__status__created_at", "status", "created_at"),
        Index("ix_orders__created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    order_ref: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    customer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    customer_phone_e164: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    customer_phone_country: Mapped[str] = mapped_column(String(4), nullable=False, default="KW")

    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    fbp: Mapped[str | None] = mapped_column(String(120), nullable=True)
    fbc: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ttp: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ttclid: Mapped[str | None] = mapped_column(String(255), nullable=True)
    scid: Mapped[str | None] = mapped_column(String(120), nullable=True)
    sccid: Mapped[str | None] = mapped_column(String(255), nullable=True)

    utm_source: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_content: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_term: Mapped[str | None] = mapped_column(String(120), nullable=True)
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
    landing_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    subtotal_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    upsell_total_kwd: Mapped[Decimal] = mapped_column(
        Numeric(10, 3), nullable=False, default=Decimal("0.000")
    )
    shipping_kwd: Mapped[Decimal] = mapped_column(
        Numeric(10, 3), nullable=False, default=Decimal("0.000")
    )
    grand_total_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="KWD")
    payment_method: Mapped[str] = mapped_column(String(16), nullable=False, default="cod")

    status: Mapped[str] = mapped_column(String(24), nullable=False, default="pending")

    codnetwork_order_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    codnetwork_status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    sheets_webhook_sent_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    sheets_webhook_status: Mapped[str | None] = mapped_column(String(16), nullable=True)

    event_ids: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)

    upsell_applied: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    items: Mapped[list[OrderItem]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="OrderItem.id",
    )

    def __repr__(self) -> str:
        return f"<Order ref={self.order_ref}>"
