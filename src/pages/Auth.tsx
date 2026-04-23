import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Phone, Mail, AlertCircle, Map, ArrowLeft, Loader2 } from "lucide-react";
import { emailAuthSchema, phoneAuthSchema } from "@/lib/validations";

const GoogleIcon = () => (
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
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});

  useEffect(() => {
    let hasRedirected = false;
    const safeRedirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      navigate("/", { replace: true });
    };

    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) safeRedirect();
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) safeRedirect();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateEmailAuth = () => {
    const result = emailAuthSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePhoneAuth = () => {
    const result = phoneAuthSchema.safeParse({ phone: phoneNumber, password });
    if (!result.success) {
      const fieldErrors: { phone?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "phone") fieldErrors.phone = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailAuth()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setLoading(false);
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Logged in successfully!");
      navigate("/");
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return; // prevent double-clicks
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: {
          prompt: "select_account",
        },
      });

      if (result?.redirected) {
        // Browser will redirect to Google. Keep button disabled briefly,
        // but clear it after a short delay so a stuck redirect doesn't lock UI.
        setTimeout(() => setGoogleLoading(false), 4000);
        return;
      }

      if (result?.error) {
        console.error("Google OAuth Error:", result.error);
        const msg = result.error.message || "Failed to sign in with Google";
        // Friendlier message for the most common preview/network case
        if (/fetch|network|failed/i.test(msg)) {
          toast.error("Couldn't reach Google sign-in. Please try again, or use email login.");
        } else {
          toast.error(msg);
        }
        setGoogleLoading(false);
        return;
      }

      // Success path: tokens were set on the client. The auth listener
      // above will navigate to "/" once the session is confirmed.
      toast.success("Signed in with Google!");
    } catch (err) {
      console.error("Google Sign In Exception:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred during sign-in");
      setGoogleLoading(false);
    }
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhoneAuth()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      phone: phoneNumber,
      password,
      options: {
        data: {
          phone_number: phoneNumber,
        },
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please verify your phone number.");
    }
  };

  const PasswordRequirements = () => (
    <p className="text-xs text-muted-foreground mt-1">
      Min 8 characters, 1 uppercase letter, 1 number
    </p>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" />
        {message}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 pb-8">
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
            <p className="text-xs text-muted-foreground mt-1">
              You can explore everything without signing in too!
            </p>
          </div>

          {/* Google Sign In - Prominent */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-12 md:h-14 text-base font-medium border-2 hover:bg-muted/50 transition-all"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-3">Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-lg glass-card">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login" className="text-sm md:text-base">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm md:text-base">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-0">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-login" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password-login"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="h-11"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Login with Email
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <Tabs defaultValue="email-signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-9">
                      <TabsTrigger value="email-signup" className="text-xs md:text-sm">
                        <Mail className="w-3 h-3 mr-1.5" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="phone-signup" className="text-xs md:text-sm">
                        <Phone className="w-3 h-3 mr-1.5" />
                        Phone
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email-signup" className="space-y-4 mt-4">
                      <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-signup" className="text-sm font-medium">Email</Label>
                          <Input
                            id="email-signup"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            disabled={loading}
                            className={`h-11 ${errors.email ? "border-destructive" : ""}`}
                          />
                          <ErrorMessage message={errors.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-signup" className="text-sm font-medium">Password</Label>
                          <Input
                            id="password-signup"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            disabled={loading}
                            className={`h-11 ${errors.password ? "border-destructive" : ""}`}
                          />
                          <ErrorMessage message={errors.password} />
                          <PasswordRequirements />
                        </div>
                        <Button type="submit" className="w-full h-11" disabled={loading}>
                          {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4 mr-2" />
                          )}
                          Create Account
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="phone-signup" className="space-y-4 mt-4">
                      <form onSubmit={handlePhoneSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone-signup" className="text-sm font-medium">Phone Number</Label>
                          <Input
                            id="phone-signup"
                            type="tel"
                            placeholder="+91 1234567890"
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value);
                              setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            disabled={loading}
                            className={`h-11 ${errors.phone ? "border-destructive" : ""}`}
                          />
                          <ErrorMessage message={errors.phone} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-phone" className="text-sm font-medium">Password</Label>
                          <Input
                            id="password-phone"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            disabled={loading}
                            className={`h-11 ${errors.password ? "border-destructive" : ""}`}
                          />
                          <ErrorMessage message={errors.password} />
                          <PasswordRequirements />
                        </div>
                        <Button type="submit" className="w-full h-11" disabled={loading}>
                          {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Phone className="w-4 h-4 mr-2" />
                          )}
                          Create Account
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;