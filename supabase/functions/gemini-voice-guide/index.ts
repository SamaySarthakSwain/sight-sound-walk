import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, image, language = "en", conversationHistory = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions: Record<string, string> = {
      en: "Respond in English.",
      hi: "Respond in Hindi (हिंदी में जवाब दें).",
      or: "Respond in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ).",
      te: "Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).",
      bn: "Respond in Bengali (বাংলায় উত্তর দিন).",
    };

    const systemPrompt = `You are a friendly, knowledgeable local travel guide for Odisha, India. Your name is "Odisha Explorer".

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

SPECIAL CAPABILITIES:
- When shown an image, identify the monument/place and give brief info
- Suggest nearby attractions

${languageInstructions[language] || languageInstructions.en}

IMPORTANT: Keep responses EXTREMELY SHORT (1 sentence max) for much faster voice playback. Be direct and helpful. Never mention AI or technology.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    // If image is provided, create a multimodal message
    if (image) {
      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: image },
          },
          {
            type: "text",
            text: message || "What is this place? Brief info please.",
          },
        ],
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
        model: "google/gemini-2.5-flash-lite", // Fastest model for quick responses
        messages,
        max_tokens: 150, // Shorter responses for faster TTS
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please wait." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to get AI response");
    }

    // Stream the response back
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
