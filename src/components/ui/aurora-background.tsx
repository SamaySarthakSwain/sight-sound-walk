import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export const AuroraBackground: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none transition-colors duration-700">
            {/* Premium Animated Mesh Gradient Orbs */}
            
            {/* Orb 1: Primary Brand Color (Amber/Orange) */}
            <motion.div
                animate={{
                    x: ["0%", "15%", "-5%", "0%"],
                    y: ["0%", "-15%", "10%", "0%"],
                    scale: [1, 1.15, 0.9, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full mix-blend-multiply opacity-70 will-change-transform",
                    isDark ? "bg-amber-600/30 mix-blend-screen opacity-40" : "bg-amber-300/60"
                )}
                style={{ filter: "blur(8vw)" }}
            />

            {/* Orb 2: Secondary Accent (Rose/Pink) */}
            <motion.div
                animate={{
                    x: ["0%", "-20%", "10%", "0%"],
                    y: ["0%", "15%", "-10%", "0%"],
                    scale: [1, 1.2, 0.85, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply opacity-60 will-change-transform",
                    isDark ? "bg-rose-900/40 mix-blend-screen opacity-40" : "bg-rose-300/50"
                )}
                style={{ filter: "blur(9vw)" }}
            />

            {/* Orb 3: Bottom Left Accent (Violet/Purple) */}
            <motion.div
                animate={{
                    x: ["0%", "15%", "-15%", "0%"],
                    y: ["0%", "-10%", "15%", "0%"],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute bottom-[-15%] left-[5%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply opacity-60 will-change-transform",
                    isDark ? "bg-violet-900/30 mix-blend-screen opacity-40" : "bg-violet-300/50"
                )}
                style={{ filter: "blur(10vw)" }}
            />
            
            {/* Orb 4: Center warm glow to tie it together */}
            <motion.div
                animate={{
                    x: ["0%", "-10%", "10%", "0%"],
                    y: ["0%", "10%", "-10%", "0%"],
                    scale: [0.8, 1.1, 0.9, 0.8],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[25%] left-[25%] w-[45vw] h-[45vw] rounded-full mix-blend-multiply opacity-50 will-change-transform",
                    isDark ? "bg-orange-800/30 mix-blend-screen opacity-30" : "bg-orange-200/50"
                )}
                style={{ filter: "blur(8vw)" }}
            />

            {/* Subtle Noise / Grain Overlay for premium SaaS texture */}
            <div 
                className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay pointer-events-none" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
};
