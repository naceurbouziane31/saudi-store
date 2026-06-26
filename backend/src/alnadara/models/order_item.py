from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Numeric, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .order import Order


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True)
    variant_id: Mapped[int | None] = mapped_column(ForeignKey("product_variants.id"), nullable=True)
    sku: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    bundle_size: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    unit_price_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    line_total_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    is_upsell: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    order: Mapped[Order] = relationship("Order", back_populates="items")
