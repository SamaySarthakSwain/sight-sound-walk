import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin } from "lucide-react";
import { useWebRTC } from "@/contexts/WebRTCContext";

const JoinSessionModal = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isJoin = searchParams.get("join") === "true";
    const session = searchParams.get("session");
    const { setUserInfo, setLocalStream } = useWebRTC();

    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (isJoin && session) {
            setOpen(true);
        }
    }, [isJoin, session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !location.trim()) return;

        setUserInfo(username, location);
        setOpen(false);

        // Remove join param so it doesn't stay open on refresh, but keep session param
        searchParams.delete("join");
        setSearchParams(searchParams);

        // Automatically request camera access after joining
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
        } catch (err) {
            console.error("Camera access denied:", err);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-foreground mb-2">Join Camera Session</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Enter your details to share your live camera feed with the host.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g. Traffic Cop 1"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. North Gate"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-6"
                            >
                                Connect Camera
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JoinSessionModal;
