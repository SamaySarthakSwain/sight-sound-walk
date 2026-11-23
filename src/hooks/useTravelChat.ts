import { useState, useCallback, useRef } from "react";
import { getApiUrl } from "@/lib/apiConfig";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type SupportedLanguage = "en" | "hi" | "or" | "te" | "bn";

export const languageLabels: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिंदी (Hindi)",
  or: "ଓଡ଼ିଆ (Odia)",
  te: "తెలుగు (Telugu)",
  bn: "বাংলা (Bengali)",
};

const getChatUrl = () => getApiUrl("/api/ai/travel-assistant");

// High-quality multilingual fallback dictionary
const MULTILINGUAL_DATA: Record<string, Record<SupportedLanguage, string>> = {
  quotes: {
    en: "Famous Inspirational Quotes & Sayings of Odisha:\n\n• \"Misu mora deha e desha matire, deshabasi chalijantu pithire...\" (\"Let my body mingle with the soil of this motherland, and let my countrymen walk forward over my back into freedom...\") — Utkalmani Gopabandhu Das.\n• \"Bhasha hi jatira prana\" (\"Language is the soul of a nation\") — Vyasakabi Fakir Mohan Senapati.\n• \"Jai Jagannath!\" — The timeless heartbeat and spiritual essence of Odisha, symbolizing universal brotherhood and compassion.",
    or: "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଓ ପ୍ରେରଣାଦାୟୀ ଉକ୍ତି / ପଦ୍ୟାଂଶ:\n\n• \"ମିଶୁ ମୋର ଦେହ ଏ ଦେଶ ମାଟିରେ, ଦେଶବାସୀ ଚାଲିଯାଆନ୍ତୁ ପିଠିରେ। ଦେଶର ସ୍ୱରାଜ୍ୟ ପଥେ ଯେତେ ଗାଡ଼, ପୂରୁ ତହିଁ ମୋର ମାଂସ ରକ୍ତ ହାଡ଼।\" — ଉତ୍କଳମଣି ଗୋପବନ୍ଧୁ ଦାସ (ଦେଶପ୍ରେମ ଓ ଆତ୍ମବଳିଦାନର ଅମର ପ୍ରତୀକ)।\n• \"ଭାଷା ହିଁ ଜାତିର ପ୍ରାଣ\" — ବ୍ୟାସକବି ଫକୀର ମୋହନ ସେନାପତି।\n• \"ଜୟ ଜଗନ୍ନାଥ!\" — ସମଗ୍ର ଓଡ଼ିଆ ଜାତିର ପ୍ରାଣସ୍ପନ୍ଦନ ଓ ବିଶ୍ୱ ଭ୍ରାତୃତ୍ୱର ପବିତ୍ର ଉଦ୍ଘୋଷ।",
    hi: "ओडिशा के प्रसिद्ध और प्रेरणादायक सुविचार / पंक्तियाँ:\n\n• \"मिशु मोर देह ए देश माटिर...\" (\"मेरा शरीर इस देश की पावन मिट्टी में मिल जाए और देशवासी मेरी पीठ पर चलकर आगे बढ़ें...\") — उत्कलमणि गोपबंधु दास (सर्वोच्च देशभक्ति का संदेश)।\n• \"भाषा ही जातिरा प्राण\" (\"मातृभाषा ही राष्ट्र की वास्तविक आत्मा है\") — व्यासकवि फकीर मोहन सेनापति।\n• \"जय जगन्नाथ!\" — ओडिशा की आध्यात्मिक पहचान और विश्व बंधुत्व का अमर उद्घोष।",
    bn: "ওড়িশার বিখ্যাত ও ঐতিহাসিক বাণী:\n\n• \"মিশু মোর দেহ এ দেশ মাটিতে...\" (\"আমার দেহ এই দেশের মাটিতে মিশে যাক, আর দেশবাসী আমার পিঠের ওপর দিয়ে এগিয়ে যাক...\") — উৎকলমণি গোপবন্ধু দাস।\n• \"ভাষা হি জাতির প্রাণ\" (\"ভাষাই হলো জাতির প্রকৃত প্রাণ\") — ব্যাসকবি ফকির মোহন সেনাপতি।\n• \"জয় জগন্নাথ!\" — ওড়িশার সংস্কৃতির হৃদয় ও আধ্যাত্মিক ধ্বনি।",
    te: "ఒడిశా ప్రసిద్ధ మరియు స్ఫూర్తిదాయక సూక్తులు:\n\n• \"మిశు మోర దేహ ఎ దేశ మాటిరె...\" (\"నా దేహం ఈ దేశ మట్టిలో కలిసిపోనివ్వండి, నా దేశవాసులు నా వీపుపై నడిచి ముందుకు సాగనివ్వండి...\") — ఉత్కళమణి గోపబంధు దాస్.\n• \"భాష హి జాతిర ప్రాణ\" (\"మాతృభాషే జాతి యొక్క ప్రాణం\") — వ్యాసకవి ఫకీర్ మోహన్ సేనాపతి.\n• \"జై జగన్నాథ్!\" — ఒడిశా ఆధ్యాత్మిక సంస్కృతికి మూలస్తంభం.",
  },
  food: {
    en: "Authentic World-Famous Cuisine & Delicacies of Odisha:\n\n• Chhena Poda: World-famous baked cottage cheese dessert with caramelized crust from Nayagarh.\n• Pahala Rasagola: Soft, warm, melt-in-mouth brown rasagolas famous along the Cuttack-Bhubaneswar highway.\n• Dalma: Wholesome lentil stew slow-cooked with vegetables and roasted cumin.\n• Pakhala Bhata: Refreshing fermented rice steeped in curd and water, served with fried greens and badi chura.\n• Cuttack Dahi Bara Aloodum: Iconic street food featuring savory lentil vadas in tangy yogurt broth with spicy aloo dum.",
    or: "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ପାରମ୍ପରିକ ଖାଦ୍ୟ ଓ ମିଠା:\n\n• ଛେନାପୋଡ଼: ନୟାଗଡ଼ର ପ୍ରସିଦ୍ଧ ପୋଡ଼ା ପନୀର ମିଠା, ଯାହା ସାରା ବିଶ୍ୱରେ ଲୋକପ୍ରିୟ।\n• ପାହାଳ ରସଗୋଲା: ନରମ, ରସାଳ ଓ ଅତ୍ୟନ୍ତ ସ୍ୱାଦିଷ୍ଟ ପାରମ୍ପରିକ ରସଗୋଲା।\n• ଡାଲମା: ବିଭିନ୍ନ ଦେଶୀ ପନିପରିବା ଓ ଡାଲିରେ ପ୍ରସ୍ତୁତ ପୌଷ୍ଟିକ ବ୍ୟଞ୍ଜନ।\n• ପଖାଳ ଭାତ: ଖରାଦିନେ ଦହି, ଶାଗ, ବଡ଼ି ଚୂରା ଓ ଆଳୁ ଭଜା ସହ ଓଡ଼ିଆଙ୍କ ପ୍ରିୟ ଭୋଜନ।\n• କଟକ ଦହିବରା ଆଳୁଦମ୍: ଓଡ଼ିଶାର ଏକ ନମ୍ବର ଷ୍ଟ୍ରିଟ୍ ଫୁଡ୍, ଯାହାର ସ୍ୱାଦ ଅତୁଳନୀୟ।",
    hi: "ओडिशा के विश्व प्रसिद्ध पारंपरिक व्यंजन और मिठाइयाँ:\n\n• छेना पोड़ा: नयागढ़ की प्रसिद्ध भुनी हुई पनीर की बेक्ड मिठाई।\n• पहाला रसगुल्ला: नर्म और मुंह में घुल जाने वाला पारंपरिक भूरा रसगुल्ला।\n• दालमा: ताज़ी सब्जियों और दाल से बना स्वास्थ्यवर्धक पारंपरिक व्यंजन।\n• पखाला भात: दही, तड़का और भुनी सब्जियों के साथ गर्मियों का लोकप्रिय भोजन।\n• कटक दहीबड़ा आलूदम: ओडिशा का सबसे मशहूर और चटपटा स्ट्रीट फूड।",
    bn: "ওড়িশার সুস্বাদু ও ঐতিহ্যবাহী খাবার:\n\n• ছানাপোড়া: নয়গড়ের বিশ্ববিখ্যাত বেকড পনিরের পোড়া মিষ্টি।\n• পাহালা রসগোল্লা: নরম ও অত্যন্ত সুস্বাদু খাঁটি ওড়িশা রসগোল্লা।\n• ডালমা: ডাল ও বিভিন্ন সবজি দিয়ে তৈরি পুষ্টিকর সুস্বাদু ব্যঞ্জন।\n• পাখালা ভাত: দই, বড়ি পোড়া ও ভাজা সহযোগে ওড়িশার পান্তা ভাত।\n• কটক দইবড়া আলুদম: মশলাদার আলুদম ও ঘুঘনি মিশ্রিত দারুণ স্ট্রিট ফুড।",
    te: "ఒడిశా ప్రసిద్ధ సాంప్రదాయ వంటకాలు:\n\n• ఛేనా పోడా: కాల్చిన జున్నుతో తయారుచేసే నయగఢ్ ప్రసిద్ధ తీపి వంటకం.\n• పహాలా రసగుల్లా: మెత్తని, నోట్లో కరిగిపోయే సాంప్రదాయ రసగుల్లాలు.\n• దాల్మా: కూరగాయలు మరియు పప్పుతో నెయ్యి పోపుతో చేసే ఆహారం.\n• పఖాలా భాతా: చల్లని మజ్జిగ అన్నం మరియు కూరగాయల వేపుళ్లు.\n• కటక్ దహి బరా ఆలూదమ్: కారంగా ఉండే ఆలూదమ్ తో కలిపి వడ్డించే స్ట్రీట్ ఫుడ్.",
  },
  temples: {
    en: "Sacred Temples & Architecture of Odisha:\n\n• Konark Sun Temple: 13th-century UNESCO World Heritage Site conceived as a colossal solar chariot with 24 stone wheels.\n• Jagannath Temple, Puri: Renowned Char Dham pilgrimage sanctum, celebrated for the annual Ratha Yatra and Mahaprasad.\n• Lingaraj Temple, Bhubaneswar: Majestic 11th-century Kalinga sandstone masterpiece dedicated to Lord Harihara.\n• Mukteswara Temple: The 'Gem of Odishan Architecture' celebrated for its ornate arched torana gateway.\n• Dhauli Shanti Stupa: Historic Buddhist peace pagoda marking the transformation of Emperor Ashoka.",
    or: "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଧାର୍ମିକ ପୀଠ ଓ ପ୍ରାଚୀନ କଳିଙ୍ଗ ମନ୍ଦିର:\n\n• କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର: ତ୍ରୟୋଦଶ ଶତାବ୍ଦୀର ୟୁନେସ୍କୋ ବିଶ୍ୱ ଐତିହ୍ୟ, ଯାହା ୨୪ଟି ପଥର ଚକ ବିଶିଷ୍ଟ ଏକ ବିରାଟ ରଥ ସଦୃଶ।\n• ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ: ଚାରି ଧାମ ମଧ୍ୟରୁ ଅନ୍ୟତମ, ଯାହା ବିଶ୍ୱପ୍ରସିଦ୍ଧ ରଥଯାତ୍ରା ଓ ମହାପ୍ରସାଦ ପାଇଁ ଖ୍ୟାତ।\n• ଲିଙ୍ଗରାଜ ମନ୍ଦିର, ଭୁବନେଶ୍ୱର: ଏକାଦଶ ଶତାବ୍ଦୀର ପ୍ରଭୁ ହରିହରଙ୍କ ପ୍ରାଚୀନ ତଥା ଭବ୍ୟ କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କଳା।\n• ମୁକ୍ତେଶ୍ୱର ମନ୍ଦିର: ଓଡ଼ିଶାର 'ସ୍ଥାପତ୍ୟ ରତ୍ନ', ଯାହାର ସୁନ୍ଦର ତୋରଣ ଅତି ମନୋରମ।\n• ଧଉଳି ଶାନ୍ତି ସ୍ତୂପ: କଳିଙ୍ଗ ଯୁଦ୍ଧ ପରେ ଚଣ୍ଡାଶୋକରୁ ଧର୍ମାଶୋକ ହେବାର ଐତିହାସିକ ଶାନ୍ତିପୀଠ।",
    hi: "ओडिशा के प्रमुख पवित्र मंदिर और कलिंग वास्तुकला:\n\n• कोणार्क सूर्य मंदिर: 13वीं सदी का यूनेस्को विश्व धरोहर स्थल, 24 विशाल नक्काशीदार पहियों वाला सूर्य रथ।\n• श्री जगन्नाथ मंदिर, पुरी: हिंदू धर्म के चार पवित्र धामों में से एक, रथयात्रा और महाप्रसाद का केंद्र।\n• लिंगराज मंदिर, भुवनेश्वर: 11वीं सदी का भव्य शिव मंदिर जो कलिंग स्थापत्य कला का सर्वश्रेष्ठ शिखर है।\n• मुक्तेश्वर मंदिर: अपने अलंकृत तोरण के कारण इसे 'ओडिशा वास्तुकला का रत्न' कहा जाता है।\n• धौली शांति स्तूप: ऐतिहासिक बौद्ध शांति स्तूप जहाँ सम्राट अशोक ने अहिंसा का मार्ग अपनाया था।",
    bn: "ওড়িশার প্রধান ধর্মীয় তীর্থ ও প্রাচীন স্থাপত্য:\n\n• কোনার্ক সূর্য মন্দির: ত্রয়োদশ শতাব্দীর ইউনেস্কো হেরিটেজ সাইট, ২৪টি চাকাযুক্ত বিশাল রথ।\n• শ্রী জগন্নাথ মন্দির, পুরী: ভারতের অন্যতম প্রধান চার ধাম, রথযাত্রা ও মহাপ্রসাদের জন্য ভুবনখ্যাত।\n• লিঙ্গরাজ মন্দির, ভুবনেশ্বর: একাদশ শতাব্দীর সুবিশাল কলিঙ্গ স্থাপত্যশৈলীর নিদর্শন।\n• মুক্তেশ্বর মন্দির: সূক্ষ্ম খোদাই করা তোরণের জন্য একে 'ওড়িশা স্থাপত্যের রত্ন' বলা হয়।\n• ধৌলি শান্তি স্তূপ: ঐতিহাসিক বৌদ্ধ স্তূপ, যেখানে সম্রাট অশোক অহিংসা গ্রহণ করেছিলেন।",
    te: "ఒడిశా ప్రసిద్ధ పుణ్యక్షేత్రాలు మరియు చారిత్రక దేవాలయాలు:\n\n• కోణార్క్ సూర్య దేవాలయం: 13వ శతాబ్దపు యునెస్కో ప్రపంచ వారసత్వ సంపద, 24 రాతి చక్రాలతో కూడిన రథం.\n• జగన్నాథ ఆలయం, పూరీ: చార్ ధామ్ లలో ఒకటి, రథయాత్ర మరియు మహాప్రసాదానికి ప్రసిద్ధి.\n• లింగరాజ దేవాలయం, భువనేశ్వర్: 11వ శతాబ్దపు అద్భుతమైన కళింగ వాస్తుశిల్పం.\n• ముక్తేశ్వర దేవాలయం: అద్భుతమైన తోరణంతో కూడిన 'ఒడిశా వాస్తు రత్నం'.\n• ధౌళి శాంతి స్తూపం: అశోక చక్రవర్తి శాంతి మార్గాన్ని ఎంచుకున్న పవిత్ర ప్రదేశం.",
  },
  beaches: {
    en: "Coastal Beauty & Wildlife in Odisha:\n\n• Puri Golden Beach: Prestigious eco-certified Blue Flag beach with golden sand and sunrise views.\n• Chilika Lake: Asia's largest brackish lagoon, sheltering playful Irrawaddy dolphins and migratory winter birds.\n• Chandrabhaga Beach: Serene, pristine shoreline near Konark.\n• Gopalpur-on-Sea: Historic seaport town with a vintage lighthouse and coconut groves.\n• Bhitarkanika National Park: Majestic mangrove ecosystem sheltering giant saltwater crocodiles.",
    or: "ଓଡ଼ିଶାର ପ୍ରାକୃତିକ ବେଳାଭୂମି ଓ ବନ୍ୟପ୍ରାଣୀ:\n\n• ପୁରୀ ଗୋଲ୍ଡେନ୍ ବିଚ୍: ଅନ୍ତର୍ଜାତୀୟ ବ୍ଲୁ-ଫ୍ଲାଗ୍ ମାନ୍ୟତାପ୍ରାପ୍ତ ସ୍ୱଚ୍ଛ ଓ ସୁନ୍ଦର ସମୁଦ୍ରକୂଳ।\n• ଚିଲିକା ହ୍ରଦ: ଏସିଆର ସର୍ବବୃହତ ଲୁଣିଆ ହ୍ରଦ, ଯେଉଁଠାରେ ଇରାୱାଡ଼ି ଡଲଫିନ ଏବଂ ପ୍ରବାସୀ ପକ୍ଷୀ ଦେଖାଯାଆନ୍ତି।\n• ଚନ୍ଦ୍ରଭାଗା ବେଳାଭୂମି: କୋଣାର୍କ ନିକଟରେ ଅବସ୍ଥିତ ଏକ ଶାନ୍ତ ତଥା ପବିତ୍ର ବେଳାଭୂମି।\n• ଗୋପାଳପୁର ସମୁଦ୍ରକୂଳ: ଐତିହାସିକ ଲାଇଟହାଉସ ଏବଂ ନୀଳ ସମୁଦ୍ର ପାଇଁ ଜଣାଶୁଣା।\n• ଭିତରକନିକା ଜାତୀୟ ଉଦ୍ୟାନ: ବିରାଟ ଲୁଣା ଜଙ୍ଗଲ ଏବଂ କୁମ୍ଭୀରମାନଙ୍କ ପାଇଁ ପ୍ରସିଦ୍ଧ।",
    hi: "ओडिशा के समुद्री तट और प्राकृतिक वन्यजीव स्थल:\n\n• पुरी गोल्डन बीच: अंतरराष्ट्रीय 'ब्लू फ्लैग' प्रमाणित स्वच्छ और सुरक्षित सुनहरी रेत का समुद्र तट।\n• चिल्का झील: एशिया की सबसे बड़ी खारे पानी की झील, जहाँ दुर्लभ इरावाडी डॉल्फ़िन पाई जाती हैं।\n• चंद्रभागा बीच: कोणार्क के पास स्थित शांत और मनोरम समुद्र तट।\n• गोपालपुर-ऑन-सी: ऐतिहासिक लाइटहाउस और नारियल के बागों से घिरा खूबसूरत तट।\n• भितरकनिका राष्ट्रीय उद्यान: विशालकाय मगरमच्छों और मैंग्रोव वनों के लिए प्रसिद्ध।",
    bn: "ওড়িশার মনোরম সমুদ্রতট ও বন্যপ্রাণী অভয়ারণ্য:\n\n• পুরী গোল্ডেন বিচ: আন্তর্জাতিক ব্লু ফ্ল্যাগ শংসাপত্রপ্রাপ্ত পরিচ্ছন্ন সমুদ্র সৈকত।\n• চিল্কা হ্রদ: এশিয়ার বৃহত্তম হ্রদ, ইরাবতী ডলফিন ও পরিযায়ী পাখির আবাস।\n• চন্দ্রভাগা সৈকত: কোনার্কের নিকটবর্তী শান্ত প্রাকৃতিক সমুদ্রতট।\n• গোপালপুর সৈকত: প্রাচীন বাতিঘর ঘেরা প্রশান্ত সৈকত।\n• ভিতরকনিকা জাতীয় উদ্যান: ম্যানগ্রোভ অরণ্য ও নোনা জলের কুমিরের জন্য বিখ্যাত।",
    te: "ఒడిశా అందమైన తీరప్రాంతాలు మరియు వన్యప్రాణుల కేంద్రాలు:\n\n• పూరీ గోల్డెన్ బీచ్: బ్లూ ఫ్లాగ్ గుర్తింపు పొందిన పరిశుభ్రమైన బీచ్.\n• చిల్కా సరస్సు: ఆసియాలోనే అతిపెద్ద ఉప్పునీటి సరస్సు, డాల్ఫిన్ లకు ప్రసిద్ధి.\n• చంద్రభాగ బీచ్: కోణార్క్ సమీపంలో ప్రశాంతమైన తీరం.\n• గోపాల్ పూర్: లైట్ హౌస్ మరియు కొబ్బరి తోటలతో కూడిన విహార కేంద్రం.\n• భితర్ కనిక: మడ అడవులు మరియు మొసళ్లకు ప్రసిద్ధి.",
  },
  default: {
    en: "Welcome to Odisha Explorer — India's best kept secret!\n\nI am your local AI travel guide. You can ask me about:\n• Ancient Kalinga Temples (Konark, Jagannath Puri, Lingaraj)\n• Famous Odia Delicacies (Chhena Poda, Dalma, Rasagola)\n• Inspiring Quotes & Cultural Heritage\n• Beaches, Lakes (Chilika) & Wildlife (Bhitarkanika)\n• Weather forecasts and cab routes across Odisha.\n\nWhat would you like to explore next?",
    or: "ଓଡ଼ିଶା ଏକ୍ସପ୍ଲୋରରକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ — ଭାରତର ଅତୁଳନୀୟ ଐତିହ୍ୟ!\n\nମୁଁ ଆପଣଙ୍କ ଓଡ଼ିଶା ଏଆଇ ଗାଇଡ୍। ଆପଣ ମୋତେ ପଚାରିପାରିବେ:\n• ପ୍ରସିଦ୍ଧ ମନ୍ଦିର (କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର, ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର, ଲିଙ୍ଗରାଜ)\n• ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଖାଦ୍ୟ ଓ ମିଠା (ଛେନାପୋଡ଼, ଡାଲମା, ରସଗୋଲା, ଦହିବରା)\n• ଓଡ଼ିଶାର ଐତିହାସିକ ଉକ୍ତି, କଳା ଓ ସଂସ୍କୃତି\n• ଚିଲିକା ହ୍ରଦ, ବେଳାଭୂମି ଓ ଅଭୟାରଣ୍ୟ\n• ବିଭିନ୍ନ ସହରର ପାଣିପାଗ ଏବଂ ଯାତାୟାତ ସୂଚନା।\n\nଆପଣ ଆଜି କେଉଁ ବିଷୟରେ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?",
    hi: "ओडिशा एक्सप्लोरर में आपका स्वागत है — भारत की सांस्कृतिक धरोहर!\n\nमैं आपका स्थानीय एआई गाइड हूँ। आप मुझसे पूछ सकते हैं:\n• प्राचीन कलिंग मंदिर (कोणार्क, पुरी जगन्नाथ, लिंगराज)\n• ओडिशा के स्वादिष्ट व्यंजन (छेना पोड़ा, दालमा, रसगुल्ला)\n• प्रसिद्ध सुविचार, संस्कृति और परंपराएँ\n• चिल्का झील, समुद्र तट और वन्यजीव अभयारण्य\n• मौसम और कैब/परिवहन की सटीक जानकारी।\n\nआप ओडिशा के बारे में क्या जानना चाहते हैं?",
    bn: "ওড়িশা এক্সপ্লোরারে আপনাকে স্বাগতম — ভারতের এক অপূর্ব ঐতিহ্য!\n\nআমি আপনার স্থানীয় এআই গাইড। আপনি জানতে চাইতে পারেন:\n• প্রাচীন মন্দির (কোনার্ক, পুরী জগন্নাথ, লিঙ্গরাজ)\n• ওড়িশার ঐতিহ্যবাহী খাবার ও মিষ্টি (ছানাপোড়া, ডালমা, রসগোল্লা)\n• বিখ্যাত উক্তি ও ওড়িশি সংস্কৃতি\n• চিল্কা হ্রদ, সমুদ্রতট ও বন্যপ্রাণী\n• আবহাওয়া ও ভ্রমণ নির্দেশিকা।\n\nআপনি কোন বিষয়ে জানতে আগ্রহী?",
    te: "ఒడిశా ఎక్స్ ప్లోరర్ కు స్వాగతం — భారతీయ సంస్కృతికి నిలయం!\n\nనేను మీ లోకల్ ఏఐ గైడ్ ని. మీరు నన్ను అడగవచ్చు:\n• ప్రాచీన ఆలయాలు (కోణార్క్, పూరీ జగన్నాథ్, లింగరాజ)\n• ప్రసిద్ధ వంటకాలు (ఛేనా పోడా, దాల్మా, రసగుల్లా)\n• ప్రముఖ సూక్తులు మరియు సంస్కృతి\n• చిల్కా సరస్సు, సముద్ర తీరాలు\n• వాతావరణం మరియు ప్రయాణ వివరాలు.\n\nమీరు దేని గురించి తెలుసుకోవాలనుకుంటున్నారు?",
  },
};

