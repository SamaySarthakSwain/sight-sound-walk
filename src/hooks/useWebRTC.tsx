import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PeerData = {
    id: string;
    username: string;
    location: string;
    stream: MediaStream | null;
    personCount: number;
    vehicleCount: number;
    isLocal?: boolean;
    gpsCoords?: { lat: number; lng: number } | null;
};

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
    iceCandidatePoolSize: 10,
};

export const useWebRTC = (sessionId: string | null, username: string | null, location: string | null) => {
    const [peers, setPeers] = useState<Record<string, PeerData>>({});
    const [localStream, setLocalStreamState] = useState<MediaStream | null>(null);
    const peersRef = useRef<Record<string, PeerData>>({});
    const connectionsRef = useRef<Record<string, RTCPeerConnection>>({});
    const localStreamRef = useRef<MediaStream | null>(null);
    const channelRef = useRef<any>(null);
    const clientId = useRef(Math.random().toString(36).substring(2, 9)).current;

    // We need to keep refs synced with state so we can access current state in event listeners
    useEffect(() => {
        peersRef.current = peers;
    }, [peers]);

    const updatePeer = useCallback((id: string, updates: Partial<PeerData>) => {
        setPeers((prev) => {
            const existing = prev[id] || {
                id,
                username: "Unknown",
                location: "Unknown",
                stream: null,
                personCount: 0,
                vehicleCount: 0,
            };
            return { ...prev, [id]: { ...existing, ...updates } };
        });
    }, []);

    const removePeer = useCallback((id: string) => {
        if (connectionsRef.current[id]) {
            connectionsRef.current[id].close();
            delete connectionsRef.current[id];
        }
        setPeers((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    }, []);

    const broadcastMessage = useCallback((payload: any) => {
        if (channelRef.current) {
            channelRef.current.send({
                type: "broadcast",
                event: "webrtc",
                payload: { ...payload, senderId: clientId },
            });
        }
    }, [clientId]);

    const createPeerConnection = useCallback((peerId: string) => {
        if (connectionsRef.current[peerId]) {
            connectionsRef.current[peerId].close();
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        connectionsRef.current[peerId] = pc;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                broadcastMessage({
                    type: "ice-candidate",
                    targetId: peerId,
                    candidate: event.candidate,
                });
            }
        };

        pc.ontrack = (event) => {
            updatePeer(peerId, { stream: event.streams[0] });
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed" || pc.iceConnectionState === "closed") {
                removePeer(peerId);
            }
        };

        return pc;
    }, [broadcastMessage, updatePeer, removePeer]);

    const handleMetadataUpdate = useCallback((personCount: number, vehicleCount: number, gpsCoords?: { lat: number; lng: number } | null) => {
        if (!sessionId || !username) return;
        broadcastMessage({
            type: "metadata-update",
            personCount,
            vehicleCount,
            gpsCoords,
        });
    }, [sessionId, username, broadcastMessage]);

    useEffect(() => {
        if (!sessionId || !username || !location) return;

        const channel = supabase.channel(`webrtc-${sessionId}`, {
            config: { broadcast: { self: false } },
        });
        channelRef.current = channel;

        channel
            .on("broadcast", { event: "webrtc" }, async ({ payload }) => {
                const { type, senderId, targetId, offer, answer, candidate, u, l, personCount, vehicleCount } = payload;

                if (senderId === clientId) return;
                if (targetId && targetId !== clientId) return;

                console.log(`Received ${type} from ${senderId}`);

                if (type === "peer-join") {
                    updatePeer(senderId, { username: u, location: l });
                    const pc = createPeerConnection(senderId);
                    const newOffer = await pc.createOffer();
                    await pc.setLocalDescription(newOffer);

                    broadcastMessage({
                        type: "sdp-offer",
                        targetId: senderId,
                        offer: newOffer,
                        u: username,
                        l: location,
                    });
                }
                else if (type === "sdp-offer") {
                    updatePeer(senderId, { username: u, location: l });
                    const pc = createPeerConnection(senderId);
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const newAnswer = await pc.createAnswer();
                    await pc.setLocalDescription(newAnswer);

                    broadcastMessage({
                        type: "sdp-answer",
                        targetId: senderId,
                        answer: newAnswer,
                    });
                }
                else if (type === "sdp-answer") {
                    const pc = connectionsRef.current[senderId];
                    if (pc) {
                        await pc.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                }
                else if (type === "ice-candidate") {
                    const pc = connectionsRef.current[senderId];
                    if (pc) {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
                    }
                }
                else if (type === "metadata-update") {
                    updatePeer(senderId, { personCount, vehicleCount, gpsCoords: payload.gpsCoords });
                }
                else if (type === "peer-leave") {
                    removePeer(senderId);
                }
            })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.log(`Joined channel webrtc-${sessionId}`);
                    // Broadcast join to all existing peers
                    broadcastMessage({
                        type: "peer-join",
                        u: username,
                        l: location,
                    });
                }
            });

        // Broadcast peer-leave on page unload / tab close
        const handleBeforeUnload = () => {
            broadcastMessage({ type: "peer-leave" });
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            broadcastMessage({ type: "peer-leave" });
            window.removeEventListener("beforeunload", handleBeforeUnload);
            channel.unsubscribe();
            Object.values(connectionsRef.current).forEach((pc) => pc.close());
            connectionsRef.current = {};
            setPeers({});
        };
    }, [sessionId, username, location, broadcastMessage, createPeerConnection, updatePeer, removePeer, clientId]);

    const userInfoRef = useRef({ username, location });
    useEffect(() => {
        userInfoRef.current = { username, location };
    }, [username, location]);

    const setLocalStream = useCallback((stream: MediaStream | null) => {
        localStreamRef.current = stream;
        setLocalStreamState(stream);

        if (!stream) {
            // Remove tracks from all existing peer connections
            Object.entries(connectionsRef.current).forEach(([peerId, pc]) => {
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });

                // Trigger renegotiation manually
                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .then(() => {
                        broadcastMessage({
                            type: "sdp-offer",
                            targetId: peerId,
                            offer: pc.localDescription,
                            u: userInfoRef.current.username,
                            l: userInfoRef.current.location,
                        });
                    })
                    .catch(console.error);
            });
            return;
        }

        const existingPeers = Object.keys(connectionsRef.current);
        if (existingPeers.length === 0) {
            // No existing connections — re-announce so others can connect with our stream
            broadcastMessage({
                type: "peer-join",
                u: userInfoRef.current.username,
                l: userInfoRef.current.location,
            });
            return;
        }

        // Add tracks to all existing peer connections (if stream changed)
        Object.entries(connectionsRef.current).forEach(([peerId, pc]) => {
            const senders = pc.getSenders();
            let tracksAdded = false;

            stream.getTracks().forEach((track) => {
                const sender = senders.find((s) => s.track?.kind === track.kind);
                if (sender) {
                    sender.replaceTrack(track);
                } else {
                    pc.addTrack(track, stream);
                    tracksAdded = true;
                }
            });

            if (tracksAdded) {
                // Trigger renegotiation manually
                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .then(() => {
                        broadcastMessage({
                            type: "sdp-offer",
                            targetId: peerId,
                            offer: pc.localDescription,
                            u: userInfoRef.current.username,
                            l: userInfoRef.current.location,
                        });
                    })
                    .catch(console.error);
            }
        });
    }, [broadcastMessage]);

    return { localStream, peers, setLocalStream, handleMetadataUpdate };
};
