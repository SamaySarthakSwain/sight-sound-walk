// Runtime env accessor for MCP tool files. These files are bundled by the
// @lovable.dev/mcp-js Vite plugin into a Supabase Edge Function (Deno) at
// build time, where `process.env` is available. The frontend never imports
// them. We use `globalThis` to avoid needing @types/node in the frontend.
export function env(name: string): string {
  const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  const v = g.process?.env?.[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export function envOr(name: string, fallback: string | undefined): string | undefined {
  const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.[name] ?? fallback;
}
