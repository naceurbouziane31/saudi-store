from __future__ import annotations

from typing import Any

from sqlalchemy import JSON, DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class EventLog(Base, TimestampMixin):
    """Idempotent server-side event ledger (CAPI / COD Network / Sheets)."""

    __tablename__ = "event_log"
    __table_args__ = (
        Index("ix_event_log__event_type__status", "event_type", "status"),
        Index("ix_event_log__reference", "reference"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    event_type: Mapped[str] = mapped_column(String(80), nullable=False)
    reference: Mapped[str] = mapped_column(String(64), nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="queued")
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    sent_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
