from __future__ import annotations

from alnadara.services.capi.hashing import (
    hash_email,
    hash_phone_meta,
    hash_phone_snap,
    hash_phone_tiktok,
)

LOCAL_PHONE = "50001234"
E164_PHONE = "+96550001234"


def test_meta_phone_digits_only() -> None:
    # Meta hash MUST be of digits-only canonical form, no "+".
    expected = hash_phone_meta(LOCAL_PHONE)
    assert expected == hash_phone_meta(E164_PHONE)
    # Confirm the underlying string is digits-only.
    import hashlib

    assert expected == hashlib.sha256(b"96550001234").hexdigest()


def test_tiktok_phone_keeps_plus() -> None:
    expected = hash_phone_tiktok(LOCAL_PHONE)
    assert expected == hash_phone_tiktok(E164_PHONE)
    import hashlib

    assert expected == hashlib.sha256(b"+96550001234").hexdigest()


def test_snap_phone_matches_meta() -> None:
    assert hash_phone_snap(E164_PHONE) == hash_phone_meta(E164_PHONE)


def test_email_lowercase_trim() -> None:
    a = hash_email("  noura@example.com  ")
    b = hash_email("noura@example.com")
    assert a == b
    assert a == hash_email("NOURA@EXAMPLE.COM")
