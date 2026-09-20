import { Language } from '../types';

export const LANGUAGE_STORAGE_KEY = 'kabadiwala_preferred_language';

export const languageNames: Record<Language, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  bn: { label: 'Bengali', native: 'বাংলা' },
  mr: { label: 'Marathi', native: 'मराठी' },
};

export const translations = {
  en: {
    appTitle: 'Kabadiwala Connect',
    appSubtitle: 'Formal E-Waste & Scrap Recycling Network',
    tagline: 'Bridging informal waste collectors directly with authorized recyclers under EPR rules.',
    signOut: 'Sign Out',
    citizenPortal: 'Household / Citizen',
    collectorPortal: 'Informal Collector / Field Partner',
    language: 'Language',
    
    // Collector Tabs
    tabQueue: 'Available Pickups',
    tabActive: 'Active Weighing',
    tabLots: 'Digital Lots',
    tabPrices: 'Daily Price Board',
    tabRecyclers: 'Authorized Recyclers',
    tabHandover: 'Handover & Ledger',
    tabSafety: 'Safety Guidance',
    tabImpact: 'Municipal & ESG Impact',
    backToPortal: 'Back to Operations',
    offlineSyncOnline: 'Field Sync: Online',
    offlineSyncOffline: 'Field Sync: Offline (Local DB)',
    listenScale: 'Listen to Weighing Readout',

    // Household Tabs
    tabSchedule: 'Schedule Pickup',
    tabTracking: 'Live Tracking',
    tabHistory: 'Order History',

    // Scale Calculator
    scaleTitle: 'Itemized Scale Weight Calculator',
    scaleSubtitle: 'Enter measured scale weight for each separate material. Subtotals calculate automatically.',
    verifiedKg: 'Verified Weight (KG)',
    ratePerKg: 'Rate (₹/kg)',
    subtotal: 'Subtotal',
    totalCalculatedPayout: 'Total Calculated Payout',
    confirmAndCash: 'Confirm Scale Weight & Hand Cash',
    residentOtp: 'Resident 4-Digit Security PIN',
    addMaterialRow: '+ Add Additional Material',

    // Handover & Ledger
    handoverTitle: 'Digital Handover Record',
    handoverSubtitle: 'Verifiable transfer document logged to authorized recycler under EPR 2022.',
    referenceCode: 'Reference Code',
    recyclerName: 'Authorized Recycler',
    handoverCash: 'Cash Handover',
    handoverDigital: 'Digital / UPI',
    statusConfirmed: 'Recycler Confirmed',
    earningsLedger: 'Earnings Ledger',
    totalCashReceived: 'Cash Collected Today',
    totalRecyclerPayout: 'Recycler Payouts',
    netProfitMargin: 'Net Field Margin',

    // Safety Guidance
    safetyTitle: 'Field Safety & Hazardous Materials Guidance',
    safetySubtitle: 'Protect your health, prevent toxic fires, and earn higher profits with formal recyclers.',
    hazardousPractice: 'Hazardous Backyard Practice',
    safeAlternative: 'Formal Safe Method',
    economicValue: 'Economic Advantage',
    listenAudio: 'Listen to Safety Audio',
    stopAudio: 'Stop Audio',

    // Price Board
    priceBoardTitle: 'Official E-Waste & Scrap Price Board',
    priceBoardSubtitle: 'Transparent daily rates aligned with Extended Producer Responsibility (EPR) benchmarks.',
    currentRate: 'Current Rate',
    fairMarketRange: 'Fair Market Range',
    trend: '7-Day Trend',
    listenPrices: 'Listen to Today\'s Rates',

    // Ratings
    rateCollectorTitle: 'Rate Your Collector Partner',
    rateCollectorSubtitle: 'Help informal scrap collectors build verified trust with authorized municipal recycling networks.',
    submitRating: 'Submit Rating',
    ratingSubmitted: 'Thank you! Rating recorded successfully.',
    tagPunctual: 'Punctual & Prompt',
    tagFairWeighing: 'Accurate Scale Weighing',
    tagPolite: 'Polite & Professional',
    tagCashImmediate: 'Paid Cash Instantly',
    tagCleanHandling: 'Safe & Clean Handling',

    // Common
    kg: 'kg',
    rs: '₹',
    urgent: 'Urgent',
    express: 'Express Today',
    standard: 'Standard',
  },
  hi: {
    appTitle: 'कबाड़ीवाला कनेक्ट',
    appSubtitle: 'ई-कचरा व रीसाइक्लिंग नेटवर्क',
    tagline: 'ईपीआर (EPR) नियमों के तहत अनौपचारिक कबाड़ियों को सीधे अधिकृत रीसाइक्लर्स से जोड़ना।',
    signOut: 'लॉग आउट',
    citizenPortal: 'नागरिक / घर का स्क्रैप',
    collectorPortal: 'कबाड़ीवाला साथी / फील्ड पार्टनर',
    language: 'भाषा',

    // Collector Tabs
    tabQueue: 'नजदीकी पिकअप',
    tabActive: 'वजन व तौल',
    tabLots: 'डिजिटल लॉट बनाएं',
    tabPrices: 'आज का भाव (रेट बोर्ड)',
    tabRecyclers: 'अधिकृत रीसाइक्लर्स',
    tabHandover: 'हैंडओवर व बहीखाता',
    tabSafety: 'सुरक्षा मार्गदर्शिका',
    tabImpact: 'नगरपालिका ईएसजी प्रभाव',
    backToPortal: 'पोर्टल पर वापस',
    offlineSyncOnline: 'फील्ड सिंक: ऑनलाइन',
    offlineSyncOffline: 'फील्ड सिंक: ऑफलाइन (लोकल)',
    listenScale: 'तौल सारांश सुनें',

    // Household Tabs
    tabSchedule: 'पिकअप बुक करें',
    tabTracking: 'लाइव ट्रैकिंग',
    tabHistory: 'पुराना रिकॉर्ड',

    // Scale Calculator
    scaleTitle: 'सामग्री अनुसार डिजिटल तौल कैलकुलेटर',
    scaleSubtitle: 'हर सामग्री का वास्तविक कांटा वजन दर्ज करें। कुल नकद भुगतान स्वतः तैयार हो जाएगा।',
    verifiedKg: 'कांटा वजन (किग्रा)',
    ratePerKg: 'भाव (₹/किग्रा)',
    subtotal: 'उप-योग',
    totalCalculatedPayout: 'कुल नकद भुगतान',
    confirmAndCash: 'वजन की पुष्टि करें व नकद सौंपें',
    residentOtp: 'नागरिक का 4-अंकों का पिन (PIN)',
    addMaterialRow: '+ अन्य सामग्री जोड़ें',

    // Handover & Ledger
    handoverTitle: 'डिजिटल हैंडओवर रसीद',
    handoverSubtitle: 'अधिकृत रीसाइक्लर को प्रमाणित सामग्री हस्तांतरण रिकॉर्ड।',
    referenceCode: 'हैंडओवर कोड',
    recyclerName: 'अधिकृत रीसाइक्लर',
    handoverCash: 'नकद भुगतान',
    handoverDigital: 'यूपीआई / ऑनलाइन',
    statusConfirmed: 'रीसाइक्लर द्वारा स्वीकृत',
    earningsLedger: 'कमाई का बहीखाता',
    totalCashReceived: 'आज का कुल नकद संकलन',
    totalRecyclerPayout: 'रीसाइक्लर से प्राप्त भुगतान',
    netProfitMargin: 'शुद्ध मुनाफा',

    // Safety Guidance
    safetyTitle: 'सुरक्षा मार्गदर्शिका (खतरनाक प्रथाओं से बचें)',
    safetySubtitle: 'अपने स्वास्थ्य की रक्षा करें, जहरीले धुएं से बचें और अधिकृत रीसाइक्लर से अधिक दाम पाएं।',
    hazardousPractice: 'खतरनाक देसी तरीका',
    safeAlternative: 'सुरक्षित अधिकृत तरीका',
    economicValue: 'आर्थिक लाभ (मुनाफा)',
    listenAudio: 'सुरक्षा ऑडियो सुनें',
    stopAudio: 'ऑडियो बंद करें',

    // Price Board
    priceBoardTitle: 'आज का ई-कचरा व स्क्रैप भाव बोर्ड',
    priceBoardSubtitle: 'ईपीआर (EPR) नियमों के अनुसार पारदर्शी और निष्पक्ष बाजार दरें।',
    currentRate: 'वर्तमान भाव',
    fairMarketRange: 'उचित बाजार मूल्य',
    trend: 'बाजार रुझान',
    listenPrices: 'आज के भाव की आवाज सुनें',

    // Ratings
    rateCollectorTitle: 'कबाड़ी साथी को रेटिंग दें',
    rateCollectorSubtitle: 'आपके दिए गए स्टार्स कबाड़ी साथी को औपचारिक रीसाइक्लिंग नेटवर्क में पहचान दिलाते हैं।',
    submitRating: 'रेटिंग जमा करें',
    ratingSubmitted: 'धन्यवाद! आपकी रेटिंग दर्ज कर ली गई है।',
    tagPunctual: 'समय पर पहुंचे',
    tagFairWeighing: 'ईमानदार व सही तौल',
    tagPolite: 'सभ्य व्यवहार',
    tagCashImmediate: 'तुरंत पूरा नकद भुगतान',
    tagCleanHandling: 'स्वच्छ व सुरक्षित संभाल',

    // Common
    kg: 'किग्रा',
    rs: '₹',
    urgent: 'प्राथमिकता (तत्काल)',
    express: 'आज ही',
    standard: 'सामान्य',
  },
  mr: {
    appTitle: 'कबाडीवाला कनेक्ट',
    appSubtitle: 'ई-कचरा व अधिकृत पुनर्वापर नेटवर्क',
    tagline: 'ईपीआर नियमांनुसार असंघटित भंगार गोळा करणाऱ्यांना अधिकृत रीसायकलर्सशी थेट जोडणे.',
    signOut: 'लॉग आउट',
    citizenPortal: 'घरगुती नागरिक / रहिवासी',
    collectorPortal: 'कबाडीवाला भागीदार / संकलनकर्ता',
    language: 'भाषा',

    // Collector Tabs
    tabQueue: 'उपलब्ध पिकअप',
    tabActive: 'वजन व मापन',
    tabLots: 'डिजिटल लॉट तयार करा',
    tabPrices: 'आजचा भाव फलक',
    tabRecyclers: 'अधिकृत रीसायकलर्स',
    tabHandover: 'हस्तांतरण व जमाखर्च',
    tabSafety: 'सुरक्षा मार्गदर्शक',
    tabImpact: 'महानगरपालिका ईएसजी प्रभाव',
    backToPortal: 'पोर्टलवर परत जा',
    offlineSyncOnline: 'फील्ड सिंक: ऑनलाइन',
    offlineSyncOffline: 'फील्ड सिंक: ऑफलाइन (स्थानिक)',
    listenScale: 'वजन सारांश ऐका',

    // Household Tabs
    tabSchedule: 'भंगार पिकअप नोंदवा',
    tabTracking: 'थेट ट्रॅकिंग',
    tabHistory: 'मागील व्यवहार',

    // Scale Calculator
    scaleTitle: 'वस्तूनिहाय डिजिटल वजन गणक',
    scaleSubtitle: 'प्रत्येक वस्तूचे प्रत्यक्ष मोजलेले वजन टाका. एकूण रोख रक्कम आपोआप मोजली जाईल.',
    verifiedKg: 'काट्यावरील वजन (कि.ग्रॅ.)',
    ratePerKg: 'दर (₹/कि.ग्रॅ.)',
    subtotal: 'रक्कम',
    totalCalculatedPayout: 'एकूण देय रोख रक्कम',
    confirmAndCash: 'वजन निश्चित करा व रोख रक्कम द्या',
    residentOtp: 'रहिवाशांचा ४ अंकी पिन (PIN)',
    addMaterialRow: '+ आणखी वस्तू जोडा',

    // Handover & Ledger
    handoverTitle: 'डिजिटल हस्तांतरण पावती',
    handoverSubtitle: 'अधिकृत रीसायकलर्सकडे ई-कचरा सुपूर्द केल्याची डिजिटल नोंद.',
    referenceCode: 'नोंदणी कोड',
    recyclerName: 'अधिकृत रीसायकलर',
    handoverCash: 'रोख व्यवहार',
    handoverDigital: 'युपीआय / ऑनलाइन',
    statusConfirmed: 'रीसायकलरकडून पुष्टी',
    earningsLedger: 'दैनंदिन जमाखर्च बहीखाता',
    totalCashReceived: 'आज गोळा केलेली रोख',
    totalRecyclerPayout: 'रीसायकलरकडून मिळालेली रक्कम',
    netProfitMargin: 'निव्वळ नफा',

    // Safety Guidance
    safetyTitle: 'सुरक्षा मार्गदर्शक (धोकादायक पद्धती टाळा)',
    safetySubtitle: 'स्वतःच्या आरोग्याची काळजी घ्या, विषारी धूर टाळा आणि अधिकृत केंद्रामार्फत अधिक नफा मिळवा.',
    hazardousPractice: 'धोकादायक पद्धत',
    safeAlternative: 'अधिकृत सुरक्षित पद्धत',
    economicValue: 'आर्थिक फायदा',
    listenAudio: 'सुरक्षा मार्गदर्शन ऐका',
    stopAudio: 'आवाज थांबवा',

    // Price Board
    priceBoardTitle: 'आजचा ई-कचरा व भंगार दर फलक',
    priceBoardSubtitle: 'ईपीआर नियमांनुसार पारदर्शक आणि खात्रीशीर बाजारभाव.',
    currentRate: 'सध्याचा दर',
    fairMarketRange: 'वाजवी बाजारभाव',
    trend: 'बाजारातील कल',
    listenPrices: 'आजचे दर ऐका',

    // Ratings
    rateCollectorTitle: 'कबाडी मित्राचे मूल्यमापन करा',
    rateCollectorSubtitle: 'तुमचे रेटिंग कबाडी मित्रांना अधिकृत पुनर्चक्रीकरण प्रणालीत विश्वासार्ह बनवते.',
    submitRating: 'मूल्यमापन जतन करा',
    ratingSubmitted: 'धन्यवाद! आपले मूल्यमापन यशस्वीपणे नोंदवले गेले.',
    tagPunctual: 'वेळेवर उपस्थित',
    tagFairWeighing: 'अचूक आणि पारदर्शक वजन',
    tagPolite: 'नम्र आणि व्यावसायिक',
    tagCashImmediate: 'तात्काळ रोख रक्कम दिली',
    tagCleanHandling: 'स्वच्छ आणि सुरक्षित हाताळणी',

    // Common
    kg: 'कि.ग्रॅ.',
    rs: '₹',
    urgent: 'तातडीचे (४५ मि.)',
    express: 'आजचे पिकअप',
    standard: 'नियोजित',
  },
  bn: {
    appTitle: 'কবাডিওয়ালা কানেক্ট',
    appSubtitle: 'ই-বর্জ্য ও স্ক্র্যাপ পুনর্ব্যবহার নেটওয়ার্ক',
    tagline: 'ইপিআর (EPR) বিধিমালার অধীনে অনানুষ্ঠানিক বর্জ্য সংগ্রাহকদের সরাসরি অনুমোদিত রিসাইকলারদের সাথে যুক্ত করা।',
    signOut: 'লগ আউট',
    citizenPortal: 'নাগরিক / গৃহস্থালি পোর্টাল',
    collectorPortal: 'কবাডিওয়ালা সাথী / ফিল্ড পার্টনার',
    language: 'ভাষা',

    // Collector Tabs
    tabQueue: 'পিকআপ তালিকা',
    tabActive: 'ডিজিটাল ওজন ও তৌল',
    tabLots: 'ডিজিটাল লট তৈরি',
    tabPrices: 'দৈনিক বাজারদর ফলক',
    tabRecyclers: 'অনুমোদিত রিসাইকলার',
    tabHandover: 'হস্তান্তর ও খতিয়ান',
    tabSafety: 'নিরাপত্তা নির্দেশিকা',
    tabImpact: 'পৌর ও ইএসজি প্রভাব',
    backToPortal: 'পোর্টালে ফিরে যান',
    offlineSyncOnline: 'ফিল্ড সিঙ্ক: অনলাইন',
    offlineSyncOffline: 'ফিল্ড সিঙ্ক: অফলাইন (লোকাল)',
    listenScale: 'ওজন বিবরণ শুনুন',

    // Household Tabs
    tabSchedule: 'স্ক্র্যাপ বুক করুন',
    tabTracking: 'লাইভ ট্র্যাকিং',
    tabHistory: 'অর্ডার ইতিহাস',

    // Scale Calculator
    scaleTitle: 'আইটেমভিত্তিক ডিজিটাল স্কেল ক্যালকুলেটর',
    scaleSubtitle: 'প্রতিটি সামগ্রীর সঠিক স্কেল ওজন লিখুন। নগদ পাওনা স্বয়ংক্রিয়ভাবে হিসাব হবে।',
    verifiedKg: 'যাচাইকৃত ওজন (কেজি)',
    ratePerKg: 'দর (₹/কেজি)',
    subtotal: 'উপমোট',
    totalCalculatedPayout: 'মোট প্রদেয় নগদ অর্থ',
    confirmAndCash: 'ওজন নিশ্চিত করুন ও নগদ টাকা দিন',
    residentOtp: 'নাগরিকের ৪-সংখ্যার সিকিউরিটি পিন',
    addMaterialRow: '+ অতিরিক্ত সামগ্রী যোগ করুন',

    // Handover & Ledger
    handoverTitle: 'ডিজিটাল হস্তান্তর রশিদ',
    handoverSubtitle: 'অনুমোদিত রিসাইকলারে ই-বর্জ্য হস্তান্তরের ডিজিটাল প্রমাণপত্র।',
    referenceCode: 'রেফারেন্স কোড',
    recyclerName: 'অনুমোদিত রিসাইকলার',
    handoverCash: 'নগদ হস্তান্তর',
    handoverDigital: 'ডিজিটাল / ইউপিআই',
    statusConfirmed: 'রিসাইকলার দ্বারা নিশ্চিত',
    earningsLedger: 'উপার্জন ও জমাখরচের খতিয়ান',
    totalCashReceived: 'আজ সংগৃহীত নগদ টাকা',
    totalRecyclerPayout: 'রিসাইকলার থেকে প্রাপ্ত অর্থ',
    netProfitMargin: 'নিট লাভের মার্জিন',

    // Safety Guidance
    safetyTitle: 'মাঠ পর্যায়ের নিরাপত্তা ও ক্ষতিকর উপাদান নির্দেশিকা',
    safetySubtitle: 'নিজের স্বাস্থ্য রক্ষা করুন, বিষাক্ত ধোঁয়া থেকে দূরে থাকুন এবং অনুমোদিত রিসাইকলারে সর্বোচ্চ দাম পান।',
    hazardousPractice: 'বিপজ্জনক খোলা পদ্ধতি',
    safeAlternative: 'অনুমোদিত নিরাপদ পদ্ধতি',
    economicValue: 'অর্থনৈতিক লাভ (মুনাফা)',
    listenAudio: 'নিরাপত্তা অডিও শুনুন',
    stopAudio: 'অডিও বন্ধ করুন',

    // Price Board
    priceBoardTitle: 'অফিসিয়াল ই-বর্জ্য ও স্ক্র্যাপ বাজারদর ফলক',
    priceBoardSubtitle: 'ইপিআর বিধিমালা অনুযায়ী স্বচ্ছ ও নিশ্চিত দৈনিক বাজারদর।',
    currentRate: 'বর্তমান দর',
    fairMarketRange: 'ন্যায্য বাজার দর',
    trend: 'বাজারের গতিপ্রকৃতি',
    listenPrices: 'আজকের বাজারদর শুনুন',

    // Ratings
    rateCollectorTitle: 'আপনার সংগ্রহকারী সঙ্গীর মূল্যায়ন করুন',
    rateCollectorSubtitle: 'আপনার রেটিং অনানুষ্ঠানিক সংগ্রহকারীদের প্রাতিষ্ঠানিক নেটওয়ার্কে আস্থা বৃদ্ধি করতে সাহায্য করে।',
    submitRating: 'রেটিং জমা দিন',
    ratingSubmitted: 'ধন্যবাদ! আপনার রেটিং সফলভাবে সংরক্ষিত হয়েছে।',
    tagPunctual: 'সময়নিষ্ঠ ও তৎপর',
    tagFairWeighing: 'সঠিক ও নিখুঁত স্কেল ওজন',
    tagPolite: 'বিনম্র ও পেশাদার',
    tagCashImmediate: 'তাত্ক্ষণিক নগদ পরিশোধ',
    tagCleanHandling: 'পরিচ্ছন্ন ও নিরাপদ হ্যান্ডলিং',

    // Common
    kg: 'কেজি',
    rs: '₹',
    urgent: 'জরুরি (৪৫ মি.)',
    express: 'আজকের ডেলিভারি',
    standard: 'সাধারণ শিডিউল',
  },
};

export function getTranslation(lang: Language = 'en') {
  return translations[lang] || translations.en;
}

// Low-literacy Speech Synthesis Voice announcement helper
export function speakVernacular(text: string, lang: Language = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'bn') {
      utterance.lang = 'bn-IN';
    } else if (lang === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95; // Slightly slower for low-literacy field comprehension
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('TTS speech error:', err);
    return false;
  }
}

export function stopVernacularSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
