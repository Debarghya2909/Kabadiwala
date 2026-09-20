import {
  AuthUser,
  MaterialLine,
  Pickup,
  AuthorizedRecycler,
  DigitalLot,
  HandoverRecord,
  SafetyGuideItem,
  MaterialKey,
  ItemizedWeighItem,
  Language,
} from '../types';

export const STORAGE_KEY_PICKUPS = 'kabadiwala_connect_pickups_v3';
export const STORAGE_KEY_AUTH = 'kabadiwala_connect_auth_user_v3';
export const STORAGE_KEY_LOTS = 'kabadiwala_connect_lots_v3';
export const STORAGE_KEY_HANDOVERS = 'kabadiwala_connect_handovers_v3';
export const STORAGE_KEY_LANGUAGE = 'kabadiwala_connect_language_v3';
export const UPDATE_EVENT_PICKUPS = 'kabadiwala_pickups_updated';
export const UPDATE_EVENT_AUTH = 'kabadiwala_auth_updated';

export const materialCatalog: MaterialLine[] = [
  {
    key: 'pcb',
    label: 'Printed Circuit Boards (PCBs & Motherboards)',
    labelHi: 'सर्किट बोर्ड व मदरबोर्ड (PCBs)',
    labelMr: 'सर्किट बोर्ड आणि मदरबोर्ड (PCBs)',
    short: 'PCBs',
    rate: 285,
    kg: 2,
    color: '#059669',
    category: 'ewaste',
    description: 'Computer motherboards, green RAM chips, telecom telecom cards, TV boards',
    descriptionHi: 'कंप्यूटर मदरबोर्ड, रैम चिप्स, टीवी किट और ग्रीन सर्किट बोर्ड',
    descriptionMr: 'संगणक मदरबोर्ड, रॅम चिप्स, टेलिकॉम सर्किट्स व हिरवे बोर्ड',
    marketRange: '₹260 – ₹310 / kg',
    trend: 'up',
    trendPercent: '+6.5%',
    hazardousNote: 'Never use acid leaching! Authorized hydrometallurgy facilities pay higher rates.',
  },
  {
    key: 'cables',
    label: 'Copper Cables & Insulated Wiring',
    labelHi: 'तांबे की केबल व बिजली के तार',
    labelMr: 'तांब्याची केबल आणि वायरिंग',
    short: 'Cables',
    rate: 220,
    kg: 3,
    color: '#d97706',
    category: 'metal',
    description: 'PVC coated wiring, power cords, data cables, telecom copper pairs',
    descriptionHi: 'बिजली के तार, पावर केबल्स और इंसुलेटेड तांबे के तार',
    descriptionMr: 'विद्युत तारा, डेटा केबल्स आणि कॉपर वायर',
    marketRange: '₹205 – ₹235 / kg',
    trend: 'up',
    trendPercent: '+4.2%',
    hazardousNote: 'Do not burn plastic coating! Burning destroys copper and causes toxic dioxin fumes.',
  },
  {
    key: 'batteries',
    label: 'Batteries (Lithium-ion / Lead-Acid / UPS)',
    labelHi: 'बैटरियां (लिथियम-आयन व यूपीएस)',
    labelMr: 'बॅटरी (लिथियम-आयन व लेड-ॲसिड)',
    short: 'Batteries',
    rate: 95,
    kg: 2,
    color: '#dc2626',
    category: 'battery',
    description: 'Smartphone Li-ion packs, laptop batteries, inverter lead-acid blocks, UPS units',
    descriptionHi: 'मोबाइल व लैपटॉप की बैटरी, इनवर्टर व यूपीएस बैटरी ब्लॉक',
    descriptionMr: 'मोबाईल व लॅपटॉप बॅटरी, युपीएस आणि इन्व्हर्टर बॅटरी',
    marketRange: '₹85 – ₹110 / kg',
    trend: 'up',
    trendPercent: '+8.0%',
    hazardousNote: 'Puncturing or breaking batteries causes explosive chemical fires and acid leaks.',
  },
  {
    key: 'crt',
    label: 'Cathode Ray Tubes (CRTs / Old Picture Tubes)',
    labelHi: 'सीआरटी पिक्चर ट्यूब (पुराने टीवी/मॉनिटर)',
    labelMr: 'सीआरटी पिक्चर ट्यूब (जुने टीव्ही/मॉनिटर)',
    short: 'CRTs',
    rate: 26,
    kg: 0,
    color: '#6366f1',
    category: 'display',
    description: 'Heavy glass bulbs from box TVs, computer monitors containing leaded funnel glass',
    descriptionHi: 'पुराने बक्से वाले टीवी और कंप्यूटर मॉनिटर का भारी पिक्चर ग्लास',
    descriptionMr: 'जुन्या टीव्ही व कॉम्प्युटर मॉनिटरच्या काचेच्या पिक्चर ट्यूब',
    marketRange: '₹22 – ₹30 / kg',
    trend: 'stable',
    trendPercent: '0.0%',
    hazardousNote: 'Never smash CRT glass! Risk of vacuum implosion and toxic lead dust.',
  },
  {
    key: 'lcd',
    label: 'LCD & LED Display Panels',
    labelHi: 'एलसीडी व एलईडी स्क्रीन पैनल्स',
    labelMr: 'एलसीडी आणि एलईडी स्क्रीन पॅनेल्स',
    short: 'LCD/LED',
    rate: 52,
    kg: 0,
    color: '#0284c7',
    category: 'display',
    description: 'Flat screen TV panels, broken laptop displays, desktop computer monitors',
    descriptionHi: 'फ्लैट स्क्रीन टीवी, लैपटॉप की स्क्रीन और डेस्कटॉप मॉनिटर पैनल्स',
    descriptionMr: 'फ्लॅट स्क्रीन टीव्ही, फुटलेले लॅपटॉप डिस्प्ले व संगणक मॉनिटर्स',
    marketRange: '₹48 – ₹58 / kg',
    trend: 'up',
    trendPercent: '+2.8%',
    hazardousNote: 'Keep diffusers and CCFL backlight tubes intact to avoid mercury vapor release.',
  },
  {
    key: 'motors',
    label: 'Motors & Magnet-Bearing Assemblies',
    labelHi: 'इलेक्ट्रिक मोटर्स व मैग्नेट असेंबली',
    labelMr: 'इलेक्ट्रिक मोटर्स आणि मॅग्नेट पार्ट्स',
    short: 'Motors',
    rate: 58,
    kg: 0,
    color: '#475569',
    category: 'metal',
    description: 'Washing machine motors, refrigerator compressor blocks, HDD neodymium magnets',
    descriptionHi: 'फ्रिज कंप्रेसर, वाशिंग मशीन मोटर और हार्ड डिस्क के शक्तिशाली चुंबक',
    descriptionMr: 'वॉशिंग मशीन मोटर्स, फ्रीज कॉम्प्रेसर आणि हार्ड ड्राईव्ह मॅग्नेट्स',
    marketRange: '₹54 – ₹64 / kg',
    trend: 'stable',
    trendPercent: '+1.5%',
    hazardousNote: 'Contains heavy copper windings and rare-earth neodymium elements.',
  },
  {
    key: 'mixed_plastics',
    label: 'Mixed E-Waste Plastics (ABS / HIPS Casings)',
    labelHi: 'ई-कचरा हार्ड प्लास्टिक (ABS / HIPS)',
    labelMr: 'ई-कचरा कठीण प्लास्टिक (ABS / HIPS)',
    short: 'Plastics',
    rate: 18,
    kg: 0,
    color: '#64748b',
    category: 'plastic',
    description: 'Printer shells, computer tower bezels, keyboard bodies, appliance plastic covers',
    descriptionHi: 'प्रिंटर, सीपीयू बॉडी, कीबोर्ड और इलेक्ट्रॉनिक्स के बाहरी प्लास्टिक खोल',
    descriptionMr: 'प्रिंटर कव्हर, संगणक बॉडी, कीबोर्ड आणि उपकरणांचे प्लास्टिक आवरण',
    marketRange: '₹16 – ₹22 / kg',
    trend: 'down',
    trendPercent: '-2.1%',
    hazardousNote: 'Segregate flame-retardant plastics for authorized granulator shredding.',
  },
  {
    key: 'iron',
    label: 'Scrap Iron & Structural Steel',
    labelHi: 'लोहा स्क्रैप व स्टील सरिया',
    labelMr: 'लोखंड भंगार व स्टील',
    short: 'Iron',
    rate: 34,
    kg: 4,
    color: '#334155',
    category: 'metal',
    description: 'Computer casing frames, metallic racks, appliance chasses, steel brackets',
    descriptionHi: 'कंप्यूटर कैबिनेट, लोहे के एंगल, मशीन के पुर्जे व ग्रिल',
    descriptionMr: 'संगणक कॅबिनेट, अँगल रॉड्स, मशिनचे सुटे भाग व लोखंडी पत्रे',
    marketRange: '₹32 – ₹37 / kg',
    trend: 'up',
    trendPercent: '+3.1%',
  },
  {
    key: 'cardboard',
    label: 'Corrugated Cardboard (Gatta Packaging)',
    labelHi: 'पैकिंग का गत्ता (कार्टन बॉक्स)',
    labelMr: 'पुठ्ठा आणि खोके (कार्टन बॉक्स)',
    short: 'Cardboard',
    rate: 14,
    kg: 5,
    color: '#b45309',
    category: 'paper',
    description: 'Clean shipping boxes, appliance packing cartons, unsoiled cardboard sheets',
    descriptionHi: 'साफ डिलीवरी बॉक्स, टीवी पैकिंग के गत्ते व सूखी कार्टन शीट',
    descriptionMr: 'स्वच्छ पार्सल बॉक्स, टीव्ही पॅकिंग पुठ्ठे व कोरडे कार्टन',
    marketRange: '₹12 – ₹16 / kg',
    trend: 'stable',
    trendPercent: '0.0%',
  },
  {
    key: 'newspaper',
    label: 'Old Newspapers & Office Paper (Raddi)',
    labelHi: 'रद्दी अखबार व सफेद कागजात',
    labelMr: 'जुनी वर्तमानपत्रे व कागद (रद्दी)',
    short: 'Paper',
    rate: 16,
    kg: 6,
    color: '#15803d',
    category: 'paper',
    description: 'Bundled daily broadsheets, magazines, office reports, textbooks',
    descriptionHi: 'अखबार के बंडल, मैगजीन, दफ्तरी दस्तावेज और कॉपियां',
    descriptionMr: 'वर्तमानपत्रांचे बंडल, मासिके, वह्या आणि कार्यालयीन कागदपत्रे',
    marketRange: '₹15 – ₹18 / kg',
    trend: 'up',
    trendPercent: '+1.8%',
  },
];

