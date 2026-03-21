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

export interface Monument {
  title: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  facts: string[];
}

export interface CityData {
  name: string;
  sections: {
    title: string;
    monuments: Monument[];
  }[];
}

// Bhubaneswar monuments data
const bhubaneswarData: CityData = {
  name: "Bhubaneswar",
  sections: [
    {
      title: "Places in Bhubaneswar",
      monuments: [
        {
          title: "Lingaraja Temple",
          description: "A masterpiece of Kalinga architecture with a 180-ft high tower, this 11th century temple is dedicated to Lord Shiva in his Harihara form (half Vishnu, half Shiva).",
          location: "Bhubaneswar, Odisha",
          category: "Temple",
          imageUrl: lingarajaImage,
          facts: ["Built in 11th century by Somavamsi dynasty", "180-feet high tower", "Dedicated to Harihara", "Features sacred Bindu Sagar pond", "Masterpiece of Kalinga architecture"]
        },
        {
          title: "Mukteswara Temple",
          description: "Built in 10th century, known as the 'Gem of Odishan architecture'. Famous for its exquisite torana (arched gateway).",
          location: "Bhubaneswar, Odisha",
          category: "Temple",
          imageUrl: mukteswaraImage,
          facts: ["Built in 10th century", "Called 'Gem of Odishan architecture'", "Famous for exquisite torana", "Detailed carvings from Hindu mythology", "Small but architecturally significant"]
        },
        {
          title: "Rajarani Temple",
          description: "11th century temple built from red and golden sandstone. Famous for its intricate carvings depicting celestial nymphs.",
          location: "Bhubaneswar, Odisha",
          category: "Temple",
          imageUrl: rajaraniImage,
          facts: ["Built in 11th century", "Constructed from 'Rajarani' sandstone", "Famous for celestial nymphs carvings", "No presiding deity inside", "Believed to be connected to Lord Shiva"]
        }
      ]
    },
    {
      title: "Nearby Monuments",
      monuments: [
        {
          title: "Udayagiri & Khandagiri Caves",
          description: "Ancient Jain rock-cut shelters dating back to 2nd century BCE, built by King Kharavela.",
          location: "8 km from Bhubaneswar",
          category: "Cave",
          imageUrl: udayagiriImage,
          facts: ["8 km from Bhubaneswar", "Dating back to 2nd century BCE", "Built by King Kharavela", "Jain rock-cut shelters", "Rani Gumpha is the most ornate"]
        },
        {
          title: "Dhauli Shanti Stupa",
          description: "Peace pagoda at the historic site of the Kalinga War. Features 3rd century BCE Ashokan rock edicts.",
          location: "8 km from Bhubaneswar",
          category: "Stupa",
          imageUrl: dhauliImage,
          facts: ["8 km from Bhubaneswar", "Site of Kalinga War", "3rd century BCE Ashokan edicts", "Where Ashoka embraced Buddhism", "Peace pagoda built in 1972"]
        },
        {
          title: "Konark Sun Temple",
          description: "UNESCO World Heritage Site built in 13th century. Designed as a colossal chariot with 24 wheels.",
          location: "65 km from Bhubaneswar",
          category: "Temple",
          imageUrl: konarkImage,
          facts: ["65 km from Bhubaneswar", "Built in 13th century", "UNESCO World Heritage Site", "Designed as colossal chariot", "Dedicated to Surya (Sun God)"]
        },
        {
          title: "Jagannath Temple",
          description: "Sacred Hindu temple in Puri, one of the Char Dham pilgrimage sites. Famous for annual Rath Yatra.",
          location: "60 km from Bhubaneswar",
          category: "Temple",
          imageUrl: jagannathImage,
          facts: ["60 km from Bhubaneswar", "One of four Char Dham sites", "Famous for Rath Yatra", "World's largest temple kitchen", "Built in 12th century"]
        }
      ]
    }
  ]
};

