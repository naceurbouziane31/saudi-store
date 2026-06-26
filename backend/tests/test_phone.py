from __future__ import annotations

import pytest

from alnadara.utils.phone import mask_phone, normalize_kuwait_local, to_e164


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("50001234", "50001234"),
        ("60001234", "60001234"),
        ("90001234", "90001234"),
        ("+96550001234", "50001234"),
        ("0096550001234", "50001234"),
        (" 5000-1234 ", "50001234"),
        ("40001234", None),
        ("5000123", None),
        ("", None),
    ],
)
def test_normalize_kuwait_local(raw: str, expected: str | None) -> None:
    assert normalize_kuwait_local(raw) == expected


def test_to_e164() -> None:
    assert to_e164("50001234") == "+96550001234"
    assert to_e164("40001234") is None


def test_mask_phone() -> None:
    assert mask_phone("+96550001234") == "+9655***1234"
    assert mask_phone(None) == "?"
