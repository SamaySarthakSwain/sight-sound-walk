import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, image, language = "en", conversationHistory = [], isProactive = false, monumentName = "" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Check for expert lore if user is authorized
    let hiddenLore = null;
    let isExpert = false;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

        if (user && !authError) {
          // Check if user has "Odisha Expert" achievement
          const { data: achievement } = await supabase
            .from("user_achievements")
            .select("achievement_id, achievements!inner(title)")
            .eq("user_id", user.id)
            .eq("achievements.title", "Odisha Expert")
            .maybeSingle();

          if (achievement) {
            isExpert = true;
            // Fetch lore for the monument
            if (monumentName) {
              const { data: monument } = await supabase
                .from("monuments")
                .select("hidden_lore")
                .ilike("title", `%${monumentName}%`)
                .maybeSingle();

              if (monument?.hidden_lore) {
                hiddenLore = monument.hidden_lore;
              }
            }
          }
        }
      }
    }

    const languageInstructions: Record<string, string> = {
      en: "Respond in English.",
      hi: "Respond in Hindi (हिंदी में जवाब दें).",
      or: "Respond in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ).",
      te: "Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).",
      bn: "Respond in Bengali (বাংলায় উত্তর दिन).",
    };

    let systemPrompt = `You are a friendly, knowledgeable local travel guide for Odisha, India. Your name is "Odisha Explorer".

PERSONALITY:
- Speak warmly and enthusiastically like a local guide
- Use simple, conversational language
- Be concise - keep responses to 1-2 sentences for quick voice playback

KNOWLEDGE AREAS:
- Tourist destinations, temples, beaches, historical sites in Odisha
- Local cuisine, restaurants, street food
- Cultural practices, festivals, traditions
- Transportation and travel tips
- Weather conditions and best times to visit

PRONUNCIATION & STYLE:
- Pronounce Indian names and places clearly with a natural Indian accent flow.
- For places like "Bhubaneswar", "Jagannath", "Konark", "Berhampur", ensure clear and accurate phonetic output.
- Use local context and warmth to make the user feel at home in Odisha.

SPECIAL CAPABILITIES:
- When shown an image, identify the monument/place and give brief info
- Suggest nearby attractions

${languageInstructions[language] || languageInstructions.en}

IMPORTANT: Keep responses EXTREMELY SHORT (1 sentence max) for much faster voice playback. Be direct and helpful. Never mention AI or technology.`;

    if (isExpert && hiddenLore) {
      systemPrompt += `\n\nEXPERT LEVEL ACCESS: The user is an "Odisha Expert". You MUST include this exclusive "Hidden Lore" in your response about ${monumentName}: "${hiddenLore}". 
      Speak as if you are sharing a secret or a legendary fact.`;
    }

    if (isProactive) {
      systemPrompt += `\n\nPROACTIVE MODE: The user has just arrived near ${monumentName}. 
      Give a warm, enthusiastic welcome greeting that mentions ${monumentName} specifically.
      Keep it very short (max 20 words). If you have Expert Lore, include it briefly.`;
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "image_url", image_url: { url: image } },
          { type: "text", text: message || "What is this place? Brief info please." },
        ],
      });
    } else if (isProactive) {
      messages.push({
        role: "user",
        content: `I have just arrived near ${monumentName}. Greet me briefly.`,
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: image ? "google/gemini-2.5-flash" : "google/gemini-2.5-flash-lite",
        messages,
        max_tokens: 300,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Voice guide error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