// Puri monuments data
const puriData: CityData = {
  name: "Puri",
  sections: [
    {
      title: "Places in Puri",
      monuments: [
        {
          title: "Jagannath Temple",
          description: "Sacred Hindu temple, one of the Char Dham pilgrimage sites. Built in 12th century, famous for annual Rath Yatra and world's largest temple kitchen.",
          location: "Puri, Odisha",
          category: "Temple",
          imageUrl: jagannathImage,
          facts: ["Built in 12th century", "One of four Char Dham sites", "Famous for Rath Yatra", "World's largest temple kitchen", "Temple flag changes direction"]
        },
        {
          title: "Puri Beach",
          description: "One of the most famous beaches in India. Known for golden sands and the annual International Sand Art Festival.",
          location: "Puri, Odisha",
          category: "Beach",
          imageUrl: jagannathImage,
          facts: ["One of India's most famous beaches", "Golden sands", "Annual Sand Art Festival", "Near Jagannath Temple", "Vibrant atmosphere"]
        }
      ]
    },
    {
      title: "Nearby Attractions",
      monuments: [
        {
          title: "Konark Sun Temple",
          description: "UNESCO World Heritage Site built in 13th century. Designed as a colossal stone chariot with 24 wheels.",
          location: "35 km from Puri",
          category: "Temple",
          imageUrl: konarkImage,
          facts: ["35 km from Puri", "UNESCO World Heritage Site", "13th century marvel", "Designed as chariot", "24 intricate wheels"]
        },
        {
          title: "Chandrabhaga Beach",
          description: "A pristine beach near Konark Sun Temple. Known for clean sands and famous Chandrabhaga Mela.",
          location: "38 km from Puri",
          category: "Beach",
          imageUrl: konarkImage,
          facts: ["38 km from Puri", "Near Konark Temple", "Famous Chandrabhaga Mela", "Pristine sands", "Ideal for sunrise views"]
        },
        {
          title: "Chilika Lake",
          description: "Asia's largest brackish water lagoon. Home to migratory birds and famous Irrawaddy dolphins.",
          location: "50 km from Puri",
          category: "Lake",
          imageUrl: chilikaImage,
          facts: ["50 km from Puri", "Asia's largest lagoon", "Home to Irrawaddy dolphins", "Migratory bird sanctuary", "Lake cruises available"]
        }
      ]
    }
  ]
};

// Berhampur monuments data
const berhampurData: CityData = {
  name: "Berhampur",
  sections: [
    {
      title: "Places in Berhampur",
      monuments: [
        {
          title: "Budhi Thakurani Temple",
          description: "Ancient temple dedicated to Goddess Budhi Thakurani. Famous for the grand Budhi Thakurani Yatra festival.",
          location: "Berhampur, Odisha",
          category: "Temple",
          imageUrl: budhiThakuraniImage,
          facts: ["Ancient temple in city center", "Famous Budhi Thakurani Yatra", "Celebrated every two years", "Important local deity", "Rich cultural traditions"]
        },
        {
          title: "NIST University",
          description: "One of the premier technical institutions in Eastern India, known for engineering and technology education.",
          location: "Berhampur, Odisha",
          category: "Education",
          imageUrl: nistImage,
          facts: ["Premier technical institution", "Established in 1996", "Known for engineering programs", "Beautiful campus", "Modern facilities"]
        }
      ]
    },
    {
      title: "Nearby Attractions",
      monuments: [
        {
          title: "Tara Tarini Temple",
          description: "Ancient Shakti Peetha perched on Kumari Hills. One of the oldest pilgrimage centers in India dedicated to Goddess Tara Tarini.",
          location: "30 km from Berhampur",
          category: "Temple",
          imageUrl: taraTariniImage,
          facts: ["30 km from Berhampur", "Ancient Shakti Peetha", "On Kumari Hills", "Ropeway available", "Panoramic views of Rushikulya River"]
        },
        {
          title: "Gopalpur-on-Sea",
          description: "One of the cleanest and most scenic beaches on the eastern coast. Old lighthouse and colonial heritage.",
          location: "16 km from Berhampur",
          category: "Beach",
          imageUrl: gopalpurImage,
          facts: ["16 km from Berhampur", "Cleanest beach on east coast", "Old lighthouse", "Colonial heritage", "Great for seafood"]
        },
        {
          title: "Taptapani Hot Springs",
          description: "Natural hot water springs with sulphur content, believed to have medicinal properties.",
          location: "50 km from Berhampur",
          category: "Natural",
          imageUrl: taptapaniImage,
          facts: ["50 km from Berhampur", "Natural hot springs", "Sulphur water", "Believed medicinal properties", "Scenic forest surroundings"]
        },
        {
          title: "Chilika Lake",
          description: "Asia's largest brackish water lagoon. Home to migratory birds and famous Irrawaddy dolphins.",
          location: "90 km from Berhampur (Rambha)",
          category: "Lake",
          imageUrl: chilikaImage,
          facts: ["90 km from Berhampur", "Asia's largest lagoon", "Irrawaddy dolphins", "Migratory birds", "Rambha entry point"]
        },
        {
          title: "Mahendragiri Hills",
          description: "Second highest peak of Eastern Ghats. Sacred mountain associated with Parashurama legend.",
          location: "85 km from Berhampur",
          category: "Mountain",
          imageUrl: mahendragiriImage,
          facts: ["85 km from Berhampur", "Second highest Eastern Ghats peak", "Sacred mountain", "Trekking destination", "Rich biodiversity"]
        }
      ]
    }
  ]
};

