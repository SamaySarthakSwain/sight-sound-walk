import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, MapPin, Search, Trash2, Clock, Compass } from "lucide-react";
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

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visitHistory, setVisitHistory] = useState<VisitHistory[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to view your profile");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // If no profile exists, create one from user metadata
      if (!profileData) {
        const newProfile: Profile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          email: user.email || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          phone_number: user.phone || null,
        };
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Fetch visit history
      const { data: visits } = await supabase
        .from("visit_history")
        .select("*")
        .eq("user_id", user.id)
        .order("visited_at", { ascending: false })
        .limit(10);

      setVisitHistory(visits || []);

      // Fetch search history
      const { data: searches } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("searched_at", { ascending: false })
        .limit(10);

      setSearchHistory(searches || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setSearchHistory([]);
      toast.success("Search history cleared");
    } catch (error) {
      toast.error("Failed to clear search history");
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        {/* User Info Section */}
        <Card className="mb-8">
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

        {/* Last Visited Place */}
        <Card className="mb-8">
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
                  <img
                    src={visitHistory[0].place_image}
                    alt={visitHistory[0].place_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{visitHistory[0].place_name}</h4>
                  {visitHistory[0].place_category && (
                    <p className="text-sm text-muted-foreground capitalize">
                      {visitHistory[0].place_category}
                    </p>
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
                <p className="text-muted-foreground mb-4">
                  You haven't visited any places yet. Start exploring now!
                </p>
                <Button onClick={() => navigate("/explore")}>Start Exploring</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit History */}
        {visitHistory.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Recent Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visitHistory.slice(1).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {visit.place_image && (
                        <img
                          src={visit.place_image}
                          alt={visit.place_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{visit.place_name}</p>
                        {visit.place_category && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {visit.place_category}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(visit.visited_at)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search History
              </CardTitle>
              <CardDescription>Your recent route searches</CardDescription>
            </div>
            {searchHistory.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Search History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your search history. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearSearchHistory}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : searchHistory.length > 0 ? (
              <div className="space-y-3">
                {searchHistory.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{search.start_location}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-foreground">{search.end_location}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(search.searched_at)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No search history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
