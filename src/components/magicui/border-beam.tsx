import React from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  size = 60,
  delay = 0,
  duration = 6,
  colorFrom = "hsl(var(--primary))",
  colorTo = "#f59e0b",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
}: BorderBeamProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={
        {
          padding: `${borderWidth}px`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          "absolute aspect-square rounded-full blur-[2px]",
          className
        )}
        style={
          {
            width: size,
            height: size,
            background: `radial-gradient(circle, ${colorFrom} 0%, ${colorTo} 50%, transparent 80%)`,
            offsetPath: `rect(0 100% 100% 0 round 24px)`,
            ...style,
          } as any
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};

export default BorderBeam;