export const safetyGuides: SafetyGuideItem[] = [
  {
    id: 'sg-cables',
    title: 'Stop Open-Air Cable Burning',
    titleHi: 'केबलों को खुले में जलाना बंद करें',
    titleMr: 'केबल्स व तारा उघड्यावर जाळणे पूर्णपणे थांबवा',
    dangerDescription:
      'Burning insulated cables releases toxic dioxins, furans, and black soot. Inhaling these causes permanent lung damage and cancer. Burning also oxidizes copper, reducing its weight and market purity by up to 35%.',
    dangerDescriptionHi:
      'तारों को जलाने से जहरीला डाइऑक्सिन धुआं निकलता है जो फेफड़ों को भारी नुकसान पहुंचाता है। आग से तांबा जलकर काला हो जाता है और उसका वजन व कीमत 35% तक घट जाती है।',
    dangerDescriptionMr:
      'वायर जाळल्याने अत्यंत विषारी धूर हवेत पसरतो, ज्यामुळे फुप्फुसांचे गंभीर आजार होतात. शिवाय तांबे जळून काळे पडल्याने त्याचे वजन आणि बाजारातील भाव ३५% टक्क्यांनी कमी होतो.',
    safePractice:
      'Use hand cable-stripping tools or sell intact cables directly to authorized recyclers who operate automated mechanical cable granulators.',
    safePracticeHi:
      'हाथ से तार छीलने वाले कटर का उपयोग करें या सीधे अधिकृत रीसाइक्लर को बिना जलाए सौंपें जो मशीनी कटर से पूरा शुद्ध तांबा निकालते हैं।',
    safePracticeMr:
      'हात-कटरने वायर सोला किंवा अधिकृत रीसायकलर्सना थेट अखंड केबल द्या, जिथे अत्याधुनिक मशिनने स्वच्छ तांबे वेगळे केले जाते.',
    economicBenefit:
      'Earn ₹220/kg for intact copper cables at authorized hub vs only ₹160/kg for soot-damaged burnt copper.',
    economicBenefitHi:
      'अधिकृत केंद्र पर स्वच्छ केबल का ₹220/किग्रा मिलता है, जबकि जलाए हुए तांबे का सिर्फ ₹160/किग्रा ही मिल पाता है।',
    economicBenefitMr:
      'अधिकृत केंद्रावर अखंड केबलला ₹२२०/कि.ग्रॅ. मिळतात, तर जाळलेल्या खराब तांब्याला केवळ ₹१६०/कि.ग्रॅ. मिळतात.',
    audioSpeechText:
      'Warning: Do not burn cables. It creates cancer-causing smoke and reduces your copper profits. Sell intact cables directly to authorized recyclers.',
    audioSpeechTextHi:
      'सावधान: केबलों को कभी न जलाएं। इससे जहरीला धुआं निकलता है और तांबे का दाम भी कम हो जाता है। साफ केबल अधिकृत रीसाइक्लर को बेचें।',
    audioSpeechTextMr:
      'सावधान: वायर कधीही जाळू नका. त्यामुळे विषारी धूर होतो आणि तांब्याची किंमत घटते. अधिकृत केंद्रात स्वच्छ केबल विकून अधिक नफा मिळवा.',
    iconName: 'Flame',
    severity: 'critical',
  },
  {
    id: 'sg-acid',
    title: 'Eliminate Backyard Acid Leaching of PCBs',
    titleHi: 'सर्किट बोर्ड्स (PCBs) पर एसिड डालना बंद करें',
    titleMr: 'सर्किट बोर्ड्सवर ॲसिड वापरणे टाळा',
    dangerDescription:
      'Dunking motherboards into nitric acid or cyanide baths causes severe chemical burns, blindness, and lethal toxic gas plumes. Informal acid dumps poison ground soil and local water wells.',
    dangerDescriptionHi:
      'मदरबोर्ड से सोना निकालने के लिए तेजाब का उपयोग करना बेहद जानलेवा है। इससे आंखों की रोशनी जा सकती है और जहरीली गैस से दम घुट सकता है।',
    dangerDescriptionMr:
      'मदरबोर्डमधून सोने किंवा धातू काढण्यासाठी ॲसिड वापरल्याने हात भाजणे, अंधत्व आणि विषारी वायूचा धोका संभवतो. हा कचरा पाणी आणि जमीन दूषित करतो.',
    safePractice:
      'Store intact circuit boards in dry plastic crates. Authorized hydrometallurgical facilities extract 99% gold, palladium, copper, and tin in closed-loop systems with certified safety.',
    safePracticeHi:
      'सर्किट बोर्ड्स को सूखा रखें और बिना तोड़े अधिकृत रीसाइक्लर को दें। आधुनिक कारखानों में सुरक्षित तरीके से पूरा कीमती धातु निकाला जाता है।',
    safePracticeMr:
      'सर्किट बोर्ड्स न तोडता कोरड्या क्रेटमध्ये साठवा. अधिकृत रिसायकलिंग प्लांट्स आधुनिक तंत्रज्ञानाने सुरक्षितपणे मौल्यवान धातू वेगळे करतात.',
    economicBenefit:
      'CPCB authorized recyclers pay ₹285/kg upfront without you spending money on hazardous acid barrels.',
    economicBenefitHi:
      'अधिकृत रीसाइक्लर ₹285/किग्रा का तुरंत नकद भुगतान करते हैं और आपको तेजाब खरीदने पर फालतू खर्च नहीं करना पड़ता।',
    economicBenefitMr:
      'अधिकृत रीसायकलर्स रोख ₹२८५/कि.ग्रॅ. दर देतात, आणि घातक ॲसिड खरेदीचा खर्चही वाचतो.',
    audioSpeechText:
      'Caution: Never use acid on circuit boards. It causes blindness and toxic poisoning. Hand over intact boards to authorized e-waste recyclers for top prices.',
    audioSpeechTextHi:
      'सावधानी: सर्किट बोर्ड पर कभी तेजाब न डालें। यह अंधापन और फेफड़ों की बीमारी करता है। इसे सीधे अधिकृत ई-कचरा रीसाइक्लर को दें।',
    audioSpeechTextMr:
      'दक्षता: सर्किट बोर्डवर कधीही ॲसिड टाकू नका. हे डोळ्यांसाठी आणि फुप्फुसांसाठी प्राणघातक आहे. अधिकृत केंद्रात देऊन पूर्ण मोबदला मिळवा.',
    iconName: 'FlaskConical',
    severity: 'critical',
  },
  {
    id: 'sg-batteries',
    title: 'Safe Handling of Lithium & Lead Batteries',
    titleHi: 'लिथियम व लेड-एसिड बैटरी की सुरक्षित संभाल',
    titleMr: 'लिथियम व लेड बॅटरी सुरक्षित हाताळणी',
    dangerDescription:
      'Crushing or puncturing smartphone and laptop batteries causes spontaneous thermal runaway explosions and intense chemical fires. Dropping car/inverter batteries causes sulfuric acid chemical burns.',
    dangerDescriptionHi:
      'मोबाइल या लैपटॉप की बैटरी को दबाने या हथौड़े से तोड़ने पर तुरंत भयंकर आग लग सकती है। इनवर्टर बैटरी के तेजाब से त्वचा बुरी तरह जल सकती है।',
    dangerDescriptionMr:
      'मोबाईल किंवा लॅपटॉपच्या बॅटरीवर हातोडा मारल्यास किंवा ती वाकवल्यास स्फोट होऊन आग लागू शकते. मोठ्या बॅटऱ्यांमधील ॲसिड गळतीमुळे कातडी जळू शकते.',
    safePractice:
      'Always tape exposed battery terminals with insulation tape. Store in a dry, ventilated plastic container away from flammable papers or direct sunlight.',
    safePracticeHi:
      'बैटरी के दोनों सिरों पर इंसुलेशन टेप लगाएं। इन्हें धूप और पानी से दूर प्लास्टिक के सूखे बक्से में सुरक्षित रखें।',
    safePracticeMr:
      'बॅटरीच्या दोन्ही टोकांवर इन्सुलेशन टेप लावा. उष्णता व पावसापासून लांब कोरड्या प्लास्टिकच्या पेटीत साठवा.',
    economicBenefit:
      'Intact, untampered lithium and lead batteries fetch certified EPR rate of ₹95/kg to ₹110/kg.',
    economicBenefitHi:
      'बिना टूटी-फूटी सुरक्षित बैटरियों पर अधिकृत ईपीआर केंद्र ₹95 से ₹110 प्रति किलो का पक्का भाव देते हैं।',
    economicBenefitMr:
      'सुस्थितीतील बॅटरीला अधिकृत केंद्रावर ₹९५ ते ₹११० प्रति किलो खात्रीशीर दर मिळतो.',
    audioSpeechText:
      'Battery alert: Do not crush or hammer batteries. Cover terminals with tape and store in dry bins to prevent explosive fires.',
    audioSpeechTextHi:
      'बैटरी चेतावनी: बैटरी को कभी न तोड़ें और न ही हथौड़ा मारें। सिरों पर टेप लगाएं ताकि आग न लगे।',
    audioSpeechTextMr:
      'बॅटरी सूचना: बॅटरी कधीही आपटू किंवा कापू नका. आगीचा धोका टाळण्यासाठी टोकांवर टेप लावून सुरक्षित ठेवा.',
    iconName: 'BatteryCharging',
    severity: 'high',
  },
  {
    id: 'sg-crt',
    title: 'Prevent CRT Picture Tube Implosion & Lead Release',
    titleHi: 'सीआरटी पिक्चर ट्यूब को टूटने और फूटने से बचाएं',
    titleMr: 'सीआरटी पिक्चर ट्यूब फुटण्यापासून वाचवा',
    dangerDescription:
      'Smashing the neck of a CRT monitor causes violent vacuum implosion, spraying razor-sharp glass shards up to 10 feet. It also pulverizes 2 to 3 kg of hazardous lead and cadmium phosphor powder.',
    dangerDescriptionHi:
      'पुराने टीवी की पिक्चर ट्यूब को हथौड़े से तोड़ने पर वह वैक्यूम से फट जाती है और कांच दूर तक उड़ता है। इसमें 2 से 3 किलो जहरीला सीसा (Lead) होता है जो सांस में चला जाता है।',
    dangerDescriptionMr:
      'सीआरटी काच फोडल्यास व्हॅक्यूममुळे काचेचे तुकडे उडून मोठा अपघात होऊ शकतो. तसेच त्यातील विषारी शिसे (Lead) हवेत मिसळून शरीरास घातक ठरते.',
    safePractice:
      'Transport CRT units with the screen facing flat downward. Never break the glass funnel or neck. Deliver intact to authorized dismantling facilities.',
    safePracticeHi:
      'पिक्चर ट्यूब को कभी न तोड़ें। इसे सीधा या कपड़े पर रखकर अधिकृत डिस्मेंटलिंग सेंटर तक अखंड पहुंचाएं।',
    safePracticeMr:
      'पिक्चर ट्यूब कधीही फोडू नका. अखंड स्थितीतच अधिकृत ई-कचरा केंद्रावर सुरक्षितपणे सुपूर्द करा.',
    economicBenefit:
      'Authorized centers accept intact CRT units for compliant recycling at ₹26/kg.',
    economicBenefitHi:
      'साबुत सुरक्षित सीआरटी को अधिकृत केंद्र ₹26 प्रति किलो पर स्वीकार करते हैं।',
    economicBenefitMr:
      'अखंड सीआरटी युनिट्स अधिकृत केंद्रात ₹२६/कि.ग्रॅ. दराने स्वीकारले जातात.',
    audioSpeechText:
      'CRT safety: Never smash CRT glass. It contains toxic lead and can implode with flying glass. Keep picture tubes intact.',
    audioSpeechTextHi:
      'सीआरटी सुरक्षा: पिक्चर ट्यूब को कभी न फोड़ें। इसमें जहरीला सीसा होता है और कांच उड़ने का खतरा रहता है।',
    audioSpeechTextMr:
      'सीआरटी सुरक्षा: पिक्चर ट्यूब कधीही फोडू नका. त्यात विषारी शिसे असते आणि काच उडण्याचा धोका असतो.',
    iconName: 'Tv2',
    severity: 'high',
  },
];

