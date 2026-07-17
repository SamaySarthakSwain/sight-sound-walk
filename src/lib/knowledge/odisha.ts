/**
 * Curated Odisha knowledge base for the RAG local-guide edge function.
 * Kept small and focused on facts an on-the-ground traveler needs.
 */

export interface KnowledgeChunk {
  id: string;
  topic: string;
  tags: string[];
  content: string;
}

export const ODISHA_KB: KnowledgeChunk[] = [
  {
    id: "jagannath-timings",
    topic: "Jagannath Temple, Puri",
    tags: ["temple", "puri", "jagannath", "timings", "darshan"],
    content:
      "Jagannath Temple opens for Mangala Aarti around 5:00 AM and closes around 12:00 AM. Non-Hindus are not permitted inside the temple precinct; a rooftop view is available from Raghunandan Library across the road. Dress modestly, leave leather items and phones outside. Best time: early morning to avoid queues.",
  },
  {
    id: "jagannath-rath-yatra",
    topic: "Rath Yatra festival",
    tags: ["festival", "puri", "jagannath", "rath-yatra"],
    content:
      "Rath Yatra is Puri's grand chariot festival, held on Ashadha Shukla Dwitiya (June-July). Three enormous wooden chariots carry Lord Jagannath, Balabhadra, and Subhadra along Bada Danda. Book accommodation months in advance and expect crowds of 500,000+.",
  },
  {
    id: "konark-timings",
    topic: "Konark Sun Temple",
    tags: ["konark", "temple", "unesco", "timings"],
    content:
      "Konark Sun Temple is open daily from 6:00 AM to 8:00 PM. Entry fee is ₹40 for Indians and ₹600 for foreigners; children under 15 are free. A sound-and-light show runs at 7:00 PM (subject to weather). Best months: October to February.",
  },
  {
    id: "konark-history",
    topic: "Konark history",
    tags: ["konark", "history", "unesco", "sun-temple"],
    content:
      "Built in the 13th century by King Narasimhadeva I of the Eastern Ganga dynasty, Konark is designed as a colossal chariot of the sun god Surya with 24 stone wheels and seven horses. UNESCO World Heritage Site since 1984.",
  },
  {
    id: "lingaraj-etiquette",
    topic: "Lingaraj Temple, Bhubaneswar",
    tags: ["temple", "bhubaneswar", "lingaraj", "etiquette"],
    content:
      "Lingaraj Temple is open 5:00 AM–9:00 PM. Non-Hindus can view the temple from an elevated viewing platform behind the compound wall. Cameras are not allowed inside. Traditional dress preferred; no leather.",
  },
  {
    id: "chilika-lake",
    topic: "Chilika Lake",
    tags: ["chilika", "lake", "birds", "dolphins", "wildlife"],
    content:
      "Asia's largest brackish-water lagoon. Satapada is best for Irrawaddy dolphin spotting (boats ₹1,500–3,000). Mangalajodi is the top birding site, especially November–February when migratory birds arrive. Nalabana Island is a bird sanctuary within the lake.",
  },
  {
    id: "udayagiri-caves",
    topic: "Udayagiri & Khandagiri Caves",
    tags: ["udayagiri", "khandagiri", "caves", "jain", "bhubaneswar"],
    content:
      "Twin hills near Bhubaneswar with 2nd-century BCE Jain rock-cut caves. Rani Gumpha (Queen's Cave) has the finest carvings. Open 8:00 AM–5:00 PM. Entry ₹25. Wear sturdy shoes — the steps are steep.",
  },
  {
    id: "dhauli",
    topic: "Dhauli Peace Pagoda",
    tags: ["dhauli", "ashoka", "buddhist", "bhubaneswar"],
    content:
      "Site of the Kalinga war (261 BCE) that transformed Emperor Ashoka. The white Peace Pagoda (Shanti Stupa), built jointly with Japan, offers panoramic views. Rock edicts of Ashoka are carved at the base.",
  },
  {
    id: "odia-etiquette",
    topic: "General Odia etiquette",
    tags: ["etiquette", "culture", "manners"],
    content:
      "Greet with 'Namaskar' and folded hands. Remove footwear before entering temples and homes. Use the right hand for eating and giving/receiving. Avoid public displays of affection. Ask before photographing people, especially at religious sites.",
  },
  {
    id: "odia-food",
    topic: "Odia food you must try",
    tags: ["food", "cuisine", "dalma", "chhena", "mahaprasad"],
    content:
      "Try Dalma (lentil-vegetable stew), Machha Besara (fish in mustard curry), Chhena Poda (baked cottage cheese dessert), Pakhala (fermented rice with curd), and Mahaprasad from Jagannath Temple's Ananda Bazaar — reputedly the world's largest kitchen.",
  },
  {
    id: "festivals-calendar",
    topic: "Major Odisha festivals",
    tags: ["festivals", "calendar"],
    content:
      "Rath Yatra (June–July, Puri), Durga Puja (September–October, Cuttack is famous for silver-filigree pandals), Konark Dance Festival (December 1–5), Raja Parba (June, celebrating womanhood), Bali Yatra (November, Cuttack — commemorates ancient maritime trade with Bali).",
  },
  {
    id: "best-season",
    topic: "Best time to visit Odisha",
    tags: ["weather", "season", "when-to-go"],
    content:
      "October to February is ideal — cool, dry, and festival-heavy. March–May is very hot (35–42°C). Monsoon (June–September) is lush but travel can be disrupted. Beach towns like Puri and Gopalpur are pleasant year-round if you can tolerate humidity.",
  },
  {
    id: "transport",
    topic: "Getting around Odisha",
    tags: ["transport", "cabs", "trains", "travel"],
    content:
      "Bhubaneswar and Puri are connected by frequent trains (~2 hrs). Cabs from Bhubaneswar to Puri cost ₹1,500–2,500. OSRTC buses run between all major towns. For heritage triangle (Bhubaneswar–Puri–Konark) a private cab for the day is ~₹3,000–4,000.",
  },
  {
    id: "safety",
    topic: "Safety and emergency",
    tags: ["safety", "emergency", "police"],
    content:
      "Odisha is generally very safe for travelers. Emergency: 112 (all-in-one), 100 (police), 108 (ambulance). Tourist Helpline: 1363. Keep a photocopy of your ID. Beach undertows at Puri can be strong — swim only in lifeguard zones.",
  },
];

/** Simple keyword-overlap retrieval — no embedding call required. */
export function retrieveChunks(query: string, k = 4): KnowledgeChunk[] {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  const scored = ODISHA_KB.map((chunk) => {
    const hay = (chunk.topic + " " + chunk.tags.join(" ") + " " + chunk.content).toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (chunk.tags.includes(t)) score += 3;
      else if (hay.includes(t)) score += 1;
    }
    return { chunk, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0)
    .map((s) => s.chunk);
}
