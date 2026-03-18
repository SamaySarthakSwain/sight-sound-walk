import { motion } from "framer-motion";

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
            {/* Dynamic Grid */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
                }}
            />

            {/* Moving scanline */}
            <motion.div
                animate={{ y: ["-10%", "110%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
            />

            {/* Floating Orbs for depth */}
            <motion.div
                animate={{
                    x: ["0%", "5%", "-5%", "0%"],
                    y: ["0%", "-5%", "5%", "0%"],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
            />

            <motion.div
                animate={{
                    x: ["0%", "-5%", "5%", "0%"],
                    y: ["0%", "5%", "-5%", "0%"],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-accent/20 blur-[120px] pointer-events-none"
            />

            <motion.div
                animate={{
                    x: ["0%", "10%", "-10%", "0%"],
                    y: ["0%", "-10%", "10%", "0%"],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-success/10 blur-[80px] pointer-events-none"
            />
        </div>
    );
};

export default AnimatedBackground;
