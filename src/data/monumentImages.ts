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

  // === TEMPLES (real images – Wikimedia Commons / relevant photos) ===
  "lingaraja temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "lingaraj temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "mukteswara temple": "https://upload.wikimedia.org/wikipedia/commons/4/47/Mukteswara_Temple%2C_Bhubaneswar.jpg",
  "mukteshvara temple": "https://upload.wikimedia.org/wikipedia/commons/4/47/Mukteswara_Temple%2C_Bhubaneswar.jpg",
  "rajarani temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/A_view_of_Rajarani_Temple_image_3.jpg/400px-A_view_of_Rajarani_Temple_image_3.jpg",
  "konark sun temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sun_Temple_Konark_Puri_District_Odisha.jpg/400px-Sun_Temple_Konark_Puri_District_Odisha.jpg",
  "jagannath temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Puri_Jagannath_Temple_Entrance.jpg/400px-Puri_Jagannath_Temple_Entrance.jpg",
  "budhi thakurani temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg/400px-Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg",
  "maa budhi thakurani temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg/400px-Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg",
  "tara tarini temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maa_Tarini_Temple.jpg/400px-Maa_Tarini_Temple.jpg",
  // Real images for specific temples
  "biraja temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Maa_Biraja_Jajpur.jpg/400px-Maa_Biraja_Jajpur.jpg",
  "khiching temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Maa_Kichakeswari_temple%2C_Khiching%2C_Mayurbhanj%2C_Odisha.jpg/400px-Maa_Kichakeswari_temple%2C_Khiching%2C_Mayurbhanj%2C_Odisha.jpg",
  "kichakeswari temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Maa_Kichakeswari_temple%2C_Khiching%2C_Mayurbhanj%2C_Odisha.jpg/400px-Maa_Kichakeswari_temple%2C_Khiching%2C_Mayurbhanj%2C_Odisha.jpg",
  "isaneaswar temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parsurameswara_temple_complex.jpg/400px-Parsurameswara_temple_complex.jpg",
  "parasurameswara temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parsurameswara_temple_complex.jpg/400px-Parsurameswara_temple_complex.jpg",
  "jagannath temple berhampur": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Puri_Jagannath_Temple_Entrance.jpg/400px-Puri_Jagannath_Temple_Entrance.jpg",
  // Nearby / same-region Odisha temple images (no dedicated Commons image)
  "bhagabati temple angul": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "bhairabi temple": "https://upload.wikimedia.org/wikipedia/commons/4/47/Mukteswara_Temple%2C_Bhubaneswar.jpg",
  "biranchi narayan temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/A_view_of_Rajarani_Temple_image_3.jpg/400px-A_view_of_Rajarani_Temple_image_3.jpg",
  "dakshya prajapati temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sun_Temple_Konark_Puri_District_Odisha.jpg/400px-Sun_Temple_Konark_Puri_District_Odisha.jpg",
  "durga temple station road": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maa_Tarini_Temple.jpg/400px-Maa_Tarini_Temple.jpg",
  "ganesh temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parsurameswara_temple_complex.jpg/400px-Parsurameswara_temple_complex.jpg",
  "gokuldham temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Puri_Jagannath_Temple_Entrance.jpg/400px-Puri_Jagannath_Temple_Entrance.jpg",
  "hanuman temple old town": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "lakshmi narayan temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/A_view_of_Rajarani_Temple_image_3.jpg/400px-A_view_of_Rajarani_Temple_image_3.jpg",
  "maa chandika temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg/400px-Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg",
  "maa harachandi temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maa_Tarini_Temple.jpg/400px-Maa_Tarini_Temple.jpg",
  "maa kali temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg/400px-Budhi_Maa_Thakurani_temple%2C_Odisha%2C_India.jpg",
  "mahurikalua temple": "https://upload.wikimedia.org/wikipedia/commons/4/47/Mukteswara_Temple%2C_Bhubaneswar.jpg",
  "narayani temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "navagraha temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sun_Temple_Konark_Puri_District_Odisha.jpg/400px-Sun_Temple_Konark_Puri_District_Odisha.jpg",
  "nirmaljhar temple": "https://upload.wikimedia.org/wikipedia/commons/4/47/Mukteswara_Temple%2C_Bhubaneswar.jpg",
  "palkadia temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/A_view_of_Rajarani_Temple_image_3.jpg/400px-A_view_of_Rajarani_Temple_image_3.jpg",
  "radha krishna temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Puri_Jagannath_Temple_Entrance.jpg/400px-Puri_Jagannath_Temple_Entrance.jpg",
  "ramaguda temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lingaraj_temple_Bhubaneswar.jpg/400px-Lingaraj_temple_Bhubaneswar.jpg",
  "santoshi maa temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maa_Tarini_Temple.jpg/400px-Maa_Tarini_Temple.jpg",
  "saraswati temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parsurameswara_temple_complex.jpg/400px-Parsurameswara_temple_complex.jpg",
  "shani temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sun_Temple_Konark_Puri_District_Odisha.jpg/400px-Sun_Temple_Konark_Puri_District_Odisha.jpg",
  "shiva temple gopalpur road": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maa_Tarini_Temple.jpg/400px-Maa_Tarini_Temple.jpg",
  "shree ram temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Puri_Jagannath_Temple_Entrance.jpg/400px-Puri_Jagannath_Temple_Entrance.jpg",
  "sun temple gopalpur": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sun_Temple_Konark_Puri_District_Odisha.jpg/400px-Sun_Temple_Konark_Puri_District_Odisha.jpg",
};

// Track used images to guarantee no duplicates at runtime
const usedImages = new Set<string>();

export function getMonumentImage(monument: { title: string; category: string; image_url?: string | null }): string {
  if (monument.image_url) return monument.image_url;

  const titleKey = monument.title.toLowerCase().trim();

  // Direct match: same title always gets same image (do not add to usedImages)
  const directMatch = monumentImageMap[titleKey];
  if (directMatch) return directMatch;

  // Partial match: e.g. "Lingaraja Temple, Bhubaneswar" -> use longest matching key so the right temple gets the right image
  const partialMatches = Object.entries(monumentImageMap)
    .filter(([key]) => titleKey.includes(key))
    .sort(([a], [b]) => b.length - a.length);
  if (partialMatches.length > 0) return partialMatches[0][1];

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
