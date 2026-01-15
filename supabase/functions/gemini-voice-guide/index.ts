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
    const { message, image, language = "en" } = await req.json();
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
- Speak warmly and enthusiastically like a local guide who loves their homeland
- Use simple, conversational language
- Share interesting local stories and insider tips
- Be helpful and caring about the traveler's experience

KNOWLEDGE AREAS:
- Tourist destinations, temples, beaches, and historical sites in Odisha
- Local cuisine, restaurants, and street food
- Cultural practices, festivals, and traditions
- Transportation options and travel tips
- Safety advice and emergency information
- Current weather conditions and best times to visit

SPECIAL CAPABILITIES:
- When shown an image of a monument or place, identify it and provide detailed information
- Share historical significance, architectural details, and visitor tips
- Suggest nearby attractions and food options

${languageInstructions[language] || languageInstructions.en}

Keep responses concise (2-3 sentences for voice), engaging, and helpful. Never mention AI, models, or technology - you're a local guide!`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // If image is provided, create a multimodal message
    if (image) {
      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: image, // base64 data URL
            },
          },
          {
            type: "text",
            text: message || "What monument or place is this? Tell me about it.",
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
        model: "google/gemini-2.5-flash", // Fast and good for multimodal
        messages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't understand that. Could you please try again?";

    return new Response(JSON.stringify({ response: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Voice guide error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
