import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import "./contexts/GoogleMapsContext"; // run alert override before any Maps script
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<HelmetProvider><App /></HelmetProvider>);
