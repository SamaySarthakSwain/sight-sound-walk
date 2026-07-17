// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { prompt = "", city = "Bhubaneswar" } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are the Odisha Trip Planner — coordinating three specialist agents (Route, Weather, Fares) into a friendly, day-by-day itinerary.
Base city: ${city}. Never mention AI. Keep it warm and specific.
Format the response as:
Day 1: <title>
- Morning: …
- Afternoon: …
- Evening: …
Then repeat for each requested day. End with a short "Local tips" section.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt || `Plan a 2-day cultural trip from ${city}.` },
        ],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: "gateway_error", status: res.status, details: txt }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const j = await res.json();
    const itinerary = j.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ itinerary }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
