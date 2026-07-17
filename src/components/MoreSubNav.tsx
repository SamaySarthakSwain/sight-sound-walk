import { Link, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { FEATURED_TABS } from "@/data/moreFeatures";

const MoreSubNav = () => {
  const location = useLocation();
  const isHub = location.pathname === "/more";

  return (
    <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          <Link
            to="/more"
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
              isHub
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            All
          </Link>
          {FEATURED_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = !isHub && location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.short}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreSubNav;
