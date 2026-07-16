import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Car, MapPin, Camera, CameraOff, LogOut, Loader2, AlertTriangle, Mic, Video, Monitor, MoreVertical, PhoneOff, QrCode, Copy, Check, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWebRTC, PeerData } from "@/contexts/WebRTCContext";
import { useDetection } from "@/contexts/DetectionContext";
import { VideoPlayer } from "@/components/dashboard/VideoPlayer";
import JoinSessionModal from "@/components/dashboard/JoinSessionModal";
import CrowdDensityOverview from "@/components/dashboard/CrowdDensityOverview";
import { WebRTCProvider } from "@/contexts/WebRTCContext";
import { DetectionProvider } from "@/contexts/DetectionContext";
import { DetectionEngine } from "@/components/dashboard/DetectionEngine";
import { RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCrowdPersistence } from "@/hooks/useCrowdPersistence";


const getCrowdDensity = (count: number) => {
    if (count > 10) return { label: "HIGH CROWD", level: "high", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/40" };
    if (count > 5) return { label: "MODERATE", level: "moderate", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/40" };
    return { label: "LOW", level: "low", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40" };
};

const LiveRoomContent = () => {
    const navigate = useNavigate();
    const { localStream, setLocalStream, peers, username, location, sessionId } = useWebRTC();
    const { personCount, vehicleCount, bboxes } = useDetection();
    const { saveRecord } = useCrowdPersistence(sessionId);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Auto-save detection data periodically if we are the streamer
    useEffect(() => {
        if (!localStream || !sessionId || !username) return;

        const interval = setInterval(() => {
            if (personCount > 0 || vehicleCount > 0) {
                saveRecord({
                    username,
                    location: location || "Live Room",
                    person_count: personCount,
                    vehicle_count: vehicleCount
                });
            }
        }, 15000); // Every 15 seconds save a snapshot

        return () => clearInterval(interval);
    }, [localStream, sessionId, username, location, personCount, vehicleCount, saveRecord]);
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);

    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const sessionUrl = sessionId ? `${appUrl}/crowd/room?session=${sessionId}&join=true` : `${appUrl}/crowd/room`;

    const handleCopy = () => {
        navigator.clipboard.writeText(sessionUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const [isStartingCamera, setIsStartingCamera] = useState(false);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const { handleMetadataUpdate } = useWebRTC();

    const toggleCamera = useCallback(async () => {
        if (localStream) {
            localStream.getTracks().forEach((t) => t.stop());
            setLocalStream(null);
            handleMetadataUpdate(0, 0); // Reset on stop
        } else {
            setIsStartingCamera(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                });
                setLocalStream(stream);
            } catch (e) {
                console.error("Camera error:", e);
                alert("Camera access denied. Please allow camera permissions.");
            } finally {
                setIsStartingCamera(false);
            }
        }
    }, [localStream, setLocalStream, facingMode, handleMetadataUpdate]);

    const switchCamera = useCallback(async () => {
        const nextMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(nextMode);
        
        if (localStream) {
            localStream.getTracks().forEach((t) => t.stop());
            setIsStartingCamera(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: nextMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                });
                setLocalStream(stream);
            } catch (e) {
                console.error("Camera switch error:", e);
            } finally {
                setIsStartingCamera(false);
            }
        }
    }, [facingMode, localStream, setLocalStream]);

    // Sync detection to WebRTC peers
    useEffect(() => {
        if (username && (personCount > 0 || vehicleCount > 0 || (bboxes && bboxes.length > 0))) {
            handleMetadataUpdate(personCount, vehicleCount, bboxes);
        }
    }, [personCount, vehicleCount, bboxes, username, handleMetadataUpdate]);

    useEffect(() => {
        if (username && !localStream && !isStartingCamera) {
            toggleCamera();
        }
    }, [username, localStream, isStartingCamera, toggleCamera]);

    const allPeers = [
        {
            id: "local",
            username: username || "You",
            location: location || "Local",
            stream: localStream,
            personCount,
            vehicleCount,
            bboxes,
            isLocal: true,
        },
        ...(Object.values(peers) as PeerData[]),
    ];

    const totalPersons = allPeers.reduce((sum, p) => sum + (p.personCount || 0), 0);
    const totalVehicles = allPeers.reduce((sum, p) => sum + (p.vehicleCount || 0), 0);
    const highCrowdAlert = totalPersons > 10;

    // Grid layout based on participant count (Google Meet style)
    const getGridClass = (count: number) => {
        if (count === 1) return "grid-cols-1 max-w-3xl mx-auto";
        if (count === 2) return "grid-cols-2";
        if (count <= 4) return "grid-cols-2";
        if (count <= 6) return "grid-cols-3";
        if (count <= 9) return "grid-cols-3";
        return "grid-cols-4";
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <JoinSessionModal />

            {/* Red Alert Banner */}
            <AnimatePresence>
                {highCrowdAlert && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-600/90 backdrop-blur-sm border-b border-red-500/50 overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-center gap-3 py-2.5 px-4">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-white font-bold text-sm tracking-wide">
                                ⚠️ HIGH CROWD ALERT — {totalPersons} persons detected across {allPeers.length} camera{allPeers.length > 1 ? "s" : ""}
                            </span>
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}
                            >
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Area */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar pb-24">
                <div className="max-w-[1600px] mx-auto space-y-6 w-full">
                    <CrowdDensityOverview />
                    <DetectionEngine stream={localStream} />

                    {/* QR Code Panel */}
                    <AnimatePresence>
                        {showQR && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="p-4 rounded-xl bg-white shrink-0 border border-border">
                                            <QRCodeSVG
                                                value={sessionUrl}
                                                size={160}
                                                bgColor="#ffffff"
                                                fgColor="#0a0e1a"
                                                level="H"
                                                includeMargin={false}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3 text-center sm:text-left">
                                            <h3 className="text-lg font-bold text-foreground">Invite Others to This Room</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Anyone who scans this QR code will join this room. Their camera feed will appear here automatically for everyone to see.
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    readOnly
                                                    value={sessionUrl}
                                                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono"
                                                />
                                                <button
                                                    onClick={handleCopy}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                                                >
                                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                    {copied ? "Copied!" : "Copy Link"}
                                                </button>
                                            </div>
                                            <div className="flex gap-2 text-[10px] text-muted-foreground font-mono">
                                                <span>• Camera auto-starts on join</span>
                                                <span>• Detection runs on each device</span>
                                                <span>• All feeds visible to everyone</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className={`grid ${getGridClass(allPeers.length)} gap-3 w-full transition-all duration-500`}>
                    <AnimatePresence>
                        {allPeers.map((peer, i) => {
                            const density = getCrowdDensity(peer.personCount);
                            const isHighCrowd = density.level === "high";

                            return (
                                <motion.div
                                    key={peer.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`relative rounded-lg overflow-hidden bg-muted border border-border aspect-video ${isHighCrowd ? "ring-2 ring-red-500 ring-offset-1 ring-offset-background" : ""}`}
                                >
                                    {/* Pulsing red border for high crowd */}
                                    {isHighCrowd && (
                                        <motion.div
                                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 rounded-lg border-2 border-red-500 z-30 pointer-events-none"
                                        />
                                    )}

                                    {/* Video / Camera Off */}
                                    <div className="absolute inset-0">
                                        {peer.stream ? (
                                            <VideoPlayer stream={peer.stream} showDetection={true} personCount={peer.personCount} bboxes={peer.bboxes} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                                                    <span className="text-2xl font-bold text-foreground">
                                                        {(peer.username || "U").charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Live Count Overlay — always visible */}
                                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                                        {/* Crowd density badge */}
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${density.bg} ${density.border} border backdrop-blur-sm`}>
                                            {isHighCrowd && (
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                                                    <AlertTriangle className="w-3 h-3 text-red-400" />
                                                </motion.div>
                                            )}
                                            <span className={`text-[10px] font-bold tracking-wider ${density.color}`}>
                                                {density.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continuous live counts — bottom-left */}
                                    <div className="absolute bottom-8 left-2 z-20 flex gap-1.5">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                                            <Users className="w-3 h-3 text-blue-400" />
                                            <span className="text-xs font-bold font-mono text-white">{peer.personCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                                            <Car className="w-3 h-3 text-purple-400" />
                                            <span className="text-xs font-bold font-mono text-white">{peer.vehicleCount}</span>
                                        </div>
                                    </div>

                                    {/* Username label — bottom-left (Google Meet style) */}
                                    <div className="absolute bottom-1.5 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                                        <span className="text-xs text-white font-medium drop-shadow-lg truncate max-w-[140px]">
                                            {peer.username}{peer.isLocal ? " (You)" : ""}
                                        </span>
                                    </div>

                                    {/* Location pin — top-left */}
                                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md shadow-lg border border-white/10">
                                        <MapPin className="w-3 h-3 text-blue-400" />
                                        <span className="text-[10px] text-gray-200 font-medium truncate max-w-[100px]">{peer.location}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                </div>
            </main>

            {/* Bottom Control Bar (Google Meet style) */}
            <footer className="bg-background border-t border-border py-3 px-4 flex items-center justify-between shrink-0 shadow-lg">
                {/* Left: Meeting info */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground font-medium">
                        {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-xs text-muted-foreground">CrowdFlow Live Room</span>
                </div>

                {/* Center: Controls */}
                <div className="flex items-center gap-2">
                    {/* Total counts summary */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mr-3">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold font-mono text-blue-400">{totalPersons}</span>
                        <span className="text-gray-500 mx-1">·</span>
                        <Car className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-bold font-mono text-purple-400">{totalVehicles}</span>
                    </div>

                    <button
                        onClick={() => setShowQR(!showQR)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${showQR ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-muted hover:bg-accent text-foreground border border-border"}`}
                        title="Share QR Code"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors shadow-sm">
                        <Mic className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                        onClick={toggleCamera}
                        disabled={isStartingCamera}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative shadow-sm border ${localStream ? "bg-red-500 hover:bg-red-600 border-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)] text-white" : "bg-muted hover:bg-accent border-border text-foreground"
                            }`}
                    >
                        {isStartingCamera ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : localStream ? (
                            <CameraOff className="w-5 h-5" />
                        ) : (
                            <Video className="w-5 h-5" />
                        )}
                        <AnimatePresence>
                            {!localStream && !isStartingCamera && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"
                                />
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={switchCamera}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors shadow-sm text-foreground"
                        title="Switch Camera (Front/Rear)"
                    >
                        <RefreshCw className={`w-5 h-5 ${isStartingCamera ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors shadow-sm text-foreground">
                        <Monitor className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors shadow-sm text-foreground">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-14 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors ml-2 shadow-sm border border-red-500 text-white"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </button>
                </div>

                {/* Right: Participant count */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{allPeers.length}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const LiveRoom = () => (
    <WebRTCProvider>
        <DetectionProvider>
            <LiveRoomContent />
        </DetectionProvider>
    </WebRTCProvider>
);

export default LiveRoom;
