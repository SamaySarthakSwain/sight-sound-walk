import { Helmet } from "react-helmet-async";

const BASE = "https://letsexploreit.lovable.app";
const DEFAULT = {
  title: "Lets Explore - Educational Tourism Experience",
  description: "Discover Odisha's monuments, temples and beaches with GPS-guided stories, maps and local tips.",
};

const META: Record<string, { title: string; description: string }> = {
  "/": DEFAULT,
  "/explore": { title: "Explore Odisha Monuments | Lets Explore", description: "Browse Odisha's temples, forts, beaches and heritage sites on an interactive map with photos and history." },
  "/food": { title: "Food Near You in Odisha | Lets Explore", description: "Find rated local restaurants and traditional Odia dishes near the places you visit." },
  "/cabs": { title: "Compare Cab Fares | Lets Explore", description: "Compare estimated cab fares and plan routes between Odisha's attractions." },
  "/hotels": { title: "Hotels in Odisha | Lets Explore", description: "Find and book hotels near Odisha's top monuments and beaches." },
  "/assistant": { title: "Odisha Travel Guide Chat | Lets Explore", description: "Ask a friendly local guide about places, food, routes and history across Odisha." },
  "/help": { title: "Help & Support | Lets Explore", description: "Get help using Lets Explore and contact our team for bookings and support." },
  "/ar": { title: "AR Monument Viewer | Lets Explore", description: "View Odisha's monuments in interactive 3D and augmented reality." },
  "/crowd": { title: "Live Crowd Levels | Lets Explore", description: "Check live crowd levels at popular Odisha attractions before you go." },
  "/crowd/room": { title: "Live Room | Lets Explore", description: "Join a live room to share crowd and traffic updates in real time." },
  "/more": { title: "More Features | Lets Explore", description: "Explore VR tours, 3D monuments, spatial audio, AR translation and more travel tools." },
  "/more/sundial": { title: "Konark Sundial Simulator | Lets Explore", description: "Learn to read time from the sundial wheels of the Konark Sun Temple." },
  "/more/vr-tours": { title: "VR Tours of Odisha | Lets Explore", description: "Take 360° virtual tours of Odisha's famous heritage sites." },
  "/flash": { title: "Monument Flashcards | Lets Explore", description: "Learn about Odisha's monuments with quick photo flashcards." },
};

export const RouteMeta = ({ path }: { path: string }) => {
  const m = META[path] || DEFAULT;
  const url = `${BASE}${path}`;
  return (
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
    </Helmet>
  );
};
