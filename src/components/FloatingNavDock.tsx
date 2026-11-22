import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { 
  Home, Zap, Compass, Bot, Box, Users, UtensilsCrossed, Car, Sparkles 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DOCK_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/flash", label: "Heritage Flash", icon: Zap, badge: "New" },
  { path: "/explore", label: "Interactive Map", icon: Compass },
  { path: "/assistant", label: "AI Guide", icon: Bot },
  { path: "/ar", label: "3D AR View", icon: Box },
  { path: "/crowd", label: "Live Crowd", icon: Users },
  { path: "/food", label: "Authentic Food", icon: UtensilsCrossed },
  { path: "/cabs", label: "Smart Cabs", icon: Car },
];

export const FloatingNavDock = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <TooltipProvider delayDuration={100}>
        <Dock
          iconSize={38}
          iconMagnification={54}
          iconDistance={110}
          className="border-white/20 dark:border-white/10 bg-background/80 shadow-2xl backdrop-blur-2xl px-3 py-1.5 rounded-full ring-1 ring-primary/20"
        >
          {DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link to={item.path} className="relative">
                    <DockIcon
                      className={`relative transition-all duration-300 rounded-full ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.badge && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </DockIcon>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs font-semibold px-2.5 py-1 rounded-full bg-popover/90 backdrop-blur-md border border-white/10 shadow-lg">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </Dock>
      </TooltipProvider>
    </div>
  );
};

export default FloatingNavDock;