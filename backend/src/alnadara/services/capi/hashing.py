from __future__ import annotations

import hashlib

from ...utils.phone import to_e164


def sha256_lower(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def _digits_no_plus(e164: str) -> str:
    """E.164 -> digits only, no leading +. '+96550001234' -> '96550001234'."""
    return e164.lstrip("+")


def _ensure_e164(raw: str) -> str:
    if raw.startswith("+"):
        return raw
    normalized = to_e164(raw)
    if normalized:
        return normalized
    # Last resort: prepend + so TikTok hashing stays consistent.
    return f"+{raw}" if raw else raw


def hash_email(email: str) -> str:
    return sha256_lower(email.strip().lower())


def hash_phone_meta(raw: str) -> str:
    """Meta + Snap: digits only, no '+', no leading zeros, SHA-256 lowercase hex."""
    e164 = _ensure_e164(raw)
    return sha256_lower(_digits_no_plus(e164))


def hash_phone_snap(raw: str) -> str:
    """Same canonical form as Meta."""
    return hash_phone_meta(raw)


def hash_phone_tiktok(raw: str) -> str:
    """TikTok: keep '+' prefix, then SHA-256 lowercase hex."""
    e164 = _ensure_e164(raw)
    if not e164.startswith("+"):
        e164 = f"+{e164}"
    return sha256_lower(e164)


def hash_name(name: str) -> str:
    return sha256_lower(name.strip().lower())


def hash_ip(ip: str) -> str:
    return sha256_lower(ip.strip())


__all__ = [
    "hash_email",
    "hash_ip",
    "hash_name",
    "hash_phone_meta",
    "hash_phone_snap",
    "hash_phone_tiktok",
    "sha256_lower",
]
