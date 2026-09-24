import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Map, ArrowLeft, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useGoogleLogin } from '@react-oauth/google';
import { getApiUrl } from "@/lib/apiConfig";

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
    <div className="min-h-screen flex flex-col relative bg-background/50">
      <AuroraBackground />
      {/* Header */}
      <header className="p-4 md:p-6 z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 pb-8 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Lets Explore</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Sign in to save travel history & get personalized suggestions
            </p>
          </div>

          <Card className="border-0 shadow-lg glass-card overflow-hidden">
            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px]">
              {loading ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p>Authenticating...</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                    <p className="text-sm text-muted-foreground">One click to continue</p>
                  </div>
                  
                  <Button
                    onClick={() => handleGoogleLogin()}
                    className="w-full py-6 text-base font-medium flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm transition-all rounded-full"
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
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;