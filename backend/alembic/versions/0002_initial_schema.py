"""initial schema: products, variants, orders, order_items, event_log

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-26
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | None = None
depends_on: str | None = None


# BigInteger primary keys for Postgres production, plain Integer on SQLite so
# AUTOINCREMENT works without extra glue (we only use SQLite in unit tests).
BigPk = sa.BigInteger().with_variant(sa.Integer(), "sqlite")


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", BigPk, primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(80), nullable=False, unique=True),
        sa.Column("sku_prefix", sa.String(8), nullable=False),
        sa.Column("title_ar", sa.String(255), nullable=False),
        sa.Column("subtitle_ar", sa.String(500), nullable=True),
        sa.Column("short_description_ar", sa.Text, nullable=True),
        sa.Column("long_description_ar", sa.Text, nullable=True),
        sa.Column("ingredients_ar", sa.JSON, nullable=False, server_default="[]"),
        sa.Column("benefits_ar", sa.JSON, nullable=False, server_default="[]"),
        sa.Column("usage_ar", sa.Text, nullable=True),
        sa.Column("who_is_for_ar", sa.Text, nullable=True),
        sa.Column("who_is_not_for_ar", sa.Text, nullable=True),
        sa.Column("origin_country", sa.String(8), nullable=True),
        sa.Column("order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_products__slug", "products", ["slug"], unique=True)
    op.create_index("ix_products__is_active__order", "products", ["is_active", "order"])

    op.create_table(
        "product_variants",
        sa.Column("id", BigPk, primary_key=True, autoincrement=True),
        sa.Column(
            "product_id",
            BigPk,
            sa.ForeignKey("products.id", ondelete="CASCADE", name="fk_product_variants__product_id__products"),
            nullable=False,
        ),
        sa.Column("sku", sa.String(32), nullable=False, unique=True),
        sa.Column("bundle_size", sa.SmallInteger, nullable=False),
        sa.Column("label_ar", sa.String(80), nullable=False),
        sa.Column("price_kwd", sa.Numeric(10, 3), nullable=False),
        sa.Column("compare_at_price_kwd", sa.Numeric(10, 3), nullable=True),
        sa.Column("is_upsell_offer", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("stock_qty", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("price_kwd > 0", name="ck_product_variants__price_positive"),
    )
    op.create_index("ix_product_variants__sku", "product_variants", ["sku"], unique=True)
    op.create_index("ix_product_variants__product_id", "product_variants", ["product_id"])

    op.create_table(
        "orders",
        sa.Column("id", BigPk, primary_key=True, autoincrement=True),
        sa.Column("order_ref", sa.String(64), nullable=False, unique=True),
        sa.Column("customer_name", sa.String(120), nullable=False),
        sa.Column("customer_phone_e164", sa.String(20), nullable=False),
        sa.Column("customer_phone_country", sa.String(4), nullable=False, server_default="KW"),
        sa.Column("ip_address", sa.String(64), nullable=True),
        sa.Column("user_agent", sa.Text, nullable=True),
        sa.Column("fbp", sa.String(120), nullable=True),
        sa.Column("fbc", sa.String(255), nullable=True),
        sa.Column("ttp", sa.String(120), nullable=True),
        sa.Column("ttclid", sa.String(255), nullable=True),
        sa.Column("scid", sa.String(120), nullable=True),
        sa.Column("sccid", sa.String(255), nullable=True),
        sa.Column("utm_source", sa.String(80), nullable=True),
        sa.Column("utm_medium", sa.String(80), nullable=True),
        sa.Column("utm_campaign", sa.String(120), nullable=True),
        sa.Column("utm_content", sa.String(120), nullable=True),
        sa.Column("utm_term", sa.String(120), nullable=True),
        sa.Column("referrer", sa.Text, nullable=True),
        sa.Column("landing_url", sa.Text, nullable=True),
        sa.Column("subtotal_kwd", sa.Numeric(10, 3), nullable=False),
        sa.Column("upsell_total_kwd", sa.Numeric(10, 3), nullable=False, server_default="0.000"),
        sa.Column("shipping_kwd", sa.Numeric(10, 3), nullable=False, server_default="0.000"),
        sa.Column("grand_total_kwd", sa.Numeric(10, 3), nullable=False),
        sa.Column("currency", sa.String(8), nullable=False, server_default="KWD"),
        sa.Column("payment_method", sa.String(16), nullable=False, server_default="cod"),
        sa.Column("status", sa.String(24), nullable=False, server_default="pending"),
        sa.Column("codnetwork_order_id", sa.String(120), nullable=True),
        sa.Column("codnetwork_status", sa.String(40), nullable=True),
        sa.Column("sheets_webhook_sent_at", sa.String(40), nullable=True),
        sa.Column("sheets_webhook_status", sa.String(16), nullable=True),
        sa.Column("event_ids", sa.JSON, nullable=False, server_default="{}"),
        sa.Column("upsell_applied", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("grand_total_kwd >= 0", name="ck_orders__grand_total_nonneg"),
    )
    op.create_index("ix_orders__order_ref", "orders", ["order_ref"], unique=True)
    op.create_index("ix_orders__customer_phone_e164", "orders", ["customer_phone_e164"])
    op.create_index("ix_orders__status__created_at", "orders", ["status", "created_at"])
    op.create_index("ix_orders__created_at", "orders", ["created_at"])

    op.create_table(
        "order_items",
        sa.Column("id", BigPk, primary_key=True, autoincrement=True),
        sa.Column(
            "order_id",
            BigPk,
            sa.ForeignKey("orders.id", ondelete="CASCADE", name="fk_order_items__order_id__orders"),
            nullable=False,
        ),
        sa.Column(
            "product_id",
            BigPk,
            sa.ForeignKey("products.id", name="fk_order_items__product_id__products"),
            nullable=True,
        ),
        sa.Column(
            "variant_id",
            BigPk,
            sa.ForeignKey("product_variants.id", name="fk_order_items__variant_id__product_variants"),
            nullable=True,
        ),
        sa.Column("sku", sa.String(32), nullable=False),
        sa.Column("title_ar", sa.String(255), nullable=False),
        sa.Column("bundle_size", sa.SmallInteger, nullable=False),
        sa.Column("unit_price_kwd", sa.Numeric(10, 3), nullable=False),
        sa.Column("line_total_kwd", sa.Numeric(10, 3), nullable=False),
        sa.Column("is_upsell", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_order_items__order_id", "order_items", ["order_id"])
    op.create_index("ix_order_items__sku", "order_items", ["sku"])

    op.create_table(
        "event_log",
        sa.Column("id", BigPk, primary_key=True, autoincrement=True),
        sa.Column("event_type", sa.String(80), nullable=False),
        sa.Column("reference", sa.String(64), nullable=False),
        sa.Column("payload", sa.JSON, nullable=False, server_default="{}"),
        sa.Column("status", sa.String(16), nullable=False, server_default="queued"),
        sa.Column("attempts", sa.Integer, nullable=False, server_default="0"),
        sa.Column("last_error", sa.Text, nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_event_log__event_type__status", "event_log", ["event_type", "status"])
    op.create_index("ix_event_log__reference", "event_log", ["reference"])


def downgrade() -> None:
    op.drop_index("ix_event_log__reference", table_name="event_log")
    op.drop_index("ix_event_log__event_type__status", table_name="event_log")
    op.drop_table("event_log")

    op.drop_index("ix_order_items__sku", table_name="order_items")
    op.drop_index("ix_order_items__order_id", table_name="order_items")
    op.drop_table("order_items")

    op.drop_index("ix_orders__created_at", table_name="orders")
    op.drop_index("ix_orders__status__created_at", table_name="orders")
    op.drop_index("ix_orders__customer_phone_e164", table_name="orders")
    op.drop_index("ix_orders__order_ref", table_name="orders")
    op.drop_table("orders")

    op.drop_index("ix_product_variants__product_id", table_name="product_variants")
    op.drop_index("ix_product_variants__sku", table_name="product_variants")
    op.drop_table("product_variants")

    op.drop_index("ix_products__is_active__order", table_name="products")
    op.drop_index("ix_products__slug", table_name="products")
    op.drop_table("products")