export const authorizedRecyclers: AuthorizedRecycler[] = [
  {
    id: 'rec-01',
    name: 'EcoRecycle CleanTech Hub (CPCB Approved)',
    facilityLocation: 'Plot 48, Sector V Industrial Corridor, Salt Lake',
    city: 'Kolkata, WB',
    authorizationNumber: 'CPCB/EPR-EW/2023-WB0041',
    authorizationStatus: 'CPCB Authorized',
    validUntil: '31-Dec-2028',
    contactPerson: 'Arunav Banerjee (Plant Head)',
    phone: '+91 98302 44102',
    acceptedMaterials: ['pcb', 'cables', 'batteries', 'lcd', 'crt', 'motors', 'mixed_plastics'],
    offeredRates: {
      pcb: 290,
      cables: 225,
      batteries: 98,
      motors: 60,
      lcd: 54,
      crt: 28,
      mixed_plastics: 19,
    },
    pickupAvailability: 'Direct Hub Drop-off',
    serviceArea: 'Salt Lake, New Town, Lake Town & Rajarhat',
    distanceKm: 2.4,
  },
  {
    id: 'rec-02',
    name: 'GreenHydromet E-Waste Recovery Aggregators',
    facilityLocation: 'Block B-12, Kasba Industrial Estate, Phase II',
    city: 'Kolkata, WB',
    authorizationNumber: 'WBPCB/HW/EPR-2024-KOL8921',
    authorizationStatus: 'State PCB Approved',
    validUntil: '15-Mar-2027',
    contactPerson: 'Sujata Sen (Operations Director)',
    phone: '+91 98310 99841',
    acceptedMaterials: ['pcb', 'cables', 'batteries', 'motors'],
    offeredRates: {
      pcb: 295,
      cables: 222,
      batteries: 96,
      motors: 62,
    },
    pickupAvailability: 'On-demand Trike',
    serviceArea: 'Ballygunge, Kasba, Gariahat, Jadavpur & Ruby Crossing',
    distanceKm: 1.1,
  },
  {
    id: 'rec-03',
    name: 'Apex Circular Battery & Metals Hub',
    facilityLocation: '74, Taratala Industrial Complex, Diamond Harbour Road',
    city: 'Kolkata, WB',
    authorizationNumber: 'CPCB/BAT-REG/2023-0914',
    authorizationStatus: 'CPCB Authorized',
    validUntil: '20-Oct-2029',
    contactPerson: 'Mohammad Farooq (Logistics Incharge)',
    phone: '+91 98360 11200',
    acceptedMaterials: ['batteries', 'motors', 'iron', 'cables'],
    offeredRates: {
      batteries: 102,
      motors: 61,
      cables: 224,
      iron: 35,
    },
    pickupAvailability: 'Collector Pickup Available',
    serviceArea: 'Behala, Alipore, Kidderpore & Taratala Belt',
    distanceKm: 4.8,
  },
  {
    id: 'rec-04',
    name: 'CleanEarth Certified EPR Polymers & Display Facility',
    facilityLocation: 'Jalan Complex, Industrial Gate 3, Dhulagarh',
    city: 'Howrah, WB',
    authorizationNumber: 'CPCB/EPR-PL/2022-IN9941',
    authorizationStatus: 'EPR Registered',
    validUntil: '12-Jun-2027',
    contactPerson: 'Debabrata Ghosh',
    phone: '+91 98305 77610',
    acceptedMaterials: ['mixed_plastics', 'lcd', 'crt', 'cardboard'],
    offeredRates: {
      mixed_plastics: 20,
      lcd: 55,
      crt: 27,
      cardboard: 15,
    },
    pickupAvailability: 'Direct Hub Drop-off',
    serviceArea: 'Howrah, Central Kolkata & Hooghly Axis',
    distanceKm: 8.5,
  },
];

