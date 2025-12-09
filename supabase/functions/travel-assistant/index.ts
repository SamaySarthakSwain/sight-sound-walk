import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Major Odisha destinations with coordinates
const odishaLocations: Record<string, { lat: number; lon: number; name: string }> = {
  "bhubaneswar": { lat: 20.2961, lon: 85.8245, name: "Bhubaneswar" },
  "puri": { lat: 19.8135, lon: 85.8312, name: "Puri" },
  "konark": { lat: 19.8876, lon: 86.0945, name: "Konark" },
  "cuttack": { lat: 20.4625, lon: 85.8830, name: "Cuttack" },
  "berhampur": { lat: 19.3150, lon: 84.7941, name: "Berhampur" },
  "gopalpur": { lat: 19.2583, lon: 84.9167, name: "Gopalpur" },
  "chilika": { lat: 19.7000, lon: 85.3167, name: "Chilika Lake" },
  "sambalpur": { lat: 21.4669, lon: 83.9812, name: "Sambalpur" },
  "rourkela": { lat: 22.2604, lon: 84.8536, name: "Rourkela" },
  "taptapani": { lat: 19.5333, lon: 84.0833, name: "Taptapani" },
};

async function fetchWeatherData(location: string): Promise<string | null> {
  const locationKey = location.toLowerCase().replace(/[^a-z]/g, '');
  
  // Find matching location
  let coords = null;
  for (const [key, value] of Object.entries(odishaLocations)) {
    if (locationKey.includes(key) || key.includes(locationKey)) {
      coords = value;
      break;
    }
  }
  
  // Default to Bhubaneswar if no match
  if (!coords) {
    coords = odishaLocations["bhubaneswar"];
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=3`;
    
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }
    
    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    
    const currentCondition = weatherCodes[current.weather_code] || "Unknown";
    
    return `
**Current Weather in ${coords.name}:**
- Temperature: ${current.temperature_2m}°C
- Condition: ${currentCondition}
- Humidity: ${current.relative_humidity_2m}%
- Wind: ${current.wind_speed_10m} km/h

**3-Day Forecast:**
- Today: ${daily.temperature_2m_min[0]}°C - ${daily.temperature_2m_max[0]}°C (${weatherCodes[daily.weather_code[0]] || "Unknown"})
- Tomorrow: ${daily.temperature_2m_min[1]}°C - ${daily.temperature_2m_max[1]}°C (${weatherCodes[daily.weather_code[1]] || "Unknown"})
- Day after: ${daily.temperature_2m_min[2]}°C - ${daily.temperature_2m_max[2]}°C (${weatherCodes[daily.weather_code[2]] || "Unknown"})
`;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

const languageInstructions: Record<string, string> = {
  en: "Respond in English.",
  hi: "हिंदी में जवाब दें। Respond in Hindi using Devanagari script.",
  or: "ଓଡ଼ିଆ ରେ ଉତ୍ତର ଦିଅନ୍ତୁ। Respond in Odia using Odia script.",
  te: "తెలుగులో సమాధానం ఇవ్వండి. Respond in Telugu using Telugu script.",
  bn: "বাংলায় উত্তর দিন। Respond in Bengali using Bengali script.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "en", includeWeather = false, weatherLocation = "" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing travel assistant request:", { 
      messageCount: messages.length, 
      language, 
      includeWeather,
      weatherLocation 
    });

    // Fetch weather data if requested
    let weatherContext = "";
    if (includeWeather && weatherLocation) {
      const weather = await fetchWeatherData(weatherLocation);
      if (weather) {
        weatherContext = `\n\n**REAL-TIME WEATHER DATA:**\n${weather}\nUse this weather data to provide accurate, current weather information in your response.`;
      }
    }

    const langInstruction = languageInstructions[language] || languageInstructions.en;

    const systemPrompt = `You are "Odisha Explorer", a friendly and knowledgeable AI travel assistant specializing in Odisha, India. You help travelers with:

- **Destinations**: Temples (Jagannath Temple, Konark Sun Temple, Lingaraja Temple), beaches (Gopalpur, Puri, Chandipur), caves (Udayagiri, Khandagiri), forts, lakes (Chilika Lake), and heritage sites.
- **Weather & Best Times**: Provide real-time weather info when available, seasonal advice, monsoon precautions, festival timing.
- **Local Tips**: Culture, etiquette at temples, local cuisine (like Pakhala, Chhena Poda), transportation, and safety.
- **Itinerary Planning**: Suggest routes between destinations, travel times, must-see spots.
- **History & Culture**: Share fascinating stories about Odisha's rich heritage, Kalinga architecture, and traditions.

${langInstruction}

Keep responses concise, friendly, and helpful. Use emojis sparingly to add warmth. If asked about places outside Odisha, politely redirect to Odisha attractions.${weatherContext}`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Travel assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
