import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Loader2, Users, Car, Download, RefreshCw } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useDetection } from "@/contexts/DetectionContext";
import { useWebRTC } from "@/contexts/WebRTCContext";
import { motion } from "framer-motion";

const VEHICLE_CLASSES = ["car", "truck", "bus", "motorcycle", "bicycle"];
const VEHICLE_COLOR = "#ffab00";

const getPersonColor = (totalPersons: number) => {
  if (totalPersons > 10) return "#ef4444"; // red - high crowd
  if (totalPersons > 5) return "#f59e0b";  // amber - medium crowd
  return "#22c55e"; // green - low crowd
};

const drawBox = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  label: string, color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const cornerLen = 15;
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  [[x, y + cornerLen, x, y, x + cornerLen, y],
  [x + w - cornerLen, y, x + w, y, x + w, y + cornerLen],
  [x, y + h - cornerLen, x, y + h, x + cornerLen, y + h],
  [x + w - cornerLen, y + h, x + w, y + h, x + w, y + h - cornerLen],
  ].forEach(([x1, y1, x2, y2, x3, y3]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.stroke();
  });

  ctx.font = "bold 12px monospace";
  const tw = ctx.measureText(label).width;
  ctx.fillStyle = color.replace(")", ", 0.85)").replace("rgb", "rgba").includes("rgba") ? color : color;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(x, y - 20, tw + 8, 20);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000";
  ctx.fillText(label, x + 4, y - 6);
};

const LiveCameraDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const lastMetadataRef = useRef({ time: 0, p: -1, v: -1 });
  const { personCount, vehicleCount, setPersonCount, setVehicleCount } = useDetection();
  const { setLocalStream, handleMetadataUpdate, gpsCoords } = useWebRTC();

  useEffect(() => {
    let cancelled = false;
    const loadModel = async () => {
      try {
        await tf.ready();
        const loaded = await cocoSsd.load({ base: "mobilenet_v2" });
        if (!cancelled) { setModel(loaded); setLoading(false); }
      } catch (e) {
        console.error("Model load error:", e);
        if (!cancelled) { setError("Failed to load detection model"); setLoading(false); }
      }
    };
    loadModel();
    return () => { cancelled = true; };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setError(null);
        setLocalStream(stream);
      }
    } catch (e) {
      console.error("Camera error:", e);
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setCameraActive(false);
    setPersonCount(0);
    setVehicleCount(0);
  }, [setPersonCount, setVehicleCount]);

  const switchCamera = useCallback(async () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    
    if (cameraActive) {
      stopCamera();
      // Small timeout to ensure stream is released before acquiring new one
      setTimeout(() => startCamera(), 100);
    }
  }, [facingMode, cameraActive, stopCamera, startCamera]);

  const takeScreenshot = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `crowdflow-snapshot-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }, []);

  // Detection loop
  useEffect(() => {
    if (!model || !cameraActive || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const detect = async () => {
      if (!running || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const predictions = (await model.detect(video, 40, 0.2)).filter(p => p.score >= 0.2);
      ctx.drawImage(video, 0, 0);

      const persons = predictions.filter((p) => p.class === "person");
      const vehicles = predictions.filter((p) => VEHICLE_CLASSES.includes(p.class));

      setPersonCount(persons.length);
      setVehicleCount(vehicles.length);

      const now = Date.now();
      if (
        now - lastMetadataRef.current.time > 1000 &&
        (persons.length !== lastMetadataRef.current.p || vehicles.length !== lastMetadataRef.current.v)
      ) {
        handleMetadataUpdate(persons.length, vehicles.length, undefined, gpsCoords);
        lastMetadataRef.current = { time: now, p: persons.length, v: vehicles.length };
      }

      const personColor = getPersonColor(persons.length);

      persons.forEach((p) => {
        const [x, y, w, h] = p.bbox;
        drawBox(ctx, x, y, w, h, `person ${(p.score * 100).toFixed(0)}%`, personColor);
      });

      vehicles.forEach((p) => {
        const [x, y, w, h] = p.bbox;
        drawBox(ctx, x, y, w, h, `${p.class} ${(p.score * 100).toFixed(0)}%`, VEHICLE_COLOR);
      });

      // Overlay counts
      ctx.font = "bold 16px monospace";
      const pLabel = `Persons: ${persons.length}`;
      const vLabel = `Vehicles: ${vehicles.length}`;
      const pW = ctx.measureText(pLabel).width;
      const vW = ctx.measureText(vLabel).width;
      const totalW = Math.max(pW, vW) + 16;

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(8, 8, totalW, 52);
      ctx.fillStyle = personColor;
      ctx.fillText(pLabel, 16, 28);

      // Crowd level indicator
      const crowdLabel = persons.length > 10 ? "🔴 HIGH CROWD" : persons.length > 5 ? "🟡 MODERATE" : "🟢 LOW CROWD";
      ctx.font = "bold 14px monospace";
      const clW = ctx.measureText(crowdLabel).width;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(canvas.width - clW - 24, 8, clW + 16, 30);
      ctx.fillStyle = personColor;
      ctx.fillText(crowdLabel, canvas.width - clW - 16, 28);
      ctx.fillStyle = VEHICLE_COLOR;
      ctx.fillText(vLabel, 16, 50);

      if (running) animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
    return () => { running = false; if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [model, cameraActive, setPersonCount, setVehicleCount]);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest text-glow">Live Camera Detection</h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {cameraActive && (
            <>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 shadow-inner">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xl font-bold font-mono text-primary" style={{ textShadow: "0 0 10px rgba(var(--primary),0.5)" }}>{personCount}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">persons</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-2 shadow-inner">
                <Car className="w-4 h-4 text-accent" />
                <span className="text-xl font-bold font-mono text-accent" style={{ textShadow: "0 0 10px rgba(var(--accent),0.5)" }}>{vehicleCount}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">vehicles</span>
              </div>
              <button
                onClick={takeScreenshot}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-muted/80 border border-border text-foreground hover:bg-muted transition-all duration-300 backdrop-blur-md"
              >
                <Download className="w-4 h-4" />
                Snapshot
              </button>
            </>
          )}
          <button
            onClick={cameraActive ? stopCamera : startCamera}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg ${cameraActive
              ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_rgba(var(--destructive),0.6)]"
              : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.6)]"
              } disabled:opacity-50 disabled:hover:bg-primary/20 disabled:hover:text-primary disabled:hover:shadow-none`}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Loading Model...</>
            ) : cameraActive ? (
              <><CameraOff className="w-4 h-4" /> Stop</>
            ) : (
              <><Camera className="w-4 h-4" /> Start Camera</>
            )}
          </button>
          <button
            onClick={switchCamera}
            className="p-2.5 rounded-xl bg-muted/80 border border-border text-foreground hover:bg-muted transition-all duration-300 backdrop-blur-md"
            title="Switch Camera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium backdrop-blur-md relative z-10">{error}</div>
      )}

      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 dark:bg-black/40 border border-border shadow-inner z-10 backdrop-blur-sm">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ display: "none" }} playsInline muted />
        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-contain ${cameraActive ? "block" : "hidden"}`} />
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className={`w-20 h-20 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center shadow-inner ${loading ? 'animate-pulse' : ''}`}>
              <Camera className="w-10 h-10 text-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground font-mono tracking-wider">
              {loading ? "Loading AI models..." : "System Idle. Start camera to begin."}
            </p>
            {loading && <div className="mt-2"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveCameraDetection;