export const defaultHouseholdUser: AuthUser = {
  id: 'usr-household-101',
  role: 'household',
  name: 'Deblina Mukherjee',
  phone: '+91 98301 44829',
  address: 'Flat 3B, Ballygunge Park Road, Ballygunge',
  zone: 'Ballygunge Ward 69',
  completedTrips: 7,
  preferredLanguage: 'en',
};

export const defaultCollectorUser: AuthUser = {
  id: 'usr-collector-204',
  role: 'collector',
  name: 'Raju Das (Field Partner)',
  phone: '+91 98312 77410',
  partnerId: 'KC-EPR-204',
  zone: 'South Kolkata & Central Route Cluster',
  vehicle: 'Electric Cargo Trike (WB-02-AK-4192)',
  rating: 4.9,
  completedTrips: 184,
  preferredLanguage: 'hi',
};

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export function formatTimestamp(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
      ' · ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    );
  } catch {
    return dateStr;
  }
}

export function deriveArea(address: string): string {
  if (!address || !address.trim()) return 'Local Area';
  const parts = address
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return parts.length > 2 ? parts[parts.length - 2] : parts[parts.length - 1];
  }
  return parts[0] || 'Local Area';
}

export function deriveUrgency(slot: string): 'urgent' | 'express' | 'standard' {
  const lower = (slot || '').toLowerCase();
  if (lower.includes('urgent') || lower.includes('min') || lower.includes('now') || lower.includes('priority')) {
    return 'urgent';
  }
  if (lower.includes('today')) {
    return 'express';
  }
  return 'standard';
}

