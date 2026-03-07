import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Landmark, UtensilsCrossed, Car, Building2, Box, Bot } from "lucide-react";

const services = [
  {
    icon: Landmark,
    title: "Heritage Monuments",
    desc: "GPS-triggered audio narrations at 50+ historical sites across India.",
    path: "/explore",
  },
  {
    icon: UtensilsCrossed,
    title: "Local Food Guide",
    desc: "Discover authentic street food and restaurants rated by real travelers.",
    path: "/food",
  },
  {
    icon: Car,
    title: "Smart Cab Booking",
    desc: "Compare fares across Ola, Uber, Rapido & local providers instantly.",
    path: "/cabs",
  },
  {
    icon: Building2,
    title: "Hotel Discovery",
    desc: "Curated stays from budget to luxury with real-time availability.",
    path: "/hotels",
  },
  {
    icon: Box,
    title: "AR Experience",
    desc: "Interactive 3D models of monuments with augmented reality overlays.",
    path: "/ar",
  },
  {
    icon: Bot,
    title: "AI Travel Guide",
    desc: "Your personal AI companion for route planning and recommendations.",
    path: "/assistant",
  },
];

const ExploreServices = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/20 dark:bg-background relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16 md:mb-24">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              What We <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg">
              Developed with precision, delivered with passion
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={i} delay={i * 80}>
                <Link to={service.path}>
                  <motion.div
                    className="rounded-2xl border border-border bg-card p-6 md:p-8 group cursor-pointer relative overflow-hidden h-full hover:shadow-xl hover:border-primary/30 transition-all duration-500"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>

                      {/* Badge */}
                      <span className="inline-block text-[9px] font-mono tracking-[0.3em] uppercase text-primary/50 mb-4">
                        Lets Explore
                      </span>

                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom note */}
        <ScrollReveal>
          <p className="text-center mt-16 text-muted-foreground/60 text-sm max-w-2xl mx-auto italic">
            Each feature is carefully crafted to ensure every detail enhances your exploration
            with precision and immersive storytelling.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ExploreServices;