// Accurate token-based matching (prevents 'odisha' matching 'dish'!)
export const getLocalFallbackReply = (query: string, language: SupportedLanguage = "en"): string => {
  const lang = language in MULTILINGUAL_DATA.default ? language : "en";
  const tokens = new Set((query.toLowerCase().match(/[a-zA-Z0-9_\u0900-\u0D7F]+/g) || []));
  const fullText = query.toLowerCase();

  // 1. Quotes / Sayings intent
  const quoteTokens = ["quote", "quotes", "saying", "sayings", "ukti", "shloka", "prabodha", "katha", "gopabandhu", "poetry", "poem", "ବାଣୀ", "ଉକ୍ତି", "ପଦ୍ୟ", "କବିତା", "ପ୍ରବଚନ", "सुविचार", "पंक्ति", "पंक्तियाँ", "কাহাওয়াত", "উক্তি", "సూక్తి", "సూక్తులు"];
  if (quoteTokens.some(k => tokens.has(k)) || fullText.includes("famous quote") || fullText.includes("famous quotes") || fullText.includes("quotes of odisha")) {
    return MULTILINGUAL_DATA.quotes[lang];
  }

  // 2. Food intent (checked strictly with whole words so 'odisha' does NOT trigger 'dish'!)
  const foodTokens = ["food", "foods", "eat", "eating", "dish", "dishes", "cuisine", "recipe", "recipes", "delicacy", "delicacies", "sweet", "sweets", "mitha", "chhena", "chhenapoda", "rasagola", "dalma", "pakhala", "dahibara", "khaja", "machha", "ଖାଦ୍ୟ", "ମିଠା", "ରସଗୋଲା", "ଛେନାପୋଡ଼", "ପଖାଳ", "ଦହିବରା", "खाना", "व्यंजन", "मिठाई", "রসগোল্লা", "ছানাপোড়া", "వంటకాలు", "మిఠాయిలు"];
  if (foodTokens.some(k => tokens.has(k)) || fullText.includes("famous food") || fullText.includes("gamous food") || fullText.includes("local food")) {
    return MULTILINGUAL_DATA.food[lang];
  }

  // 3. Temples intent
  const templeTokens = ["temple", "temples", "mandir", "deula", "konark", "jagannath", "puri", "lingaraj", "mukteswar", "rajarani", "dhauli", "architecture", "monument", "monuments", "sun temple", "ମନ୍ଦିର", "କୋଣାର୍କ", "ଜଗନ୍ନାଥ", "ଲିଙ୍ଗରାଜ", "ଧଉଳି", "मंदिर", "कोणार्क", "জগন্নাথ", "দেউল", "గుడి", "దేవాలయం"];
  if (templeTokens.some(k => tokens.has(k)) || fullText.includes("sun temple") || fullText.includes("temple city")) {
    return MULTILINGUAL_DATA.temples[lang];
  }

  // 4. Beaches intent
  const beachTokens = ["beach", "beaches", "sea", "ocean", "chilika", "gopalpur", "chandrabhaga", "lake", "similipal", "dolphin", "dolphins", "waterfall", "waterfalls", "ସମୁଦ୍ର", "ବେଳାଭୂମି", "ଚିଲିକା", "ଡଲଫିନ", "समुद्र", "बीच", "झील", "সৈকত", "হ্রদ", "తీరం", "సరస్సు"];
  if (beachTokens.some(k => tokens.has(k))) {
    return MULTILINGUAL_DATA.beaches[lang];
  }

  return MULTILINGUAL_DATA.default[lang];
};

