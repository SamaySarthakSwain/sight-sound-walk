import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useDetection } from "@/contexts/DetectionContext";

interface DetectionEngineProps {
    stream: MediaStream | null;
}

const VEHICLE_CLASSES = ["car", "truck", "bus", "motorcycle", "bicycle"];

export const DetectionEngine = ({ stream }: DetectionEngineProps) => {
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const { setPersonCount, setVehicleCount, setBboxes } = useDetection();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const animFrameRef = useRef<number>(0);

    // Initialize model once
    useEffect(() => {
        const load = async () => {
            try {
                await tf.ready();
                const loaded = await cocoSsd.load({ base: "mobilenet_v2" });
                setModel(loaded);
            } catch (e) {
                console.error("Detection model failed to load:", e);
            }
        };
        load();
    }, []);

    // Create a hidden video element for the stream
    useEffect(() => {
        if (!stream) {
            setPersonCount(0);
            setVehicleCount(0);
            setBboxes([]);
            return;
        }

        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        
        // Ensure video plays and metadata is loaded
        const handleReady = () => {
            video.play().catch(console.error);
        };
        video.addEventListener("loadedmetadata", handleReady);
        videoRef.current = video;

        return () => {
            video.removeEventListener("loadedmetadata", handleReady);
            video.pause();
            video.srcObject = null;
            videoRef.current = null;
        };
    }, [stream, setPersonCount, setVehicleCount, setBboxes]);

    // Detection loop
    useEffect(() => {
        if (!model || !stream || !videoRef.current) return;

        let active = true;
        const detect = async () => {
            if (!active || !videoRef.current || videoRef.current.readyState < 2) {
                if (active) animFrameRef.current = requestAnimationFrame(detect);
                return;
            }

            try {
                const predictions = (await model.detect(videoRef.current, 40, 0.2)).filter(p => p.score >= 0.2);
                const persons = predictions.filter(p => p.class === "person");
                const vehicles = predictions.filter(p => VEHICLE_CLASSES.includes(p.class));

                setPersonCount(persons.length);
                setVehicleCount(vehicles.length);
                setBboxes(predictions); // Store all predictions for visual feedback
            } catch (e) {
                console.error("Detection error:", e);
            }

            if (active) {
                animFrameRef.current = requestAnimationFrame(detect);
            }
        };

        detect();
        return () => {
            active = false;
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [model, stream, setPersonCount, setVehicleCount, setBboxes]);

    return null; // Headless
};
