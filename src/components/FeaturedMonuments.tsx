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

const monuments = [
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
    title: "Konark Sun Temple",
    description: "UNESCO World Heritage Site built in 13th century by King Narasimhadeva I. This architectural marvel is dedicated to Surya (Sun God) and built in the form of a colossal stone chariot with 24 wheels pulled by seven horses.",
    location: "Konark, Odisha",
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
    location: "Near Bhubaneswar, Odisha",
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
    location: "Near Bhubaneswar, Odisha",
    category: "Stupa",
    imageUrl: dhauliImage,
    facts: [
      "Site of the historic Kalinga War",
      "3rd century BCE Ashokan rock edicts",
      "Where Emperor Ashoka embraced Buddhism",
      "Modern peace pagoda built in 1972",
      "8 km from Bhubaneswar near Daya River"
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
    title: "Tara Tarini Temple",
    description: "Ancient Shakti Peetha on Kumari Hills near Rushikulya River, dedicated to twin goddesses Tara and Tarini. Located 30 km from Berhampur, features ropeway facility and stunning hilltop views. Famous for vibrant Chaitra Yatra festival.",
    location: "Ganjam District, Odisha",
    category: "Temple",
    imageUrl: taraTariniImage,
    facts: [
      "Ancient Shakti Peetha",
      "Dedicated to twin goddesses Tara and Tarini",
      "Located on Kumari Hills near Rushikulya River",
      "Ropeway facility and panoramic views",
      "Vibrant Chaitra Yatra festival (March-April)"
    ]
  },
  {
    title: "Gopalpur-on-Sea",
    description: "One of the cleanest and most scenic beaches on the eastern coast, 15 km from Berhampur. This serene beach town features an old lighthouse, sea-view resorts, and was once a busy colonial port during British rule.",
    location: "Near Berhampur, Odisha",
    category: "Beach",
    imageUrl: gopalpurImage,
    facts: [
      "15 km from Berhampur",
      "One of cleanest beaches on east coast",
      "Old lighthouse and colonial heritage",
      "Once a busy British-era port",
      "Ideal for water sports and seafood"
    ]
  },
  {
    title: "Taptapani Hot Springs",
    description: "Natural sulfur hot water springs 50 km from Berhampur, believed to have medicinal properties. Surrounded by forests, tribal villages, and features a deer park maintained by Odisha Tourism.",
    location: "Near Berhampur, Odisha",
    category: "Nature",
    imageUrl: taptapaniImage,
    facts: [
      "Natural sulfur hot water springs",
      "50 km from Berhampur",
      "Believed to have medicinal properties",
      "Surrounded by forests and tribal villages",
      "Deer park by Odisha Tourism"
    ]
  },
  {
    title: "Mahendragiri Hills",
    description: "Mythological site from the Mahabharata, 120 km from Berhampur in Gajapati district. Features temples dedicated to Parashurama and Pandavas, offering scenic trekking opportunities through the Eastern Ghats.",
    location: "Gajapati District, Odisha",
    category: "Hill",
    imageUrl: mahendragiriImage,
    facts: [
      "Mythological site from Mahabharata",
      "120 km from Berhampur",
      "Temples for Parashurama and Pandavas",
      "Scenic trekking destination",
      "Part of Eastern Ghats"
    ]
  },
  {
    title: "Buguda & Budhakhol",
    description: "Ancient rock-cut caves and Shiva temples on hill slopes, 60 km from Berhampur. Dating back to 6th century, these caves show Buddhist and Shaivite influences amidst beautiful natural surroundings.",
    location: "Near Berhampur, Odisha",
    category: "Cave",
    imageUrl: budhakholImage,
    facts: [
      "60 km from Berhampur",
      "Ancient rock-cut caves dating to 6th century",
      "Shiva temples on hill slopes",
      "Buddhist and Shaivite influences",
      "Beautiful natural surroundings"
    ]
  },
  {
    title: "Rushikulya River Mouth",
    description: "Famous site for Olive Ridley turtle nesting near Purunabandha, 50 km from Berhampur. One of the world's largest mass nesting (arribada) zones, best visited between December to March.",
    location: "Near Berhampur, Odisha",
    category: "Nature",
    imageUrl: rushikulyaImage,
    facts: [
      "50 km from Berhampur",
      "Olive Ridley turtle nesting site",
      "One of world's largest mass nesting zones",
      "Best time: December to March",
      "Important conservation area"
    ]
  },
  {
    title: "Maa Budhi Thakurani Temple",
    description: "The presiding deity of Berhampur, Goddess Budhi Thakurani (form of Shakti). Famous for Budhi Thakurani Yatra celebrated every 2 years - one of Odisha's largest tribal-urban festivals with colorful processions.",
    location: "Berhampur, Odisha",
    category: "Temple",
    imageUrl: budhiThakuraniImage,
    facts: [
      "Presiding deity of Berhampur",
      "Goddess Budhi Thakurani (Shakti form)",
      "Budhi Thakurani Yatra every 2 years",
      "One of Odisha's largest festivals",
      "Colorful tribal-urban cultural performances"
    ]
  },
  {
    title: "Bhairabi Temple",
    description: "Temple dedicated to Goddess Bhairabi (fierce form of Durga) near Mantridi, 5 km from Berhampur. Unique idol with one leg, discovered by a farmer. Popular during Dussehra and Navaratri.",
    location: "Near Berhampur, Odisha",
    category: "Temple",
    imageUrl: bhairabiImage,
    facts: [
      "5 km from Berhampur near Mantridi",
      "Goddess Bhairabi (fierce Durga form)",
      "Unique one-legged idol",
      "Discovered by farmer while ploughing",
      "Popular during Dussehra and Navaratri"
    ]
  },
  {
    title: "Aryapalli Beach",
    description: "Quiet, less crowded beach 30 km from Berhampur, ideal for peaceful getaways and stunning sunsets. Located near DRDO missile testing range at Chandipur-on-sea.",
    location: "Near Berhampur, Odisha",
    category: "Beach",
    imageUrl: aryapalliImage,
    facts: [
      "30 km from Berhampur",
      "Quiet and less crowded",
      "Ideal for peaceful getaways",
      "Stunning sunset views",
      "Near DRDO testing range"
    ]
  },
  {
    title: "Tampara Lake",
    description: "Beautiful freshwater lake near Chatrapur, 25 km from Berhampur. Features eco-park, boating facilities, water sports, and is popular for picnics and nature photography.",
    location: "Near Berhampur, Odisha",
    category: "Lake",
    imageUrl: tamparaImage,
    facts: [
      "25 km from Berhampur near Chatrapur",
      "Beautiful freshwater lake",
      "Boating and water sports facilities",
      "Eco-park maintained by OTDC",
      "Great for picnics and photography"
    ]
  },
  {
    title: "Mahurikalua Temple",
    description: "Temple dedicated to Goddess Mahurikalua, a form of Kali, located 20 km from Berhampur. Situated amidst forested hills, offering both spiritual and scenic appeal to visitors.",
    location: "Near Berhampur, Odisha",
    category: "Temple",
    imageUrl: mahurikaulaImage,
    facts: [
      "20 km from Berhampur",
      "Dedicated to Goddess Mahurikalua (Kali form)",
      "Located amidst forested hills",
      "Spiritual and scenic destination",
      "Important local pilgrimage site"
    ]
  },
  {
    title: "Potagarh Fort",
    description: "Also known as the 'Buried Fort', built during British period near Rushikulya River mouth in Ganjam, 35 km from Berhampur. Features combination of natural and man-made defenses, an important archaeological site.",
    location: "Ganjam, Odisha",
    category: "Fort",
    imageUrl: potagarhImage,
    facts: [
      "35 km from Berhampur in Ganjam",
      "Known as the 'Buried Fort'",
      "Built during British period",
      "Near Rushikulya River mouth",
      "Combination of natural and man-made defenses"
    ]
  },
  {
    title: "Chilika Lake",
    description: "Asia's largest brackish water lagoon, 60 km from Berhampur (Rambha entry). Home to migratory birds and famous Irrawaddy dolphins. OTDC offers lake cruises from Rambha resort.",
    location: "Near Berhampur, Odisha",
    category: "Lake",
    imageUrl: chilikaImage,
    facts: [
      "Asia's largest brackish water lagoon",
      "60 km from Berhampur (Rambha/Satapada entry)",
      "Home to Irrawaddy dolphins",
      "Migratory bird sanctuary",
      "OTDC lake cruises available"
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
