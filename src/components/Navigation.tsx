import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Map } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Walk & Learn</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to="/explore">
              <Button 
                variant={location.pathname === "/explore" ? "default" : "ghost"}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
