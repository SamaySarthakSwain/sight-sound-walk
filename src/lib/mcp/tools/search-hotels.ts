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
  name: "search_hotels",
  title: "Search hotels",
  description:
    "Search hotels near a city or location in Odisha. Returns public listings (name, location, rating, amenities).",
  inputSchema: {
    city: z.string().optional().describe("City or area to search (matches location field)."),
    query: z.string().optional().describe("Free-text search across name and description."),
    minRating: z.number().min(0).max(5).optional().describe("Minimum Google rating filter."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ city, query, minRating, limit }) => {
    let q = supa()
      .from("hotels_public")
      .select("id,name,location,address,description,amenities,google_rating,google_total_ratings,image_url,latitude,longitude");
    if (city) q = q.ilike("location", `%${city}%`);
    if (query) q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    if (typeof minRating === "number") q = q.gte("google_rating", minRating);
    const { data, error } = await q.limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { hotels: data ?? [] },
    };
  },
});
