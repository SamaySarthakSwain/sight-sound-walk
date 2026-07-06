import { Link, useLocation } from "react-router-dom";
import { Headphones, Sun, Palette, Trophy } from "lucide-react";

const tabs = [
  { path: "/more/quests", label: "Quests", icon: Trophy },
  { path: "/more/soundscape", label: "Soundscapes", icon: Headphones },
  { path: "/more/sundial", label: "Sundial", icon: Sun },
  { path: "/more/artisan-trail", label: "Artisan Trail", icon: Palette },
];

const MoreSubNav = () => {
  const location = useLocation();

  return (
    <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreSubNav;
