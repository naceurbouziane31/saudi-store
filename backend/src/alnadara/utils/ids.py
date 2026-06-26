from __future__ import annotations

import random
import string
from datetime import UTC, datetime


def generate_order_ref() -> str:
    """Human-readable order reference, e.g. NAD-2026-000123.

    The numeric portion is a random 6-digit value; collisions are caught by
    the unique constraint on `orders.order_ref` and retried at insert time.
    """
    year = datetime.now(UTC).year
    n = random.randint(100_000, 999_999)
    return f"NAD-{year}-{n:06d}"


def random_token(length: int = 24) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(random.choices(alphabet, k=length))
