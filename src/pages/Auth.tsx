import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Map, ArrowLeft, Loader2, Compass, Mountain, Globe2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useGoogleLogin } from '@react-oauth/google';
import { getApiUrl } from "@/lib/apiConfig";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have a google token saved locally, redirect to home
    const existingToken = localStorage.getItem("auth_token");
    if (existingToken) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Fetch user profile from Google userinfo API
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile from Google");

        const userInfo = await res.json();
        const user = {
          id: userInfo.sub,
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        };

        // Save token and user details to localStorage
        localStorage.setItem("auth_token", tokenResponse.access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // Notify backend in background
        fetch(getApiUrl("/api/auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token, user }),
        }).catch((err) => console.warn("Backend sync notice:", err));

        toast.success(`Welcome back, ${user.name || "Explorer"}!`);
        navigate("/", { replace: true });
      } catch (err: any) {
        console.error("Auth error:", err);
        toast.error(err.message || "Failed to log in with Google.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google sign in was cancelled or encountered an error.");
    },
  });

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Original Theme Background */}
      <AuroraBackground />
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

      {/* Header */}
      <header className="absolute top-0 w-full p-4 md:p-8 z-20 flex justify-between items-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span className="text-sm font-medium tracking-wide">Back to Home</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/" className="hover:text-foreground transition-colors">Destinations</Link>
          <Link to="/" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center lg:justify-start lg:px-24 p-6 z-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Hero Section (Hidden on small screens) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col text-foreground max-w-lg space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero shadow-glow">
              <Map className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-hero pb-2">
              Lets Explore
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Sign in to save travel history & get personalized suggestions
            </p>
            
            <div className="flex gap-6 pt-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-foreground">10k+</h3>
                <p className="text-sm text-muted-foreground">Active Explorers</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-foreground">500+</h3>
                <p className="text-sm text-muted-foreground">Destinations</p>
              </div>
            </div>
          </motion.div>

          {/* Right Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md lg:ml-auto relative"
          >
            {/* Mobile Header (Shows only on small screens) */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero shadow-glow">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-hero">
                Lets Explore
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Sign in to save travel history & get personalized suggestions
              </p>
            </div>

            <Card className="glass-card overflow-hidden rounded-3xl relative border-border/50">
              <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center min-h-[300px] relative z-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                  className="mb-8 flex flex-col items-center space-y-2 text-center"
                >
                  <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
                  <p className="text-sm text-muted-foreground font-medium">One click to continue</p>
                </motion.div>

                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-muted-foreground py-4"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-medium animate-pulse">Authenticating...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="w-full flex flex-col items-center space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={() => handleGoogleLogin()}
                      className="w-full py-6 text-base font-semibold flex items-center justify-center gap-3 bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all rounded-[1rem] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="w-full flex items-center gap-4">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Secure Login</span>
                      <div className="h-px bg-border flex-1" />
                    </div>

                    <div className="flex gap-4 w-full">
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl glass-panel text-muted-foreground hover:text-primary transition-colors cursor-default">
                        <Compass className="w-5 h-5 mb-1 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Explore</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl glass-panel text-muted-foreground hover:text-primary transition-colors cursor-default">
                        <Mountain className="w-5 h-5 mb-1 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Discover</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-muted-foreground mt-6 max-w-xs mx-auto"
            >
              By continuing, you agree to our <a href="#" className="text-foreground hover:text-primary hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-foreground hover:text-primary hover:underline transition-colors">Privacy Policy</a>
            </motion.p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Auth;