// Cuttack monuments data
const cuttackData: CityData = {
  name: "Cuttack",
  sections: [
    {
      title: "Places in Cuttack",
      monuments: [
        {
          title: "Barabati Fort",
          description: "14th century fort built by the Ganga dynasty. Features moat, earthen ramparts, and once housed a 9-storey palace.",
          location: "Cuttack, Odisha",
          category: "Fort",
          imageUrl: barabatiImage,
          facts: ["Built in 14th century", "Ganga dynasty architecture", "Once had 9-storey palace", "Features moat", "Near Mahanadi River"]
        }
      ]
    },
    {
      title: "Nearby Attractions",
      monuments: [
        {
          title: "Lingaraja Temple",
          description: "A masterpiece of Kalinga architecture, 11th century temple dedicated to Lord Shiva.",
          location: "25 km from Cuttack",
          category: "Temple",
          imageUrl: lingarajaImage,
          facts: ["25 km from Cuttack", "11th century temple", "180-feet high tower", "Kalinga architecture", "Dedicated to Harihara"]
        },
        {
          title: "Udayagiri & Khandagiri Caves",
          description: "Ancient Jain rock-cut shelters dating back to 2nd century BCE.",
          location: "30 km from Cuttack",
          category: "Cave",
          imageUrl: udayagiriImage,
          facts: ["30 km from Cuttack", "2nd century BCE", "Jain rock-cut shelters", "Built by King Kharavela", "Historic inscriptions"]
        }
      ]
    }
  ]
};

// Default data for other Indian cities
const defaultIndiaData: CityData = {
  name: "India",
  sections: [
    {
      title: "Famous Places in Odisha",
      monuments: [
        {
          title: "Konark Sun Temple",
          description: "UNESCO World Heritage Site built in 13th century. Designed as a colossal chariot with 24 wheels.",
          location: "Konark, Odisha",
          category: "Temple",
          imageUrl: konarkImage,
          facts: ["UNESCO World Heritage Site", "Built in 13th century", "Designed as chariot", "24 intricate wheels", "Dedicated to Sun God"]
        },
        {
          title: "Jagannath Temple",
          description: "Sacred Hindu temple, one of the Char Dham pilgrimage sites. Famous for annual Rath Yatra.",
          location: "Puri, Odisha",
          category: "Temple",
          imageUrl: jagannathImage,
          facts: ["One of four Char Dham sites", "Famous for Rath Yatra", "12th century temple", "World's largest kitchen", "Temple flag mystery"]
        },
        {
          title: "Lingaraja Temple",
          description: "Masterpiece of Kalinga architecture with a 180-ft tower, 11th century temple dedicated to Lord Shiva.",
          location: "Bhubaneswar, Odisha",
          category: "Temple",
          imageUrl: lingarajaImage,
          facts: ["11th century temple", "180-feet tower", "Kalinga architecture", "Dedicated to Harihara", "Sacred Bindu Sagar pond"]
        }
      ]
    },
    {
      title: "Explore More of Odisha",
      monuments: [
        {
          title: "Chilika Lake",
          description: "Asia's largest brackish water lagoon. Home to migratory birds and famous Irrawaddy dolphins.",
          location: "Odisha",
          category: "Lake",
          imageUrl: chilikaImage,
          facts: ["Asia's largest lagoon", "Irrawaddy dolphins", "Migratory birds", "Multiple entry points", "Lake cruises available"]
        },
        {
          title: "Udayagiri & Khandagiri Caves",
          description: "Ancient Jain rock-cut shelters dating back to 2nd century BCE.",
          location: "Near Bhubaneswar, Odisha",
          category: "Cave",
          imageUrl: udayagiriImage,
          facts: ["2nd century BCE", "Jain rock-cut shelters", "Built by King Kharavela", "Historic inscriptions", "Rani Gumpha is famous"]
        },
        {
          title: "Dhauli Shanti Stupa",
          description: "Peace pagoda at the historic site of the Kalinga War where Emperor Ashoka embraced Buddhism.",
          location: "Near Bhubaneswar, Odisha",
          category: "Stupa",
          imageUrl: dhauliImage,
          facts: ["Site of Kalinga War", "Ashokan rock edicts", "Ashoka embraced Buddhism here", "Peace pagoda", "Historic significance"]
        }
      ]
    }
  ]
};

// City name matching function
export const getCityData = (cityName: string): CityData => {
  const lowerCityName = cityName.toLowerCase();
  
  if (lowerCityName.includes("bhubaneswar") || lowerCityName.includes("bbsr")) {
    return bhubaneswarData;
  }
  if (lowerCityName.includes("puri")) {
    return puriData;
  }
  if (lowerCityName.includes("berhampur") || lowerCityName.includes("brahmapur")) {
    return berhampurData;
  }
  if (lowerCityName.includes("cuttack")) {
    return cuttackData;
  }
  
  // Return default data for other cities
  return defaultIndiaData;
};

// Odisha cities for autocomplete prioritization
export const odishaCities = [
  "Bhubaneswar",
  "Puri", 
  "Cuttack",
  "Berhampur",
  "Rourkela",
  "Sambalpur",
  "Balasore",
  "Baripada",
  "Konark",
  "Angul",
  "Jharsuguda"
];
