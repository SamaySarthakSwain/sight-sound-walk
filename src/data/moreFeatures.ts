import {
  Trophy,
  Headphones,
  Sun,
  Palette,
  Sparkles,
  Camera,
  Waves,
  Compass,
  Languages,
  Users,
  Accessibility as AccessibilityIcon,
  Bot,
  Heart,
  TrendingUp,
  Box,
  Map as MapIcon,
  Glasses,
  Award,
  Radio,
  type LucideIcon,
} from "lucide-react";

export type FeatureStatus = "live" | "beta" | "soon";

export interface MoreFeature {
  id: string;
  path: string;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  category:
    | "spatial"
    | "on-device-ai"
    | "personalization"
    | "connectivity"
    | "trust";
  status: FeatureStatus;
  /** Include in the top sub-nav strip when true. */
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<MoreFeature["category"], string> = {
  spatial: "Spatial & Immersive",
  "on-device-ai": "On-Device AI & Vision",
  personalization: "Personalization & Agents",
  connectivity: "Connectivity & Infrastructure",
  trust: "Trust & Engagement",
};

export const MORE_FEATURES: MoreFeature[] = [
  // ── Live existing ──────────────────────────────────────────────
  {
    id: "quests",
    path: "/more/quests",
    label: "Heritage Quests",
    short: "Quests",
    description: "Geofenced badge quests across Odisha's heritage waypoints.",
    icon: Trophy,
    category: "trust",
    status: "live",
    featured: true,
  },
  {
    id: "soundscape",
    path: "/more/soundscape",
    label: "Soundscapes",
    short: "Soundscapes",
    description: "Ambient audio journeys through temple courtyards and beaches.",
    icon: Headphones,
    category: "spatial",
    status: "live",
    featured: true,
  },
  {
    id: "sundial",
    path: "/more/sundial",
    label: "Sundial Simulator",
    short: "Sundial",
    description: "Watch the Konark wheel cast time across the day.",
    icon: Sun,
    category: "spatial",
    status: "live",
    featured: true,
  },
  {
    id: "artisan-trail",
    path: "/more/artisan-trail",
    label: "Artisan Trail",
    short: "Artisans",
    description: "Meet Pattachitra painters, weavers, and stone carvers.",
    icon: Palette,
    category: "trust",
    status: "live",
    featured: true,
  },

  // ── Beta (new, functional) ─────────────────────────────────────
  {
    id: "rag-guide",
    path: "/more/rag-guide",
    label: "Local Guide (RAG)",
    short: "Local Guide",
    description: "Answers grounded in curated Odisha knowledge: timings, festivals, etiquette.",
    icon: Sparkles,
    category: "personalization",
    status: "beta",
    featured: true,
  },
  {
    id: "agent-planner",
    path: "/more/agent-planner",
    label: "Agent Itinerary Planner",
    short: "Planner",
    description: "Multi-agent trip planner combining weather, routes, and fares.",
    icon: Bot,
    category: "personalization",
    status: "beta",
    featured: true,
  },
  {
    id: "ar-recognize",
    path: "/more/ar-recognize",
    label: "AR Monument Recognition",
    short: "AR Recognize",
    description: "Point your camera at a monument — get its story instantly.",
    icon: Camera,
    category: "on-device-ai",
    status: "beta",
    featured: true,
  },
  {
    id: "ar-translate",
    path: "/more/ar-translate",
    label: "AR Text Translate",
    short: "Translate",
    description: "Translate Odia signboards, menus, and inscriptions from your camera.",
    icon: Languages,
    category: "on-device-ai",
    status: "beta",
    featured: true,
  },
  {
    id: "spatial-audio",
    path: "/more/spatial-audio",
    label: "Spatial Audio",
    short: "Spatial Audio",
    description: "3D soundscapes that shift as you turn your device.",
    icon: Waves,
    category: "spatial",
    status: "beta",
    featured: true,
  },
  {
    id: "vr-tours",
    path: "/more/vr-tours",
    label: "360° VR Tours",
    short: "VR Tours",
    description: "Walk through Konark and Jagannath before you arrive.",
    icon: Compass,
    category: "spatial",
    status: "beta",
    featured: true,
  },
  {
    id: "monument-3d",
    path: "/more/monument-3d",
    label: "3D Monument Viewer",
    short: "3D View",
    description: "Orbit interactive 3D reconstructions of Odisha's icons.",
    icon: Box,
    category: "spatial",
    status: "beta",
    featured: true,
  },
  {
    id: "accessibility",
    path: "/more/accessibility",
    label: "Accessibility AI",
    short: "Access",
    description: "High-contrast mode, narrated tours, wheelchair-friendly routes.",
    icon: AccessibilityIcon,
    category: "on-device-ai",
    status: "beta",
    featured: true,
  },
  {
    id: "for-you",
    path: "/more/for-you",
    label: "For You",
    short: "For You",
    description: "Recommendations that learn from your browsing history.",
    icon: Heart,
    category: "personalization",
    status: "beta",
    featured: true,
  },
  {
    id: "pricing-insights",
    path: "/more/pricing-insights",
    label: "Pricing Insights",
    short: "Pricing",
    description: "Fare and demand trends across cabs, hotels, and festival dates.",
    icon: TrendingUp,
    category: "personalization",
    status: "beta",
    featured: true,
  },
  {
    id: "crowd-analytics",
    path: "/crowd",
    label: "Crowd & Safety",
    short: "Crowd",
    description: "Live crowd density and queue estimates from partner cameras.",
    icon: Users,
    category: "on-device-ai",
    status: "live",
  },
  {
    id: "live-rooms",
    path: "/crowd/room",
    label: "Live Tour Rooms",
    short: "Live Rooms",
    description: "Join or host a shared live tour with audio and video.",
    icon: Radio,
    category: "connectivity",
    status: "live",
  },

  // ── Coming soon ────────────────────────────────────────────────
  {
    id: "offline-maps",
    path: "/more/offline-maps",
    label: "Offline Vector Maps",
    short: "Offline Maps",
    description: "Download regions for offline navigation and audio guides.",
    icon: MapIcon,
    category: "connectivity",
    status: "soon",
  },
  {
    id: "webxr",
    path: "/more/webxr",
    label: "WebXR Trip Preview",
    short: "WebXR",
    description: "Preview your itinerary in mixed reality on supported devices.",
    icon: Glasses,
    category: "spatial",
    status: "soon",
  },
  {
    id: "nft-passport",
    path: "/more/nft-passport",
    label: "Heritage Passport",
    short: "Passport",
    description: "Verifiable digital stamps for every site you visit.",
    icon: Award,
    category: "trust",
    status: "soon",
  },
];

export const FEATURED_TABS = MORE_FEATURES.filter((f) => f.featured);