export interface CalculatedPayoutEstimate {
  minKg: number;
  maxKg: number;
  weightRangeLabel: string;
  minPayout: number;
  maxPayout: number;
  payoutRangeLabel: string;
  targetPayout: number;
  effectiveRatePerKg: number;
}

export function getCalculatedPayoutEstimate(job: Pickup): CalculatedPayoutEstimate {
  const estKg = Math.max(1, job.estimatedKg || 1);
  const targetPayout = job.payout || 0;
  const effectiveRatePerKg = targetPayout / estKg;

  const minKg = estKg <= 10 
    ? Math.max(1, Math.round(estKg * 0.85 * 10) / 10)
    : Math.round(estKg * 0.85);
  const maxKg = estKg <= 10 
    ? Math.round(estKg * 1.18 * 10) / 10 
    : Math.round(estKg * 1.18);

  const minPayout = Math.max(30, Math.round(minKg * effectiveRatePerKg));
  const maxPayout = Math.max(minPayout + 10, Math.round(maxKg * effectiveRatePerKg));

  return {
    minKg,
    maxKg,
    weightRangeLabel: `${minKg} – ${maxKg} kg`,
    minPayout,
    maxPayout,
    payoutRangeLabel: `${formatINR(minPayout)} – ${formatINR(maxPayout)}`,
    targetPayout,
    effectiveRatePerKg: Math.round(effectiveRatePerKg),
  };
}

