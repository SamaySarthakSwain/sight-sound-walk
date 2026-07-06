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
  name: "search_food_places",
  title: "Search food places",
  description:
    "Find restaurants, street food stalls, and food streets in Odisha with ratings and famous dishes.",
  inputSchema: {
    city: z.string().optional().describe("City / area filter (matches location)."),
    query: z.string().optional().describe("Free-text search across name and description."),
    category: z.string().optional().describe("Category filter (e.g. 'Restaurant', 'Street Food')."),
    minRating: z.number().min(0).max(5).optional().describe("Minimum Google rating."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ city, query, category, minRating, limit }) => {
    let q = supa().from("food_places").select("*");
    if (city) q = q.ilike("location", `%${city}%`);
    if (category) q = q.ilike("category", `%${category}%`);
    if (query) q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    if (typeof minRating === "number") q = q.gte("google_rating", minRating);
    const { data, error } = await q.limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { food_places: data ?? [] },
    };
  },
});
