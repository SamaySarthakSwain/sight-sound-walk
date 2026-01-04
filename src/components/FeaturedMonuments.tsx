import MonumentCard from "./MonumentCard";
import konarkImage from "@/assets/konark-temple.jpg";
import jagannathImage from "@/assets/jagannath-temple.jpg";
import lingarajaImage from "@/assets/lingaraja-temple.jpg";
import mukteswaraImage from "@/assets/mukteswara-temple.jpg";
import rajaraniImage from "@/assets/rajarani-temple.jpg";
import udayagiriImage from "@/assets/udayagiri-caves.jpg";
import dhauliImage from "@/assets/dhauli-stupa.jpg";
import ratnagiriImage from "@/assets/ratnagiri-buddhist.jpg";
import barabatiImage from "@/assets/barabati-fort.jpg";
import khichingImage from "@/assets/khiching-temple.jpg";
import birajaImage from "@/assets/biraja-temple.jpg";
import taraTariniImage from "@/assets/tara-tarini-temple.jpg";
import gopalpurImage from "@/assets/gopalpur-beach.jpg";
import taptapaniImage from "@/assets/taptapani-springs.jpg";
import mahendragiriImage from "@/assets/mahendragiri-hills.jpg";
import budhakholImage from "@/assets/budhakhol-caves.jpg";
import rushikulyaImage from "@/assets/rushikulya-river.jpg";
import budhiThakuraniImage from "@/assets/budhi-thakurani-temple.jpg";
import bhairabiImage from "@/assets/bhairabi-temple.jpg";
import aryapalliImage from "@/assets/aryapalli-beach.jpg";
import tamparaImage from "@/assets/tampara-lake.jpg";
import mahurikaulaImage from "@/assets/mahurikalua-temple.jpg";
import potagarhImage from "@/assets/potagarh-fort.jpg";
import chilikaImage from "@/assets/chilika-lake.jpg";
import nistImage from "@/assets/nist-university.jpg";

interface Monument {
  title: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  facts: string[];
}

