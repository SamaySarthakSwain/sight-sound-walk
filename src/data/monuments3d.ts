export interface Hotspot {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
}

export interface TimePeriod {
  year: number;
  label: string;
  description: string;
}

export interface Monument3D {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  historyText: string;
  timePeriods?: TimePeriod[];
  hotspots?: Hotspot[];
}

export const monuments3dData: Monument3D[] = [
  {
    id: "konark-sun-temple",
    name: "Konark Sun Temple",
    type: "Monument",
    coordinates: [86.0945, 19.8876],
    description: "A 13th-century CE sun temple at Konark about 35 kilometres northeast from Puri on the coastline of Odisha.",
    historyText: "Welcome to the Konark Sun Temple. Built in the 13th century by King Narasimhadeva I of the Eastern Ganga Dynasty. This magnificent structure was designed in the shape of a colossal chariot for the Sun God Surya, featuring 24 meticulously carved wheels pulled by seven horses.",
    timePeriods: [
      { year: 1250, label: "1250 AD", description: "Temple construction completed by King Narasimhadeva I." },
      { year: 1568, label: "1568 AD", description: "Temple suffered damage according to historical texts." },
      { year: 1903, label: "1903 AD", description: "British colonial era preservation efforts begin, filling the main hall with sand." },
      { year: 2024, label: "Present", description: "A UNESCO World Heritage site and a major pilgrimage/tourism destination." }
    ],
    hotspots: [
      { id: "k-wheel", name: "The Sun Dial Wheel", coordinates: [86.0946, 19.8875], description: "One of the 24 wheels, functioning as a highly accurate sundial." },
      { id: "k-horses", name: "The Seven Horses", coordinates: [86.0944, 19.8877], description: "Representing the seven days of the week pulling the Sun God's chariot." },
      { id: "k-natamandir", name: "Nata Mandir (Dance Hall)", coordinates: [86.0948, 19.8876], description: "The intricately carved hall where temple dancers performed." }
    ]
  },
  {
    id: "jagannath-temple",
    name: "Shree Jagannath Temple",
    type: "Temple",
    coordinates: [85.8179, 19.8049],
    description: "The Jagannath Temple is an important Hindu temple dedicated to Jagannath, a form of Vishnu, in Puri in the state of Odisha on the eastern coast of India.",
    historyText: "Welcome to the Shree Jagannath Temple in Puri. The present temple was rebuilt from the 10th century onwards, on the site of an earlier temple, and begun by Anantavarman Chodaganga Deva, the first king of the Eastern Ganga dynasty.",
    hotspots: [
      { id: "j-aruna", name: "Aruna Stambha", coordinates: [85.8181, 19.8049], description: "The 34-foot tall, monolithic sun pillar brought from Konark." },
      { id: "j-singhadwara", name: "Singhadwara", coordinates: [85.8180, 19.8049], description: "The 'Lion Gate', which is the main entrance to the temple." }
    ]
  },
  {
    id: "lingaraj-temple",
    name: "Lingaraj Temple",
    type: "Temple",
    coordinates: [85.8338, 20.2381],
    description: "Lingaraj Temple is a Hindu temple dedicated to Harihara, a form of Shiva and Vishnu and is one of the oldest temples in Bhubaneswar.",
    historyText: "Welcome to Lingaraj Temple, the largest temple in Bhubaneswar. Built in the 11th century, it is a quintessential example of Kalinga architecture.",
    hotspots: [
      { id: "l-bindusagar", name: "Bindu Sagar Lake", coordinates: [85.8339, 20.2390], description: "The sacred lake believed to contain water from every holy river in India." }
    ]
  },
  {
    id: "udayagiri-khandagiri",
    name: "Udayagiri and Khandagiri Caves",
    type: "Cave",
    coordinates: [85.7852, 20.2587],
    description: "Partly natural and partly artificial caves of archaeological, historical and religious importance near the city of Bhubaneswar.",
    historyText: "Welcome to Udayagiri and Khandagiri Caves. These finely carved caves were built around the 2nd century BCE during the reign of King Kharavela for Jain monks.",
    hotspots: [
      { id: "uk-ranigumpha", name: "Rani Gumpha", coordinates: [85.7853, 20.2588], description: "The largest and most popular cave (Queen's Cave) in Udayagiri." },
      { id: "uk-hathigumpha", name: "Hathi Gumpha", coordinates: [85.7851, 20.2586], description: "Contains the famous Hathigumpha inscription of King Kharavela." }
    ]
  },
  {
    id: "chilika-lake",
    name: "Chilika Lake",
    type: "Lake",
    coordinates: [85.2750, 19.7042],
    description: "Chilika Lake is a brackish water lagoon, spread over the Puri, Khurda and Ganjam districts of Odisha state on the east coast of India.",
    historyText: "Welcome to Chilika Lake. It is the largest coastal lagoon in India and the second largest brackish water lagoon in the world, hosting incredible migratory bird populations and the endangered Irrawaddy dolphins.",
    hotspots: [
      { id: "c-kalijai", name: "Kalijai Temple", coordinates: [85.2500, 19.6500], description: "Located on an island in the lake, dedicated to Goddess Kalijai." },
      { id: "c-nalabana", name: "Nalabana Bird Sanctuary", coordinates: [85.3000, 19.6800], description: "A major island sanctuary for migratory birds." }
    ]
  },
  {
    id: "mukteshvara-temple",
    name: "Mukteshvara Temple",
    type: "Temple",
    coordinates: [85.8415, 20.2435],
    description: "Mukteshvara Temple is a 10th-century Hindu temple dedicated to Shiva located in Bhubaneswar, Odisha.",
    historyText: "Welcome to Mukteshvara Temple. Often called the 'Gem of Odisha architecture', this 10th-century temple marks the transition point between early and later phases of the Kalinga architectural style.",
    hotspots: [
      { id: "m-torana", name: "Arched Torana", coordinates: [85.8416, 20.2435], description: "The beautifully decorated arched gateway, unique in Orissan architecture." }
    ]
  },
  {
    id: "dhauli-stupa",
    name: "Dhauli Shanti Stupa",
    type: "Monument",
    coordinates: [85.8394, 20.1925],
    description: "Dhauli is a hill on the banks of the river Daya, 8 km south of Bhubaneswar. It is known for the Peace Pagoda (Shanti Stupa).",
    historyText: "Welcome to Dhauli Shanti Stupa. This hill is presumed to be the area where the Kalinga War was fought. The peace pagoda was built in 1972 by the Japan Buddha Sangha and the Kalinga Nippon Buddha Sangha.",
    hotspots: [
      { id: "d-edicts", name: "Ashokan Rock Edicts", coordinates: [85.8392, 20.1920], description: "Emperor Ashoka's rock edicts detailing his transformation after the Kalinga War." }
    ]
  },
  {
    id: "nandankanan",
    name: "Nandankanan Zoological Park",
    type: "Park",
    coordinates: [85.8184, 20.3957],
    description: "A 437-hectare zoo and botanical garden in Bhubaneswar.",
    historyText: "Welcome to Nandankanan Zoological Park. Established in 1960, it was the first zoo in India to join the World Association of Zoos and Aquariums. It is famous for its white tigers and melanistic tigers."
  },
  {
    id: "simlipal",
    name: "Simlipal National Park",
    type: "Park",
    coordinates: [86.3500, 21.8000],
    description: "A national park and a tiger reserve in the Mayurbhanj district.",
    historyText: "Welcome to Simlipal National Park. Spanning over 2,750 square kilometers, it derives its name from the abundance of red silk cotton trees. It's home to Bengal tigers, Asian elephants, and diverse wildlife."
  },
  {
    id: "bhitarkanika",
    name: "Bhitarkanika National Park",
    type: "Park",
    coordinates: [86.8667, 20.7333],
    description: "A national park located in Kendrapara district of Odisha.",
    historyText: "Welcome to Bhitarkanika National Park. It's renowned for its lush mangrove forests and as a massive sanctuary for the Saltwater Crocodile, Indian python, and King cobra."
  },
  {
    id: "rajarani-temple",
    name: "Rajarani Temple",
    type: "Temple",
    coordinates: [85.8430, 20.2438],
    description: "An 11th-century Hindu temple in Bhubaneswar.",
    historyText: "Welcome to the Rajarani Temple. Built from a dull red and yellow sandstone locally called 'Rajarani', this temple is unique as it contains no presiding deity inside the sanctum."
  },
  {
    id: "chandipur-beach",
    name: "Chandipur Beach",
    type: "Beach",
    coordinates: [87.0375, 21.4655],
    description: "A beach in Balasore district known for its unique receding waters.",
    historyText: "Welcome to Chandipur Beach. This unique beach is famous for its unusual phenomenon where the sea water recedes anywhere from 1 to 5 kilometers during the ebb tide."
  },
  {
    id: "gopalpur-beach",
    name: "Gopalpur Beach",
    type: "Beach",
    coordinates: [84.9126, 19.2625],
    description: "A commercial port turned into a famous sea beach in Ganjam district.",
    historyText: "Welcome to Gopalpur Beach. Once a bustling seaport during the colonial era, today it is a peaceful beach destination known for its deep blue waters and quiet environment."
  },
  {
    id: "puri-beach",
    name: "Golden Beach (Puri)",
    type: "Beach",
    coordinates: [85.8194, 19.7946],
    description: "The main beach stretching along the city of Puri.",
    historyText: "Welcome to Puri's Golden Beach. Famous for its golden sands and roaring waves of the Bay of Bengal, it is also a canvas for the renowned sand artist Sudarshan Pattnaik."
  },
  {
    id: "raghurajpur",
    name: "Raghurajpur Artist Village",
    type: "Village",
    coordinates: [85.8305, 19.9044],
    description: "A heritage crafts village known for its Pattachitra painters.",
    historyText: "Welcome to Raghurajpur. This heritage crafts village is home to artisans who have kept the intricate Pattachitra style of painting alive for centuries."
  },
  {
    id: "hirakud-dam",
    name: "Hirakud Dam",
    type: "Monument",
    coordinates: [83.8700, 21.5300],
    description: "Built across the Mahanadi River, about 15 kilometres from Sambalpur.",
    historyText: "Welcome to Hirakud Dam. Built in 1957, it is one of the first major multipurpose river valley projects started after India's independence, featuring one of the longest earthen dams in the world."
  },
  {
    id: "daringbadi",
    name: "Daringbadi",
    type: "Hill Station",
    coordinates: [84.1084, 19.9077],
    description: "A hill station in Kandhamal district, popularly known as the Kashmir of Odisha.",
    historyText: "Welcome to Daringbadi. Situated at an altitude of 3000 ft, it boasts pine forests, coffee gardens, and beautiful valleys, offering a chilly climate unique to this region."
  },
  {
    id: "mahendragiri",
    name: "Mahendragiri Hills",
    type: "Hill Station",
    coordinates: [84.3644, 18.9667],
    description: "A mountain peak in the Paralakhemundi subdivision of Gajapati district.",
    historyText: "Welcome to Mahendragiri Hills. Rich in mythology and biodiversity, these hills are associated with the Ramayana and Mahabharata, offering stunning panoramic views."
  },
  {
    id: "taratarini-temple",
    name: "Tara Tarini Temple",
    type: "Temple",
    coordinates: [84.8988, 19.4975],
    description: "A famous Hindu shrine situated on the Kumari hills at the bank of the River Rushikulya near Purushottampur.",
    historyText: "Welcome to the Tara Tarini Temple. It is considered one of the most ancient Shakti Peethas and is a major center of Shakti worship in Odisha."
  },
  {
    id: "huma-temple",
    name: "Huma Leaning Temple",
    type: "Temple",
    coordinates: [83.9928, 21.2842],
    description: "The only leaning temple in the world dedicated to Lord Shiva, located near Sambalpur.",
    historyText: "Welcome to the Leaning Temple of Huma. Dedicated to Lord Bimaleswar, the temple leans at an angle, the reason for which continues to be a subject of structural and historical research."
  },
  {
    id: "samaleswari-temple",
    name: "Samaleswari Temple",
    type: "Temple",
    coordinates: [83.9610, 21.4700],
    description: "A Hindu temple in Sambalpur dedicated to the goddess Samaleswari.",
    historyText: "Welcome to Samaleswari Temple. Located on the banks of the Mahanadi river, Goddess Samaleswari is deeply revered in western Odisha and Chhattisgarh."
  },
  {
    id: "kapilash",
    name: "Kapilash Temple",
    type: "Temple",
    coordinates: [85.7600, 20.6800],
    description: "Situated in Dhenkanal district, known as the Kailash of Odisha.",
    historyText: "Welcome to Kapilash. Set amidst verdant hills, the Chandrashekhar Temple is accessed via 1352 steep steps and is a highly respected pilgrimage site."
  },
  {
    id: "joranda-falls",
    name: "Joranda Falls",
    type: "Park",
    coordinates: [86.1550, 21.9360],
    description: "A breathtaking waterfall located in the core area of Simlipal National Park.",
    historyText: "Welcome to Joranda Falls. Plunging from a height of over 150 meters, it is situated amidst the dense greenery of the Simlipal tiger reserve."
  },
  {
    id: "barehipani",
    name: "Barehipani Falls",
    type: "Park",
    coordinates: [86.3811, 21.8950],
    description: "A two tiered waterfall located in Simlipal National Park.",
    historyText: "Welcome to Barehipani Falls. It is one of the highest waterfalls in India, falling from a spectacular height of 399 meters amidst thick forestry."
  },
  {
    id: "khandadhar",
    name: "Khandadhar Falls",
    type: "Park",
    coordinates: [85.1610, 21.7580],
    description: "Located in Sundargarh district, it is the second highest waterfall in Odisha.",
    historyText: "Welcome to Khandadhar Falls. The falls have a horse-tail shape and drop from a towering height of 244 meters, looking like a brilliant sword (Khanda) from a distance."
  },
  { id: "duduma", name: "Duduma Waterfalls", type: "Park", coordinates: [82.5200, 18.5500], description: "Situated on the border of Odisha and Andhra Pradesh.", historyText: "Welcome to Duduma Waterfalls on the Machkund River, a massive 175-meter cascade." },
  { id: "gupteswar", name: "Gupteswar Cave", type: "Cave", coordinates: [82.1610, 18.8230], description: "A deeply revered limestone cave shrine of Lord Shiva.", historyText: "Welcome to Gupteswar Cave. Hidden in dense forests, this cave holds a giant natural Shiva Linga." },
  { id: "cuttack-fort", name: "Barabati Fort", type: "Monument", coordinates: [85.8670, 20.4850], description: "A 14th-century fort built by the Ganga dynasty.", historyText: "Welcome to Barabati Fort. Though mostly in ruins, the carved gateway and earthen mound signify its grand history." },
  { id: "maritime-museum", name: "Odisha State Maritime Museum", type: "Museum", coordinates: [85.8920, 20.4700], description: "Located in Cuttack, detailing Odisha's maritime history.", historyText: "Welcome to the Maritime Museum, which beautifully chronicles the ancient shipping and maritime prowess of Kalinga." },
  { id: "netaji-museum", name: "Netaji Birth Place Museum", type: "Museum", coordinates: [85.8750, 20.4650], description: "The ancestral house of Netaji Subhas Chandra Bose in Cuttack.", historyText: "Welcome to Janakinath Bhawan, the birthplace of the legendary freedom fighter Netaji Subhas Chandra Bose." },
  { id: "lalitgiri", name: "Lalitgiri Buddhist Complex", type: "Monument", coordinates: [86.2570, 20.5900], description: "One of the oldest Buddhist settlements in Odisha.", historyText: "Welcome to Lalitgiri, part of the Diamond Triangle. It houses massive stupas and incredible Buddhist relics." },
  { id: "ratnagiri", name: "Ratnagiri Buddhist Site", type: "Monument", coordinates: [86.3350, 20.6350], description: "Ruined mahavihara, once a major Buddhist monastic complex.", historyText: "Welcome to Ratnagiri. With exquisite carved gates and numerous stupas, it was a pivotal center for Mahayana Buddhism." },
  { id: "debrigarh", name: "Debrigarh Wildlife Sanctuary", type: "Park", coordinates: [83.7000, 21.6000], description: "A dry deciduous forest on the banks of Hirakud Reservoir.", historyText: "Welcome to Debrigarh Sanctuary, a prime spot to witness majestic leopards and vibrant avian life around the Hirakud dam." },
  { id: "satkosia", name: "Satkosia Gorge", type: "Nature", coordinates: [84.8210, 20.5730], description: "A spectacular gorge where the Mahanadi River cuts the Eastern Ghats.", historyText: "Welcome to Satkosia Gorge. Famous for its rugged beauty, it is also a vital habitat for the endangered Gharial crocodiles." },
  { id: "chandrabhaga", name: "Chandrabhaga Beach", type: "Beach", coordinates: [86.1150, 19.8650], description: "Located close to the Konark Sun Temple.", historyText: "Welcome to Chandrabhaga Beach. Considered highly sacred, it is the site for the massive Magha Mela held every year." },
  { id: "harishankar", name: "Harishankar Temple", type: "Temple", coordinates: [82.8550, 20.8520], description: "A popular place of pilgrimage on the slopes of Gandhamardhan hills.", historyText: "Welcome to Harishankar, where the rare synergy of Lord Shiva and Lord Vishnu is worshipped alongside a perennial stream." },
  { id: "nrusinghanath", name: "Nrusinghanath Temple", type: "Temple", coordinates: [82.7230, 20.8710], description: "Located at the foothills of Gandhamardhan hills near Paikmal.", historyText: "Welcome to Nrusinghanath Temple, a 15th-century edifice famous for the incarnation of Lord Vishnu holding a cat's head." },
  { id: "chausathi-yogini", name: "Chausathi Yogini Temple", type: "Temple", coordinates: [85.8640, 20.2100], description: "A 9th-century hypaethral temple in Hirapur.", historyText: "Welcome to the Chausathi Yogini Temple, a unique circular, roofless shrine with 64 exquisite black chlorite statues of yoginis." },
  { id: "ananta-vasudeva", name: "Ananta Vasudeva Temple", type: "Temple", coordinates: [85.8350, 20.2400], description: "A Hindu temple dedicated to Lord Krishna in Bhubaneswar.", historyText: "Welcome to Ananta Vasudeva Temple. In a city dominated by Shiva temples, this 13th-century Vaishnavite temple stands out." },
  { id: "kedargauri", name: "Kedargauri Temple", type: "Temple", coordinates: [85.8450, 20.2450], description: "One of the oldest temple complexes in Bhubaneswar.", historyText: "Welcome to Kedargauri Temple. According to local lore, it honors the tragic ancient lovers Kedar and Gauri." },
  { id: "kapilas-elephant", name: "Kapilas Elephant Sanctuary", type: "Park", coordinates: [85.7650, 20.7000], description: "A protected area for elephants in Dhenkanal.", historyText: "Welcome to Kapilas Sanctuary. These dense ranges form an excellent corridor for the magnificent Asian Elephants." },
  { id: "khandagiri-caves", name: "Khandagiri Caves", type: "Cave", coordinates: [85.7830, 20.2570], description: "Adjacent to Udayagiri, featuring Jain ascetic dwellings.", historyText: "Welcome to Khandagiri Caves, displaying intricately rock-cut dwellings used by meditating Jain monks two millennia ago." },
  { id: "pipili", name: "Pipili Applique Village", type: "Village", coordinates: [85.8280, 20.1170], description: "A town famous for its applique handicrafts.", historyText: "Welcome to Pipili. Every street bursts with color from the world-famous Applique work, originally designed to adorn temple chariots." },
  { id: "ramchandi", name: "Ramchandi Temple & Beach", type: "Beach", coordinates: [86.0590, 19.8510], description: "Located where the Kushabhadra river meets the Bay of Bengal.", historyText: "Welcome to Ramchandi. Blessed with pristine sandy shores and the revered temple of Goddess Ramchandi under casuarina grooves." },
  { id: "beleswar", name: "Beleswar Beach", type: "Beach", coordinates: [85.9520, 19.8160], description: "A serene and secluded beach near Puri.", historyText: "Welcome to Beleswar Beach. Unlike commercial beaches, it offers tremendous tranquility next to the Shaivite Beleswar Temple." },
  { id: "paradeep", name: "Paradeep Port", type: "Monument", coordinates: [86.6730, 20.2660], description: "A major commercial port on the east coast of India.", historyText: "Welcome to Paradeep Port. More than an economic hub, the port area and the nearby marine drive offer beautiful coastal views." },
  { id: "astarange", name: "Astaranga Beach", type: "Beach", coordinates: [86.2640, 19.9750], description: "A beautiful beach whose name means 'colorful sunset'.", historyText: "Welcome to Astaranga. True to its name, this beach provides spectacular, multi-hued sunsets against the horizon." },
  { id: "khandadhar-keonjhar", name: "Khandadhar Falls, Keonjhar", type: "Park", coordinates: [85.3410, 21.6240], description: "Another beautiful waterfall bearing the same name in Keonjhar.", historyText: "Welcome to the Khandadhar of Keonjhar. A shimmering, smoky veil of water dropping amidst an expansive, dense deciduous forest." },
  { id: "bhaskareswara", name: "Bhaskareswara Temple", type: "Temple", coordinates: [85.8480, 20.2450], description: "A temple in Bhubaneswar with an unusually large Shiva Linga.", historyText: "Welcome to Bhaskareswara Temple. It stands out because of its towering 9-foot Lingam, believed by some to be the remnant of an Ashokan pillar." },
  { id: "biraja-temple", name: "Biraja Temple, Jajpur", type: "Temple", coordinates: [86.3350, 20.8520], description: "A major Shakti Peetha in Jajpur district.", historyText: "Welcome to Biraja Temple. Located in the ancient capital of Jajpur, it is highly revered as the 'Navigaya' or an essential center for offering prayers to ancestors." }
];
