# AGENTS.md

## Cursor Cloud specific instructions

This repository (`saudi-store`) is currently an **empty scaffold** — it contains
no application code yet. As of this writing the entire repo is:

- `README.md` — documents only the optional Cursor MCP server setup (Context7, Exa).
- `.cursor/mcp.example.json` — template for Cursor MCP servers (run via `npx`, editor tooling only, not a product service).
- `.gitignore` — ignores `.cursor/mcp.json`.

Implications for development environment setup:

- There is **no product/service to build, run, lint, or test**. No `package.json`,
  lockfiles, source directories, `Makefile`, `Dockerfile`, CI config, or
  dependency manifests exist.
- The only tooling referenced is **Node.js / `npx`** (already available on the VM:
  `node` v22.x, `npm` 10.x), used solely to launch the optional Context7/Exa MCP
  servers inside Cursor. These require `CONTEXT7_API_KEY` / `EXA_API_KEY` and are
  not part of any application.
- Until application code is added, there is nothing to install. Once a real
  product is added (e.g. a `package.json` or other manifest appears), revisit the
  update script and add the appropriate install/build/test/lint/dev commands, and
  replace this note with concrete service instructions.
