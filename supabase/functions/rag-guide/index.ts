// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Inlined knowledge base — kept in sync with src/lib/knowledge/odisha.ts.
interface KB { id: string; topic: string; tags: string[]; content: string }
const ODISHA_KB: KB[] = [
  { id: "jagannath-timings", topic: "Jagannath Temple, Puri", tags: ["temple","puri","jagannath","timings","darshan"], content: "Jagannath Temple opens for Mangala Aarti around 5:00 AM and closes around 12:00 AM. Non-Hindus are not permitted inside the temple precinct; a rooftop view is available from Raghunandan Library across the road. Dress modestly, leave leather items and phones outside." },
  { id: "jagannath-rath-yatra", topic: "Rath Yatra festival", tags: ["festival","puri","jagannath","rath-yatra"], content: "Rath Yatra is Puri's grand chariot festival, held on Ashadha Shukla Dwitiya (June-July). Three wooden chariots carry Lord Jagannath, Balabhadra, and Subhadra along Bada Danda." },
  { id: "konark-timings", topic: "Konark Sun Temple", tags: ["konark","temple","unesco","timings"], content: "Konark Sun Temple is open daily 6:00 AM–8:00 PM. Entry ₹40 for Indians, ₹600 for foreigners. Sound-and-light show at 7:00 PM. Best months: October–February." },
  { id: "konark-history", topic: "Konark history", tags: ["konark","history","unesco","sun-temple"], content: "Built in the 13th century by King Narasimhadeva I of the Eastern Ganga dynasty. Designed as a chariot of Surya with 24 stone wheels and seven horses. UNESCO site since 1984." },
  { id: "lingaraj-etiquette", topic: "Lingaraj Temple, Bhubaneswar", tags: ["temple","bhubaneswar","lingaraj","etiquette"], content: "Lingaraj Temple is open 5:00 AM–9:00 PM. Non-Hindus view from an elevated platform behind the compound wall. No cameras inside. No leather." },
  { id: "chilika-lake", topic: "Chilika Lake", tags: ["chilika","lake","birds","dolphins","wildlife"], content: "Asia's largest brackish-water lagoon. Satapada for Irrawaddy dolphins (₹1,500–3,000 boats). Mangalajodi for birding (Nov–Feb). Nalabana Island bird sanctuary." },
  { id: "udayagiri-caves", topic: "Udayagiri & Khandagiri Caves", tags: ["udayagiri","khandagiri","caves","jain","bhubaneswar"], content: "Twin hills near Bhubaneswar with 2nd-century BCE Jain rock-cut caves. Rani Gumpha has the finest carvings. Open 8:00 AM–5:00 PM. Entry ₹25." },
  { id: "dhauli", topic: "Dhauli Peace Pagoda", tags: ["dhauli","ashoka","buddhist","bhubaneswar"], content: "Site of the Kalinga war (261 BCE) that transformed Emperor Ashoka. White Peace Pagoda built with Japan. Ashoka rock edicts at the base." },
  { id: "odia-etiquette", topic: "Odia etiquette", tags: ["etiquette","culture","manners"], content: "Greet with 'Namaskar' and folded hands. Remove footwear before entering temples and homes. Use the right hand for eating. Ask before photographing people." },
  { id: "odia-food", topic: "Odia food", tags: ["food","cuisine","dalma","chhena","mahaprasad"], content: "Try Dalma, Machha Besara (fish in mustard curry), Chhena Poda (baked cottage cheese dessert), Pakhala, and Mahaprasad from Jagannath Temple's Ananda Bazaar." },
  { id: "festivals-calendar", topic: "Odisha festivals", tags: ["festivals","calendar"], content: "Rath Yatra (Jun–Jul, Puri), Durga Puja (Sep–Oct, Cuttack silver pandals), Konark Dance Festival (Dec 1–5), Raja Parba (Jun), Bali Yatra (Nov, Cuttack)." },
  { id: "best-season", topic: "Best time to visit", tags: ["weather","season","when-to-go"], content: "October–February is ideal. March–May is very hot (35–42°C). Monsoon June–September is lush but disrupted." },
  { id: "transport", topic: "Getting around", tags: ["transport","cabs","trains","travel"], content: "Bhubaneswar–Puri trains ~2 hrs. Cab BBSR–Puri ₹1,500–2,500. Heritage triangle cab for the day ₹3,000–4,000." },
  { id: "safety", topic: "Safety", tags: ["safety","emergency","police"], content: "Emergency: 112 (all), 100 (police), 108 (ambulance). Tourist Helpline: 1363. Beach undertows at Puri — swim only in lifeguard zones." },
];

function retrieve(query: string, k = 4): KB[] {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  return ODISHA_KB
    .map((c) => {
      const hay = (c.topic + " " + c.tags.join(" ") + " " + c.content).toLowerCase();
      let score = 0;
      for (const t of tokens) { if (c.tags.includes(t)) score += 3; else if (hay.includes(t)) score += 1; }
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0)
    .map((s) => s.c);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { messages = [] } = await req.json();
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
    if (!lastUser?.content) {
      return new Response(JSON.stringify({ error: "No user message" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const hits = retrieve(lastUser.content, 4);
    const context = hits.length
      ? hits.map((h, i) => `[${i + 1}] ${h.topic}\n${h.content}`).join("\n\n")
      : "(No matching entries found in the knowledge base.)";

    const system = `You are Odisha Explorer, a warm and knowledgeable local guide for travelers in Odisha, India.
You answer ONLY from the KNOWLEDGE below. If the answer isn't in the KNOWLEDGE, say so briefly and suggest what you can help with instead.
Keep answers under 4 short sentences. Never mention that you are an AI or a language model.

KNOWLEDGE:
${context}`;

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          ...messages.slice(-6).map((m: any) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: "gateway_error", status: res.status, details: txt }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const j = await res.json();
    const answer = j.choices?.[0]?.message?.content ?? "";
    const citations = hits.map((h) => h.topic);
    return new Response(JSON.stringify({ answer, citations }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
