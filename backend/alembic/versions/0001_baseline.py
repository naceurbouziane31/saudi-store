"""baseline (no-op)

Tables land in the next migration once the SQLAlchemy models are introduced.
This baseline only stamps the database so subsequent migrations can chain.

Revision ID: 0001
Revises:
Create Date: 2026-06-26
"""

from __future__ import annotations

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
