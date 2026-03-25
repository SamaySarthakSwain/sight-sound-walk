import React, { useEffect, useState } from "react";
import { useCity } from "@/contexts/CityContext";
import { 
  CloudRain, CloudSun, Cloud, Sun, CloudLightning, 
  Snowflake, Wind, Droplet, Thermometer, CloudFog, 
  Moon, Loader2, MapPin
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { motion } from "framer-motion";

// WMO Weather interpretation codes
const getWeatherIcon = (code: number, isDay: boolean = true) => {
  if (code === 0) return isDay ? <Sun className="w-8 h-8 text-yellow-400" /> : <Moon className="w-8 h-8 text-slate-300" />;
  if (code === 1 || code === 2) return <CloudSun className="w-8 h-8 text-orange-300" />;
  if (code === 3) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (code >= 45 && code <= 48) return <CloudFog className="w-8 h-8 text-gray-400" />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <Snowflake className="w-8 h-8 text-blue-200" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return "Clear Sky";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Unknown";
};

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max?: number[];
  };
}

const WeatherReport = () => {
  const { selectedCity, cityLat, cityLng } = useCity();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("Could not load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityLat, cityLng]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <p>Fetching real-time weather...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-destructive h-[600px]">
        <CloudLightning className="w-12 h-12 mb-4" />
        <p>{error || "Data unavailable"}</p>
      </div>
    );
  }

  const { current, hourly, daily } = data;
  const isDay = current.is_day === 1;

  // Find next 24 hours
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(t => new Date(t).getHours() === now.getHours() && new Date(t).getDate() === now.getDate());
  const startIdx = currentHourIndex >= 0 ? currentHourIndex : 0;
  const next24Hours = hourly.time.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: t,
    temp: hourly.temperature_2m[startIdx + i],
    code: hourly.weather_code[startIdx + i]
  }));

  const bgGradient = isDay 
    ? "bg-gradient-to-b from-blue-400/80 to-blue-600/80 dark:from-blue-900/40 dark:to-slate-900/60" 
    : "bg-gradient-to-b from-slate-800/90 to-slate-950/90";

  return (
    <div className={`rounded-2xl overflow-hidden ${bgGradient} text-white shadow-xl border border-white/10 p-6 space-y-8 animate-in fade-in duration-500`}>
      {/* Current Weather Header */}
      <div className="text-center space-y-2 mt-4">
        <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
          <MapPin className="w-4 h-4" />
          <span className="text-lg">{selectedCity.split(",")[0]}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex items-center gap-6"
          >
            <div className="scale-150 drop-shadow-lg">
              {getWeatherIcon(current.weather_code, isDay)}
            </div>
            <div className="text-7xl font-light tracking-tighter drop-shadow-md">
              {Math.round(current.temperature_2m)}°
            </div>
          </motion.div>
          <div className="text-2xl font-medium mt-4 tracking-wide text-white/90 drop-shadow">
            {getWeatherDescription(current.weather_code)}
          </div>
          <div className="text-sm font-medium text-white/70 mt-2">
            H: {Math.round(daily.temperature_2m_max[0])}°  L: {Math.round(daily.temperature_2m_min[0])}°
          </div>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5">
        <div className="flex flex-col items-center p-2">
          <Thermometer className="w-5 h-5 text-red-300 mb-1" />
          <span className="text-xs text-white/60 mb-1">Feels Like</span>
          <span className="font-semibold">{Math.round(current.apparent_temperature)}°</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <Wind className="w-5 h-5 text-blue-200 mb-1" />
          <span className="text-xs text-white/60 mb-1">Wind</span>
          <span className="font-semibold">{current.wind_speed_10m} km/h</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <Droplet className="w-5 h-5 text-blue-400 mb-1" />
          <span className="text-xs text-white/60 mb-1">Humidity</span>
          <span className="font-semibold">{current.relative_humidity_2m}%</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <Cloud className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-xs text-white/60 mb-1">UV Index</span>
          <span className="font-semibold">{Math.round(daily.uv_index_max?.[0] || 0)}</span>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 px-2">Today</h3>
        <Card className="bg-black/20 border-white/5 backdrop-blur-md overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex p-4 gap-6">
              {next24Hours.map((hour, idx) => {
                const isNow = idx === 0;
                const timeStr = isNow ? "Now" : format(new Date(hour.time), "ha");
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 min-w-[3rem]">
                    <span className={`text-sm ${isNow ? "font-bold text-white" : "text-white/70"}`}>
                      {timeStr}
                    </span>
                    <div>
                      {getWeatherIcon(hour.code, true)}
                    </div>
                    <span className="font-semibold text-lg">{Math.round(hour.temp)}°</span>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="bg-white/5" />
          </ScrollArea>
        </Card>
      </div>

      {/* Daily Forecast */}
      <div className="space-y-3 pb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 px-2">7-Day Forecast</h3>
        <Card className="bg-black/20 border-white/5 backdrop-blur-md p-4 space-y-4">
          {daily.time.slice(0, 7).map((dayTime, idx) => {
            const isToday = idx === 0;
            const dayName = isToday ? "Today" : format(new Date(dayTime), "EEEE");
            return (
              <div key={idx} className="flex items-center justify-between">
                <span className={`w-24 ${isToday ? "font-bold" : "text-white/90"}`}>{dayName}</span>
                <div className="flex items-center justify-center w-12">
                  {getWeatherIcon(daily.weather_code[idx], true)}
                </div>
                <div className="flex items-center gap-4 w-32 justify-end font-medium">
                  <span className="text-white/60">{Math.round(daily.temperature_2m_min[idx])}°</span>
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 opacity-60"></div>
                  <span className="text-white">{Math.round(daily.temperature_2m_max[idx])}°</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default WeatherReport;
