import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";
import { useTrafficDensity } from "@/hooks/useTrafficDensity";

const TrafficCharts = () => {
  const { peers } = useWebRTC();
  const { personCount, vehicleCount } = useDetection();
  const { densities } = useTrafficDensity(30000);

  const peerList = Object.values(peers) as PeerData[];
  const totalPersons = peerList.reduce((sum, p) => sum + (p.personCount || 0), 0) + personCount;
  const totalVehicles = peerList.reduce((sum, p) => sum + (p.vehicleCount || 0), 0) + vehicleCount;

  // Build zone data from server density data (top zones)
  const zoneData = densities.length > 0
    ? densities
        .sort((a, b) => b.currentDensity - a.currentDensity)
        .slice(0, 8)
        .map((d) => ({ zone: d.name.replace(/ Square| Junction/g, ""), density: d.currentDensity }))
    : [];

  // Build a simple timeline showing current camera data point
  const now = new Date();
  const hour = now.getHours();
  const crowdData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    crowd: i === hour ? totalPersons : 0,
    vehicles: i === hour ? totalVehicles : 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Live Crowd & Traffic (Current Hour)</h3>
        {totalPersons === 0 && totalVehicles === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-xs text-muted-foreground">
            Start camera to see live crowd/vehicle data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={crowdData.filter((_, i) => Math.abs(i - hour) <= 2)}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187 85% 48%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(187 85% 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vehicleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38 95% 55%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(38 95% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220 25% 12%)", border: "1px solid hsl(220 20% 18%)", borderRadius: 8, color: "hsl(210 30% 90%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="crowd" stroke="hsl(187 85% 48%)" fill="url(#crowdGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="vehicles" stroke="hsl(38 95% 55%)" fill="url(#vehicleGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Crowd ({totalPersons})</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-accent" />Vehicles ({totalVehicles})</span>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Server Traffic Density — Top Zones</h3>
        {zoneData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-xs text-muted-foreground">
            Loading server traffic data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={zoneData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
              <XAxis dataKey="zone" tick={{ fill: "hsl(215 15% 55%)", fontSize: 9 }} tickLine={false} axisLine={false} angle={-20} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "hsl(220 25% 12%)", border: "1px solid hsl(220 20% 18%)", borderRadius: 8, color: "hsl(210 30% 90%)", fontSize: 12 }} />
              <Bar dataKey="density" radius={[4, 4, 0, 0]} fill="hsl(187 85% 48%)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrafficCharts;
