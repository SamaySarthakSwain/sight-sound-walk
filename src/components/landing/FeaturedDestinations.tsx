import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import dest1 from "@/assets/destination-featured-1.jpg";
import dest2 from "@/assets/destination-featured-2.jpg";
import dest3 from "@/assets/destination-featured-3.jpg";
import { Link } from "react-router-dom";

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

const FeaturedDestinations = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-16 md:mb-24">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Featured Destinations
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Creative <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Explorations</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Destination Cards */}
        <div className="space-y-20 md:space-y-32">
          {destinations.map((dest, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
                {/* Image */}
                <motion.div
                  className="w-full md:w-3/5 relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-medium">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    {/* Label badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase bg-primary/90 text-primary-foreground dark:bg-primary/20 dark:text-primary border border-primary/30 backdrop-blur-sm">
                      {dest.label}
                    </div>
                  </div>
                </motion.div>

                {/* Info */}
                <div className="w-full md:w-2/5 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {dest.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {dest.desc}
                  </p>
                  {/* Tags grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {dest.tags.map((tag, j) => (
                      <div key={j} className="space-y-1">
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
                          {tag.label}
                        </span>
                        <p className="text-sm font-medium text-foreground/80">{tag.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All button */}
        <ScrollReveal>
          <div className="text-center mt-20">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-500 text-sm font-mono tracking-wider uppercase hover:bg-primary/5"
            >
              View All Destinations
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
