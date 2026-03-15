/**
 * 50-Node Bhubaneswar City Road Network Topology
 * Each node = intersection, each edge = road segment
 * All congestion/queue values start at 0 — populated by live camera feeds
 */

export type IntersectionNode = {
  id: string;
  name: string;
  position: [number, number]; // [lat, lng]
  type: "major" | "minor" | "signal" | "roundabout";
  hasCCTV: boolean;
  signalPhase?: number;
  queueLength: number;
  congestion: number;
};

export type RoadEdge = {
  from: string;
  to: string;
  name: string;
  distance: number;
  lanes: number;
  speedLimit: number;
  currentSpeed: number;
  pcu: number;
  capacity: number;
  weather: "clear" | "rain" | "fog" | "heavy_rain";
  incidents: Incident[];
};

export type Incident = {
  id: string;
  type: "accident" | "construction" | "breakdown" | "flooding" | "protest";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
  description: string;
};

export type EmergencyVehicle = {
  id: string;
  type: "ambulance" | "fire" | "police";
  currentNode: string;
  targetNode: string;
  corridor: string[];
  eta: number;
  active: boolean;
};

// 50 intersections across Bhubaneswar (real locations, real coordinates)
export const intersections: IntersectionNode[] = [
  { id: "N01", name: "Master Canteen Square", position: [20.2724, 85.8390], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N02", name: "Vani Vihar Square", position: [20.2961, 85.8245], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N03", name: "Jaydev Vihar Square", position: [20.2990, 85.8177], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N04", name: "Acharya Vihar Square", position: [20.2944, 85.8322], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N05", name: "Rasulgarh Square", position: [20.2880, 85.8560], type: "major", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N06", name: "Kalpana Square", position: [20.2666, 85.8432], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N07", name: "Sishu Bhawan Square", position: [20.2710, 85.8340], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N08", name: "AG Square", position: [20.2650, 85.8400], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N09", name: "Ram Mandir Square", position: [20.2580, 85.8370], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N10", name: "Raj Mahal Square", position: [20.2620, 85.8310], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N11", name: "Rupali Square", position: [20.2680, 85.8280], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N12", name: "Saheed Nagar Square", position: [20.2850, 85.8430], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N13", name: "Bomikhal Junction", position: [20.2810, 85.8500], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N14", name: "Nayapalli Square", position: [20.2960, 85.8100], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N15", name: "Patia Square", position: [20.3100, 85.8190], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N16", name: "Chandrasekharpur Square", position: [20.3180, 85.8150], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N17", name: "Khandagiri Square", position: [20.2560, 85.7870], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N18", name: "Baramunda Bus Stand", position: [20.2700, 85.8080], type: "major", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N19", name: "Palasuni Junction", position: [20.2900, 85.8680], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N20", name: "AIIMS Square", position: [20.2370, 85.7930], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N21", name: "Kalinga Hospital Square", position: [20.3020, 85.8230], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N22", name: "Fortune Towers Junction", position: [20.2830, 85.8360], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N23", name: "Damana Square", position: [20.3060, 85.8320], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N24", name: "Bhubaneswar Railway Station", position: [20.2710, 85.8420], type: "major", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N25", name: "Lingaraj Temple Road", position: [20.2380, 85.8340], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N26", name: "Lewis Road Junction", position: [20.2550, 85.8250], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N27", name: "Cuttack-Puri Road Junction", position: [20.2760, 85.8450], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N28", name: "Janpath-Sachivalaya Marg", position: [20.2760, 85.8270], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N29", name: "Unit-1 Market Square", position: [20.2640, 85.8350], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N30", name: "Bapuji Nagar Junction", position: [20.2590, 85.8180], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N31", name: "IRC Village Junction", position: [20.3000, 85.8080], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N32", name: "Mancheswar Junction", position: [20.2970, 85.8550], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N33", name: "Jharpada Square", position: [20.2680, 85.8150], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N34", name: "Satya Nagar Square", position: [20.2790, 85.8300], type: "roundabout", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N35", name: "KIIT Square", position: [20.3540, 85.8190], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N36", name: "Capital Hospital Gate", position: [20.2680, 85.8380], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N37", name: "Nandankanan Road Junction", position: [20.3350, 85.8230], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N38", name: "Aiginia Square", position: [20.2480, 85.8200], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N39", name: "Pokhariput Junction", position: [20.2420, 85.8070], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N40", name: "Tamando Junction", position: [20.2340, 85.7810], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N41", name: "Infocity Square", position: [20.3310, 85.8090], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N42", name: "Nalco Square", position: [20.2900, 85.8350], type: "roundabout", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N43", name: "Ekamra Haat Junction", position: [20.2850, 85.8200], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N44", name: "BMC Bhawani Mall Junction", position: [20.2870, 85.8430], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N45", name: "CRP Square", position: [20.2560, 85.8310], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N46", name: "Dumduma Junction", position: [20.2500, 85.7990], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
  { id: "N47", name: "Sundarpada Junction", position: [20.2650, 85.7910], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N48", name: "Gadkan Junction", position: [20.2770, 85.8530], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N49", name: "Phulnakhara Junction", position: [20.3400, 85.8350], type: "minor", hasCCTV: false, queueLength: 0, congestion: 0 },
  { id: "N50", name: "Old Town Square", position: [20.2430, 85.8350], type: "signal", hasCCTV: true, queueLength: 0, congestion: 0 },
];

// Road connections between intersections
export const roads: RoadEdge[] = [
  { from: "N01", to: "N06", name: "Janpath South", distance: 700, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N01", to: "N07", name: "Sachivalaya Marg", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N01", to: "N24", name: "Station Road", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N02", to: "N04", name: "NH-16 Segment", distance: 600, lanes: 4, speedLimit: 60, currentSpeed: 60, pcu: 0, capacity: 100, weather: "clear", incidents: [] },
  { from: "N02", to: "N03", name: "Vani Vihar-Jaydev Rd", distance: 500, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N03", to: "N14", name: "Jaydev Vihar-Nayapalli", distance: 600, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N03", to: "N21", name: "Kalinga Nagar Rd", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N04", to: "N42", name: "Acharya Vihar-Nalco", distance: 450, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N04", to: "N12", name: "Saheed Nagar Link", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N05", to: "N13", name: "NH-16 East", distance: 600, lanes: 4, speedLimit: 60, currentSpeed: 60, pcu: 0, capacity: 100, weather: "clear", incidents: [] },
  { from: "N05", to: "N19", name: "Rasulgarh-Palasuni", distance: 700, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N05", to: "N32", name: "Mancheswar Industrial", distance: 550, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N06", to: "N08", name: "Kalpana-AG Link", distance: 300, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N07", to: "N11", name: "Rupali Connector", distance: 350, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N07", to: "N28", name: "Janpath Central", distance: 400, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N08", to: "N29", name: "AG-Unit 1 Rd", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N09", to: "N10", name: "Ram Mandir-Raj Mahal", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N09", to: "N45", name: "CRP Link", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N10", to: "N11", name: "Raj Mahal-Rupali Rd", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N11", to: "N28", name: "Rupali-Janpath", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N12", to: "N13", name: "Saheed Nagar-Bomikhal", distance: 450, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N12", to: "N44", name: "BMC Mall Road", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N13", to: "N48", name: "Bomikhal-Gadkan", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N14", to: "N31", name: "Nayapalli-IRC", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N15", to: "N16", name: "Patia-CSpur Rd", distance: 600, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N15", to: "N21", name: "Patia-Kalinga Hosp", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N16", to: "N37", name: "CSpur-Nandankanan", distance: 800, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N17", to: "N47", name: "Khandagiri-Sundarpada", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N17", to: "N46", name: "Khandagiri-Dumduma", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N18", to: "N33", name: "Baramunda-Jharpada", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N18", to: "N14", name: "Baramunda-Nayapalli", distance: 600, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N20", to: "N40", name: "AIIMS-Tamando", distance: 700, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N20", to: "N39", name: "AIIMS-Pokhariput", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N21", to: "N23", name: "Kalinga-Damana", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N22", to: "N34", name: "Fortune-Satya Nagar", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N22", to: "N42", name: "Fortune-Nalco", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N24", to: "N27", name: "Station-Cuttack Rd", distance: 500, lanes: 3, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 70, weather: "clear", incidents: [] },
  { from: "N24", to: "N36", name: "Capital Hosp Road", distance: 350, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N25", to: "N50", name: "Lingaraj-Old Town", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N25", to: "N38", name: "Lingaraj-Aiginia", distance: 500, lanes: 1, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 35, weather: "clear", incidents: [] },
  { from: "N26", to: "N30", name: "Lewis-Bapuji Nagar", distance: 400, lanes: 1, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 35, weather: "clear", incidents: [] },
  { from: "N26", to: "N45", name: "Lewis-CRP Rd", distance: 300, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N27", to: "N44", name: "Cuttack Rd North", distance: 500, lanes: 3, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 70, weather: "clear", incidents: [] },
  { from: "N28", to: "N34", name: "Janpath-Satya Nagar", distance: 350, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N29", to: "N36", name: "Unit 1-Capital Hosp", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N30", to: "N33", name: "Bapuji-Jharpada", distance: 450, lanes: 1, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 35, weather: "clear", incidents: [] },
  { from: "N31", to: "N43", name: "IRC-Ekamra Haat", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N32", to: "N23", name: "Mancheswar-Damana", distance: 600, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N33", to: "N47", name: "Jharpada-Sundarpada", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N34", to: "N42", name: "Satya Nagar Ring Rd", distance: 500, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N35", to: "N37", name: "KIIT-Nandankanan", distance: 700, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N35", to: "N41", name: "KIIT-Infocity", distance: 600, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N36", to: "N06", name: "Capital Hosp-Kalpana", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N37", to: "N49", name: "Nandankanan-Phulnakhara", distance: 600, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N38", to: "N46", name: "Aiginia-Dumduma", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N39", to: "N46", name: "Pokhariput-Dumduma", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N40", to: "N17", name: "Tamando-Khandagiri", distance: 600, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N41", to: "N15", name: "Infocity-Patia", distance: 600, lanes: 3, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 80, weather: "clear", incidents: [] },
  { from: "N42", to: "N43", name: "Nalco-Ekamra Haat", distance: 350, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N43", to: "N03", name: "Ekamra Haat-Jaydev", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N44", to: "N05", name: "BMC-Rasulgarh", distance: 500, lanes: 3, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 70, weather: "clear", incidents: [] },
  { from: "N45", to: "N50", name: "CRP-Old Town", distance: 500, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N47", to: "N18", name: "Sundarpada-Baramunda", distance: 500, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N48", to: "N05", name: "Gadkan-Rasulgarh", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
  { from: "N49", to: "N35", name: "Phulnakhara-KIIT", distance: 700, lanes: 2, speedLimit: 50, currentSpeed: 50, pcu: 0, capacity: 60, weather: "clear", incidents: [] },
  { from: "N50", to: "N09", name: "Old Town-Ram Mandir", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N10", to: "N26", name: "Raj Mahal-Lewis Rd", distance: 400, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 45, weather: "clear", incidents: [] },
  { from: "N08", to: "N09", name: "AG-Ram Mandir Rd", distance: 450, lanes: 2, speedLimit: 30, currentSpeed: 30, pcu: 0, capacity: 50, weather: "clear", incidents: [] },
  { from: "N27", to: "N12", name: "Cuttack Rd-Saheed Nagar", distance: 400, lanes: 2, speedLimit: 40, currentSpeed: 40, pcu: 0, capacity: 55, weather: "clear", incidents: [] },
];
