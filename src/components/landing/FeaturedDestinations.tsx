import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dest1 from "@/assets/destination-featured-1.jpg";
import dest2 from "@/assets/destination-featured-2.jpg";
import dest3 from "@/assets/destination-featured-3.jpg";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    image: dest1,
    label: "Heritage",
    title: "Ancient Monasteries",
    desc: "Walk through centuries-old Buddhist ruins perched atop misty hills. GPS narration unveils forgotten stories of monks and meditation.",
    tags: [
      { label: "Category", value: "Heritage" },
      { label: "Style", value: "Immersive Walk" },
      { label: "Tone", value: "Spiritual Journey" },
      { label: "Format", value: "Audio Narration" },
    ],
  },
  {
    image: dest2,
    label: "Coastal",
    title: "Golden Shores",
    desc: "Sun-kissed beaches where ancient maritime history meets golden sunsets. Hear tales of sea trade routes as waves lap the shore.",
    tags: [
      { label: "Category", value: "Beach" },
      { label: "Style", value: "Scenic Tour" },
      { label: "Tone", value: "Calm & Reflective" },
      { label: "Format", value: "GPS Triggered" },
    ],
  },
  {
    image: dest3,
    label: "Fortress",
    title: "Majestic Strongholds",
    desc: "Towering forts that stood against time and invaders. Every stone wall whispers legends of battles, kingdoms and glory.",
    tags: [
      { label: "Category", value: "Fort" },
      { label: "Style", value: "Historical Deep-dive" },
      { label: "Tone", value: "Epic & Grand" },
      { label: "Format", value: "Voice Guide" },
    ],
  },
];

const DestinationCard = ({ dest, index }: { dest: typeof destinations[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image */}
      <motion.div
        className="w-full md:w-3/5 relative group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-medium">
          <motion.img
            src={dest.image}
            alt={dest.title}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          {/* Label badge */}
          <motion.div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase bg-primary/90 text-primary-foreground dark:bg-primary/20 dark:text-primary border border-primary/30 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {dest.label}
          </motion.div>
          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 backdrop-blur-sm">
            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <div className="w-full md:w-2/5 space-y-6">
        <motion.h3
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {dest.title}
        </motion.h3>
        <motion.p
          className="text-muted-foreground leading-relaxed text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {dest.desc}
        </motion.p>
        {/* Tags grid */}
        <div className="grid grid-cols-2 gap-3">
          {dest.tags.map((tag, j) => (
            <motion.div
              key={j}
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + j * 0.1, duration: 0.4 }}
            >
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
                {tag.label}
              </span>
              <p className="text-sm font-medium text-foreground/80">{tag.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedDestinations = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block"
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Featured Destinations
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Creative <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Explorations</span>
          </h2>
        </motion.div>

        {/* Destination Cards */}
        <div className="space-y-20 md:space-y-32">
          {destinations.map((dest, i) => (
            <DestinationCard key={i} dest={dest} index={i} />
          ))}
        </div>

        {/* View All button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-500 text-sm font-mono tracking-wider uppercase hover:bg-primary/5 relative overflow-hidden"
          >
            <span className="relative z-10">View All Destinations</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
