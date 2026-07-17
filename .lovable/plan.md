## Goal

Turn `/more` into a proper hub that surfaces all 15 advanced technologies you listed, ship working demos for the feasible ones, mark the rest "coming soon", and make the whole app noticeably faster to load.

---

## Part 1 — The "More" hub

### New landing page `/more`
Replace the current redirect-to-Quests behavior with a real hub page: a grid of 15 glass cards grouped into the 5 categories from your list (Spatial & Immersive, On‑Device AI, Personalization & Agents, Connectivity & Infrastructure, Trust & Engagement). Each card = icon, title, one-line description, and a "Live" / "Beta" / "Coming soon" badge. Existing 4 items (Quests, Soundscape, Sundial, Artisan Trail) are folded in as "Live". `MoreSubNav` gets a scrollable tab for every Live/Beta item.

### The 15 entries

| # | Feature | Route | Status | What ships |
|---|---|---|---|---|
| 1 | Heritage Quests | `/more/quests` | Live | existing |
| 2 | Soundscapes | `/more/soundscape` | Live | existing |
| 3 | Sundial | `/more/sundial` | Live | existing |
| 4 | Artisan Trail | `/more/artisan-trail` | Live | existing |
| 5 | RAG Local Guide | `/more/rag-guide` | **Beta** | New edge function `rag-guide` that grounds Gemini 3 Flash in a curated Odisha knowledge base (temple timings, festivals, etiquette, dos/don'ts) using AI SDK + `Output.object` for structured answers with citations. New chat page reusing existing chat UI. |
| 6 | AR Monument Recognition | `/more/ar-recognize` | **Beta** | Browser camera + on-device image classification. Ship with MediaPipe Image Classifier (WASM, loads on demand) preloaded with a small custom-labels JSON (Konark, Jagannath, Lingaraj, Udayagiri, Dhauli). Falls back to Gemini Vision if confidence low. |
| 7 | Spatial Audio Soundscape | `/more/spatial-audio` | **Beta** | Web Audio `PannerNode` demo: pick a monument (Konark), rotate device / drag orientation → hear bells, waves, chants positioned in 3D. Reuses existing soundscape assets. |
| 8 | 360° VR Tours | `/more/vr-tours` | **Beta** | `pannellum` (tiny lib) player embedded, loading equirectangular photos. Ship 2 sample tours (Konark exterior, Jagannath approach) using existing Unsplash / free 360 imagery. |
| 9 | AR Text Translate (Odia↔EN) | `/more/ar-translate` | **Beta** | Camera stream → capture frame on tap → Gemini Vision extracts + translates text, overlays on frozen frame. True real-time overlay left as v2. |
| 10 | Crowd & Safety Analytics | `/more/crowd-analytics` | Live | Redirects into existing `/crowd` dashboard (already built) — just surfaced in More hub. |
| 11 | Accessibility AI | `/more/accessibility` | **Beta** | Settings page: high-contrast toggle, TTS narrator (existing ElevenLabs), route-preferences flag `wheelchairAccessible` piped into Journey Planner filters. Sign-language avatar = "coming soon" note. |
| 12 | Multi-Agent Itinerary Planner | `/more/agent-planner` | **Beta** | New edge function running AI SDK `streamText` with three tools: `checkWeather` (Open-Meteo), `optimizeRoute` (Google Directions), `estimateCabFare` (existing logic). Chat interface where user says "3 days, Bhubaneswar + Puri, avoid rain" → agent replies with itinerary. |
| 13 | Predictive Recommendations | `/more/for-you` | **Beta** | Personalized monument feed from browsing history in `search_history` table. Client-side scoring (no federated ML yet) — cosine similarity on category tags. |
| 14 | Dynamic Pricing Insights | `/more/pricing-insights` | **Beta** | Read-only dashboard: cab fare trend chart (based on existing cab estimates + time-of-day multiplier), festival demand indicator (hardcoded calendar). |
| 15 | NeRF / 3D Monument Viewer | `/more/monument-3d` | **Beta** | `@react-three/fiber` scene loading a GLB placeholder for Konark wheel (fetch free CC0 model) with orbit controls, lighting, glassmorphic UI chrome. True splat rendering flagged as v2 (needs training pipeline). |
| 16 | Offline Vector Maps | `/more/offline-maps` | Coming soon | Card links to existing PWA offline strategy explainer. |
| 17 | WebXR Trip Preview | `/more/webxr` | Coming soon | Feature-detect WebXR; if unsupported show waitlist card. |
| 18 | Heritage NFTs | `/more/nft-passport` | Coming soon | Card explains upcoming digital-passport stamps. |
| 19 | Live Tour Rooms | `/more/live-rooms` | Live | Reuses existing `/crowd/room` WebRTC infra, surfaced here. |

(19 tiles cover all 15 categories + the 4 existing.)

### Connectors
No new connectors needed for this pass — Google Maps, Lovable AI (Gemini), and ElevenLabs are already wired. Twilio/Resend deferred until you request notifications/emails.

---

## Part 2 — Aggressive loading speed

1. **Route preloading** — `<link rel="modulepreload">` for `/explore`, `/assistant`, `/cabs` (most-visited routes) injected into `index.html`.
2. **Idle prefetch** — `requestIdleCallback` inside `AnimatedRoutes` prefetches the next-likeliest chunk after home mounts.
3. **Image pipeline** — every `<img>` gets `loading="lazy"` + `decoding="async"`; hero LCP image gets `fetchpriority="high"` + preload tag; Unsplash URLs switched to `?w=<intrinsic>&q=60&auto=format`.
4. **Bundle trims**
   - Move `framer-motion` PageTransition to a lighter CSS transition on mobile (feature-detected).
   - Split heavy libs (`three`, `pannellum`, `@mediapipe/*`) into their own async chunks via `vite` `manualChunks`.
   - Tree-shake unused Radix primitives (audit imports).
5. **Google Maps deferral** — don't load Maps JS until first map route is visited (already in context, verify + gate on `IntersectionObserver`).
6. **Skeletons over spinners** — `PageLoadingSkeleton` per route already exists; add matching skeleton for the More hub and each Beta page so perceived TTI drops.
7. **Service worker cache** — extend existing SW (if present) to precache the More hub shell and the top-5 monument thumbnails. Manifest-only if no SW.
8. **Error resilience** — wrap each Beta page's own `Suspense` + `ErrorBoundary` so a failing WASM/three chunk can't nuke the app.

---

## Part 3 — Flutter parity notes (documentation only)

Delivered as `docs/flutter-parity.md`:
- Reuse the same Supabase Edge Functions (`rag-guide`, `agent-planner`) → identical JSON contract → drop-in from Flutter via `http` package.
- Flutter equivalents recommended: `google_ml_kit` for on-device recognition, `flutter_tts` + `just_audio` for spatial audio (`SoLoud` plugin), `panorama` package for 360° tours, `flutter_3d_controller` for monument 3D, `geolocator` + `flutter_local_notifications` for geofenced quests.
- Shared design tokens: export CSS variables to a `tokens.json` the Flutter app can consume via `flutter_gen`.

---

## Technical section

**New files**
- `src/pages/MoreHub.tsx` — grid + category grouping
- `src/pages/more/RagGuide.tsx`, `ARRecognize.tsx`, `SpatialAudio.tsx`, `VRTours.tsx`, `ARTranslate.tsx`, `Accessibility.tsx`, `AgentPlanner.tsx`, `ForYou.tsx`, `PricingInsights.tsx`, `Monument3D.tsx`, `ComingSoon.tsx` (shared)
- `src/data/moreFeatures.ts` — single source of truth for hub tiles + sub-nav
- `supabase/functions/rag-guide/index.ts`, `supabase/functions/agent-planner/index.ts`
- `src/lib/knowledge/odisha.ts` — curated RAG corpus (temple timings, etiquette, festivals)
- `docs/flutter-parity.md`

**Modified**
- `src/components/AnimatedRoutes.tsx` — 11 new lazy routes + idle-prefetch
- `src/components/MoreSubNav.tsx` — data-driven from `moreFeatures.ts`
- `vite.config.ts` — `manualChunks` for three/pannellum/mediapipe
- `index.html` — preload/modulepreload tags
- `src/contexts/GoogleMapsContext.tsx` — lazy-load Maps JS on first map visit

**New deps** (all small / async-loaded)
- `three` + `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` (per React 18 pin)
- `pannellum-react` (~40 KB)
- `@mediapipe/tasks-vision` (WASM, loads on demand)

**Not changing**
- Existing color tokens, cinematic aesthetic, contact number, Unsplash rules, auth flows, Twilio/Resend (deferred).

Ready to build when you approve.