import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/apiConfig";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, MapPin, Search, Trash2, Clock, Compass, LogIn, Sparkles, Trophy } from "lucide-react";
import { DigitalPassport } from "@/components/DigitalPassport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone_number: string | null;
}

interface VisitHistory {
  id: string;
  place_name: string;
  place_category: string | null;
  place_image: string | null;
  visited_at: string;
}

interface SearchHistory {
  id: string;
  start_location: string;
  end_location: string;
  searched_at: string;
}

interface SuggestedPlace {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
}

const GuestProfileView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        {/* Login Prompt */}
        <Card className="mb-8 border-none glass-card">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to unlock more</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Log in to save your travel history, get personalized place suggestions, and track your explorations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-lg mx-auto text-left">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/80">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Travel History</p>
                  <p className="text-xs text-muted-foreground">Track places you visit</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/80">
                <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Suggestions</p>
                  <p className="text-xs text-muted-foreground">Based on your history</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/80">
                <Search className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Search History</p>
                  <p className="text-xs text-muted-foreground">Revisit past routes</p>
                </div>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In / Create Account
            </Button>
          </CardContent>
        </Card>

        {/* Explore CTA */}
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Start Exploring</h3>
            <p className="text-muted-foreground mb-4">
              You can explore all monuments, food places, and plan routes without logging in!
            </p>
            <Button variant="outline" onClick={() => navigate("/explore")}>
              Explore Places
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visitHistory, setVisitHistory] = useState<VisitHistory[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const uId = user.id || user.email;
      
      const newProfile: Profile = {
        id: uId,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.name || null,
        email: user.email || null,
        avatar_url: user.user_metadata?.avatar_url || user.picture || null,
        phone_number: user.phone || null,
      };
      setProfile(newProfile);

      // Fetch visit history
      const visitsRes = await fetch(getApiUrl(`/api/visits/${uId}`));
      let visits = [];
      if (visitsRes.ok) visits = await visitsRes.json();
      setVisitHistory(visits);

      // Get search history from localStorage
      const localSearches = JSON.parse(localStorage.getItem('search_history') || '[]');
      setSearchHistory(localSearches);

      // Get suggested places
      if (visits.length > 0) {
        const visitedCategories = [...new Set(visits.map(v => v.place_category).filter(Boolean))];
        const visitedNames = visits.map(v => v.place_name);

        if (visitedCategories.length > 0) {
          const monRes = await fetch(getApiUrl(`/api/monuments`));
          if (monRes.ok) {
            const allMons = await monRes.json();
            const suggestions = allMons
              .filter(m => visitedCategories.includes(m.category))
              .filter(s => !visitedNames.includes(s.title))
              .slice(0, 6);
            setSuggestedPlaces(suggestions);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearchHistory = async () => {
    localStorage.setItem('search_history', '[]');
    setSearchHistory([]);
    toast.success("Search history cleared");
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 container mx-auto px-4">
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Show guest view if not logged in
  if (!user) {
    return <GuestProfileView />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="passport">Travel Passport</TabsTrigger>
            <TabsTrigger value="history">Visit History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* User Info Section */}
            <Card className="mb-8 glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(profile?.full_name, profile?.email || user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {profile?.full_name || user?.user_metadata?.name || "Explorer"}
                      </h3>
                      <p className="text-muted-foreground">
                        {profile?.email || user?.email || profile?.phone_number || user?.phone}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Places */}
            {suggestedPlaces.length > 0 && (
              <Card className="mb-8 glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Suggested For You
                  </CardTitle>
                  <CardDescription>Based on your travel history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {suggestedPlaces.slice(0, 6).map((place) => (
                      <div
                        key={place.id}
                        className="p-3 bg-secondary/20 rounded-lg cursor-pointer hover:bg-secondary/40 transition-colors"
                        onClick={() => navigate("/explore")}
                      >
                        {place.image_url && (
                          <img src={place.image_url} alt={place.title} className="w-full h-24 object-cover rounded mb-2" />
                        )}
                        <p className="font-medium text-foreground text-sm">{place.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{place.category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Last Visited Place */}
            <Card className="mb-8 glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Last Visited Place
                </CardTitle>
                <CardDescription>Your most recent exploration</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : visitHistory.length > 0 ? (
                  <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                    {visitHistory[0].place_image && (
                      <img src={visitHistory[0].place_image} alt={visitHistory[0].place_name} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{visitHistory[0].place_name}</h4>
                      {visitHistory[0].place_category && (
                        <p className="text-sm text-muted-foreground capitalize">{visitHistory[0].place_category}</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(visitHistory[0].visited_at)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">You haven't visited any places yet. Start exploring now!</p>
                    <Button onClick={() => navigate("/explore")}>Start Exploring</Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="passport">
            <DigitalPassport user={user} visitCount={visitHistory.length} />
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            {/* Visit History from existing content */}
            {visitHistory.length > 0 ? (
              <div className="space-y-3">
                {visitHistory.map((visit) => (
                  <Card key={visit.id} className="glass-card glass-card-hover border-transparent cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {visit.place_image && (
                          <img src={visit.place_image} alt={visit.place_name} className="w-14 h-14 object-cover rounded-md" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{visit.place_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{visit.place_category}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{formatDate(visit.visited_at)}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card border-none">
                <CardContent className="p-8 text-center">
                  <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No visits recorded yet.</p>
                </CardContent>
              </Card>
            )}

            {/* Search History */}
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="w-4 h-4" />
                    Search History
                  </CardTitle>
                  <CardDescription className="text-xs">Your recent route searches</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {searchHistory.map((search) => (
                      <div key={search.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg text-sm border border-border/10">
                        <div className="flex items-center gap-2 truncate pr-4">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{search.start_location}</span>
                          <span className="text-muted-foreground mx-1">→</span>
                          <span className="truncate">{search.end_location}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap opacity-70">{formatDate(search.searched_at)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-muted-foreground pt-2">No history</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
