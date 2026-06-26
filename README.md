# النضارة / Al Nadara

Kuwaiti DTC beauty storefront — Arabic-first, COD-only, high-AOV.

This repo will contain two services:

- **`frontend/`** — Next.js 15 storefront (TypeScript, Tailwind, RTL). Docker-ready.
- **`backend/`** — FastAPI orders & integrations (Python 3.12, async SQLAlchemy 2, Alembic). Docker-ready.

Hosted on EasyPanel:

- Frontend → https://alnadara.shop
- Backend → https://api.alnadara.shop

## Where to start

All build specifications live in **[`docs/`](./docs)**.

- New to the project? Read **[`docs/README.md`](./docs/README.md)** for the doc index and reading order.
- About to start coding? Use the prompt in **[`docs/00-AI-CODER-PROMPT.md`](./docs/00-AI-CODER-PROMPT.md)**.

## Cursor MCP (developer tooling)

This repo registers MCP servers for Cursor in [`.cursor/mcp.example.json`](./.cursor/mcp.example.json):

- **Context7** — up-to-date library docs
- **Exa** — AI-powered web search

To enable locally:

```bash
cp .cursor/mcp.example.json .cursor/mcp.json
# then paste your real API keys into .cursor/mcp.json
```

`.cursor/mcp.json` is gitignored so your real keys never get committed.
