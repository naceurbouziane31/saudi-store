from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, Integer, Numeric, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .product import Product


class ProductVariant(Base, TimestampMixin):
    __tablename__ = "product_variants"
    __table_args__ = (CheckConstraint("price_kwd > 0", name="price_positive"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sku: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    bundle_size: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    label_ar: Mapped[str] = mapped_column(String(80), nullable=False)
    price_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    compare_at_price_kwd: Mapped[Decimal | None] = mapped_column(Numeric(10, 3), nullable=True)
    is_upsell_offer: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    stock_qty: Mapped[int | None] = mapped_column(Integer, nullable=True)

    product: Mapped[Product] = relationship("Product", back_populates="variants")

    def __repr__(self) -> str:
        return f"<ProductVariant sku={self.sku}>"
