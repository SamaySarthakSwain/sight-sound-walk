import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Landmark, UtensilsCrossed, Car, Building2, Box, Bot, ArrowUpRight, Users, Headphones, Sun, Palette, Trophy } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const services = [
  {
    icon: Landmark,
    title: "Heritage Monuments",
    desc: "GPS-triggered audio narrations at 50+ historical sites across India.",
    path: "/explore",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Headphones,
    title: "Heritage Soundscapes",
    desc: "Binaural custom audio mixer with ancient, medieval, and modern atmospheric sounds.",
    path: "/soundscape",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Sun,
    title: "Sundial Simulator",
    desc: "Interact with the Konark Sun Temple sundial to tell time using solar shadow projections.",
    path: "/sundial",
    gradient: "from-yellow-500/20 to-amber-500/20",
  },
  {
    icon: Palette,
    title: "Artisan Handloom Trail",
    desc: "Support living heritage villages by discovering authentic local craft hubs.",
    path: "/artisan-trail",
    gradient: "from-orange-500/20 to-rose-500/20",
  },
  {
    icon: Trophy,
    title: "Heritage Quests",
    desc: "Test your historical knowledge in scavenger quests to unlock collectible stamps.",
    path: "/quests",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: UtensilsCrossed,
    title: "Local Food Guide",
    desc: "Discover authentic street food and restaurants rated by real travelers.",
    path: "/food",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: Car,
    title: "Smart Cab Booking",
    desc: "Compare fares across Ola, Uber, Rapido & local providers instantly.",
    path: "/cabs",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Building2,
    title: "Hotel Discovery",
    desc: "Curated stays from budget to luxury with real-time availability.",
    path: "/hotels",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: Box,
    title: "AR Experience",
    desc: "Interactive 3D models of monuments with augmented reality overlays.",
    path: "/ar",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Bot,
    title: "AI Travel Guide",
    desc: "Your personal AI companion for route planning and recommendations.",
    path: "/assistant",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Users,
    title: "Crowd Management",
    desc: "Real-time crowd density monitoring and safe route recommendations.",
    path: "/crowd",
    gradient: "from-red-500/20 to-orange-500/20",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const Icon = service.icon;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1.15", "1 1"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y, perspective: 1000, willChange: "transform, opacity" }}
    >
      <Link to={service.path}>
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.2)"
          spotlightSize={320}
          className="rounded-3xl border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl p-6 md:p-8 group cursor-pointer relative overflow-hidden h-full hover:border-primary/40 transition-all duration-300"
        >
          {/* Background subtle gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <span className="inline-block text-[10px] font-mono tracking-[0.25em] uppercase text-primary/60 mb-2">
                Sight-Sound Service
              </span>

              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </div>

            {/* Arrow & Action */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-primary">
              <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">Explore Module</span>
              <ArrowUpRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
};

const ExploreServices = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section className="py-24 md:py-32 bg-muted/20 dark:bg-background relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            What We <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Offer</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg">
            Developed with precision, delivered with passion
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center mt-16 text-muted-foreground/60 text-sm max-w-2xl mx-auto italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Each feature is carefully crafted to ensure every detail enhances your exploration
          with precision and immersive storytelling.
        </motion.p>
      </div>
    </section>
  );
};

export default ExploreServices;
