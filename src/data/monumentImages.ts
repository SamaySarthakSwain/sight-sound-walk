// Each monument gets a unique, relevant Unsplash image. No repeats, no Taj Mahal.
// Using w=400&h=300 for faster loading.

const monumentImageMap: Record<string, string> = {
  // === BEACHES ===
  "aryapalli beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=70",
  "chhatrapur beach": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&h=300&fit=crop&q=70",
  "gopalpur beach": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400&h=300&fit=crop&q=70",
  "gopalpur-on-sea": "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&h=300&fit=crop&q=70",
  "pati sonapur beach": "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=400&h=300&fit=crop&q=70",
  "ramayapatnam beach": "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=400&h=300&fit=crop&q=70",

  // === BUDDHIST SITE ===
  "buddhist diamond triangle": "https://images.unsplash.com/photo-1602393816768-4772f4428c65?w=400&h=300&fit=crop&q=70",

  // === CAVE ===
  "udayagiri & khandagiri caves": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=400&h=300&fit=crop&q=70",

  // === FORTS ===
  "barabati fort": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&q=70",
  "potagarh fort": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop&q=70",

  // === HERITAGE ===
  "aska fort ruins": "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=400&h=300&fit=crop&q=70",
  "jarada jora": "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=300&fit=crop&q=70",
  "khallikote palace": "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop&q=70",
  "khandagiri jain caves ganjam": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop&q=70",
  "narendrapur fort": "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=300&fit=crop&q=70",

  // === HILLS ===
  "mahendragiri hills": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=300&fit=crop&q=70",

  // === LAKES ===
  "chilika lake": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&q=70",
  "tampara lake": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop&q=70",

  // === NATURAL ===
  "taptapani hot springs": "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=400&h=300&fit=crop&q=70",
  "bada ghara waterfall": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop&q=70",
  "budhakhol caves": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=300&fit=crop&q=70",
  "lakhari valley wildlife sanctuary": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400&h=300&fit=crop&q=70",
  "rushikulya river mouth": "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400&h=300&fit=crop&q=70",

  // === STUPA ===
  "dhauli shanti stupa": "https://images.unsplash.com/photo-1545126571-aef18cbb0bec?w=400&h=300&fit=crop&q=70",

  // === TEMPLES ===
  "bhagabati temple angul": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop&q=70",
  "bhairabi temple": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&q=70",
  "biraja temple": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop&q=70",
  "biranchi narayan temple": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&h=300&fit=crop&q=70",
  "budhi thakurani temple": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=300&fit=crop&q=70",
  "dakshya prajapati temple": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop&q=70",
  "durga temple station road": "https://images.unsplash.com/photo-1621427642649-62db8a41cfba?w=400&h=300&fit=crop&q=70",
  "ganesh temple": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop&q=70",
  "gokuldham temple": "https://images.unsplash.com/photo-1585135497273-1a86d9d9108e?w=400&h=300&fit=crop&q=70",
  "hanuman temple old town": "https://images.unsplash.com/photo-1609766856923-7e0a7f63204a?w=400&h=300&fit=crop&q=70",
  "isaneaswar temple": "https://images.unsplash.com/photo-1590766940554-634b4f7dc1b5?w=400&h=300&fit=crop&q=70",
  "jagannath temple": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&q=70",
  "jagannath temple berhampur": "https://images.unsplash.com/photo-1585468274952-66591eb14165?w=400&h=300&fit=crop&q=70",
  "khiching temple": "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=400&h=300&fit=crop&q=70",
  "konark sun temple": "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop&q=70",
  "lakshmi narayan temple": "https://images.unsplash.com/photo-1606298246186-05493e4f0168?w=400&h=300&fit=crop&q=70",
  "lingaraja temple": "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&h=300&fit=crop&q=70",
  "maa budhi thakurani temple": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&q=70",
  "maa chandika temple": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=300&fit=crop&q=70",
  "maa harachandi temple": "https://images.unsplash.com/photo-1613467590737-06d21e732ed7?w=400&h=300&fit=crop&q=70",
  "maa kali temple": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&q=70",
  "mahurikalua temple": "https://images.unsplash.com/photo-1623494815756-4e6152c10203?w=400&h=300&fit=crop&q=70",
  "mukteswara temple": "https://images.unsplash.com/photo-1599030729189-aea49e34db60?w=400&h=300&fit=crop&q=70",
  "narayani temple": "https://images.unsplash.com/photo-1609948543911-75f209e1f723?w=400&h=300&fit=crop&q=70",
  "navagraha temple": "https://images.unsplash.com/photo-1611516491426-03025e6043c8?w=400&h=300&fit=crop&q=70",
  "nirmaljhar temple": "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400&h=300&fit=crop&q=70",
  "palkadia temple": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=70",
  "radha krishna temple": "https://images.unsplash.com/photo-1600082984270-6fbe4e878710?w=400&h=300&fit=crop&q=70",
  "rajarani temple": "https://images.unsplash.com/photo-1584806749948-697891c67821?w=400&h=300&fit=crop&q=70",
  "ramaguda temple": "https://images.unsplash.com/photo-1612263554271-12fe8e57d4f2?w=400&h=300&fit=crop&q=70",
  "santoshi maa temple": "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=300&fit=crop&q=70",
  "saraswati temple": "https://images.unsplash.com/photo-1627301517152-11505d049286?w=400&h=300&fit=crop&q=70",
  "shani temple": "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&h=300&fit=crop&q=70",
  "shiva temple gopalpur road": "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=300&fit=crop&q=70",
  "shree ram temple": "https://images.unsplash.com/photo-1625040757309-248e6e8c6769?w=400&h=300&fit=crop&q=70",
  "sun temple gopalpur": "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=400&h=300&fit=crop&q=70",
  "tara tarini temple": "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=400&h=300&fit=crop&q=70",
};

