import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { env, envOr } from "../env";

function supa() {
  return createClient(env("SUPABASE_URL"), envOr("SUPABASE_PUBLISHABLE_KEY", envOr("SUPABASE_ANON_KEY", ""))!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "search_monuments",
  title: "Search monuments",
  description:
    "Search Odisha monuments and historical sites in the Lets Explore catalog. Filter by free-text query (matches title, location, description), city/location, or category.",
  inputSchema: {
    query: z.string().optional().describe("Free-text search across title, location, description."),
    city: z.string().optional().describe("Filter by city or location (e.g. 'Puri', 'Bhubaneswar')."),
    category: z.string().optional().describe("Filter by category (e.g. 'Temple', 'Beach', 'Museum')."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, city, category, limit }) => {
    let q = supa()
      .from("monuments")
      .select("id,title,category,location,region,state,description,latitude,longitude,image_url,is_featured");
    if (city) q = q.ilike("location", `%${city}%`);
    if (category) q = q.ilike("category", `%${category}%`);
    if (query) q = q.or(`title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`);
    const { data, error } = await q.limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { monuments: data ?? [] },
    };
  },
});
