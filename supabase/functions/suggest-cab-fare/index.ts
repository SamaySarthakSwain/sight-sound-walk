import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireUser } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FareEstimate {
  serviceName: string;
  vehicleType: string;
  fare: number;
  waitTime: number;
  isEcoFriendly: boolean;
  capacity: number;
}

interface RequestBody {
  estimates: FareEstimate[];
  passengers: number;
  preferences: {
    prioritizePrice: boolean;
    prioritizeTime: boolean;
    prioritizeEco: boolean;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { estimates, passengers, preferences }: RequestBody = await req.json();

    if (!estimates || estimates.length === 0) {
      return new Response(
        JSON.stringify({ error: "No fare estimates provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt for AI analysis
    const estimatesText = estimates
      .map(
        (e) =>
          `- ${e.serviceName} (${e.vehicleType}): ₹${e.fare}, ${e.waitTime} min wait, ${e.capacity} seats${e.isEcoFriendly ? ", eco-friendly" : ""}`
      )
      .join("\n");

    const prefsText = [];
    if (preferences.prioritizePrice) prefsText.push("lowest price");
    if (preferences.prioritizeTime) prefsText.push("shortest wait time");
    if (preferences.prioritizeEco) prefsText.push("eco-friendly options");

    const systemPrompt = `You are a smart travel assistant helping users choose the best cab option. 
Analyze the given fare estimates and provide a recommendation. Consider:
1. Total cost and value for money
2. Wait time and convenience
3. Vehicle capacity (user has ${passengers} passengers)
4. Eco-friendliness if user prefers it
5. Any fare splitting opportunities for groups

Be concise and practical. Format your response as JSON with:
- recommendedIndex: number (0-based index of best option)
- reason: string (short explanation, max 100 words)
- tips: string[] (2-3 money-saving tips)
- ecoChoice: number | null (index of best eco option if different from recommended)`;

    const userPrompt = `Here are the cab options available:
${estimatesText}

Number of passengers: ${passengers}
User preferences: ${prefsText.length > 0 ? prefsText.join(", ") : "no specific preferences"}

Which option do you recommend and why?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the AI response
    let recommendation;
    try {
      recommendation = JSON.parse(content);
    } catch {
      // Fallback to cheapest option
      recommendation = {
        recommendedIndex: 0,
        reason: "Based on price comparison, this option offers the best value.",
        tips: ["Consider sharing the ride to split costs", "Book during off-peak hours for better prices"],
        ecoChoice: estimates.findIndex((e) => e.isEcoFriendly) ?? null,
      };
    }

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in suggest-cab-fare:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