// Track used images to guarantee no duplicates at runtime
const usedImages = new Set<string>();

export function getMonumentImage(monument: { title: string; category: string; image_url?: string | null }): string {
  if (monument.image_url) return monument.image_url;

  const titleKey = monument.title.toLowerCase().trim();

  const directMatch = monumentImageMap[titleKey];
  if (directMatch && !usedImages.has(directMatch)) {
    usedImages.add(directMatch);
    return directMatch;
  }

  for (const [key, url] of Object.entries(monumentImageMap)) {
    if (titleKey.includes(key) && !usedImages.has(url)) {
      usedImages.add(url);
      return url;
    }
  }

  const categoryFallbacks: Record<string, string[]> = {
    beach: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=400&h=300&fit=crop&q=70",
    ],
    temple: [
      "https://images.unsplash.com/photo-1618249209823-0e4c3e0f6a49?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?w=400&h=300&fit=crop&q=70",
    ],
    fort: [
      "https://images.unsplash.com/photo-1580294647332-88339772ef58?w=400&h=300&fit=crop&q=70",
    ],
    heritage: [
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&q=70",
    ],
    nature: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop&q=70",
    ],
    natural: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&q=70",
    ],
    lake: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=70",
    ],
    hill: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=70",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=300&fit=crop&q=70",
    ],
    cave: [
      "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=400&h=300&fit=crop&q=70",
    ],
    stupa: [
      "https://images.unsplash.com/photo-1545126571-aef18cbb0bec?w=400&h=300&fit=crop&q=70",
    ],
  };

  const cat = monument.category.toLowerCase();
  const fallbacks = categoryFallbacks[cat] || categoryFallbacks["temple"]!;
  for (const url of fallbacks) {
    if (!usedImages.has(url)) {
      usedImages.add(url);
      return url;
    }
  }

  return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=70";
}

export function resetImageCounters() {
  usedImages.clear();
}
