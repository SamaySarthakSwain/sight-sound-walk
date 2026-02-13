// Diverse high-quality Unsplash images mapped to monuments by title keyword
// Each category has multiple unique images to avoid repetition

const beachImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80", // tropical sunset
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop&q=80", // rocky coastline
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=400&fit=crop&q=80", // sandy waves
  "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=600&h=400&fit=crop&q=80", // palm trees beach
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop&q=80", // ocean waves
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&h=400&fit=crop&q=80", // sunrise beach
  "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=600&h=400&fit=crop&q=80", // rocks and waves
];

const templeImages = [
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop&q=80", // Indian monument
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop&q=80", // ancient temple
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=80", // South Indian temple
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=80", // temple columns
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop&q=80", // white temple
  "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600&h=400&fit=crop&q=80", // golden temple
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&h=400&fit=crop&q=80", // temple corridor
  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop&q=80", // carved sculpture
  "https://images.unsplash.com/photo-1621427642649-62db8a41cfba?w=600&h=400&fit=crop&q=80", // temple tower
  "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&h=400&fit=crop&q=80", // temple at dusk
  "https://images.unsplash.com/photo-1585135497273-1a86d9d9108e?w=600&h=400&fit=crop&q=80", // ornate entrance
  "https://images.unsplash.com/photo-1609766856923-7e0a7f63204a?w=600&h=400&fit=crop&q=80", // mountain temple
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop&q=80", // India monument
  "https://images.unsplash.com/photo-1590766940554-634b4f7dc1b5?w=600&h=400&fit=crop&q=80", // stone carved
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80", // ancient ruins
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop&q=80", // ornate Hindu temple
  "https://images.unsplash.com/photo-1585468274952-66591eb14165?w=600&h=400&fit=crop&q=80", // carved pillar
  "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&h=400&fit=crop&q=80", // temple steps
  "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&h=400&fit=crop&q=80", // temple dome
  "https://images.unsplash.com/photo-1606298246186-05493e4f0168?w=600&h=400&fit=crop&q=80", // stone temple
];

const fortImages = [
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=80", // fort walls
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop&q=80", // ancient fort
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop&q=80", // fortress
  "https://images.unsplash.com/photo-1580294647332-88339772ef58?w=600&h=400&fit=crop&q=80", // castle ruins
  "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&h=400&fit=crop&q=80", // palace architecture
  "https://images.unsplash.com/photo-1608037521244-f1c6c7635194?w=600&h=400&fit=crop&q=80", // fort gate
];

const lakeImages = [
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop&q=80", // serene lake
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop&q=80", // lake mountains
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop&q=80", // misty lake
];

const hillImages = [
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop&q=80", // mountain peak
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&q=80", // dramatic hills
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop&q=80", // green hills
];

const caveImages = [
  "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=600&h=400&fit=crop&q=80", // cave entrance
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=400&fit=crop&q=80", // cave interior
];

const stupaImages = [
  "https://images.unsplash.com/photo-1545126571-aef18cbb0bec?w=600&h=400&fit=crop&q=80", // Buddhist stupa
  "https://images.unsplash.com/photo-1602393816768-4772f4428c65?w=600&h=400&fit=crop&q=80", // peace pagoda
];

const natureImages = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&q=80", // forest
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&q=80", // valley sunrise
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop&q=80", // waterfall
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop&q=80", // sunlight trees
  "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=600&h=400&fit=crop&q=80", // river valley
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&q=80", // golden field
  "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=600&h=400&fit=crop&q=80", // hot springs
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=600&h=400&fit=crop&q=80", // wildlife sanctuary
];

const heritageImages = [
  "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=600&h=400&fit=crop&q=80", // heritage building
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80", // palace
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop&q=80", // ancient architecture
  "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=600&h=400&fit=crop&q=80", // ruins
  "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&h=400&fit=crop&q=80", // Jain cave
  "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&h=400&fit=crop&q=80", // heritage site
];

const buddhistImages = [
  "https://images.unsplash.com/photo-1545126571-aef18cbb0bec?w=600&h=400&fit=crop&q=80", // Buddhist monument
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop&q=80", // Buddhist temple
];

const springsImages = [
  "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=600&h=400&fit=crop&q=80", // hot spring
];

// Counters to cycle through images per category without repeating
const counters: Record<string, number> = {};

function getNextFromArray(arr: string[], category: string): string {
  if (!counters[category]) counters[category] = 0;
  const index = counters[category] % arr.length;
  counters[category]++;
  return arr[index];
}

export function getMonumentImage(monument: { title: string; category: string; image_url?: string | null }): string {
  // If monument has its own image, use it
  if (monument.image_url) return monument.image_url;

  const category = monument.category.toLowerCase();
  const title = monument.title.toLowerCase();

  // Use title-specific matching first for more accuracy
  if (title.includes("beach") || title.includes("sea") || title.includes("gopalpur") || title.includes("sonapur") || title.includes("aryapalli")) {
    return getNextFromArray(beachImages, `beach-${title}`);
  }
  if (title.includes("waterfall")) {
    return getNextFromArray(natureImages, `waterfall-${title}`);
  }
  if (title.includes("hot spring") || title.includes("taptapani")) {
    return getNextFromArray(springsImages, `springs-${title}`);
  }

  // Category-based matching
  switch (category) {
    case "beach": return getNextFromArray(beachImages, `beach-${title}`);
    case "temple": return getNextFromArray(templeImages, `temple-${title}`);
    case "fort": return getNextFromArray(fortImages, `fort-${title}`);
    case "lake": return getNextFromArray(lakeImages, `lake-${title}`);
    case "hill":
    case "hills": return getNextFromArray(hillImages, `hill-${title}`);
    case "cave": return getNextFromArray(caveImages, `cave-${title}`);
    case "stupa": return getNextFromArray(stupaImages, `stupa-${title}`);
    case "nature":
    case "natural": return getNextFromArray(natureImages, `nature-${title}`);
    case "heritage": return getNextFromArray(heritageImages, `heritage-${title}`);
    case "buddhist site":
    case "buddhist": return getNextFromArray(buddhistImages, `buddhist-${title}`);
    default: return getNextFromArray(templeImages, `default-${title}`);
  }
}

// Reset counters (call on re-render to ensure consistent assignment)
export function resetImageCounters() {
  Object.keys(counters).forEach(k => delete counters[k]);
}