export const seedPickups: Pickup[] = [
  {
    id: 'KC-1052',
    userId: 'usr-household-105',
    userName: 'Rajesh Gopinath',
    userPhone: '+91 98300 23145',
    address: '14/2, Gariahat Road, Dover Terrace, Ballygunge',
    area: 'Ballygunge',
    landmark: 'Near Gariahat Crossing & Pantaloons',
    lat: 22.5186,
    lng: 88.3644,
    distanceKm: 0.5,
    slot: '⚡ Urgent · Next 45 Mins (Priority)',
    urgency: 'urgent',
    materials: [
      { key: 'pcb', label: 'Circuit Boards (PCBs)', kg: 3.5, rate: 285 },
      { key: 'cables', label: 'Copper Cables & Wiring', kg: 5.0, rate: 220 },
    ],
    estimatedKg: 8.5,
    payout: 2097,
    status: 'pending',
    verificationOtp: '5192',
    notes: 'Decommissioned PC motherboards & heavy copper power wires ready in lobby',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Priority Urgent Pickup Logged',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        note: 'High-value e-waste priority request in Ballygunge.',
      },
    ],
  },
  {
    id: 'KC-1051',
    userId: 'usr-household-106',
    userName: 'Sunita Agarwal',
    userPhone: '+91 98311 54220',
    address: 'Block CF-182, Sector 1, Salt Lake City',
    area: 'Salt Lake',
    landmark: 'Near City Centre 1 & Vidyasagar Mancha',
    lat: 22.5867,
    lng: 88.4069,
    distanceKm: 3.2,
    slot: 'Today · 4:30 PM – 6:30 PM',
    urgency: 'express',
    materials: [
      { key: 'cardboard', label: 'Corrugated Cardboard (Gatta)', kg: 28, rate: 14 },
      { key: 'mixed_plastics', label: 'E-Waste Mixed Plastics', kg: 8, rate: 18 },
      { key: 'batteries', label: 'Lithium-ion Batteries', kg: 2, rate: 95 },
    ],
    estimatedKg: 38,
    payout: 726,
    status: 'pending',
    verificationOtp: '4081',
    notes: 'Carton bundles and plastic printer housings with small UPS battery',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Carton & E-Waste Pickup Logged',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        note: 'Awaiting collector with vehicle capacity > 35kg in Salt Lake.',
      },
    ],
  },
  {
    id: 'KC-1050',
    userId: 'usr-household-107',
    userName: 'Kunal Singhania (DesignLab)',
    userPhone: '+91 98360 88201',
    address: 'Ecospace Business Park, Plot 2A, Action Area II, New Town',
    area: 'New Town',
    landmark: 'Opposite Kolkata Gate / Near Convention Centre',
    lat: 22.5855,
    lng: 88.4712,
    distanceKm: 5.4,
    slot: 'Tomorrow · 10:00 AM – 12:00 PM',
    urgency: 'standard',
    materials: [
      { key: 'lcd', label: 'LCD & LED Display Panels', kg: 14, rate: 52 },
      { key: 'pcb', label: 'Printed Circuit Boards', kg: 4, rate: 285 },
    ],
    estimatedKg: 18,
    payout: 1868,
    status: 'pending',
    verificationOtp: '9234',
    notes: 'Decommissioned flat workstation displays and controller cards',
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Display & PCB Pickup Scheduled',
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        note: 'Scheduled for certified recycling stream in New Town.',
      },
    ],
  },
  {
    id: 'KC-1049',
    userId: 'usr-household-101',
    userName: 'Deblina Mukherjee',
    userPhone: '+91 98301 44829',
    address: 'Flat 3B, Ballygunge Park Road, Ballygunge',
    area: 'Ballygunge',
    landmark: 'Near Birla Mandir & Ice Skating Rink',
    lat: 22.5312,
    lng: 88.3615,
    distanceKm: 0.6,
    slot: 'Today · 3:30 PM – 5:30 PM',
    urgency: 'express',
    materials: [
      { key: 'cables', label: 'Copper Cables & Wiring', kg: 2.5, rate: 220 },
      { key: 'newspaper', label: 'Old Newspapers (Raddi)', kg: 6, rate: 16 },
      { key: 'iron', label: 'Scrap Iron & Metals', kg: 4, rate: 34 },
    ],
    estimatedKg: 12.5,
    payout: 782,
    status: 'accepted',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das',
    collectorPhone: '+91 98312 77410',
    collectorVehicle: 'Electric Cargo Trike (WB-02-AK-4192)',
    etaMinutes: 8,
    verificationOtp: '7412',
    notes: 'Please ring bell 3B; elevator available',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Pickup Request Logged',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        note: 'Requested 12.5 kg scrap pickup via resident portal.',
      },
      {
        status: 'accepted',
        title: 'Collector Assigned & En Route',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        note: 'Raju Das accepted the route. ETA ~8 mins.',
      },
    ],
  },
  {
    id: 'KC-1048',
    userId: 'usr-household-102',
    userName: 'Vikram Mehta',
    userPhone: '+91 98305 91223',
    address: '28A, Mother Teresa Sarani (Park Street), Camac Street Crossing',
    area: 'Park Street',
    landmark: 'Behind Allen Park, Near Flurys',
    lat: 22.5516,
    lng: 88.3533,
    distanceKm: 1.4,
    slot: '⚡ Urgent · Within 1 Hour',
    urgency: 'urgent',
    materials: [
      { key: 'motors', label: 'Motors & Magnet Assemblies', kg: 12, rate: 58 },
      { key: 'cables', label: 'Copper Cables & Wiring', kg: 4, rate: 220 },
    ],
    estimatedKg: 16,
    payout: 1576,
    status: 'pending',
    verificationOtp: '3920',
    notes: 'Heavy AC motor core and thick copper conduits',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Pickup Request Logged',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        note: 'Broadcasted to certified partners in Park Street cluster.',
      },
    ],
  },
  {
    id: 'KC-1046',
    userId: 'usr-household-101',
    userName: 'Deblina Mukherjee',
    userPhone: '+91 98301 44829',
    address: 'Flat 3B, Ballygunge Park Road, Ballygunge',
    area: 'Ballygunge',
    landmark: 'Near Birla Mandir & Ice Skating Rink',
    slot: 'Yesterday · 11:00 AM – 1:00 PM',
    materials: [
      { key: 'pcb', label: 'Printed Circuit Boards', kg: 3, rate: 285 },
      { key: 'newspaper', label: 'Old Newspapers (Raddi)', kg: 8, rate: 16 },
    ],
    estimatedKg: 11,
    finalKg: 11.8,
    payout: 983,
    status: 'completed',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das',
    collectorPhone: '+91 98312 77410',
    collectorVehicle: 'Electric Cargo Trike (WB-02-AK-4192)',
    verificationOtp: '6521',
    createdAt: '2026-09-17T09:15:00.000Z',
    acceptedAt: '2026-09-17T09:30:00.000Z',
    arrivedAt: '2026-09-17T11:20:00.000Z',
    completedAt: '2026-09-17T11:38:00.000Z',
    rating: {
      stars: 5,
      tags: ['Punctual & Prompt', 'Accurate Scale Weighing', 'Paid Cash Instantly'],
      comment: 'Raju arrived with clean electronic scales and paid exact cash without delay.',
      ratedAt: '2026-09-17T12:05:00.000Z',
    },
    timeline: [
      {
        status: 'pending',
        title: 'Pickup Request Logged',
        timestamp: '2026-09-17T09:15:00.000Z',
        note: 'Requested 11 kg pickup.',
      },
      {
        status: 'accepted',
        title: 'Collector Assigned',
        timestamp: '2026-09-17T09:30:00.000Z',
        note: 'Raju Das assigned.',
      },
      {
        status: 'arrived',
        title: 'Arrived at Address',
        timestamp: '2026-09-17T11:20:00.000Z',
        note: 'Collector arrived on site.',
      },
      {
        status: 'completed',
        title: 'Weighed & Paid in Cash',
        timestamp: '2026-09-17T11:38:00.000Z',
        note: 'Weight recorded: 11.8 kg. Payout: ₹983 handed over in cash.',
      },
    ],
  },
];