const monumentsByCategory = {
  berhampur: [
    {
      title: "Tara Tarini Temple",
      description: "Ancient Shakti Peetha dedicated to Goddess Tara Tarini, located on Kumari Hills near Berhampur. One of the four major Adi Shakti shrines in India with panoramic views of Rushikulya River.",
      location: "Berhampur, Ganjam, Odisha",
      category: "Temple",
      imageUrl: taraTariniImage,
      facts: [
        "One of four Adi Shakti Peethas in India",
        "Located on Kumari Hills",
        "Panoramic views of Rushikulya River",
        "Ancient Shakti Peetha shrine",
        "Popular pilgrimage destination"
      ]
    },
    {
      title: "Bhairabi Temple",
      description: "Historic temple dedicated to Goddess Bhairabi, situated in the heart of Berhampur. Known for its religious significance and annual festivals drawing devotees from across the region.",
      location: "Berhampur, Ganjam, Odisha",
      category: "Temple",
      imageUrl: bhairabiImage,
      facts: [
        "Dedicated to Goddess Bhairabi",
        "Located in heart of Berhampur",
        "Annual festivals attract many devotees",
        "Important religious site",
        "Historic temple architecture"
      ]
    },
    {
      title: "Budhi Thakurani Temple",
      description: "Temple dedicated to Goddess Budhi Thakurani, the presiding deity of Berhampur. Famous for the grand Budhi Thakurani Yatra held every two years with elaborate processions.",
      location: "Berhampur, Ganjam, Odisha",
      category: "Temple",
      imageUrl: budhiThakuraniImage,
      facts: [
        "Presiding deity of Berhampur",
        "Grand Yatra every two years",
        "Elaborate festival processions",
        "Cultural importance to locals",
        "Historic temple tradition"
      ]
    }
  ],
  nearby: [
    {
      title: "Gopalpur-on-Sea",
      description: "One of the cleanest and most scenic beaches on the eastern coast, just 16 km from Berhampur. This serene beach town features an old lighthouse, sea-view resorts, and was once a busy colonial port.",
      location: "16 km from Berhampur, Ganjam",
      category: "Beach",
      imageUrl: gopalpurImage,
      facts: [
        "16 km from Berhampur",
        "One of cleanest beaches on east coast",
        "Old lighthouse and colonial heritage",
        "Once a busy British-era port",
        "Ideal for water sports and seafood"
      ]
    },
    {
      title: "Taptapani Hot Springs",
      description: "Natural hot water springs with therapeutic sulfur water, about 50 km from Berhampur. The water temperature remains around 56°C and is believed to cure skin ailments.",
      location: "50 km from Berhampur, Ganjam",
      category: "Natural",
      imageUrl: taptapaniImage,
      facts: [
        "50 km from Berhampur",
        "Natural hot water springs",
        "Water temperature around 56°C",
        "Therapeutic sulfur water",
        "Believed to cure skin ailments"
      ]
    },
    {
      title: "Chilika Lake",
      description: "Asia's largest brackish water lagoon, about 90 km from Berhampur (Rambha entry). Home to migratory birds and famous Irrawaddy dolphins. OTDC offers lake cruises from Rambha and Satapada.",
      location: "90 km from Berhampur, Odisha",
      category: "Lake",
      imageUrl: chilikaImage,
      facts: [
        "90 km from Berhampur (Rambha entry)",
        "Asia's largest brackish water lagoon",
        "Home to Irrawaddy dolphins",
        "Migratory bird sanctuary",
        "OTDC lake cruises available"
      ]
    },
    {
      title: "Mahendragiri Hills",
      description: "Second highest peak in Odisha at 1,501 meters, about 95 km from Berhampur. Sacred mountain associated with Parashurama and rich biodiversity with medicinal plants.",
      location: "95 km from Berhampur, Gajapati",
      category: "Hill",
      imageUrl: mahendragiriImage,
      facts: [
        "95 km from Berhampur",
        "Second highest peak in Odisha (1,501m)",
        "Associated with Parashurama legend",
        "Rich biodiversity",
        "Home to medicinal plants"
      ]
    },
    {
      title: "Tampara Lake",
      description: "Picturesque freshwater lake near Chatrapur, about 45 km from Berhampur. Ideal for boating and picnics with scenic surroundings and rich birdlife.",
      location: "45 km from Berhampur, Ganjam",
      category: "Lake",
      imageUrl: tamparaImage,
      facts: [
        "45 km from Berhampur",
        "Freshwater lake near Chatrapur",
        "Boating facilities available",
        "Scenic picnic spot",
        "Rich birdlife"
      ]
    },
    {
      title: "Potagarh Fort",
      description: "Also known as the 'Buried Fort', located near Rushikulya River mouth, about 25 km from Berhampur. Features combination of natural and man-made defenses with historical significance.",
      location: "25 km from Berhampur, Ganjam",
      category: "Fort",
      imageUrl: potagarhImage,
      facts: [
        "25 km from Berhampur",
        "Known as the 'Buried Fort'",
        "Near Rushikulya River mouth",
        "Combination of natural and man-made defenses",
        "Historical significance"
      ]
    }
  ],
  beaches: [
    {
      title: "Gopalpur-on-Sea",
      description: "One of the cleanest and most scenic beaches on the eastern coast, just 16 km from Berhampur. This serene beach town features an old lighthouse, sea-view resorts, and was once a busy colonial port.",
      location: "16 km from Berhampur, Ganjam",
      category: "Beach",
      imageUrl: gopalpurImage,
      facts: [
        "16 km from Berhampur",
        "One of cleanest beaches on east coast",
        "Old lighthouse and colonial heritage",
        "Once a busy British-era port",
        "Ideal for water sports and seafood"
      ]
    },
    {
      title: "Aryapalli Beach",
      description: "A serene and less crowded beach about 25 km from Berhampur. Known for its clean golden sands, calm waters, and beautiful sunrise views.",
      location: "25 km from Berhampur, Ganjam",
      category: "Beach",
      imageUrl: aryapalliImage,
      facts: [
        "25 km from Berhampur",
        "Less crowded and serene",
        "Clean golden sands",
        "Beautiful sunrise views",
        "Ideal for peaceful getaway"
      ]
    },
    {
      title: "Puri Beach",
      description: "One of the most famous beaches in India, about 170 km from Berhampur. Known for its golden sands, the annual Sand Art Festival, and proximity to the sacred Jagannath Temple.",
      location: "170 km from Berhampur, Puri",
      category: "Beach",
      imageUrl: jagannathImage,
      facts: [
        "170 km from Berhampur",
        "One of India's most famous beaches",
        "Golden sands and vibrant atmosphere",
        "Annual International Sand Art Festival",
        "Near sacred Jagannath Temple"
      ]
    }
  ],
  forts: [
    {
      title: "Potagarh Fort",
      description: "Also known as the 'Buried Fort', built near Rushikulya River mouth in Ganjam, just 25 km from Berhampur. Features combination of natural and man-made defenses with historical significance.",
      location: "25 km from Berhampur, Ganjam",
      category: "Fort",
      imageUrl: potagarhImage,
      facts: [
        "25 km from Berhampur",
        "Known as the 'Buried Fort'",
        "Near Rushikulya River mouth",
        "Combination of natural and man-made defenses",
        "Historical significance"
      ]
    },
    {
      title: "Barabati Fort",
      description: "14th century fort built by the Ganga dynasty in Cuttack. Features moat, earthen ramparts, and once housed a 9-storey palace. Strategic location near Mahanadi River showcases medieval military architecture.",
      location: "Cuttack, Odisha",
      category: "Fort",
      imageUrl: barabatiImage,
      facts: [
        "Built in 14th century by Ganga dynasty",
        "Once housed a 9-storey palace",
        "Features moat and earthen ramparts",
        "Near Mahanadi River barrage",
        "Important medieval military architecture"
      ]
    }
  ],
  gems: [
    {
      title: "Konark Sun Temple",
      description: "UNESCO World Heritage Site built in 13th century by King Narasimhadeva I. This architectural marvel is dedicated to Surya (Sun God) and built in the form of a colossal stone chariot with 24 wheels pulled by seven horses.",
      location: "Konark, Puri District, Odisha",
      category: "Temple",
      imageUrl: konarkImage,
      facts: [
        "Built by King Narasimhadeva I in 13th century",
        "UNESCO World Heritage Site",
        "Designed as colossal chariot with 24 wheels",
        "Dedicated to Surya (Sun God)",
        "Famous for intricate stone carvings"
      ]
    },
    {
      title: "Jagannath Temple",
      description: "Sacred Hindu temple in Puri, one of the Char Dham pilgrimage sites. Built in 12th century by King Anantavarman Chodaganga Deva, it's famous for the annual Rath Yatra (Chariot Festival) and houses the world's largest temple kitchen.",
      location: "Puri, Odisha",
      category: "Temple",
      imageUrl: jagannathImage,
      facts: [
        "Built in 12th century by King Anantavarman Chodaganga Deva",
        "One of the four sacred Char Dham pilgrimage sites",
        "Famous for annual Rath Yatra (Chariot Festival)",
        "World's largest temple kitchen",
        "Temple flag changes direction with the wind"
      ]
    },
    {
      title: "Lingaraja Temple",
      description: "A masterpiece of Kalinga architecture with a 180-ft high tower, this 11th century temple is dedicated to Lord Shiva in his Harihara form (half Vishnu, half Shiva). Built by the Somavamsi dynasty, it features intricate carvings and a sacred pond called Bindu Sagar.",
      location: "Bhubaneswar, Odisha",
      category: "Temple",
      imageUrl: lingarajaImage,
      facts: [
        "Built in 11th century by Somavamsi dynasty",
        "180-feet high tower dominating Bhubaneswar skyline",
        "Dedicated to Harihara (half Vishnu, half Shiva)",
        "Features sacred Bindu Sagar pond",
        "Masterpiece of Kalinga architecture with intricate carvings"
      ]
    },
    {
      title: "Mukteswara Temple",
      description: "Built in 10th century, known as the 'Gem of Odishan architecture'. This temple is famous for its exquisite torana (arched gateway) and detailed carvings depicting stories from Hindu mythology.",
      location: "Bhubaneswar, Odisha",
      category: "Temple",
      imageUrl: mukteswaraImage,
      facts: [
        "Built in 10th century",
        "Called 'Gem of Odishan architecture'",
        "Famous for exquisite torana (arched gateway)",
        "Detailed carvings from Hindu mythology",
        "Small but architecturally significant temple"
      ]
    },
    {
      title: "Rajarani Temple",
      description: "11th century temple built from red and golden sandstone (Rajarani stone). Famous for its intricate carvings depicting celestial nymphs and musicians. Unique for having no presiding deity, believed to be connected to Lord Shiva.",
      location: "Bhubaneswar, Odisha",
      category: "Temple",
      imageUrl: rajaraniImage,
      facts: [
        "Built in 11th century",
        "Constructed from red and golden 'Rajarani' sandstone",
        "Famous for celestial nymphs and musician carvings",
        "No presiding deity inside",
        "Believed to be connected to Lord Shiva"
      ]
    },
    {
      title: "Udayagiri & Khandagiri Caves",
      description: "Ancient Jain rock-cut shelters dating back to 2nd century BCE, built by King Kharavela. These caves feature inscriptions and sculptures with Rani Gumpha being the largest and most ornate cave.",
      location: "8 km from Bhubaneswar, Odisha",
      category: "Cave",
      imageUrl: udayagiriImage,
      facts: [
        "Dating back to 2nd century BCE",
        "Built by King Kharavela",
        "Jain rock-cut shelters with inscriptions",
        "Rani Gumpha is the largest and most ornate",
        "Important archaeological and historical site"
      ]
    },
    {
      title: "Dhauli Shanti Stupa",
      description: "Peace pagoda built at the historic site of the Kalinga War near Daya River. Features 3rd century BCE Ashokan rock edicts where Emperor Ashoka embraced Buddhism after witnessing the war's devastation.",
      location: "8 km from Bhubaneswar, Odisha",
      category: "Stupa",
      imageUrl: dhauliImage,
      facts: [
        "Site of the historic Kalinga War",
        "3rd century BCE Ashokan rock edicts",
        "Where Emperor Ashoka embraced Buddhism",
        "Modern peace pagoda built in 1972",
        "Near Daya River"
      ]
    },
    {
      title: "Buddhist Diamond Triangle",
      description: "Ratnagiri, Lalitgiri, and Udayagiri (Jajpur district) form the 'Buddhist Diamond Triangle' of Odisha. Dating between 2nd–12th centuries CE, these sites house stupas, monasteries, and relics of Buddha.",
      location: "Jajpur District, Odisha",
      category: "Buddhist Site",
      imageUrl: ratnagiriImage,
      facts: [
        "Dating between 2nd–12th centuries CE",
        "Known as Buddhist Diamond Triangle",
        "Houses stupas, monasteries, and Buddha relics",
        "Three major sites: Ratnagiri, Lalitgiri, Udayagiri",
        "Important Buddhist heritage of Odisha"
      ]
    },
    {
      title: "Khiching Temple",
      description: "Temple dedicated to Goddess Kichakeswari (Durga form) in Mayurbhanj district. Built entirely of black chlorite stone, it's an excellent example of North Odisha's unique temple architecture.",
      location: "Mayurbhanj, Odisha",
      category: "Temple",
      imageUrl: khichingImage,
      facts: [
        "Dedicated to Goddess Kichakeswari",
        "Built entirely of black chlorite stone",
        "Unique North Odisha architecture",
        "Near Simlipal National Park",
        "Important Shakti temple"
      ]
    },
    {
      title: "Biraja Temple",
      description: "One of the Astadasa Shakti Peethas dedicated to Goddess Biraja (Durga). Located in Jajpur, known as the 'Viraja Kshetra', this ancient temple is an important pilgrimage site.",
      location: "Jajpur, Odisha",
      category: "Temple",
      imageUrl: birajaImage,
      facts: [
        "One of the Astadasa Shakti Peethas",
        "Dedicated to Goddess Biraja (Durga)",
        "Known as Viraja Kshetra",
        "Ancient pilgrimage site",
        "Near Buddhist Diamond Triangle sites"
      ]
    },
    {
      title: "Chilika Lake",
      description: "Asia's largest brackish water lagoon, about 90 km from Berhampur (Rambha entry). Home to migratory birds and famous Irrawaddy dolphins. OTDC offers lake cruises from Rambha and Satapada.",
      location: "Puri-Ganjam-Khurda, Odisha",
      category: "Lake",
      imageUrl: chilikaImage,
      facts: [
        "Asia's largest brackish water lagoon",
        "90 km from Berhampur (Rambha entry)",
        "Home to Irrawaddy dolphins",
        "Migratory bird sanctuary",
        "OTDC lake cruises available"
      ]
    }
  ]
};

const FeaturedMonuments = () => {
  const renderSection = (title: string, monuments: Monument[]) => (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">
        <span className="bg-gradient-hero bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {monuments.map((monument, index) => (
          <MonumentCard key={index} {...monument} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover <span className="bg-gradient-hero bg-clip-text text-transparent">Odisha's Heritage</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the rich cultural tapestry through these magnificent historical sites and natural wonders
          </p>
        </div>
        
        {renderSection("Places in Berhampur", monumentsByCategory.berhampur)}
        {renderSection("Nearby Monuments & Places", monumentsByCategory.nearby)}
        {renderSection("Beaches", monumentsByCategory.beaches)}
        {renderSection("Forts", monumentsByCategory.forts)}
        {renderSection("Important Gems of Odisha", monumentsByCategory.gems)}
      </div>
    </section>
  );
};

export default FeaturedMonuments;
