import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWebRTC as useWebRTCHook, PeerData } from '@/hooks/useWebRTC';

type WebRTCState = {
    sessionId: string | null;
    username: string | null;
    location: string | null;
    gpsCoords: { lat: number; lng: number } | null;
    setUserInfo: (username: string, location: string) => void;
    setGpsCoords: (coords: { lat: number; lng: number } | null) => void;
    peers: Record<string, PeerData>;
    localStream: MediaStream | null;
    setLocalStream: (stream: MediaStream) => void;
    handleMetadataUpdate: (personCount: number, vehicleCount: number, bboxes?: any[], gpsCoords?: { lat: number; lng: number } | null) => void;
};

const WebRTCContext = createContext<WebRTCState | undefined>(undefined);

export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isJoining = searchParams.get('join') === 'true';

    const [sessionId, setSessionId] = useState<string | null>(() => {
        const urlSession = searchParams.get('session');
        if (urlSession) return urlSession;
        if (isJoining) return null;
        return Math.random().toString(36).substring(2, 9);
    });

    const [username, setUsername] = useState<string | null>(() => isJoining ? null : 'Host');
    const [location, setLocation] = useState<string | null>(() => isJoining ? null : 'Main Device');
    const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Auto-detect GPS on mount
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => console.warn("GPS unavailable:", err.message),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const session = searchParams.get('session');
        if (session && session !== sessionId) {
            setSessionId(session);
        } else if (sessionId && !session && !isJoining) {
            setSearchParams((params) => {
                params.set('session', sessionId);
                return params;
            }, { replace: true });
        }
    }, [searchParams, sessionId, setSearchParams, isJoining]);

    const setUserInfo = (name: string, loc: string) => {
        setUsername(name);
        setLocation(loc);
    };

    const { localStream, peers, setLocalStream, handleMetadataUpdate } = useWebRTCHook(sessionId, username, location);

    return (
        <WebRTCContext.Provider value={{ sessionId, username, location, gpsCoords, setGpsCoords, setUserInfo, peers, localStream, setLocalStream, handleMetadataUpdate }}>
            {children}
        </WebRTCContext.Provider>
    );
};

export type { PeerData };
export const useWebRTC = () => {
    const context = useContext(WebRTCContext);
    if (context === undefined) {
        throw new Error('useWebRTC must be used within a WebRTCProvider');
    }
    return context;
};