export const seedDigitalLots: DigitalLot[] = [
  {
    id: 'LOT-KOL-8841',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das',
    title: 'High-Grade Computer & Telecom Motherboards',
    category: 'pcb',
    approxWeightKg: 18.5,
    estimatedValue: 5272,
    condition: 'Separated',
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    location: 'Kasba Secondary Aggregation Point, Kolkata',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: 'available',
  },
  {
    id: 'LOT-KOL-8840',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das',
    title: 'Stripped & Coiled Heavy Copper Power Cables',
    category: 'cables',
    approxWeightKg: 24.0,
    estimatedValue: 5280,
    condition: 'Separated',
    photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    location: 'Ballygunge Field Trike Depot',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    status: 'matched',
    matchedRecyclerId: 'rec-01',
  },
  {
    id: 'LOT-KOL-8839',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das',
    title: 'Inverter Lead-Acid and UPS Battery Modules',
    category: 'batteries',
    approxWeightKg: 32.0,
    estimatedValue: 3040,
    condition: 'Intact',
    photoUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    location: 'South Kolkata Yard Hub',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'handed_over',
    matchedRecyclerId: 'rec-03',
  },
];

export const seedHandoverRecords: HandoverRecord[] = [
  {
    id: 'ho-rec-091',
    referenceCode: 'EPR-KOL-2026-7841',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das (Field Partner)',
    recyclerId: 'rec-02',
    recyclerName: 'GreenHydromet E-Waste Recovery Aggregators',
    facilityLocation: 'Block B-12, Kasba Industrial Estate, Phase II, Kolkata',
    materials: [
      { key: 'pcb', label: 'Circuit Boards (PCBs)', kg: 14.2, rate: 295, subtotal: 4189 },
      { key: 'cables', label: 'Copper Cables', kg: 8.5, rate: 222, subtotal: 1887 },
    ],
    totalKg: 22.7,
    totalPayout: 6076,
    paymentMode: 'Cash at Hub',
    paymentStatus: 'paid',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    gpsLocation: '22.5135° N, 88.3842° E (Kasba Industrial)',
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    recyclerConfirmed: true,
    notes: 'Verified via certified hydraulic scale. Cash handed over at weighbridge window.',
  },
  {
    id: 'ho-rec-090',
    referenceCode: 'EPR-KOL-2026-6120',
    collectorId: 'usr-collector-204',
    collectorName: 'Raju Das (Field Partner)',
    recyclerId: 'rec-01',
    recyclerName: 'EcoRecycle CleanTech Hub (CPCB Approved)',
    facilityLocation: 'Plot 48, Sector V Industrial Corridor, Salt Lake, Kolkata',
    materials: [
      { key: 'lcd', label: 'LCD Panels', kg: 18.0, rate: 54, subtotal: 972 },
      { key: 'mixed_plastics', label: 'ABS E-Waste Plastics', kg: 26.5, rate: 19, subtotal: 504 },
    ],
    totalKg: 44.5,
    totalPayout: 1476,
    paymentMode: 'Instant Bank Transfer / UPI',
    paymentStatus: 'paid',
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    gpsLocation: '22.5810° N, 88.4312° E (Sector V Hub)',
    photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    recyclerConfirmed: true,
    notes: 'Direct trike drop-off batch. Digital transfer credited instantly.',
  },
];

