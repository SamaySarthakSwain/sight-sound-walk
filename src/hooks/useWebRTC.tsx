import { useEffect, useRef, useState, useCallback } from "react";

export type PeerData = {
    id: string;
    username: string;
    location: string;
    stream: MediaStream | null;
    personCount: number;
    vehicleCount: number;
    bboxes?: unknown[];
    isLocal?: boolean;
    gpsCoords?: { lat: number; lng: number } | null;
};

export const useWebRTC = (
    sessionId: string | null, 
    userId: string | null, 
    username: string, 
    location: string, 
    onPeerDataUpdate: (peers: PeerData[]) => void
) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const localStreamRef = useRef<MediaStream | null>(null);

    const startStreaming = useCallback(async (
        personCount: number,
        vehicleCount: number,
        bboxes: unknown[],
        gpsCoords: { lat: number; lng: number } | null
    ) => {
        if (!userId) return;
        
        try {
            if (!localStreamRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 15 },
                    },
                    audio: false
                });
                localStreamRef.current = stream;
            }
            
            setIsStreaming(true);

            // Mock updating local peer data
            onPeerDataUpdate([{
                id: userId,
                username,
                location,
                stream: localStreamRef.current,
                personCount,
                vehicleCount,
                bboxes,
                isLocal: true,
                gpsCoords,
            }]);

        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }, [userId, username, location, onPeerDataUpdate]);

    const stopStreaming = useCallback(() => {
        setIsStreaming(false);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        onPeerDataUpdate([]);
    }, [onPeerDataUpdate]);

    useEffect(() => {
        return () => {
            stopStreaming();
        };
    }, [stopStreaming]);

    return { startStreaming, stopStreaming, isStreaming };
};
