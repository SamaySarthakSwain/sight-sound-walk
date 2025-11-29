import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Map, HelpCircle, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Lets Explore</span>
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
            <Link to="/help">
              <Button 
                variant={location.pathname === "/help" ? "default" : "ghost"}
                className="gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </Link>
            {user ? (
              <>
                <Button variant="ghost" className="gap-2">
                  <UserIcon className="w-4 h-4" />
                  {user.email || user.phone}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