// LocalStorage helpers
export function readPickupsFromStorage(): Pickup[] {
  if (typeof window === 'undefined') return seedPickups;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PICKUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PICKUPS, JSON.stringify(seedPickups));
      return seedPickups;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedPickups;
  } catch {
    return seedPickups;
  }
}

export function savePickupsToStorage(pickups: Pickup[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PICKUPS, JSON.stringify(pickups));
    window.dispatchEvent(new Event(UPDATE_EVENT_PICKUPS));
  } catch (err) {
    console.error('Failed saving pickups to localStorage:', err);
  }
}

export function readAuthUserFromStorage(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthUserToStorage(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
    window.dispatchEvent(new Event(UPDATE_EVENT_AUTH));
  } catch (err) {
    console.error('Failed saving auth to localStorage:', err);
  }
}

export function readDigitalLotsFromStorage(): DigitalLot[] {
  if (typeof window === 'undefined') return seedDigitalLots;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(seedDigitalLots));
      return seedDigitalLots;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedDigitalLots;
  } catch {
    return seedDigitalLots;
  }
}

export function saveDigitalLotsToStorage(lots: DigitalLot[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(lots));
  } catch (err) {
    console.error('Failed saving digital lots:', err);
  }
}

export function readHandoversFromStorage(): HandoverRecord[] {
  if (typeof window === 'undefined') return seedHandoverRecords;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HANDOVERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HANDOVERS, JSON.stringify(seedHandoverRecords));
      return seedHandoverRecords;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedHandoverRecords;
  } catch {
    return seedHandoverRecords;
  }
}

export function saveHandoversToStorage(handovers: HandoverRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_HANDOVERS, JSON.stringify(handovers));
  } catch (err) {
    console.error('Failed saving handovers:', err);
  }
}

export function readLanguageFromStorage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (raw === 'hi' || raw === 'mr' || raw === 'en') {
      return raw as Language;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguageToStorage(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  } catch (err) {
    console.error('Failed saving language preference:', err);
  }
}

