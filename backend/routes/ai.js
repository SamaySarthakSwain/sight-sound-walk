import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const languageInstructions = {
  en: "Respond in English.",
  hi: "Respond in Hindi (हिंदी में जवाब दें).",
  or: "Respond in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ).",
  te: "Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).",
  bn: "Respond in Bengali (বাংলায় উত্তর দিন).",
};

// ==========================================
// 1. Voice Guide (Replaces gemini-voice-guide)
// ==========================================
router.post('/voice-guide', async (req, res) => {
  const { message, image, language = "en", isProactive = false, monumentName = "" } = req.body;
  
  let systemPrompt = `You are "Odisha Explorer", a friendly, knowledgeable local travel guide for Odisha, India.
- Speak warmly and enthusiastically like a local guide.
- Keep responses EXTREMELY SHORT (1 sentence max) for much faster voice playback. Be direct and helpful.
- Never mention AI or technology.
${languageInstructions[language] || languageInstructions.en}`;

  if (isProactive) {
    systemPrompt += `\nPROACTIVE MODE: The user has just arrived near ${monumentName}. Give a warm, enthusiastic welcome greeting that mentions ${monumentName} specifically. Max 20 words.`;
  }

  let prompt = message || `Tell me about ${monumentName || "this place"}`;
  if (isProactive) prompt = `I have just arrived near ${monumentName}. Greet me.`;

  try {
    // Set headers for SSE (Server-Sent Events) Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        // Format to match OpenAI/Lovable chunk format the frontend expects
        const chunkData = {
          choices: [{ delta: { content: chunk.text } }]
        };
        res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error("Voice Guide Error:", err);
    res.write(`data: {"error": "Failed to generate"}\n\n`);
    res.end();
  }
});


// ==========================================
// 2. Travel Assistant (Replaces travel-assistant)
// ==========================================
router.post('/travel-assistant', async (req, res) => {
  const { messages } = req.body;
  
  const systemPrompt = `You are a helpful travel assistant for Odisha. Provide concise, friendly answers about Odisha's culture, food, and places.`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Convert messages to Gemini format
    const geminiContents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: geminiContents,
      config: { systemInstruction: systemPrompt }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        const chunkData = { choices: [{ delta: { content: chunk.text } }] };
        res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error("Assistant Error:", err);
    res.end();
  }
});


// ==========================================
// 3. Agent Planner (Replaces agent-planner)
// ==========================================
router.post('/planner', async (req, res) => {
  const { query, userPreferences } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Plan a trip based on this request: "${query}". Preferences: ${JSON.stringify(userPreferences)}. Return ONLY a JSON object representing a beautiful, realistic itinerary. Include 'title', 'description', 'budget', and 'days' (array of day objects).`,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text));
  } catch (err) {
    console.error("Planner Error:", err);
    res.status(500).json({ error: "Failed to plan trip" });
  }
});

// ==========================================
// 4. RAG Guide / AR (Replaces rag-guide)
// ==========================================
router.post('/rag-guide', async (req, res) => {
  const { query, mode, image } = req.body;
  
  let prompt = query;
  if (mode === "translate") prompt = `Translate this into English: ${query}`;
  if (mode === "recognize") prompt = `Identify this monument or object in the image and tell me exactly what it is.`;

  try {
    const response = await ai.models.generateContent({
      model: image ? "gemini-2.5-flash" : "gemini-2.5-flash-lite",
      contents: prompt
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error("RAG Error:", err);
    res.status(500).json({ error: "Failed to process RAG" });
  }
});

export default router;
