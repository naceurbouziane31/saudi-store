from __future__ import annotations

from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .variant import ProductVariant


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    sku_prefix: Mapped[str] = mapped_column(String(8), nullable=False)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    subtitle_ar: Mapped[str | None] = mapped_column(String(500), nullable=True)
    short_description_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    long_description_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    ingredients_ar: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)
    benefits_ar: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    usage_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    who_is_for_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    who_is_not_for_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    origin_country: Mapped[str | None] = mapped_column(String(8), nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    variants: Mapped[list[ProductVariant]] = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductVariant.bundle_size",
    )

    def __repr__(self) -> str:
        return f"<Product slug={self.slug}>"
