import React, { useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { useDetection } from "@/contexts/DetectionContext";

interface VideoPlayerProps {
    stream: MediaStream | null;
    className?: string;
    showDetection?: boolean;
}

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
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x, y - 20, tw + 8, 20);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillText(label, x + 4, y - 6);
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, className, showDetection = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { bboxes, personCount } = useDetection();

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Canvas drawing loop
    useEffect(() => {
        if (!showDetection || !canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let active = true;
        const render = () => {
            if (!active) return;
            
            if (video.readyState >= 2) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const personColor = getPersonColor(personCount);
                
                bboxes.forEach((p: any) => {
                    const [x, y, w, h] = p.bbox;
                    const isPerson = p.class === "person";
                    const color = isPerson ? personColor : VEHICLE_COLOR;
                    const label = `${p.class} ${(p.score * 100).toFixed(0)}%`;
                    drawBox(ctx, x, y, w, h, label, color);
                });
            }
            
            requestAnimationFrame(render);
        };

        render();
        return () => { active = false; };
    }, [showDetection, bboxes, personCount]);

    if (!stream) {
        return (
            <div className={`flex items-center justify-center bg-background/50 border border-border ${className}`}>
                <Camera className="w-6 h-6 text-muted-foreground/30" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${className}`}
            />
            {showDetection && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none object-cover"
                />
            )}
        </div>
    );
};
