from __future__ import annotations

import re

KUWAIT_LOCAL_RE = re.compile(r"^[569]\d{7}$")
NON_DIGITS = re.compile(r"[^\d+]")


def normalize_kuwait_local(raw: str) -> str | None:
    if not raw:
        return None
    digits = NON_DIGITS.sub("", raw)
    if digits.startswith("+965"):
        digits = digits[4:]
    elif digits.startswith("00965"):
        digits = digits[5:]
    elif digits.startswith("965") and len(digits) == 11:
        digits = digits[3:]
    return digits if KUWAIT_LOCAL_RE.match(digits) else None


def to_e164(raw: str) -> str | None:
    local = normalize_kuwait_local(raw)
    return f"+965{local}" if local else None


def mask_phone(e164: str | None) -> str:
    if not e164:
        return "?"
    return f"{e164[:5]}***{e164[-4:]}"
