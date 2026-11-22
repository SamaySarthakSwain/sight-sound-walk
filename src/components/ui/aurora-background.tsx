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
            {/* Optimized Animated Mesh Gradient Orbs (Hardware-Accelerated) */}
            
            {/* Orb 1: Primary Brand Color (Amber/Orange) */}
            <motion.div
                animate={{
                    x: ["0%", "10%", "-5%", "0%"],
                    y: ["0%", "-10%", "5%", "0%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full opacity-60",
                    isDark ? "bg-amber-600/25 opacity-30" : "bg-amber-300/40"
                )}
                style={{ 
                    filter: "blur(48px)",
                    transform: "translate3d(0,0,0)",
                    willChange: "transform" 
                }}
            />

            {/* Orb 2: Secondary Accent (Rose/Pink) */}
            <motion.div
                animate={{
                    x: ["0%", "-12%", "8%", "0%"],
                    y: ["0%", "8%", "-6%", "0%"],
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full opacity-50",
                    isDark ? "bg-rose-900/30 opacity-30" : "bg-rose-300/35"
                )}
                style={{ 
                    filter: "blur(48px)",
                    transform: "translate3d(0,0,0)",
                    willChange: "transform" 
                }}
            />

            {/* Orb 3: Bottom Left Accent (Violet/Purple) */}
            <motion.div
                animate={{
                    x: ["0%", "8%", "-8%", "0%"],
                    y: ["0%", "-6%", "8%", "0%"],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute bottom-[-10%] left-[5%] w-[50vw] h-[50vw] rounded-full opacity-50",
                    isDark ? "bg-violet-900/25 opacity-30" : "bg-violet-300/35"
                )}
                style={{ 
                    filter: "blur(54px)",
                    transform: "translate3d(0,0,0)",
                    willChange: "transform" 
                }}
            />
            
            {/* Orb 4: Center warm glow */}
            <motion.div
                animate={{
                    x: ["0%", "-6%", "6%", "0%"],
                    y: ["0%", "6%", "-6%", "0%"],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className={cn(
                    "absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full opacity-40",
                    isDark ? "bg-orange-800/20 opacity-25" : "bg-orange-200/35"
                )}
                style={{ 
                    filter: "blur(48px)",
                    transform: "translate3d(0,0,0)",
                    willChange: "transform" 
                }}
            />
        </div>
    );
};
