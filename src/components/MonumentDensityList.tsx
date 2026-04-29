import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Users, Clock, MapPin, Map as MapIcon, CalendarHeart, AlertTriangle } from "lucide-react";
import { getOfflineData } from "@/hooks/useOfflineData";
import { useCrowdPersistence } from "@/hooks/useCrowdPersistence";
import { cn } from "@/lib/utils";

interface Monument {
  id: string;
  title: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
  image_url: string;
  is_featured: boolean;
}

type DensityHistoryPoint = {
  time: string;
  density: number;
};

type CrowdDensityProfile = {
  current: number;
  history: DensityHistoryPoint[];
  bestTime: string;
  isRealTime?: boolean;
};

type CrowdDensityRecord = {
  location: string | null;
  person_count: number;
};

// Generate some mock historical data for the charts since we don't have real historical sensors per monument yet
const generateMockHistory = (baseLevel: number): DensityHistoryPoint[] => {
  const data: DensityHistoryPoint[] = [];
  const hours = [8, 10, 12, 14, 16, 18, 20];
  for (const h of hours) {
    // Random variations based on time of day (peak at noon/afternoon)
    let multiplier = 1;
    if (h === 12 || h === 14) multiplier = 1.8;
    if (h === 18) multiplier = 1.5;
    
    data.push({
      time: `${h}:00`,
      density: Math.floor(Math.max(10, baseLevel * multiplier + (Math.random() * 20 - 10)))
    });
  }
  return data;
};

// Calculate best time based on lowest density during daylight hours
const getBestTime = (history: {time: string, density: number}[]) => {
  const sorted = [...history].sort((a, b) => a.density - b.density);
  return sorted[0].time;
};

const MonumentDensityList = () => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [densities, setDensities] = useState<Record<string, CrowdDensityProfile>>({});
  const { fetchGlobalDensity } = useCrowdPersistence();

  useEffect(() => {
    const fetchMonumentsData = async () => {
      try {
        setLoading(true);
        // Fetch monuments
        const { data: monumentData, error: mError } = await supabase
          .from("monuments")
          .select("id,title,location,category,latitude,longitude,image_url,is_featured")
          .order("is_featured", { ascending: false })
          .limit(6);

        let finalMonuments = monumentData || [];
        if (mError || finalMonuments.length === 0) {
          finalMonuments = getOfflineData("monuments").slice(0, 6);
        }
        setMonuments(finalMonuments);

        // Fetch real global density data if available
        const realData = (await fetchGlobalDensity()) as CrowdDensityRecord[];
        const profiles: Record<string, CrowdDensityProfile> = {};

        finalMonuments.forEach(m => {
          // Check if we have real-time detection for this "location" or general area
          const latestForLocation = realData.find(r => 
            r.location?.toLowerCase().includes(m.title.toLowerCase()) || 
            r.location?.toLowerCase().includes(m.location.toLowerCase())
          );

          const baseLevel = (m.title.length * 3) % 60 + 20;
          const history = generateMockHistory(baseLevel);
          const currentVal = latestForLocation 
            ? Math.min(100, (latestForLocation.person_count * 10)) 
            : history[history.length - 1].density;

          profiles[m.id] = {
            current: currentVal,
            history: history,
            bestTime: getBestTime(history),
            isRealTime: !!latestForLocation
          };
        });
        setDensities(profiles);
      } catch (err) {
        console.error("Monument data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonumentsData();
  }, [fetchGlobalDensity]);

  const getDensityColor = (density: number) => {
    if (density > 80) return "text-red-400";
    if (density > 50) return "text-amber-400";
    return "text-teal-400";
  };
  
  const getDensityGradient = (density: number) => {
    if (density > 80) return "from-red-500";
    if (density > 50) return "from-amber-500";
    return "from-teal-500";
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading Live Monument Data...</div>;
  }

  if (monuments.length === 0) {
    return null; // Hide if no data
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl overflow-hidden mt-8 w-full max-w-5xl mx-auto mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent flex items-center gap-3">
          <MapIcon className="w-6 h-6 text-orange-500" />
          Monument Crowd Density Insights
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl">
          Check live and historical crowd patterns at famous monuments to plan your visit at the perfect time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monuments.map((monument) => {
          const densityData = densities[monument.id];
          if (!densityData) return null;

          return (
            <div key={monument.id} className="bg-muted/30 border border-border/50 rounded-xl overflow-hidden flex flex-col group hover:border-primary/30 transition-all duration-300">
              <div className="relative h-32 w-full overflow-hidden">
                <img 
                  src={monument.image_url || 'https://images.unsplash.com/photo-1621008779836-3a72d42ce563?q=80&w=400&auto=format&fit=crop'} 
                  alt={monument.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Live Badge */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-md rounded-full border border-border">
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                      densityData.current > 80 ? "bg-red-500 shadow-red-500/50" : 
                      densityData.current > 50 ? "bg-amber-500 shadow-amber-500/50" : 
                      "bg-emerald-500 shadow-emerald-500/50"
                    )} />
                    <span className="text-[10px] font-bold text-foreground tracking-wider">
                      {densityData.isRealTime ? "DETECTION: " : "ESTIMATED: "}{densityData.current}%
                    </span>
                  </div>
                  
                  {densityData.current > 75 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/80 backdrop-blur-md rounded-lg border border-red-400/50 animate-bounce shadow-lg">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span className="text-[9px] font-black text-white uppercase tracking-tighter">Heavy Crowd</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-foreground font-bold truncate text-sm">{monument.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{monument.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-md bg-muted", getDensityColor(densityData.current))}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Status</p>
                      <p className={cn("text-sm font-bold", getDensityColor(densityData.current))}>
                        {densityData.current > 80 ? 'Very Crowded' : densityData.current > 50 ? 'Moderate' : 'Uncrowded'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-primary mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{densityData.bestTime}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Best Time to Visit</p>
                  </div>
                </div>

                <div className="flex-1 mt-auto">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CalendarHeart className="w-3 h-3" /> Hourly Trend
                  </p>
                  <div className="h-16 w-full ml-[-10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={densityData.history}>
                        <defs>
                          <linearGradient id={`grad-${monument.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          tick={{ fill: 'currentColor', fontSize: 9 }}
                          className="text-muted-foreground/50"
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            color: 'hsl(var(--foreground))',
                            fontSize: '11px',
                            padding: '4px 8px'
                          }}
                          itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="density" 
                          stroke="#14b8a6" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill={`url(#grad-${monument.id})`} 
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonumentDensityList;
