import { useEffect, useState, type CSSProperties, type ReactElement } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesTextProps {
  as?: ReactElement;
  className?: string;
  text: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

const SparkleInstance = ({ sparkle }: { sparkle: Sparkle }) => {
  return (
    <motion.svg
      key={sparkle.id}
      className="pointer-events-none absolute z-20"
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, sparkle.scale, 0],
        rotate: [0, 180],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: sparkle.lifespan,
        delay: sparkle.delay,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      style={
        {
          left: sparkle.x,
          top: sparkle.y,
        } as CSSProperties
      }
      width="21"
      height="21"
      viewBox="0 0 21 21"
    >
      <path
        d="M10.5 0C10.5 5.79899 15.201 10.5 21 10.5C15.201 10.5 10.5 15.201 10.5 21C10.5 15.201 5.79899 10.5 0 10.5C5.79899 10.5 10.5 5.79899 10.5 0Z"
        fill={sparkle.color}
      />
    </motion.svg>
  );
};

export const SparklesText = ({
  text,
  colors = { first: "#f59e0b", second: "#f97316" },
  className,
  sparklesCount = 8,
  ...props
}: SparklesTextProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      return Array.from({ length: sparklesCount }).map((_, i) => ({
        id: `${i}-${Date.now()}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: Math.random() * 0.8 + 0.4,
        lifespan: Math.random() * 1.5 + 1.2,
      }));
    };
    setSparkles(generateSparkles());
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <span className="relative z-10">{text}</span>
      {sparkles.map((sparkle) => (
        <SparkleInstance key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
};

export default SparklesText;