export const useTravelChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    // Detect if weather info is needed
    const lowerInput = input.toLowerCase();
    const weatherKeywords = ["weather", "temperature", "rain", "hot", "cold", "humid", "monsoon", "climate", "forecast"];
    const locationKeywords = ["bhubaneswar", "puri", "konark", "cuttack", "berhampur", "gopalpur", "chilika", "sambalpur", "rourkela", "taptapani", "odisha"];
    const includeWeather = weatherKeywords.some(kw => lowerInput.includes(kw));
    
    let weatherLocation = "";
    for (const loc of locationKeywords) {
      if (lowerInput.includes(loc)) {
        weatherLocation = loc;
        break;
      }
    }
    if (includeWeather && !weatherLocation) {
      weatherLocation = "bhubaneswar";
    }

    try {
      const resp = await fetch(getChatUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          language,
          includeWeather,
          weatherLocation,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Server returned status ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // If response ended up empty, provide multilingual fallback
      if (!assistantContent.trim()) {
        updateAssistant(getLocalFallbackReply(input, language));
      }
    } catch (err) {
      console.warn("Chat API notice (using local offline engine):", err);
      const fallback = getLocalFallbackReply(input, language);
      updateAssistant(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Built-in speech recognition for Chat input bar
  const startSpeechInput = useCallback((onResult: (text: string) => void) => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return false;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "en" ? "en-IN" : `${language}-IN`;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) onResult(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch {
      setIsListening(false);
      return false;
    }
  }, [language]);

  const stopSpeechInput = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    language, 
    setLanguage,
    isListening,
    startSpeechInput,
    stopSpeechInput,
  };
};
