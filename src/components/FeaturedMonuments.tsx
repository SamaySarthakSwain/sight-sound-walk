import MonumentCard from "./MonumentCard";
import konarkImage from "@/assets/konark-temple.jpg";
import jagannathImage from "@/assets/jagannath-temple.jpg";
import fortImage from "@/assets/fort-monument.jpg";

const monuments = [
  {
    title: "Konark Sun Temple",
    description: "The Konark Sun Temple is a 13th-century CE Hindu temple dedicated to the sun god Surya. Built in the shape of a giant chariot, it is renowned for its intricate stone carvings and architectural grandeur.",
    location: "Konark, Odisha",
    category: "Temple",
    imageUrl: konarkImage,
    facts: [
      "Built by King Narasimhadeva I in 1250 CE",
      "Designed as a massive chariot with 24 wheels",
      "UNESCO World Heritage Site since 1984",
      "Famous for its erotic sculptures and detailed carvings",
      "Originally had a 229-foot high tower"
    ]
  },
  {
    title: "Jagannath Temple",
    description: "The Jagannath Temple in Puri is an important Hindu temple dedicated to Lord Jagannath. It is one of the Char Dham pilgrimage sites and famous for its annual Rath Yatra festival.",
    location: "Puri, Odisha",
    category: "Temple",
    imageUrl: jagannathImage,
    facts: [
      "Built in the 12th century by King Anantavarman",
      "Home to the famous Rath Yatra festival",
      "One of the four sacred Char Dham sites",
      "The temple flag changes direction with the wind",
      "Kitchen uses traditional earthen pots and wood-fired ovens"
    ]
  },
  {
    title: "Historical Fort",
    description: "Ancient forts represent India's rich military architecture and strategic heritage. These structures tell stories of battles, kingdoms, and the evolution of defensive architecture.",
    location: "Various locations across India",
    category: "Fort",
    imageUrl: fortImage,
    facts: [
      "Built using advanced engineering techniques",
      "Features multiple defense layers and strategic positions",
      "Often includes palaces, temples, and water systems",
      "Showcases blend of military and residential architecture",
      "Many are UNESCO World Heritage Sites"
    ]
  }
];

const FeaturedMonuments = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured <span className="bg-gradient-hero bg-clip-text text-transparent">Monuments</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore India's rich cultural heritage through these magnificent historical sites
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monuments.map((monument, index) => (
            <MonumentCard key={index} {...monument} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMonuments;
