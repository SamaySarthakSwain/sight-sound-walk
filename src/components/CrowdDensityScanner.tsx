import React, { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { Camera, AlertCircle, RefreshCw, BarChart2, Zap, LayoutDashboard, Clock, Users, Car } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

type DetectionRecord = {
  timestamp: Date;
  persons: number;
  vehicles: number;
};

type DensityLevel = "Low" | "Moderate" | "High";

const CrowdDensityScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [personCount, setPersonCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // History tracking local to this component
  const [history, setHistory] = useState<DetectionRecord[]>([]);

  // Load COCO-SSD Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Failed to load model", err);
        setError("Failed to load AI model.");
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // History Logger: Logs data every 5 seconds when active
  useEffect(() => {
    if (!isCameraActive || !model) return;
    
    const interval = setInterval(() => {
      setHistory(prev => {
        const newRecord = { timestamp: new Date(), persons: personCount, vehicles: vehicleCount };
        const newHistory = [...prev, newRecord];
        // Keep last 60 entries (5 minutes of data at 5s intervals)
        if (newHistory.length > 60) newHistory.shift();
        return newHistory;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isCameraActive, model, personCount, vehicleCount]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
          setError(null);
          detectObjects();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied or device not found.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setPersonCount(0);
    setVehicleCount(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const detectObjects = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Match canvas size to video layout
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    try {
      const predictions = await model.detect(video);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      let currentPersons = 0;
      let currentVehicles = 0;

      const vehicleClasses = ["car", "truck", "bus", "motorcycle", "bicycle"];

      predictions.forEach((prediction) => {
        const isPerson = prediction.class === "person";
        const isVehicle = vehicleClasses.includes(prediction.class);

        if (isPerson) currentPersons++;
        if (isVehicle) currentVehicles++;

        if ((isPerson || isVehicle) && prediction.score > 0.5) {
          const [x, y, width, height] = prediction.bbox;

          ctx.strokeStyle = isPerson ? "#14b8a6" : "#f59e0b"; // Teal for people, Amber for vehicles
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = isPerson ? "#14b8a6" : "#f59e0b";
          const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(x, y - 24, textWidth + 8, 24);

          ctx.fillStyle = "#ffffff";
          ctx.font = "14px Arial";
          ctx.fillText(label, x + 4, y - 6);
        }
      });

      setPersonCount(currentPersons);
      setVehicleCount(currentVehicles);
    } catch (err) {
      console.error("Detection error:", err);
    }

    animationFrameRef.current = requestAnimationFrame(detectObjects);
  }, [model]);

  const getDensityLevel = (persons: number): { level: DensityLevel; color: string; desc: string } => {
    if (persons > 10) return { level: "High", color: "text-red-400", desc: "Crowded Area" };
    if (persons > 5) return { level: "Moderate", color: "text-amber-400", desc: "Busy Area" };
    return { level: "Low", color: "text-teal-400", desc: "Clear Area" };
  };

  const densityInfo = getDensityLevel(personCount);

  // Format data for Recharts
  const chartData = history.map(h => ({
    time: h.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    crowd: h.persons,
    vehicles: h.vehicles
  }));

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden mt-12 w-full max-w-5xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-teal-400" />
            Live Crowd & Traffic Density (Beta)
          </h2>
          <p className="text-white/60 mt-2 text-sm max-w-xl">
            Real-time on-device AI analysis to monitor crowd and traffic flow safely. Your video stream is analyzed locally and never leaves your device.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isModelLoading && (
            <span className="text-xs text-white/50 animate-pulse flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Loading AI Core...
            </span>
          )}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              disabled={isModelLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Camera className="w-4 h-4" />
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl transition-all duration-300 text-sm font-medium"
            >
              Stop Scanner
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8">
          <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Camera View */}
          <div className="relative aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 shadow-inner">
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 p-6 text-center">
                <Camera className="w-12 h-12 mb-4 opacity-50" />
                <p>Scanner inactive. Click Start to begin tracking.</p>
              </div>
            )}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? "opacity-100" : "opacity-0"}`}
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isCameraActive ? "opacity-100" : "opacity-0"}`}
            />
            
            {/* Live Indicator overlay */}
            {isCameraActive && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium tracking-wide text-white/90">LIVE DETECT</span>
              </div>
            )}
            
            {/* Density Overlay */}
            {isCameraActive && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-wider mb-1">Density Level</p>
                    <p className={`text-xl font-bold ${densityInfo.color}`}>{densityInfo.level}</p>
                    <p className="text-xs text-white/40 mt-0.5">{densityInfo.desc}</p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-1">
                        <Users className="w-4 h-4 text-teal-400" />
                        <span className="text-xs uppercase tracking-wider font-medium">People</span>
                      </div>
                      <span className="text-2xl font-bold font-mono text-white">{personCount}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-1">
                        <Car className="w-4 h-4 text-amber-400" />
                        <span className="text-xs uppercase tracking-wider font-medium">Vehicles</span>
                      </div>
                      <span className="text-2xl font-bold font-mono text-white">{vehicleCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner">
             <h3 className="text-sm font-semibold text-white/90 mb-6 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Live Insights
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-white/60">Crowd Capacity Limit</span>
                  <span className="text-xs font-mono text-white/40">{Math.min(100, Math.round((personCount / 20) * 100))}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (personCount / 20) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-white/60">Vehicle Load</span>
                  <span className="text-xs font-mono text-white/40">{Math.min(100, Math.round((vehicleCount / 10) * 100))}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (vehicleCount / 10) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Historical Timeline */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner flex flex-col min-h-[260px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                History Timeline
              </h3>
              <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded border border-white/10 bg-black/20">
                {history.length} data points
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-end min-h-[160px]">
              {history.length < 2 ? (
                <div className="flex flex-col items-center justify-center text-white/30 gap-3 h-full pb-6">
                  <Clock className="w-8 h-8 opacity-50" />
                  <p className="text-xs text-center">Start scanner & wait a few seconds<br/>to build history...</p>
                </div>
              ) : (
                <div className="h-[160px] w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="crowdColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="vehicleColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(10,10,10,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="crowd" 
                        stroke="#14b8a6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#crowdColor)" 
                        isAnimationActive={false}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="vehicles" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#vehicleColor)" 
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-2 justify-center border-t border-white/5 pt-3">
               <span className="flex items-center gap-1.5 text-[10px] text-white/50"><span className="w-2 h-2 rounded-full bg-teal-400" />People Trend</span>
               <span className="flex items-center gap-1.5 text-[10px] text-white/50"><span className="w-2 h-2 rounded-full bg-amber-400" />Vehicle Trend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdDensityScanner;
