import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Map, ArrowLeft, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GoogleLogin } from '@react-oauth/google';
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      // Send token to our Node.js backend
      const response = await fetch(getApiUrl("/api/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Login failed");

      // Save token and user details to localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate with backend.");
    } finally {
      setLoading(false);
    }
  };

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
                  
                  <div className="w-full flex justify-center scale-110">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google Login popup failed or was closed")}
                      theme="filled_black"
                      shape="pill"
                      text="continue_with"
                    />
                  </div>
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