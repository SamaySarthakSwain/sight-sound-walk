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
  name: "get_monument_details",
  title: "Get monument details",
  description:
    "Return full details (facts, coordinates, region, description) for a single monument matched by title.",
  inputSchema: {
    title: z.string().min(1).describe("Monument title or partial title to look up."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ title }) => {
    const { data, error } = await supa()
      .from("monuments")
      .select("id,title,category,location,region,state,description,facts,latitude,longitude,image_url,distance_from_berhampur,is_featured")
      .ilike("title", `%${title}%`)
      .limit(1)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No monument found matching "${title}".` }] };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { monument: data },
    };
  },
});
