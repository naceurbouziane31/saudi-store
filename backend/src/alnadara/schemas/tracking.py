from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class EventUser(BaseModel):
    model_config = ConfigDict(extra="ignore")

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


class EventContent(BaseModel):
    id: str
    quantity: int = 1
    item_price: float = 0.0


class CustomData(BaseModel):
    currency: str = "KWD"
    value: float = 0.0
    contents: list[EventContent] = Field(default_factory=list)
    content_type: Literal["product"] = "product"
    order_id: str | None = None


class TrackingEventIn(BaseModel):
    event_name: str
    event_time_unix: int
    event_source_url: str | None = None
    event_ids: dict[str, str] = Field(default_factory=dict)
    user: EventUser = Field(default_factory=EventUser)
    custom: CustomData = Field(default_factory=CustomData)


class PlatformResult(BaseModel):
    status: Literal["ok", "failed", "skipped"]
    detail: str | None = None


class TrackingResponse(BaseModel):
    results: dict[str, PlatformResult]


__all__ = [
    "Any",
    "CustomData",
    "EventContent",
    "EventUser",
    "PlatformResult",
    "TrackingEventIn",
    "TrackingResponse",
]
