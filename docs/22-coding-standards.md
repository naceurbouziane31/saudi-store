# 22 — Coding Standards

## Common rules (all languages)

- **Single-responsibility per file.** A file does one thing.
- **No dead code.** Delete before committing.
- **No commented-out code** — git is the history.
- **No magic numbers / strings.** Use constants with semantic names.
- **Explicit > implicit.** Type everything that crosses a boundary.
- **No comments that narrate code.** Comments explain *why*, not *what*. Skip them if the code is self-explanatory.
- **English identifiers, Arabic display copy.** Variables, functions, types, files = English. UI strings = Arabic, stored in dedicated modules/JSON.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`).
- **Branches**: `feat/<thing>`, `fix/<thing>`, `chore/<thing>`.
- **PRs**: small, focused, with a 3-line description (what / why / how to test).

## Frontend (TypeScript)

### Tooling

- `tsconfig.json` strict mode (`"strict": true`).
- ESLint config extends `next/core-web-vitals` + `@typescript-eslint/recommended-type-checked`.
- Prettier with `prettier-plugin-tailwindcss`.
- `pnpm` (v9+) as package manager; lockfile committed.

### File / folder conventions

- One default export per file = the component; named exports for helpers in same module.
- Component file name = component name (PascalCase). `ProductCard.tsx`, not `product-card.tsx`.
- Hooks start with `use*`.
- Stores: `<entity>Store.ts`.
- Types: `types/<entity>.ts`; share with backend via OpenAPI generation.

### React / Next conventions

- Server Components by default; `'use client'` only when needed.
- No `useEffect` for derived state — compute it during render.
- Async data: `react-query` v5; no `useState + useEffect + fetch` pattern.
- Forms: `react-hook-form` + `zod` only.
- Modals & drawers: Radix UI primitives wrapped in our components.
- Avoid prop drilling > 2 levels; use Zustand or context.
- Suspense boundaries around async server components for fast LCP.
- Don't import from `node_modules/*` directly — re-export from `src/lib/*` when adapting.

### Types

- No `any`. Use `unknown` and narrow.
- Prefer `type` for unions/aliases, `interface` for object shapes that consumers might extend.
- All API types generated from FastAPI OpenAPI via `openapi-typescript` into `src/lib/api/types.gen.ts`.

### Styling (Tailwind)

- Use Tailwind utilities exclusively; no `style={{}}` unless dynamic-value-from-prop.
- Use `cn()` (`clsx` wrapper) for conditional classes.
- Custom CSS only in `globals.css` (tokens) and rarely in CSS modules for non-utility cases.
- Class order is enforced by `prettier-plugin-tailwindcss`.
- Use logical properties (`ms-2` not `ml-2`) for RTL safety.

### Accessibility

- All interactive elements must be `<button>` / `<a>`, never a `<div>` with `onClick`.
- All forms use `<label htmlFor>` (`react-hook-form` Controller handles this).
- All images have meaningful `alt` (or `alt=""` if decorative).
- Color contrast tested.
- Focus rings preserved (no `outline-none` without replacement).

### Testing

- Unit tests with Vitest + `@testing-library/react`.
- Co-locate `Component.test.tsx` next to `Component.tsx`.
- Snapshot tests sparingly (only for stable atoms).
- E2E happy paths in Playwright (`/e2e/checkout.spec.ts`).

### Performance

- `Image` from `next/image` always.
- `Link` from `next/link` always.
- Avoid client components above the fold.
- Lazy-load modals/drawers with `dynamic(() => import(...), { ssr: false })`.
- Bundle analyzer in CI; warn if first-load JS > 180 KB.

## Backend (Python)

### Tooling

- Python **3.12** strict.
- **uv** for dep management; `uv.lock` committed.
- **Ruff** for lint + format (replaces black + isort + flake8).
- **mypy** strict (`--strict` flag in CI).
- **pytest** + `pytest-asyncio` for tests.
- **Pydantic v2** for all schemas (request/response/settings).

### File / folder conventions

- Package layout: `src/alnadara/...` (already in `13-backend-architecture.md`).
- One class per file when classes are non-trivial; small dataclasses can group.
- Modules: snake_case. Classes: PascalCase. Functions/vars: snake_case.
- No circular imports — use protocol/interface modules to break cycles.

### Style

- Type hints everywhere — `mypy --strict` must pass.
- Use `from __future__ import annotations` for forward refs in modules with many types.
- Prefer dataclasses / Pydantic models over dicts.
- Use `Decimal` (not float) for money. Configure SQLAlchemy column type as `Numeric(10,3)` and load as `Decimal`.

### Async

- Async/await everywhere in the request path.
- DB: SQLAlchemy 2 `AsyncSession`.
- HTTP: `httpx.AsyncClient` (shared instance per app, injected via dependency).
- No `time.sleep` — use `asyncio.sleep`.

### Error handling

- Custom exceptions in `alnadara/errors.py`: `ValidationError`, `NotFound`, `Conflict`, `ExternalServiceError`.
- A global handler converts each to the right HTTP status + JSON shape.
- Never `except Exception: pass`. Always log with `exc_info=True`.

### Logging

- `structlog` JSON; bound `request_id` per request.
- Don't log full PII; mask phone as `+9655***1234`.

### Testing

- 1 test file per module, co-located in `tests/` mirroring `src/` structure.
- Use SQLite in-memory for fast unit tests where Postgres-specific features aren't used.
- Use `httpx.AsyncClient` against the FastAPI app for route tests.
- Mock external HTTP via `respx` (httpx mocking lib).

## Naming

| Concept | Style | Example |
|---|---|---|
| Files (TS) | PascalCase for components, kebab-case for utils | `ProductCard.tsx`, `phone-utils.ts` |
| Files (Py) | snake_case | `pricing_service.py` |
| Folders | kebab-case (frontend), snake_case (backend) | `frontend/src/components/atoms`, `backend/src/alnadara/services/capi` |
| Branch names | `feat/<slug>`, `fix/<slug>` | `feat/checkout-popup` |
| DB tables | snake_case plural | `order_items` |
| API URLs | kebab-case, plural nouns | `/v1/orders/{order_ref}/upsell` |
| Env vars | SCREAMING_SNAKE_CASE | `META_CAPI_ACCESS_TOKEN` |

## Git workflow

- `main` is always deployable.
- Feature branches off `main`.
- PR review (even if solo, self-review one full pass before merging).
- Squash merge to keep history clean.
- Tag releases `v1.0.0`, `v1.1.0`, etc. (semver) once we start shipping post-launch updates.

## Definition of done (each PR)

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Lighthouse mobile ≥ 85 (frontend PRs).
- [ ] Docs updated if behavior changed.
- [ ] Manual test on mobile viewport (frontend PRs).
- [ ] No new high-severity vulnerabilities (`pnpm audit`, `pip-audit`).
