# saudi-store

## Cursor MCP setup

This repo ships with a template for the Cursor MCP servers it uses
(Context7 and Exa). To enable them locally:

1. Copy the template:

   ```bash
   cp .cursor/mcp.example.json .cursor/mcp.json
   ```

2. Open `.cursor/mcp.json` and replace the placeholders with your real keys:

   - `CONTEXT7_API_KEY` — get one at https://context7.com/dashboard
   - `EXA_API_KEY` — get one at https://dashboard.exa.ai/api-keys

3. In Cursor, open **Settings → MCP** and enable the `context7` and `exa`
   servers (Cursor will install them automatically via `npx` on first run).

`.cursor/mcp.json` is gitignored so your real API keys never get committed.
