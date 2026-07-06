// Ambient declarations for MCP tool files. These files are bundled by the
// @lovable.dev/mcp-js Vite plugin into a Supabase Edge Function (Deno runtime)
// at build time, where `process.env` is available. The frontend never imports
// them, but tsc still typechecks them alongside the rest of the app.
declare const process: {
  env: Record<string, string | undefined>;
};
