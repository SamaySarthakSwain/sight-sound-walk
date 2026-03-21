export interface HistoricalPhoto {
  year: number;
  url: string;
  caption: string;
}

export interface ARModel {
  id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  embedUrl: string;
  /** Optional native GLB/GLTF file URL for direct VR loading (future use) */
  glbUrl?: string;
  /** Whether this model has the special Immersive 3D Time Travel Mode (Three.js based) */
  has3DTimeTravel?: boolean;
  /** Whether this model has the Photo-based Time Travel Feature */
  hasPhotoTimeTravel?: boolean;
  historicalPhotos?: HistoricalPhoto[];
  categories: string[];
  credit: { author: string; authorUrl: string; modelUrl: string };
}

export const arModels: ARModel[] = [
  {
    id: "konark-sun-temple",
    name: "Sun Temple, Konark",
    location: "Konark, Odisha",
    state: "Odisha",
    description: "A 13th-century CE Sun temple at Konark, a UNESCO World Heritage Site known for its intricate chariot-shaped architecture.",
    embedUrl: "https://sketchfab.com/models/6cc905be2ae34e8091eb1eaa84a17738/embed?ui_theme=dark",
    has3DTimeTravel: true,
    hasPhotoTimeTravel: true,
    historicalPhotos: [
      { year: 1868, url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Konark_Sun_Temple_main_temple_in_ruins_1868.jpg", caption: "Earliest known photograph showing the main temple in ruins." },
      { year: 1900, url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Sun_Temple_of_Konark_1900.jpg", caption: "Early 20th century view showing the temple's mandapa before the sand-filling was removed." },
      { year: 1950, url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Konark_Sun_Temple_in_1955.jpg", caption: "Post-independence conservation and archaeological study." },
      { year: 2024, url: "https://images.unsplash.com/photo-1620393470010-fd97d3962002?auto=format&fit=crop&q=80&w=1200", caption: "Present day UNESCO World Heritage Site." }
    ],
    categories: ["Odisha", "Temples"],
    credit: { author: "moniln", authorUrl: "https://sketchfab.com/moniln9", modelUrl: "https://sketchfab.com/3d-models/sun-temple-konark-6cc905be2ae34e8091eb1eaa84a17738" },
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    state: "Uttar Pradesh",
    description: "An ivory-white marble mausoleum and UNESCO World Heritage Site, widely regarded as a jewel of Muslim art in India.",
    embedUrl: "https://sketchfab.com/models/33149233cefd492b9abdd50fe5a8c921/embed?ui_theme=dark",
    hasPhotoTimeTravel: true,
    historicalPhotos: [
      { year: 1850, url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Taj_Mahal_Agra_1850s.jpg", caption: "Rare mid-19th century calotype view of the mausoleum." },
      { year: 1900, url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Taj_Mahal_Agra_India_ca_1900.jpg", caption: "View from the formal gardens during the late British Raj." },
      { year: 1940, url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Ariel_view_of_Taj_Mahal_1940.jpg", caption: "Aerial view during World War II, showing protective scaffolding." },
      { year: 2024, url: "https://images.unsplash.com/photo-1564507592333-c60657eea023?auto=format&fit=crop&q=80&w=1200", caption: "Modern day iconic landmark and wonder of the world." }
    ],
    categories: ["India", "Historical Monuments"],
    credit: { author: "Sketchfab", authorUrl: "https://sketchfab.com", modelUrl: "https://sketchfab.com/models/33149233cefd492b9abdd50fe5a8c921" },
  },
  {
    id: "india-gate",
    name: "India Gate",
    location: "New Delhi",
    state: "Delhi",
    description: "A war memorial located astride the Rajpath, dedicated to soldiers of British India who died in World War I.",
    embedUrl: "https://sketchfab.com/models/549cc0862a184db2b48e518bb6beedbd/embed?ui_theme=dark",
    hasPhotoTimeTravel: true,
    historicalPhotos: [
      { year: 1931, url: "https://upload.wikimedia.org/wikipedia/commons/7/77/India_Gate_New_Delhi_1930s.jpg", caption: "The newly completed All India War Memorial." },
      { year: 1950, url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/New_Delhi_India_Gate_1950.jpg", caption: "The heart of independent India's new capital." },
      { year: 2024, url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200", caption: "Present day view of the Central Vista." }
    ],
    categories: ["India", "Historical Monuments"],
    credit: { author: "Karan Sahu", authorUrl: "https://sketchfab.com/cgkaran", modelUrl: "https://sketchfab.com/3d-models/india-gate-high-poly-model-549cc0862a184db2b48e518bb6beedbd" },
  },
  {
    id: "charminar",
    name: "Charminar",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    description: "A monument and mosque constructed in 1591, an iconic landmark and global heritage structure.",
    embedUrl: "https://sketchfab.com/models/82603f1fe3ed4c31b37786e2bc2b63b0/embed?ui_theme=dark",
    hasPhotoTimeTravel: true,
    historicalPhotos: [
      { year: 1887, url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Charminar_in_1887.jpg", caption: "A street view of Charminar during the reign of the Nizams." },
      { year: 1920, url: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Charminar_Hyderabad_India_1920s.jpg", caption: "The bustling intersection in old Hyderabad a century ago." },
      { year: 2024, url: "https://images.unsplash.com/photo-1590050752117-2ba079ca9631?auto=format&fit=crop&q=80&w=1200", caption: "Modern day view showing the vibrant culture around the monument." }
    ],
    categories: ["India", "Historical Monuments"],
    credit: { author: "Dolores", authorUrl: "https://sketchfab.com/upto21", modelUrl: "https://sketchfab.com/3d-models/charminar-hyderabad-82603f1fe3ed4c31b37786e2bc2b63b0" },
  },
  {
    id: "gateway-of-india",
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    state: "Maharashtra",
    description: "Built in 1924 to commemorate King George V's visit, this iconic arch monument overlooks the Arabian Sea at Apollo Bunder.",
    embedUrl: "https://sketchfab.com/models/38a652e9f3bf49039026ef65ef61ac92/embed?ui_theme=dark",
    hasPhotoTimeTravel: true,
    historicalPhotos: [
      { year: 1924, url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Gateway_of_India%2C_Mumbai_1924.jpg", caption: "The year of its completion and official opening." },
      { year: 1948, url: "https://upload.wikimedia.org/wikipedia/commons/3/39/The_Departure_of_the_British_from_India%2C_1948.jpg", caption: "The last British troops leaving India through the Gateway." },
      { year: 2024, url: "https://images.unsplash.com/photo-1567157577867-05ccb1301934?auto=format&fit=crop&q=80&w=1200", caption: "The soul of Mumbai's waterfront today." }
    ],
    categories: ["India", "Historical Monuments"],
    credit: { author: "CyArk", authorUrl: "https://sketchfab.com/CyArk", modelUrl: "https://sketchfab.com/3d-models/gateway-of-india-mumbai-38a652e9f3bf49039026ef65ef61ac92" },
  },
  {
    id: "red-fort",
    name: "Red Fort",
    location: "New Delhi",
    state: "Delhi",
    description: "A UNESCO World Heritage Site and Mughal-era fort complex built in 1639, serving as the main residence of the Mughal emperors.",
    embedUrl: "https://sketchfab.com/models/74ff6d703a174f9fb1ba266003f5c4fc/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "MMI", authorUrl: "https://sketchfab.com/sneh.", modelUrl: "https://sketchfab.com/3d-models/red-fort-delhi-74ff6d703a174f9fb1ba266003f5c4fc" },
  },
  {
    id: "brihadeeshwara",
    name: "Brihadeeshwara Temple",
    location: "Thanjavur, Tamil Nadu",
    state: "Tamil Nadu",
    description: "A UNESCO World Heritage Site built by Raja Raja Chola I in 1010 CE, one of the largest South Indian temples with a 66m vimana tower.",
    embedUrl: "https://sketchfab.com/models/bcd05c0ac54a460883af7b8d9f4686c7/embed?ui_theme=dark",
    categories: ["India", "Temples"],
    credit: { author: "Yuvaan Purohit", authorUrl: "https://sketchfab.com/Prince.Purohit", modelUrl: "https://sketchfab.com/3d-models/brihadeeshwara-mandir-thanjavur-bcd05c0ac54a460883af7b8d9f4686c7" },
  },
  {
    id: "rani-ki-vav",
    name: "Rani Ki Vav",
    location: "Patan, Gujarat",
    state: "Gujarat",
    description: "A UNESCO World Heritage stepwell built in the 11th century by Queen Udayamati, featuring over 800 intricate sculptures.",
    embedUrl: "https://sketchfab.com/models/936ab8379d3c41da83c36e8902579a02/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "CyArk", authorUrl: "https://sketchfab.com/CyArk", modelUrl: "https://sketchfab.com/3d-models/rani-ki-vav-statue-gujarat-india-936ab8379d3c41da83c36e8902579a02" },
  },
  {
    id: "parasurameswara",
    name: "Parasurameswara Temple",
    location: "Bhubaneswar, Odisha",
    state: "Odisha",
    description: "A 7th-century Shiva temple and one of the oldest temples in Bhubaneswar, showcasing early Kalinga architectural style.",
    embedUrl: "https://sketchfab.com/models/6f64ba7f020a41c88d5970807893946b/embed?ui_theme=dark",
    categories: ["Odisha", "Temples"],
    credit: { author: "Prateek Pattanaik", authorUrl: "https://sketchfab.com/pattaprateek", modelUrl: "https://sketchfab.com/3d-models/saptamatruka-panel-from-parasurameswara-6f64ba7f020a41c88d5970807893946b" },
  },
  {
    id: "south-indian-gopuram",
    name: "South Indian Temple Gopuram",
    location: "South India",
    state: "Tamil Nadu",
    description: "A detailed recreation of a Dravidian-style temple tower (Gopuram), showcasing the intricate carvings and tiered structure typical of South Indian temples.",
    embedUrl: "https://sketchfab.com/models/be86255d48eb4be9bb5504d698871326/embed?ui_theme=dark",
    categories: ["India", "Temples"],
    credit: { author: "venkatgurdge", authorUrl: "https://sketchfab.com/venkatgurdge", modelUrl: "https://sketchfab.com/3d-models/south-indian-temple-gopuram-3d-model-be86255d48eb4be9bb5504d698871326" },
  },
  {
    id: "ajanta-cave-01",
    name: "Ajanta Cave 01",
    location: "Aurangabad, Maharashtra",
    state: "Maharashtra",
    description: "Part of the UNESCO World Heritage Ajanta Caves complex, Cave 1 features exquisite Buddhist murals and sculptures dating back to the 2nd century BCE.",
    embedUrl: "https://sketchfab.com/models/0e0aa7dd247d4d818c9ecb1e7be3bcc6/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "moniln", authorUrl: "https://sketchfab.com/moniln9", modelUrl: "https://sketchfab.com/3d-models/ajanta-cave-01-0e0aa7dd247d4d818c9ecb1e7be3bcc6" },
  },
  {
    id: "hampi-chariot",
    name: "Hampi Stone Chariot",
    location: "Hampi, Karnataka",
    state: "Karnataka",
    description: "The iconic stone chariot at Vittala Temple in Hampi, a UNESCO World Heritage Site representing the grandeur of the Vijayanagara Empire.",
    embedUrl: "https://sketchfab.com/models/81b5cd48f4384b309df5fa43ea3b3741/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "Sketchfab", authorUrl: "https://sketchfab.com", modelUrl: "https://sketchfab.com/3d-models/hampi-chariot-81b5cd48f4384b309df5fa43ea3b3741" },
  },
  {
    id: "amaravati-relief",
    name: "Amaravati Buddhist Relief",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    description: "A double-sided relief sculpture from the Great Stupa at Amaravati, depicting scenes from Buddhist tradition. Digitized by the British Museum.",
    embedUrl: "https://sketchfab.com/models/711eab86569a4ad1b024911a31dbe8af/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "The British Museum", authorUrl: "https://sketchfab.com/britishmuseum", modelUrl: "https://sketchfab.com/3d-models/amaravati-double-sided-relief-711eab86569a4ad1b024911a31dbe8af" },
  },
  {
    id: "ancient-rajmahal",
    name: "Ancient Rajmahal Palace",
    location: "Rajasthan, India",
    state: "Rajasthan",
    description: "A detailed 3D recreation of an ancient Indian royal palace showcasing traditional Rajput architectural elements and fortified design.",
    embedUrl: "https://sketchfab.com/models/abb617d43d73404a9c5b32dd6f671c51/embed?ui_theme=dark",
    categories: ["India", "Historical Monuments"],
    credit: { author: "Pradip8698", authorUrl: "https://sketchfab.com/Meha8698", modelUrl: "https://sketchfab.com/3d-models/ancient-rajmahal-royal-palace-abb617d43d73404a9c5b32dd6f671c51" },
  },
  {
    id: "mahabodhi-temple",
    name: "Mahabodhi Temple",
    location: "Bodh Gaya, Bihar",
    state: "Bihar",
    description: "A UNESCO World Heritage Site marking the location where Siddhartha Gautama attained enlightenment, one of the holiest Buddhist pilgrimage sites.",
    embedUrl: "https://sketchfab.com/models/a31deb9005b043d1937258c74801999c/embed?ui_theme=dark",
    categories: ["India", "Temples"],
    credit: { author: "rbm.1world", authorUrl: "https://sketchfab.com/rbm.1world", modelUrl: "https://sketchfab.com/3d-models/mahabodhi-temple-in-chobhar-a31deb9005b043d1937258c74801999c" },
  },
  {
    id: "indian-temple-walls",
    name: "Mahabaleshwar Temple Walls",
    location: "Mahabaleshwar, Maharashtra",
    state: "Maharashtra",
    description: "A photoscanned section of intricately carved temple walls from Mahabaleshwar, captured with 4K textures preserving fine sculptural details.",
    embedUrl: "https://sketchfab.com/models/04547e66984d44e9a19dd517bbbff4fb/embed?ui_theme=dark",
    categories: ["India", "Temples"],
    credit: { author: "HotFrost", authorUrl: "https://sketchfab.com/hotfrost", modelUrl: "https://sketchfab.com/3d-models/indian-temple-walls-section-photoscan-04547e66984d44e9a19dd517bbbff4fb" },
  },
];

export const arCategories = ["All", "Odisha", "India", "Temples", "Historical Monuments"] as const;
