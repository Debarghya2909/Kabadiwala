import { useState, useEffect } from 'react';
import { Language, MaterialKey } from '../types';

export const LANGUAGE_STORAGE_KEY = 'kabadiwala_preferred_language';

export const languageNames: Record<Language, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  bn: { label: 'Bengali', native: 'বাংলা' },
};

export const translations = {
  en: {
    appTitle: 'Kabadiwala Connect',
    appSubtitle: 'Formal E-Waste & Scrap Recycling Network',
    tagline: 'Bridging informal waste collectors directly with authorized recyclers under EPR rules.',
    signOut: 'Sign Out',
    citizenPortal: 'Household / Citizen',
    collectorPortal: 'Informal Collector / Field Partner',
    recyclerPortal: 'Authorized Recycler & ESG Hub',
    language: 'Language',

    // Top Banners & Hero
    urbanMissionBanner: 'National Urban Waste Mission • Formal Municipal E-Waste & Scrap Network',
    loginHeroTitle: 'Institutional Solid Waste Segregation & Formal E-Waste Network',
    loginHeroSubtitle: 'Connecting households directly with informal waste collectors, on-site verified digital scales, and authorized CPCB recycling yards under EPR 2022.',
    featureNoMaps: '100% Manual Address (No Maps)',
    featurePin: '4-Digit Security PIN',
    featureEpr: 'CPCB Traceability',
    heroDoorstepBadge: 'Doorstep Segregation • Digital Scale • Cash on Delivery',

    // Portals & Login Selection
    selectPortalTitle: 'Select Your Portal',
    selectPortalSubtitle: 'Choose your role in the three-sided recycling ecosystem to enter your dedicated, isolated workspace.',
    portalHouseholdTitle: '1. Household / Citizen Portal',
    portalHouseholdBadge: 'Source & Demand Side',
    portalHouseholdDesc: 'Practice source segregation across Dry Recyclables, Wet/Compostable Waste, and E-Waste. Request doorstep scrap pickups with manual address entry and live lifecycle tracking.',
    portalCollectorTitle: '2. Informal Collector / Field Partner Portal',
    portalCollectorBadge: 'Doorstep Aggregation & Scale',
    portalCollectorDesc: 'Accept nearby household requests, bring certified digital scales to doorsteps, calculate cash payouts on-site, and aggregate segregated scrap into bulk digital lots.',
    portalRecyclerTitle: '3. Authorized Recycler & Municipal ESG Desk',
    portalRecyclerBadge: 'Downstream EPR & Circularity',
    portalRecyclerDesc: 'Purchase certified bulk scrap lots, issue formal digital handover receipts, verify traceability, and monitor municipal landfill diversion under CPCB EPR rules.',
    enterHouseholdBtn: 'Enter Household Portal',
    enterCollectorBtn: 'Enter Collector Portal',
    enterRecyclerBtn: 'Enter Recycler & ESG Desk',
    customDemoLoginBtn: 'Custom Login Profile',

    // Footer
    footerTitle: 'Kabadiwala Connect — Formal E-Waste & Scrap Recycling Network',
    footerCompliance: 'Aligned with E-Waste (Management) Rules, 2022 & EPR Framework',

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

    // Macro Metrics
    macroTotalPickups: 'Total Pickups',
    macroTotalWeight: 'Total Weight',
    macroTotalPayout: 'Total Payout',
    macroCo2Saved: 'CO2 Saved',

    // Collector Queue
    queueSearchPlaceholder: 'Search by address, material or order ID...',
    queueEmptyTitle: 'No Open Jobs In Queue',
    queueEmptyDesc: 'All neighborhood scrap requests have been accepted or completed.',
    availableJobBadge: 'Available Job',
    residentLabel: 'Resident',
    acceptJobBtn: 'Accept Job',
    viewQueueBtn: 'View Available Pickups',

    // Scale Weighing
    scaleTitle: 'Itemized Scale Weight Calculator',
    scaleSubtitle: 'Enter measured scale weight for each separate material. Subtotals calculate automatically.',
    scaleNoActiveJob: 'No Active Job In Progress',
    scalePleaseAccept: 'Please accept a pickup request from the Available Pickups queue to begin doorstep weighing.',
    atDoorstepBadge: 'At Doorstep',
    enRouteBadge: 'En Route',
    arrivedBtn: 'I Have Arrived',
    audioScaleReadoutTitle: 'Audio Scale Readout',
    speakSummaryBtn: 'Speak Summary',
    itemizedScaleTitle: 'Itemized Digital Scale',
    verifiedKg: 'Verified Weight (KG)',
    ratePerKg: 'Rate (₹/kg)',
    subtotal: 'Subtotal',
    totalCalculatedPayout: 'Total Calculated Payout',
    confirmAndCash: 'Confirm Scale Weight & Hand Cash',
    residentOtp: 'Resident 4-Digit Security PIN',
    enterPinPlaceholder: 'Enter resident 4-digit PIN',
    pinRequiredNotice: 'Ask the resident for their 4-digit PIN shown on their screen to authorize cash handover.',
    supervisorOverride: 'Supervisor Emergency Override',
    paymentLoggedSuccess: 'Cash Payment Complete & Logged!',
    addMaterialRow: '+ Add Additional Material',
    addExtraFraction: '+ Add Extra Recyclable Fraction Found On-Site:',

    // Household Tabs
    tabSchedule: 'Schedule Pickup',
    tabTracking: 'Live Tracking',
    tabHistory: 'Order History',

    // Household Schedule Wizard
    wizardStepOf: 'Step {current} of {total}',
    step1Title: 'Source Segregation & Scrap Selection',
    step2Title: 'Doorstep Address Entry (Manual)',
    step3Title: 'Pickup Time & Instructions',
    step4Title: 'Confirm & Request Collector',
    allScrap: 'All Items',
    dryRecyclables: 'Dry Recyclables',
    wetCompostable: 'Wet / Compostable',
    ewasteElectronics: 'E-Waste (PCBs, Batteries)',
    estTotalScrap: 'Est. Total Scrap',
    liveVerifiedPayout: 'Live Verified Payout on Digital Scale',
    directCashUpi: 'Direct Cash / UPI',
    nextAddressBtn: 'Next: Doorstep Address',
    nextTimeBtn: 'Next: Time & Instructions',
    nextConfirmBtn: 'Next: Review & Confirm',
    confirmBookingBtn: 'Confirm Booking & Dispatch Collector',
    backBtn: 'Back',

    // Address Form
    manualAddressTitle: 'Enter Manual Street Address & Landmark',
    manualAddressSubtitle: 'Our verified partner arrives on an electric cargo trike with a digital scale. Enter exact flat number and nearest landmark.',
    houseFlatLabel: 'House / Flat / Building Name',
    streetAreaLabel: 'Street, Lane & Neighborhood Area',
    landmarkLabel: 'Prominent Landmark (e.g. Near Park / Metro)',
    pincodeLabel: 'Pincode',
    timeSlotTitle: 'Select Preferred Pickup Slot',
    specialInstructionsLabel: 'Special Instructions for Field Partner (Optional)',
    instructionsPlaceholder: 'e.g. Ring bell twice, heavy metal items kept in backyard...',

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
    audioPlayingNow: 'Playing Spoken Guide...',

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
    kgUnit: 'kg',
    weight: 'Weight',
    rs: '₹',
    rupees: 'Rupees',
    perKg: '₹/kg',
    urgent: 'Urgent',
    express: 'Express Today',
    standard: 'Standard',
    total: 'Total',
    rate: 'Rate',
    done: 'Done',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    phone: 'Phone',
    zone: 'Zone',
    partnerId: 'Partner ID',
    vehicle: 'Vehicle',
    registeredAddress: 'Registered Address',

    // Drawer & Profile
    profileTitle: 'User Profile & Identity',
    activeSession: 'Active Session',
    sessionLockedNotice: 'Strict Role Isolation Active. To switch portals, you must explicitly Sign Out.',
    verifiedKycBadge: 'Aadhaar & EPR KYC Verified',
    quickNav: 'Quick Navigation & Records',
    voiceEngineTitle: 'Voice Audio Engine',
    voiceEngineSubtitle: 'Verify natural speech synthesis on your device.',
    testVoiceBtn: 'Test Voice Audio',
    testVoicePlaying: 'Playing Voice Audio...',
    drawerSchedule: 'Schedule Scrap Pickup',
    drawerTracking: 'My Orders & Live Tracking',
    drawerPriceBoard: 'Daily Scrap Rate Board',
    drawerSafety: 'Field Safety Guidance',
    drawerQueue: 'Nearby Pickups Queue',
    drawerScale: 'Digital Scale Weighing',
    drawerHandover: 'Handover & Earnings Ledger',
    drawerImpact: 'Municipal & ESG Metrics',
    drawerRecyclers: 'Authorized Recycler Hubs',
    drawerCompliance: 'CPCB E-Waste Audit',

    // Bottom Nav & Additional Keys
    bottomSchedule: 'Schedule',
    bottomMyOrders: 'My Orders',
    bottomDailyRates: 'Daily Rates',
    bottomSegregation: 'Segregation',
    bottomJobQueue: 'Job Queue',
    bottomWeighing: 'Weighing',
    bottomEarnings: 'Earnings',
    bottomSafety: 'Safety',
    bottomEsgOverview: 'ESG Overview',
    bottomTraceability: 'Traceability',
    bottomBulkYards: 'Bulk Yards',
    bottomCpcbAudit: 'CPCB Audit',

    // Statuses
    statusSearching: 'Searching...',
    statusAssigned: 'Assigned to Collector',
    statusEnRoute: 'Out for Pickup',
    statusAtDoorstep: 'Out for Pickup (At Doorstep)',
    statusCompleted: 'Completed',

    // Common action strings
    pickupDetails: 'Pickup Details',
    hideDetails: 'Hide Details',
    viewLifecycle: 'View Lifecycle',
    newPickupBtn: '+ New Pickup',
    activePickupsTab: 'Active Pickups',
    completedHistoryTab: 'Completed & Past History',
    noPickupsFound: 'No Pickups Found',
    noPickupsActiveDesc: 'You have no active ongoing pickups.',
    noPickupsHistoryDesc: 'No completed pickups in your history.',
    securityPinBannerTitle: 'Your Doorstep Security PIN',
    securityPinBannerDesc: 'Share this PIN with your collector only after verifying the scale weight.',
    callPartner: 'Call Partner',
    fieldPartnerBadge: 'Field Partner',
    postPickupRatingTitle: 'Post-Pickup Rating & Segregation Audit',
    auditRecordedBadge: 'Audit Recorded',
    starsCountLabel: '{count} / 5 Stars',
    submitVerifiedRatingBtn: 'Submit Verified Rating & Audit',
    optionalCommentPlaceholder: 'Optional comment on collector service...',
    selectComplianceTags: 'Select Compliance & Quality Tags:',
    rateServiceBtn: 'Rate Collector Service',
    editRatingBtn: 'Edit Feedback',
    ratingModalTitle: 'Rate Scrap Collector Service',
    ratingModalSubtitle: 'Provide honest feedback on punctuality, scale accuracy, and demeanor.',
    ratingPendingBannerTitle: 'Feedback Pending for Completed Pickup',
    ratingPendingBannerDesc: 'Your rating empowers Raju Das and formalizes informal recycling partners.',
    rateNowBtn: 'Rate Now',
    ratingScore1: 'Poor / Unsatisfactory',
    ratingScore2: 'Needs Improvement',
    ratingScore3: 'Good & Satisfactory',
    ratingScore4: 'Very Good & Professional',
    ratingScore5: 'Outstanding & Highly Recommended!',
    feedbackSuccessToast: 'Thank you! Your feedback for {name} has been verified and saved.',
    audioListenFeedback: 'Listen to Spoken Review Summary',
    noRatingYet: 'Not Rated Yet',
    verifiedHouseholdReview: 'Verified Household Service Review',
    tagSafeHandling: 'Safe E-Waste Handling',
    tagFairPrice: 'Honored EPR Market Rates',
    tagPoliteRespectful: 'Courteous & Respectful',
    feedbackPreset1: 'Arrived right on time and weighed everything cleanly on digital scale.',
    feedbackPreset2: 'Very polite, honest weighing, and paid exact cash immediately.',
    feedbackPreset3: 'Careful with hazardous e-waste and respected segregation guidelines.',

    // Step 2 & 3 & 4 additions
    streetAddressInputLabel: 'Street Address & Flat / Building',
    streetAddressPlaceholder: 'e.g. Flat 3B, Ballygunge Park Road, Kolkata',
    landmarkInputLabel: 'Landmark / Cross Street',
    landmarkPlaceholder: 'e.g. Opposite Birla Mandir, Near Gate 2',
    selectClusterWardLabel: 'Select Cluster / Ward',
    preferredTimeSlotLabel: 'Preferred Time Slot',
    confirmedWindowBadge: 'Confirmed Window',
    specialInstructionsPlaceholder: 'e.g. Please ring bell twice; scrap is bundled in white sacks in balcony.',
    reviewBookingBtn: 'Review Booking',
    addressSummaryLabel: 'Address:',
    pickupSlotSummaryLabel: 'Pickup Slot:',
    estWeightSummaryLabel: 'Estimated Weight:',
    estCashPayoutLabel: 'Estimated Cash Payout:',
    securityPinVerificationTitle: '4-Digit Security PIN Verification',
    securityPinNoticeDesc: 'Upon arrival, your collector partner will weigh every material item on a certified digital scale. You will share your 4-digit PIN only when the scale readout matches and you receive payment.',
    broadcastRequestBtn: 'Broadcast Request to Nearby Collectors',

    // Collector Portal
    collectorAvailablePickups: 'Available Pickups',
    collectorScaleWeighing: 'Scale Weighing',
    collectorEarningsLedger: 'Earnings & Ledger',
    collectorDailyRates: 'Daily Rates',
    collectorSafetyGuide: 'Safety Guide',
    collectorTotalPickups: 'Total Pickups',
    collectorTotalWeight: 'Total Weight',
    collectorTotalPayout: 'Total Payout',
    collectorCo2Saved: 'CO2 Saved',
    searchQueuePlaceholder: 'Search by address, material or order ID...',
    allFilter: 'All',
    mixedScrapMaterials: 'Mixed Scrap Materials',
    todaySlot: 'Today',
    totalVerifiedLabel: 'Total Verified Weight:',
    totalPayoutToResident: 'Total Payout to Resident',
    confirmCashPayoutBtn: 'Confirm Cash Payout',
    requiredToCompleteHandover: 'Required to Complete Handover',
    residentSecurityCheckTip: 'Resident security check: Enter resident\'s 4-digit code displayed on their screen.',
    paidForScrapNote: 'Paid {payout} for {kg} kg scrap.',

    // Synchronized Audio Bar
    liveAudioBarTitle: 'Voice Audio Active',
    liveAudioPlayingBadge: 'Live Spoken Readout',
    spokenTranscriptLabel: 'Spoken Transcript',
  },

  hi: {
    appTitle: 'कबाड़ीवाला कनेक्ट',
    appSubtitle: 'ई-कचरा व रीसाइक्लिंग नेटवर्क',
    tagline: 'ईपीआर (EPR) नियमों के तहत अनौपचारिक कबाड़ियों को सीधे अधिकृत रीसाइक्लर्स से जोड़ना।',
    signOut: 'लॉग आउट',
    citizenPortal: 'नागरिक / घर का स्क्रैप',
    collectorPortal: 'कबाड़ीवाला साथी / फील्ड पार्टनर',
    recyclerPortal: 'अधिकृत रीसाइक्लर व ईएसजी डेस्क',
    language: 'भाषा',

    // Top Banners & Hero
    urbanMissionBanner: 'राष्ट्रीय शहरी अपशिष्ट मिशन • औपचारिक नगरपालिका ई-कचरा व रीसाइक्लिंग नेटवर्क',
    loginHeroTitle: 'संस्थागत ठोस अपशिष्ट पृथक्करण व औपचारिक ई-कचरा नेटवर्क',
    loginHeroSubtitle: 'ईपीआर 2022 के तहत घरों को सीधे अनौपचारिक कबाड़ियों, डिजिटल कांटा तौल और अधिकृत सीपीसीबी रीसाइक्लिंग यार्ड से जोड़ना।',
    featureNoMaps: '100% मैनुअल पता (बिना मैप्स)',
    featurePin: '4-अंकों का सुरक्षा पिन (PIN)',
    featureEpr: 'सीपीसीबी ईपीआर ट्रैसेबिलिटी',
    heroDoorstepBadge: 'घर पर पृथक्करण • डिजिटल कांटा तौल • मौके पर नकद भुगतान',

    // Portals & Login Selection
    selectPortalTitle: 'अपना पोर्टल चुनें',
    selectPortalSubtitle: 'अपनी समर्पित कार्यप्रणाली में प्रवेश करने के लिए रीसाइक्लिंग इकोसिस्टम में अपनी भूमिका चुनें।',
    portalHouseholdTitle: '1. नागरिक / गृहस्थ पोर्टल',
    portalHouseholdBadge: 'मांग व घरेलू स्रोत',
    portalHouseholdDesc: 'सूखा कचरा, गीला कचरा और ई-कचरा अलग करें। सीधे पते पर कबाड़ीवाला साथी बुलाएं और डिजिटल कांटे पर सही तौल व नकद पाएं।',
    portalCollectorTitle: '2. कबाड़ीवाला साथी / फील्ड पार्टनर पोर्टल',
    portalCollectorBadge: 'घर-घर तौल व एकत्रीकरण',
    portalCollectorDesc: 'नजदीकी घरों के पिकअप स्वीकार करें, डिजिटल कांटे पर पारदर्शी तौल करें, नकद भुगतान करें और थोक डिजिटल लॉट बनाएं।',
    portalRecyclerTitle: '3. अधिकृत रीसाइक्लर व नगरपालिका ईएसजी डेस्क',
    portalRecyclerBadge: 'ईपीआर 2022 व रिसाइकल प्लांट',
    portalRecyclerDesc: 'कबाड़ियों से थोक स्क्रैप खरीदें, औपचारिक डिजिटल हैंडओवर रसीद जारी करें और पर्यावरण व लैंडफिल बचाव ऑडिट रिपोर्ट देखें।',
    enterHouseholdBtn: 'नागरिक पोर्टल में जाएं',
    enterCollectorBtn: 'कबाड़ीवाला पोर्टल में जाएं',
    enterRecyclerBtn: 'रीसाइक्लर व ईएसजी पोर्टल में जाएं',
    customDemoLoginBtn: 'कस्टम डेमो प्रोफाइल',

    // Footer
    footerTitle: 'कबाड़ीवाला कनेक्ट — औपचारिक ई-कचरा व स्क्रैप रीसाइक्लिंग नेटवर्क',
    footerCompliance: 'ई-कचरा (प्रबंधन) नियम, 2022 व ईपीआर फ्रेमवर्क के अनुरूप',

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

    // Macro Metrics
    macroTotalPickups: 'कुल पिकअप',
    macroTotalWeight: 'कुल वजन',
    macroTotalPayout: 'कुल भुगतान',
    macroCo2Saved: 'कार्बन बचत',

    // Collector Queue
    queueSearchPlaceholder: 'पता, सामग्री या ऑर्डर आईडी से खोजें...',
    queueEmptyTitle: 'सूची में कोई नया काम नहीं है',
    queueEmptyDesc: 'आसपास के सभी कबाड़ अनुरोध स्वीकार कर लिए गए हैं।',
    availableJobBadge: 'उपलब्ध काम',
    residentLabel: 'नागरिक',
    acceptJobBtn: 'काम स्वीकार करें',
    viewQueueBtn: 'उपलब्ध पिकअप देखें',

    // Scale Weighing
    scaleTitle: 'सामग्री अनुसार कांटा तौल',
    scaleSubtitle: 'प्रत्येक सामग्री का डिजिटल कांटे पर मापा गया वजन दर्ज करें। नकद राशि अपने-आप जुड़ जाएगी।',
    scaleNoActiveJob: 'कोई सक्रिय काम चालू नहीं है',
    scalePleaseAccept: 'घर पर जाकर तौलने के लिए कृपया उपलब्ध पिकअप सूची में से कोई पिकअप स्वीकार करें।',
    atDoorstepBadge: 'दरवाजे पर पहुंचे',
    enRouteBadge: 'रास्ते में',
    arrivedBtn: 'मैं पहुंच गया हूं',
    audioScaleReadoutTitle: 'डिजिटल कांटा आवाज',
    speakSummaryBtn: 'तौल सारांश सुनें',
    itemizedScaleTitle: 'सामग्री अनुसार डिजिटल कांटा तौल',
    verifiedKg: 'प्रमाणित वजन (किग्रा)',
    ratePerKg: 'भाव (₹/किग्रा)',
    subtotal: 'उप-योग',
    totalCalculatedPayout: 'कुल देय नकद राशि',
    confirmAndCash: 'वजन पक्का करें व नकद दें',
    residentOtp: 'नागरिक का 4-अंकों का पिन (PIN)',
    enterPinPlaceholder: 'नागरिक का 4-अंकों का पिन दर्ज करें',
    pinRequiredNotice: 'नकद भुगतान की पुष्टि के लिए नागरिक की स्क्रीन पर दिख रहा 4-अंकों का पिन पूछें।',
    supervisorOverride: 'सुपरवाइजर आपातकालीन ओवरराइड',
    paymentLoggedSuccess: 'नकद भुगतान सफल व दर्ज हुआ!',
    addMaterialRow: '+ अतिरिक्त सामग्री जोड़ें',
    addExtraFraction: '+ मौके पर मिली अतिरिक्त सामग्री जोड़ें:',

    // Household Tabs
    tabSchedule: 'पिकअप बुक करें',
    tabTracking: 'लाइव ट्रैकिंग',
    tabHistory: 'ऑर्डर इतिहास',

    // Household Schedule Wizard
    wizardStepOf: 'चरण {current} / {total}',
    step1Title: 'स्रोत पर कचरा पृथक्करण व सामग्री चयन',
    step2Title: 'घर का पता (मैनुअल प्रविष्टि)',
    step3Title: 'पिकअप समय व विशेष निर्देश',
    step4Title: 'पुष्टि करें व कबाड़ीवाला साथी बुलाएं',
    allScrap: 'सभी सामग्रियां',
    dryRecyclables: 'सूखा कचरा (कागज/प्लास्टिक/धातु)',
    wetCompostable: 'गीला / रसोई का जैविक कचरा',
    ewasteElectronics: 'ई-कचरा (सर्किट/बैटरियां)',
    estTotalScrap: 'अनुमानित कुल वजन',
    liveVerifiedPayout: 'डिजिटल कांटे पर वास्तविक नकद भुगतान',
    directCashUpi: 'सीधा नकद या यूपीआई',
    nextAddressBtn: 'आगे: घर का पता',
    nextTimeBtn: 'आगे: समय व निर्देश',
    nextConfirmBtn: 'आगे: अंतिम पुष्टि',
    confirmBookingBtn: 'बुकिंग पक्की करें व साथी बुलाएं',
    backBtn: 'वापस',

    // Address Form
    manualAddressTitle: 'सड़क का नाम, मकान संख्या व लैंडमार्क लिखें',
    manualAddressSubtitle: 'हमारे सत्यापित साथी डिजिटल कांटे के साथ इलेक्ट्रिक ट्राइक पर पहुंचेंगे। सही पता व लैंडमार्क लिखें।',
    houseFlatLabel: 'मकान / फ्लैट / इमारत का नाम',
    streetAreaLabel: 'सड़क, गली व क्षेत्र का नाम',
    landmarkLabel: 'प्रमुख लैंडमार्क (जैसे पार्क / मेट्रो के पास)',
    pincodeLabel: 'पिनकोड',
    timeSlotTitle: 'पिकअप का पसंदीदा समय चुनें',
    specialInstructionsLabel: 'कबाड़ीवाला साथी के लिए विशेष निर्देश (वैकल्पिक)',
    instructionsPlaceholder: 'जैसे घंटी दो बार बजाएं, भारी लोहा पीछे रखा है...',

    // Handover & Ledger
    handoverTitle: 'डिजिटल हैंडओवर रिकॉर्ड',
    handoverSubtitle: 'ईपीआर नियमों के तहत अधिकृत रीसाइक्लिंग प्लांट में माल जमा करने की डिजिटल रसीद।',
    referenceCode: 'रेफरेंस कोड',
    recyclerName: 'अधिकृत रीसाइक्लर',
    handoverCash: 'नकद भुगतान',
    handoverDigital: 'डिजिटल / यूपीआई',
    statusConfirmed: 'रीसाइक्लर द्वारा स्वीकृत',
    earningsLedger: 'कमाई व बहीखाता',
    totalCashReceived: 'आज मिला कुल नकद',
    totalRecyclerPayout: 'रीसाइक्लर से प्राप्त भुगतान',
    netProfitMargin: 'शुद्ध मुनाफा (मार्जिन)',

    // Safety Guidance
    safetyTitle: 'फील्ड सुरक्षा व हानिकारक पदार्थ गाइड',
    safetySubtitle: 'अपनी सेहत बचाएं, जहरीले धुएं से बचें और अधिकृत रीसाइक्लर्स को बेचकर ज्यादा मुनाफा पाएं।',
    hazardousPractice: 'खतरनाक देसी तरीका',
    safeAlternative: 'सुरक्षित प्रमाणित तरीका',
    economicValue: 'आर्थिक लाभ (मुनाफा)',
    listenAudio: 'सुरक्षा आवाज सुनें',
    stopAudio: 'आवाज बंद करें',
    audioPlayingNow: 'सुरक्षा निर्देश पढ़े जा रहे हैं...',

    // Price Board
    priceBoardTitle: 'ऑफिशियल ई-कचरा व स्क्रैप रेट बोर्ड',
    priceBoardSubtitle: 'ईपीआर नियमों के अनुसार दैनिक पारदर्शी बाजार भाव।',
    currentRate: 'आज का भाव',
    fairMarketRange: 'उचित बाजार सीमा',
    trend: '7-दिवसीय रुझान',
    listenPrices: 'आज का भाव सुनें',

    // Ratings
    rateCollectorTitle: 'कबाड़ीवाला साथी का मूल्यांकन करें',
    rateCollectorSubtitle: 'आपकी रेटिंग अनौपचारिक कबाड़ियों को सरकारी व अधिकृत रीसाइक्लिंग नेटवर्क में विश्वास दिलाने में मदद करती है।',
    submitRating: 'रेटिंग सबमिट करें',
    ratingSubmitted: 'धन्यवाद! आपकी रेटिंग दर्ज हो गई है।',
    tagPunctual: 'समय पर पहुंचे',
    tagFairWeighing: 'सही व सच्चा कांटा तौल',
    tagPolite: 'विनम्र व्यवहार',
    tagCashImmediate: 'तुरंत पूरा नकद भुगतान',
    tagCleanHandling: 'सफाई व सुरक्षित उठान',

    // Common
    kg: 'किग्रा',
    kgUnit: 'किग्रा',
    weight: 'वजन',
    rs: '₹',
    rupees: 'रुपये',
    perKg: '₹/किग्रा',
    urgent: 'प्राथमिकता (तत्काल)',
    express: 'आज ही',
    standard: 'सामान्य',
    total: 'कुल',
    rate: 'भाव',
    done: 'संपन्न',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    phone: 'फोन',
    zone: 'जोन',
    partnerId: 'पार्टनर आईडी',
    vehicle: 'वाहन',
    registeredAddress: 'पंजीकृत पता',

    // Drawer & Profile
    profileTitle: 'उपयोगकर्ता प्रोफाइल व पहचान',
    activeSession: 'सक्रिय सत्र',
    sessionLockedNotice: 'सुरक्षित पोर्टल सत्र सक्रिय। दूसरे पोर्टल में जाने हेतु नीचे लॉग आउट करें।',
    verifiedKycBadge: 'आधार व ईपीआर केवाईसी प्रमाणित',
    quickNav: 'त्वरित नेविगेशन व रिकॉर्ड',
    voiceEngineTitle: 'आवाज ऑडियो इंजन',
    voiceEngineSubtitle: 'अपने उपकरण पर प्राकृतिक आवाज संश्लेषण का परीक्षण करें।',
    testVoiceBtn: 'आवाज टेस्ट करें',
    testVoicePlaying: 'आवाज चल रही है...',
    drawerSchedule: 'पिकअप बुक करें',
    drawerTracking: 'मेरे ऑर्डर व लाइव ट्रैकिंग',
    drawerPriceBoard: 'दैनिक भाव फलक',
    drawerSafety: 'फील्ड सुरक्षा व गाइडलाइंस',
    drawerQueue: 'नजदीकी पिकअप सूची',
    drawerScale: 'डिजिटल कांटा तौल',
    drawerHandover: 'हैंडओवर व कमाई बहीखाता',
    drawerImpact: 'नगरपालिका ईएसजी प्रभाव',
    drawerRecyclers: 'अधिकृत रीसाइक्लिंग केंद्र',
    drawerCompliance: 'सीपीसीबी ई-कचरा ऑडिट',

    // Bottom Nav & Additional Keys
    bottomSchedule: 'पिकअप शेड्यूल',
    bottomMyOrders: 'मेरे ऑर्डर',
    bottomDailyRates: 'दैनिक भाव',
    bottomSegregation: 'पृथक्करण',
    bottomJobQueue: 'कार्य सूची',
    bottomWeighing: 'कांटा तौल',
    bottomEarnings: 'कमाई बहीखाता',
    bottomSafety: 'सुरक्षा नियम',
    bottomEsgOverview: 'ईएसजी डैशबोर्ड',
    bottomTraceability: 'ट्रैसेबिलिटी',
    bottomBulkYards: 'थोक यार्ड',
    bottomCpcbAudit: 'सीपीसीबी ऑडिट',

    // Statuses
    statusSearching: 'खोज जारी...',
    statusAssigned: 'कबाड़ीवाला साथी आवंटित',
    statusEnRoute: 'रास्ते में है',
    statusAtDoorstep: 'पिकअप हेतु दरवाजे पर मौजूद',
    statusCompleted: 'संपन्न',

    // Common action strings
    pickupDetails: 'पिकअप विवरण',
    hideDetails: 'विवरण छिपाएं',
    viewLifecycle: 'लाइफसाइकिल देखें',
    newPickupBtn: '+ नया पिकअप',
    activePickupsTab: 'सक्रिय पिकअप',
    completedHistoryTab: 'पूर्ण व पुराना इतिहास',
    noPickupsFound: 'कोई पिकअप नहीं मिला',
    noPickupsActiveDesc: 'आपके पास वर्तमान में कोई सक्रिय पिकअप नहीं है।',
    noPickupsHistoryDesc: 'आपके इतिहास में कोई पूर्ण पिकअप नहीं है।',
    securityPinBannerTitle: 'आपका 4-अंकों का सुरक्षा पिन (PIN)',
    securityPinBannerDesc: 'डिजिटल कांटे पर तौल की पुष्टि करने व पैसे लेने के बाद ही साथी को यह पिन दें।',
    callPartner: 'साथी को कॉल करें',
    fieldPartnerBadge: 'कबाड़ी साथी',
    postPickupRatingTitle: 'पिकअप उपरांत रेटिंग व पृथक्करण ऑडिट',
    auditRecordedBadge: 'ऑडिट दर्ज',
    starsCountLabel: '{count} / 5 सितारे',
    submitVerifiedRatingBtn: 'सत्यापित रेटिंग व ऑडिट दर्ज करें',
    optionalCommentPlaceholder: 'कबाड़ी साथी की सेवा पर संक्षिप्त टिप्पणी...',
    selectComplianceTags: 'अनुपालन व गुणवत्ता टैग चुनें:',
    rateServiceBtn: 'सेवा को रेटिंग दें',
    editRatingBtn: 'समीक्षा बदलें',
    ratingModalTitle: 'कबाड़ी साथी सेवा मूल्यांकन',
    ratingModalSubtitle: 'समय की पाबंदी, तौल की शुद्धता और साथी के व्यवहार पर अपना निष्पक्ष फीडबैक दें।',
    ratingPendingBannerTitle: 'पूर्ण पिकअप हेतु फीडबैक लंबित',
    ratingPendingBannerDesc: 'आपकी रेटिंग कबाड़ी साथी को औपचारिक पहचान दिलाती है और विश्वसनीय सेवा बनाए रखती है।',
    rateNowBtn: 'अभी रेटिंग दें',
    ratingScore1: 'असंतोषजनक / सुधार आवश्यक',
    ratingScore2: 'औसत / सुधार की आवश्यकता',
    ratingScore3: 'अच्छा व संतोषजनक',
    ratingScore4: 'बहुत अच्छा व भरोसेमंद',
    ratingScore5: 'उत्कृष्ट व शानदार सेवा!',
    feedbackSuccessToast: 'धन्यवाद! {name} के लिए आपका फीडबैक सफलतापूर्वक दर्ज कर लिया गया है।',
    audioListenFeedback: 'फीडबैक सारांश आवाज में सुनें',
    noRatingYet: 'अभी तक कोई रेटिंग नहीं दी गई',
    verifiedHouseholdReview: 'सत्यापित नागरिक सेवा समीक्षा',
    tagSafeHandling: 'ई-कचरे की सुरक्षित संभाल',
    tagFairPrice: 'सरकारी तय दरों का पालन',
    tagPoliteRespectful: 'विनम्र व सम्मानजनक व्यवहार',
    feedbackPreset1: 'समय पर पहुंचे और डिजिटल कांटे पर पूरी पारदर्शिता से तौल किया।',
    feedbackPreset2: 'बहुत विनम्र व्यवहार, सही तौल और मौके पर पूरा नकद भुगतान किया।',
    feedbackPreset3: 'ई-कचरे व पृथक्करण नियमों का पूरी सावधानी से पालन किया।',

    // Step 2 & 3 & 4 additions
    streetAddressInputLabel: 'सड़क का पता, फ्लैट / भवन का नाम',
    streetAddressPlaceholder: 'उदा. फ्लैट 3B, बालीगंज पार्क रोड, कोलकाता',
    landmarkInputLabel: 'लैंडमार्क / नजदीकी पहचान',
    landmarkPlaceholder: 'उदा. बिड़ला मंदिर के सामने, गेट 2 के पास',
    selectClusterWardLabel: 'वार्ड / क्षेत्र चुनें',
    preferredTimeSlotLabel: 'पसंदीदा पिकअप समय स्लॉट',
    confirmedWindowBadge: 'पुष्ट समय',
    specialInstructionsPlaceholder: 'उदा. कृपया दो बार घंटी बजाएं; बालकनी में सफेद बोरियों में स्क्रैप रखा है।',
    reviewBookingBtn: 'बुकिंग की समीक्षा करें',
    addressSummaryLabel: 'पता:',
    pickupSlotSummaryLabel: 'पिकअप समय:',
    estWeightSummaryLabel: 'अनुमानित वजन:',
    estCashPayoutLabel: 'अनुमानित नकद भुगतान:',
    securityPinVerificationTitle: '4-अंकों का सुरक्षा पिन सत्यापन',
    securityPinNoticeDesc: 'घर पहुंचने पर कबाड़ी साथी प्रमाणित डिजिटल कांटे पर हर सामग्री का तौल करेगा। वजन और नकद राशि सही होने पर ही 4-अंकों का पिन साझा करें।',
    broadcastRequestBtn: 'नजदीकी कबाड़ी साथियों को अनुरोध भेजें',

    // Collector Portal
    collectorAvailablePickups: 'उपलब्ध पिकअप',
    collectorScaleWeighing: 'कांटा तौल',
    collectorEarningsLedger: 'कमाई व बहीखाता',
    collectorDailyRates: 'दैनिक भाव फलक',
    collectorSafetyGuide: 'सुरक्षा मार्गदर्शिका',
    collectorTotalPickups: 'कुल पिकअप',
    collectorTotalWeight: 'कुल वजन',
    collectorTotalPayout: 'कुल भुगतान',
    collectorCo2Saved: 'कार्बन बचत',
    searchQueuePlaceholder: 'पता, सामग्री या ऑर्डर आईडी से खोजें...',
    allFilter: 'सभी',
    mixedScrapMaterials: 'मिश्रित कबाड़ सामग्रियां',
    todaySlot: 'आज',
    totalVerifiedLabel: 'कुल सत्यापित वजन:',
    totalPayoutToResident: 'नागरिक को कुल देय भुगतान',
    confirmCashPayoutBtn: 'नकद भुगतान की पुष्टि करें',
    requiredToCompleteHandover: 'हैंडओवर पूरा करने हेतु अनिवार्य',
    residentSecurityCheckTip: 'नागरिक सुरक्षा जांच: नागरिक की स्क्रीन पर प्रदर्शित 4-अंकों का पिन दर्ज करें।',
    paidForScrapNote: '{kg} किग्रा स्क्रैप हेतु {payout} नकद भुगतान किया गया।',

    // Synchronized Audio Bar
    liveAudioBarTitle: 'हिंदी आवाज सक्रिय',
    liveAudioPlayingBadge: 'ध्वनि पठन चालू',
    spokenTranscriptLabel: 'पढ़ा जा रहा पाठ',
  },

  bn: {
    appTitle: 'কবাডিওয়ালা কানেক্ট',
    appSubtitle: 'ই-বর্জ্য ও স্ক্র্যাপ পুনর্ব্যবহার নেটওয়ার্ক',
    tagline: 'ইপিআর (EPR) বিধিমালার অধীনে অনানুষ্ঠানিক বর্জ্য সংগ্রাহকদের সরাসরি অনুমোদিত রিসাইকলারদের সাথে যুক্ত করা।',
    signOut: 'লগ আউট',
    citizenPortal: 'নাগরিক / গৃহস্থালি পোর্টাল',
    collectorPortal: 'কবাডিওয়ালা সাথী / ফিল্ড পার্টনার',
    recyclerPortal: 'অনুমোদিত রিসাইকলার ও ইএসজি ডেস্ক',
    language: 'ভাষা',

    // Top Banners & Hero
    urbanMissionBanner: 'জাতীয় নগর বর্জ্য মিশন • প্রাতিষ্ঠানিক পৌর ই-বর্জ্য ও স্ক্র্যাপ পুনর্ব্যবহার নেটওয়ার্ক',
    loginHeroTitle: 'প্রাতিষ্ঠানিক কঠিন বর্জ্য পৃথকীকরণ ও বিধিসম্মত ই-বর্জ্য নেটওয়ার্ক',
    loginHeroSubtitle: 'ইপিআর ২০২২ বিধিমালার অধীনে বাড়িঘরকে সরাসরি অনানুষ্ঠানিক বর্জ্য সংগ্রাহক, ডিজিটাল স্কেল এবং অনুমোদিত সিপিসিবি রিসাইক্লিং ইয়ার্ডের সাথে যুক্ত করা।',
    featureNoMaps: '১০০% ম্যানুয়াল ঠিকানা (ম্যাপ ছাড়া)',
    featurePin: '৪-সংখ্যার সিকিউরিটি পিন (PIN)',
    featureEpr: 'সিপিসিবি ইপিআর ট্রেসেবিলিটি',
    heroDoorstepBadge: 'দোরগোড়ায় বর্জ্য পৃথকীকরণ • ডিজিটাল স্কেল তৌল • তাৎক্ষণিক নগদ পরিশোধ',

    // Portals & Login Selection
    selectPortalTitle: 'আপনার পোর্টাল নির্বাচন করুন',
    selectPortalSubtitle: 'আপনার নির্ধারিত কর্মক্ষেত্রে প্রবেশ করতে পুনর্ব্যবহার ইকোসিস্টেমে আপনার ভূমিকা বেছে নিন।',
    portalHouseholdTitle: '১. নাগরিক / গৃহস্থালি পোর্টাল',
    portalHouseholdBadge: 'চাহিদা ও বর্জ্যের উৎস',
    portalHouseholdDesc: 'শুকনো বর্জ্য, ভেজা রান্নাঘরের বর্জ্য এবং ই-বর্জ্য আলাদা করুন। সঠিক ঠিকানায় সংগ্রাহক ডাকুন এবং ডিজিটাল স্কেলে নিশ্চিত নগদ টাকা পান।',
    portalCollectorTitle: '২. কবাডিওয়ালা সাথী / ফিল্ড পার্টনার পোর্টাল',
    portalCollectorBadge: 'দোরগোড়ায় স্কেল তৌল ও সংগ্রহ',
    portalCollectorDesc: 'কাছের বাসিন্দাদের অনুরোধ গ্রহণ করুন, ডিজিটাল স্কেলে সঠিক ওজন মেপে নগদ পরিশোধ করুন এবং ডিজিটাল লট তৈরি করুন।',
    portalRecyclerTitle: '৩. অনুমোদিত রিসাইকলার ও পৌর ইএসজি ডেস্ক',
    portalRecyclerBadge: 'ডাউনস্ট্রিম ইপিআর ও পুনর্ব্যবহার',
    portalRecyclerDesc: 'বাল্ক লট কিনুন, ডিজিটাল হস্তান্তর রশিদ ইস্যু করুন এবং পরিবেশ সংরক্ষণ ও ল্যান্ডফিল রক্ষার অডিট ট্র্যাকিং দেখুন।',
    enterHouseholdBtn: 'গৃহস্থালি পোর্টালে যান',
    enterCollectorBtn: 'কবাডিওয়ালা পোর্টালে যান',
    enterRecyclerBtn: 'রিসাইকলার ও ইএসজি পোর্টালে যান',
    customDemoLoginBtn: 'কাস্টম লগইন প্রোফাইল',

    // Footer
    footerTitle: 'কবাডিওয়ালা কানেক্ট — বিধিসম্মত ই-বর্জ্য ও স্ক্র্যাপ পুনর্ব্যবহার নেটওয়ার্ক',
    footerCompliance: 'ই-বর্জ্য (ব্যবস্থাপনা) বিধিমালা, ২০২২ ও ইপিআর কাঠামোর সাথে সামঞ্জস্যপূর্ণ',

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

    // Macro Metrics
    macroTotalPickups: 'মোট পিকআপ',
    macroTotalWeight: 'মোট ওজন',
    macroTotalPayout: 'মোট প্রদান',
    macroCo2Saved: 'কার্বন সাশ্রয়',

    // Collector Queue
    queueSearchPlaceholder: 'ঠিকানা, সামগ্রী বা অর্ডার আইডি দিয়ে খুঁজুন...',
    queueEmptyTitle: 'তালিকায় কোনো নতুন কাজ নেই',
    queueEmptyDesc: 'এলাকার সমস্ত স্ক্র্যাপের অনুরোধ ইতিমধ্যে গ্রহণ করা হয়েছে।',
    availableJobBadge: 'উপলব্ধ কাজ',
    residentLabel: 'বাসিন্দা',
    acceptJobBtn: 'কাজ গ্রহণ করুন',
    viewQueueBtn: 'উপলব্ধ পিকআপ দেখুন',

    // Scale Weighing
    scaleTitle: 'আইটেমভিত্তিক ডিজিটাল স্কেল ক্যালকুলেটর',
    scaleSubtitle: 'প্রতিটি সামগ্রীর সঠিক স্কেল ওজন লিখুন। নগদ পাওনা স্বয়ংক্রিয়ভাবে হিসাব হবে।',
    scaleNoActiveJob: 'কোনো সক্রিয় কাজ চলমান নেই',
    scalePleaseAccept: 'দোরগোড়ায় গিয়ে তৌল করতে অনুগ্রহ করে উপলব্ধ তালিকা থেকে একটি কাজ গ্রহণ করুন।',
    atDoorstepBadge: 'দোরগোড়ায় পৌঁছেছে',
    enRouteBadge: 'পথে আসছে',
    arrivedBtn: 'আমি পৌঁছে গেছি',
    audioScaleReadoutTitle: 'স্কেল ওজন অডিও',
    speakSummaryBtn: 'ওজন বিবরণ শুনুন',
    itemizedScaleTitle: 'আইটেমভিত্তিক ডিজিটাল স্কেল',
    verifiedKg: 'যাচাইকৃত ওজন (কেজি)',
    ratePerKg: 'দর (₹/কেজি)',
    subtotal: 'উপমোট',
    totalCalculatedPayout: 'মোট প্রদেয় নগদ অর্থ',
    confirmAndCash: 'ওজন নিশ্চিত করুন ও নগদ টাকা দিন',
    residentOtp: 'নাগরিকের ৪-সংখ্যার সিকিউরিটি পিন',
    enterPinPlaceholder: 'নাগরিকের ৪-সংখ্যার পিন লিখুন',
    pinRequiredNotice: 'নগদ অর্থ হস্তান্তরের অনুমতির জন্য বাসিন্দার স্ক্রিনে প্রদর্শিত ৪-সংখ্যার পিনটি নিন।',
    supervisorOverride: 'সুপারভাইজার জরুরি ওভাররাইড',
    paymentLoggedSuccess: 'নগদ পরিশোধ সফল ও সংরক্ষিত!',
    addMaterialRow: '+ অতিরিক্ত সামগ্রী যোগ করুন',
    addExtraFraction: '+ ঘটনাস্থলে প্রাপ্ত অতিরিক্ত সামগ্রী যোগ করুন:',

    // Household Tabs
    tabSchedule: 'স্ক্র্যাপ বুক করুন',
    tabTracking: 'লাইভ ট্র্যাকিং',
    tabHistory: 'অর্ডার ইতিহাস',

    // Household Schedule Wizard
    wizardStepOf: 'ধাপ {current} / {total}',
    step1Title: 'উৎস পৃথকীকরণ ও স্ক্র্যাপ নির্বাচন',
    step2Title: 'দোরগোড়ার ঠিকানা (ম্যানুয়াল)',
    step3Title: 'পিকআপের সময় ও নির্দেশাবলী',
    step4Title: 'নিশ্চিত করুন ও সংগ্রাহক ডাকুন',
    allScrap: 'সকল সামগ্রী',
    dryRecyclables: 'শুকনো পুনর্ব্যবহারযোগ্য (কাগজ/প্লাস্টিক/ধাতু)',
    wetCompostable: 'ভেজা / রান্নাঘরের জৈব বর্জ্য',
    ewasteElectronics: 'ই-বর্জ্য (সার্কিট/ব্যাটারি/ডিভাইস)',
    estTotalScrap: 'আনুমানিক মোট ওজন',
    liveVerifiedPayout: 'ডিজিটাল স্কেলে নিশ্চিত প্রদেয় অর্থ',
    directCashUpi: 'সরাসরি নগদ বা ইউপিআই',
    nextAddressBtn: 'পরবর্তী: বাড়ির ঠিকানা',
    nextTimeBtn: 'পরবর্তী: সময় ও নির্দেশ',
    nextConfirmBtn: 'পরবর্তী: চূড়ান্ত নিশ্চিতকরণ',
    confirmBookingBtn: 'বুকিং নিশ্চিত করুন ও সংগ্রাহক ডাকুন',
    backBtn: 'পিছনে',

    // Address Form
    manualAddressTitle: 'রাস্তার নাম, বাড়ির নম্বর ও ল্যান্ডমার্ক লিখুন',
    manualAddressSubtitle: 'আমাদের যাচাইকৃত পার্টনার ডিজিটাল স্কেলসহ ইলেকট্রিক ট্রাইকে পৌঁছাবেন। সঠিক ফ্ল্যাট নম্বর ও ল্যান্ডমার্ক লিখুন।',
    houseFlatLabel: 'বাড়ি / ফ্ল্যাট / ভবনের নাম',
    streetAreaLabel: 'রাস্তা, গলি ও এলাকার নাম',
    landmarkLabel: 'প্রধান ল্যান্ডমার্ক (যেমন পার্ক বা মেট্রোর কাছে)',
    pincodeLabel: 'পিনকোড',
    timeSlotTitle: 'পছন্দের পিকআপের সময় নির্বাচন করুন',
    specialInstructionsLabel: 'ফিল্ড পার্টনারের জন্য বিশেষ নির্দেশাবলী (ঐচ্ছিক)',
    instructionsPlaceholder: 'যেমন দুবার বেল বাজাবেন, ভারী স্ক্র্যাপ পেছনের বারান্দায় আছে...',

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
    audioPlayingNow: 'নিরাপত্তা নির্দেশিকা পাঠ করা হচ্ছে...',

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
    kgUnit: 'কেজি',
    weight: 'ওজন',
    rs: '₹',
    rupees: 'টাকা',
    perKg: '₹/কেজি',
    urgent: 'জরুরি (৪৫ মি.)',
    express: 'আজকের ডেলিভারি',
    standard: 'সাধারণ শিডিউল',
    total: 'মোট',
    rate: 'দর',
    done: 'সম্পন্ন',
    close: 'বন্ধ করুন',
    cancel: 'বাতিল করুন',
    confirm: 'নিশ্চিত করুন',
    phone: 'ফোন',
    zone: 'অঞ্চল',
    partnerId: 'পার্টনার আইডি',
    vehicle: 'যানবাহন',
    registeredAddress: 'নিবন্ধিত ঠিকানা',

    // Drawer & Profile
    profileTitle: 'ব্যবহারকারীর প্রোফাইল ও পরিচয়পত্র',
    activeSession: 'সক্রিয় সেশন',
    sessionLockedNotice: 'নিরাপদ পোর্টাল সেশন সক্রিয়। অন্য পোর্টালে যেতে নিচে লগ আউট করুন।',
    verifiedKycBadge: 'আধার ও ইপিআর কেওয়াইসি অনুমোদিত',
    quickNav: 'দ্রুত নেভিগেশন ও রেকর্ড',
    voiceEngineTitle: 'ভয়েস অডিও ইঞ্জিন',
    voiceEngineSubtitle: 'আপনার ডিভাইসে স্বাভাবিক উচ্চারণ ভয়েসের কার্যকারিতা পরীক্ষা করুন।',
    testVoiceBtn: 'ভয়েস অডিও শুনুন',
    testVoicePlaying: 'ভয়েস বাজছে...',
    drawerSchedule: 'স্ক্র্যাপ পিকআপ শিডিউল',
    drawerTracking: 'আমার অর্ডার ও লাইভ ট্র্যাকিং',
    drawerPriceBoard: 'দৈনিক বাজারদর ফলক',
    drawerSafety: 'মাঠ পর্যায়ের নিরাপত্তা নির্দেশিকা',
    drawerQueue: 'কাছের পিকআপের তালিকা',
    drawerScale: 'ডিজিটাল স্কেল ওজন ও তৌল',
    drawerHandover: 'হস্তান্তর ও উপার্জনের খতিয়ান',
    drawerImpact: 'পৌরসভা ও ইএসজি মেট্রিক্স',
    drawerRecyclers: 'অনুমোদিত রিসাইক্লিং হাব',
    drawerCompliance: 'সিপিসিবি ই-বর্জ্য অডিট',

    // Bottom Nav & Additional Keys
    bottomSchedule: 'স্ক্র্যাপ বুকিং',
    bottomMyOrders: 'আমার অর্ডার',
    bottomDailyRates: 'দৈনিক দর',
    bottomSegregation: 'বর্জ্য বাছাই',
    bottomJobQueue: 'কাজের তালিকা',
    bottomWeighing: 'স্কেল ওজন',
    bottomEarnings: 'উপার্জন খতিয়ান',
    bottomSafety: 'নিরাপত্তা বিধি',
    bottomEsgOverview: 'ইএসজি ওভারভিউ',
    bottomTraceability: 'ট্রেসেবিলিটি',
    bottomBulkYards: 'পাইকারি ইয়ার্ড',
    bottomCpcbAudit: 'সিপিসিবি অডিট',

    // Statuses
    statusSearching: 'সন্ধান চলছে...',
    statusAssigned: 'সংগ্রাহক নির্ধারিত হয়েছে',
    statusEnRoute: 'পথে আসছে',
    statusAtDoorstep: 'পিকআপের জন্য দোরগোড়ায় পৌঁছেছে',
    statusCompleted: 'সম্পন্ন',

    // Common action strings
    pickupDetails: 'পিকআপের বিস্তারিত',
    hideDetails: 'বিবরণ লুকান',
    viewLifecycle: 'লাইফসাইকেল দেখুন',
    newPickupBtn: '+ নতুন পিকআপ',
    activePickupsTab: 'চলমান পিকআপ',
    completedHistoryTab: 'সম্পন্ন ও পুরনো ইতিহাস',
    noPickupsFound: 'কোনো পিকআপ পাওয়া যায়নি',
    noPickupsActiveDesc: 'বর্তমানে আপনার কোনো সক্রিয় পিকআপ নেই।',
    noPickupsHistoryDesc: 'আপনার ইতিহাসে কোনো সম্পন্ন পিকআপ নেই।',
    securityPinBannerTitle: 'আপনার ৪-সংখ্যার সিকিউরিটি পিন (PIN)',
    securityPinBannerDesc: 'ডিজিটাল স্কেলে ওজন যাচাই ও নগদ টাকা পাওয়ার পরেই কেবল ফিল্ড পার্টনারকে এই পিনটি দিন।',
    callPartner: 'পার্টনারকে কল করুন',
    fieldPartnerBadge: 'ফিল্ড পার্টনার',
    postPickupRatingTitle: 'পিকআপ পরবর্তী মূল্যায়ন ও বর্জ্য বাছাই অডিট',
    auditRecordedBadge: 'অডিট সংরক্ষিত',
    starsCountLabel: '{count} / ৫ তারা',
    submitVerifiedRatingBtn: 'সত্যায়িত রেটিং ও অডিট জমা দিন',
    optionalCommentPlaceholder: 'সংগ্রাহকের সেবার মান নিয়ে মন্তব্য লিখুন...',
    selectComplianceTags: 'কমপ্লায়েন্স ও গুণমান ট্যাগ নির্বাচন করুন:',
    rateServiceBtn: 'সেবার রেটিং দিন',
    editRatingBtn: 'মতামত সম্পাদনা করুন',
    ratingModalTitle: 'স্ক্র্যাপ সংগ্রাহকের সেবার মূল্যায়ন',
    ratingModalSubtitle: 'সময়ানুবর্তিতা, স্কেলের নির্ভুলতা ও সংগ্রাহকের ব্যবহারের ওপর সৎ মতামত দিন।',
    ratingPendingBannerTitle: 'সম্পন্ন পিকআপের জন্য মতামত বাকি',
    ratingPendingBannerDesc: 'আপনার রেটিং রাজু দাসকে কাজের স্বীকৃতি দেয় ও স্বচ্ছ পরিষেবা বজায় রাখতে সাহায্য করে।',
    rateNowBtn: 'এখনই রেটিং দিন',
    ratingScore1: 'অপ্রতুল / সন্তোষজনক নয়',
    ratingScore2: 'মোটামুটি / উন্নতির প্রয়োজন',
    ratingScore3: 'ভালো ও সন্তোষজনক',
    ratingScore4: 'খুব ভালো ও নির্ভরযোগ্য',
    ratingScore5: 'চমৎকার ও দুর্দান্ত পরিষেবা!',
    feedbackSuccessToast: 'ধন্যবাদ! {name}-এর জন্য আপনার মতামত সফলভাবে সংরক্ষিত হয়েছে।',
    audioListenFeedback: 'মতামতের অডিও সারাংশ শুনুন',
    noRatingYet: 'এখনও রেটিং দেওয়া হয়নি',
    verifiedHouseholdReview: 'যাচাইকৃত নাগরিক সেবা মূল্যায়ন',
    tagSafeHandling: 'নিরাপদ ই-বর্জ্য ব্যবস্থাপনা',
    tagFairPrice: 'ন্যায্য সরকারি দর প্রদান',
    tagPoliteRespectful: 'নম্র ও শ্রদ্ধাশীল আচরণ',
    feedbackPreset1: 'ঠিক সময়ে এসেছেন এবং ডিজিটাল স্কেলে পরিষ্কারভাবে মেপেছেন।',
    feedbackPreset2: 'খুব ভদ্র ব্যবহার, নিখুঁত ওজন ও সাথে সাথে নগদ পরিশোধ করেছেন।',
    feedbackPreset3: 'ই-বর্জ্য ও পুনর্ব্যবহারযোগ্য সামগ্রী অত্যন্ত সতর্কতার সাথে সংগ্রহ করেছেন।',

    // Step 2 & 3 & 4 additions
    streetAddressInputLabel: 'রাস্তার নাম, ফ্ল্যাট / ভবনের নাম',
    streetAddressPlaceholder: 'যেমন ফ্ল্যাট ৩বি, বালিগঞ্জ পার্ক রোড, কলকাতা',
    landmarkInputLabel: 'ল্যান্ডমার্ক / পরিচিত স্থান',
    landmarkPlaceholder: 'যেমন বিড়লা মন্দিরের বিপরীতে, ২ নম্বর গেটের কাছে',
    selectClusterWardLabel: 'ওয়ার্ড / অঞ্চল বেছে নিন',
    preferredTimeSlotLabel: 'পছন্দের পিকআপের সময় স্লট',
    confirmedWindowBadge: 'নিশ্চিত সময়',
    specialInstructionsPlaceholder: 'যেমন দয়া করে দুবার বেল বাজাবেন; বারান্দায় সাদা বস্তায় স্ক্র্যাপ রাখা আছে।',
    reviewBookingBtn: 'বুকিং পর্যালোচনা করুন',
    addressSummaryLabel: 'ঠিকানা:',
    pickupSlotSummaryLabel: 'পিকআপ স্লট:',
    estWeightSummaryLabel: 'আনুমানিক ওজন:',
    estCashPayoutLabel: 'আনুমানিক নগদ পাওনা:',
    securityPinVerificationTitle: '৪-সংখ্যার সিকিউরিটি পিন যাচাইকরণ',
    securityPinNoticeDesc: 'ঘটনাস্থলে পৌঁছে আমাদের সংগ্রাহক ডিজিটাল স্কেলে প্রতিটি সামগ্রী মেপে নেবেন। ওজন ও নগদ অর্থের হিসাব মিললে তবেই আপনার ৪-সংখ্যার পিনটি শেয়ার করবেন।',
    broadcastRequestBtn: 'কাছের কবাডিওয়ালা সাথীদের অনুরোধ পাঠান',

    // Collector Portal
    collectorAvailablePickups: 'উপলব্ধ পিকআপ',
    collectorScaleWeighing: 'স্কেল ওজন ও তৌল',
    collectorEarningsLedger: 'উপার্জন ও খতিয়ান',
    collectorDailyRates: 'দৈনিক বাজারদর ফলক',
    collectorSafetyGuide: 'নিরাপত্তা নির্দেশিকা',
    collectorTotalPickups: 'মোট পিকআপ',
    collectorTotalWeight: 'মোট ওজন',
    collectorTotalPayout: 'মোট প্রদান',
    collectorCo2Saved: 'কার্বন সাশ্রয়',
    searchQueuePlaceholder: 'ঠিকানা, সামগ্রী বা অর্ডার আইডি দিয়ে খুঁজুন...',
    allFilter: 'সব',
    mixedScrapMaterials: 'মিশ্রিত স্ক্র্যাপ সামগ্রী',
    todaySlot: 'আজ',
    totalVerifiedLabel: 'মোট যাচাইকৃত ওজন:',
    totalPayoutToResident: 'বাসিন্দাকে মোট প্রদেয় নগদ অর্থ',
    confirmCashPayoutBtn: 'নগদ পরিশোধ নিশ্চিত করুন',
    requiredToCompleteHandover: 'হস্তান্তর সম্পূর্ণ করতে আবশ্যক',
    residentSecurityCheckTip: 'বাসিন্দার নিরাপত্তা যাচাই: বাসিন্দার মোবাইল স্ক্রিনে দৃশ্যমান ৪-সংখ্যার পিনটি লিখুন।',
    paidForScrapNote: '{kg} কেজি স্ক্র্যাপের জন্য {payout} নগদ প্রদান সম্পন্ন।',

    // Synchronized Audio Bar
    liveAudioBarTitle: 'বাংলা ভয়েস সক্রিয়',
    liveAudioPlayingBadge: 'শব্দে পাঠ চলছে',
    spokenTranscriptLabel: 'পঠিত বার্তা',
  },
};

export function getTranslation(lang: Language = 'en') {
  return translations[lang] || translations.en;
}

// Format units with natural vernacular numbers & labels
export function formatWeight(kg: number, lang: Language = 'en'): string {
  const t = getTranslation(lang);
  const formatted = kg.toFixed(2);
  return `${formatted} ${t.kg}`;
}

export function formatPerKg(rate: number, lang: Language = 'en'): string {
  const t = getTranslation(lang);
  return `₹${rate} ${t.perKg}`;
}

export function getCategoryLabel(category: string, lang: Language = 'en'): string {
  const t = getTranslation(lang);
  switch (category) {
    case 'dry':
      return t.dryRecyclables;
    case 'wet':
      return t.wetCompostable;
    case 'ewaste':
      return t.ewasteElectronics;
    case 'hazardous':
      return lang === 'hi' ? 'खतरनाक सामग्री' : lang === 'bn' ? 'বিপজ্জনক বর্জ্য' : 'Hazardous Material';
    default:
      return category;
  }
}

// Material localization map
export const materialLabels: Record<string, { en: string; hi: string; bn: string }> = {
  cardboard: {
    en: 'Paper & Cardboard (Gatta)',
    hi: 'कागज व गत्ता (रद्दी)',
    bn: 'কাগজ ও পিচবোর্ড (রদ্দি)',
  },
  newspaper: {
    en: 'Old Newspapers (Raddi)',
    hi: 'रद्दी अखबार व सफेद कागजात',
    bn: 'পুরনো খবরের কাগজ (রদ্দি)',
  },
  mixed_plastics: {
    en: 'Plastics (PET Bottles & Containers)',
    hi: 'प्लास्टिक की बोतलें व डिब्बे',
    bn: 'প্লাস্টিকের বোতল ও পাত্র',
  },
  iron: {
    en: 'Scrap Metal (Iron & Steel)',
    hi: 'लोहा व धातु का कबाड़',
    bn: 'লোহা ও ধাতব স্ক্র্যাপ',
  },
  glass: {
    en: 'Glass Bottles & Jars',
    hi: 'कांच की बोतलें व शीशियां',
    bn: 'কাঁচের বোতল ও বয়াম',
  },
  wet_waste: {
    en: 'Segregated Kitchen & Organic Waste',
    hi: 'गीला / रसोई का जैविक कचरा',
    bn: 'আলাদা করা ভেজা রান্নাঘরের জৈব বর্জ্য',
  },
  pcb: {
    en: 'Circuit Boards & PCBs',
    hi: 'मदरबोर्ड व सर्किट बोर्ड',
    bn: 'মাদারবোর্ড ও সার্কিট বোর্ড',
  },
  cables: {
    en: 'Copper Cables & Insulated Wire',
    hi: 'तांबे के तार व केबल',
    bn: 'তামার তার ও বিদ্যুতের কেব্‌ল',
  },
  batteries: {
    en: 'Batteries (Li-ion / Lead-Acid)',
    hi: 'बैटरियां (लिथियम-आयन व यूपीएस)',
    bn: 'ব্যাটারি (লিথিয়াম-আয়ন ও ইউপিএস)',
  },
  crt: {
    en: 'Cathode Ray Tubes (CRT TV & Monitors)',
    hi: 'सीआरटी टीवी व मॉनिटर ट्यूब',
    bn: 'সিআরটি পিকচার টিউব (পুরনো টিভি)',
  },
  lcd: {
    en: 'LCD & LED Display Panels',
    hi: 'एलसीडी व स्क्रीन पैनल्स',
    bn: 'এলসিডি ও এলইডি স্ক্রিন প্যানেল',
  },
  motors: {
    en: 'Electric Motors & Compressors',
    hi: 'इलेक्ट्रिक मोटर व कंप्रेसर',
    bn: 'বৈদ্যুতিক মোটর ও কম্প্রেসর',
  },
};

export function getMaterialLabel(key: string, lang: Language = 'en'): string {
  const item = materialLabels[key];
  if (item) {
    return item[lang] || item.en;
  }
  return key;
}

// ==========================================
// CENTRALIZED VERNACULAR AUDIO CONTROLLER
// Supports Web Speech API + High-Fidelity Streaming Fallback
// Guarantees zero "English, please" errors for Bengali & Hindi
// Provides global state synchronization for visual subtitles
// ==========================================

export interface VernacularAudioState {
  isPlaying: boolean;
  activeId: string | null;
  text: string;
  lang: Language;
}

type AudioListener = (state: VernacularAudioState) => void;

class VernacularAudioController {
  private state: VernacularAudioState = {
    isPlaying: false,
    activeId: null,
    text: '',
    lang: 'en',
  };

  private listeners: Set<AudioListener> = new Set();
  private activeHtmlAudio: HTMLAudioElement | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeBlobUrl: string | null = null;
  private audioCtx: AudioContext | null = null;
  private activeSourceNode: AudioBufferSourceNode | null = null;
  private isCancelled = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }

  // Pre-unlock AudioContext on user interaction to bypass browser autoplay restrictions
  private unlockAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch (e) {
      return null;
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): VernacularAudioState {
    return { ...this.state };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.warn('Audio listener error:', err);
      }
    });
  }

  public stop() {
    this.isCancelled = true;

    // 1. Stop Web Audio buffer source if playing
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.activeSourceNode = null;
    }

    // 2. Stop HTML Audio if playing
    if (this.activeHtmlAudio) {
      try {
        this.activeHtmlAudio.pause();
        this.activeHtmlAudio.currentTime = 0;
        this.activeHtmlAudio.src = '';
      } catch (e) {
        // ignore
      }
      this.activeHtmlAudio = null;
    }

    // 3. Revoke active Blob URL to avoid memory leak
    if (this.activeBlobUrl) {
      try {
        URL.revokeObjectURL(this.activeBlobUrl);
      } catch (e) {
        // ignore
      }
      this.activeBlobUrl = null;
    }

    // 4. Stop Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.activeUtterance = null;

    if (this.state.isPlaying) {
      this.state = {
        isPlaying: false,
        activeId: null,
        text: '',
        lang: this.state.lang,
      };
      this.notify();
    }
  }

  public play(
    text: string,
    lang: Language = 'en',
    id: string | null = null,
    onFinish?: () => void
  ): boolean {
    // Clean string
    const cleanText = text.replace(/[\n\r]+/g, ' ').trim();
    if (!cleanText) return false;

    // Unlock AudioContext immediately within user click gesture
    this.unlockAudioContext();

    // Stop any existing playback first
    this.stop();
    this.isCancelled = false;

    // Set new state
    this.state = {
      isPlaying: true,
      activeId: id,
      text: cleanText,
      lang,
    };
    this.notify();

    const handleFinished = () => {
      this.stop();
      onFinish?.();
    };

    // Check if browser has speech synthesis with authentic native voice
    const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const voices = hasSpeech ? window.speechSynthesis.getVoices() : [];

    let matchedVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'bn' && hasSpeech) {
      matchedVoice = voices.find((v) => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        const n = (v.name || '').toLowerCase();
        return (
          l === 'bn-in' ||
          l === 'bn-bd' ||
          l.startsWith('bn') ||
          n.includes('bangla') ||
          n.includes('bengali') ||
          n.includes('বাংলা')
        );
      });
    } else if (lang === 'hi' && hasSpeech) {
      matchedVoice = voices.find((v) => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        const n = (v.name || '').toLowerCase();
        return (
          l === 'hi-in' ||
          l.startsWith('hi') ||
          n.includes('hindi') ||
          n.includes('हिन्दी')
        );
      });
    } else if (hasSpeech) {
      matchedVoice = voices.find((v) => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        return l === 'en-in' || l === 'en-gb' || l.startsWith('en');
      });
    }

    // STRICT CHECK: For Bengali or Hindi, ONLY use SpeechSynthesis if an authentic native voice is installed.
    // If not found, immediately use the high-fidelity server TTS streaming pipeline.
    const isAuthenticNativeVoice =
      matchedVoice &&
      ((lang === 'bn' &&
        (matchedVoice.lang.toLowerCase().startsWith('bn') ||
          matchedVoice.name.toLowerCase().includes('bengali') ||
          matchedVoice.name.toLowerCase().includes('bangla') ||
          matchedVoice.name.includes('বাংলা'))) ||
        (lang === 'hi' &&
          (matchedVoice.lang.toLowerCase().startsWith('hi') ||
            matchedVoice.name.toLowerCase().includes('hindi') ||
            matchedVoice.name.includes('हिन्दी'))) ||
        lang === 'en');

    if (!isAuthenticNativeVoice || !hasSpeech) {
      return this.playStreamingTTS(cleanText, lang, handleFinished);
    }

    // Use Web Speech API with the authentic regional voice
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = lang === 'bn' ? 'bn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      }
      utterance.rate = 0.92; // Natural field comprehension rate
      utterance.pitch = 1.0;

      utterance.onend = () => {
        handleFinished();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error, falling back to streaming TTS:', e);
        this.playStreamingTTS(cleanText, lang, handleFinished);
      };

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      return true;
    } catch (err) {
      console.warn('SpeechSynthesis exception, using stream:', err);
      return this.playStreamingTTS(cleanText, lang, handleFinished);
    }
  }

  // Safe Unicode sentence boundary split to prevent cutting multi-byte Bengali glyphs
  private splitTextIntoChunks(text: string, maxLen = 140): string[] {
    const rawSentences = text.split(/([।\.\?!,]+)/g).filter(Boolean);
    const chunks: string[] = [];
    let current = '';

    for (let i = 0; i < rawSentences.length; i++) {
      const part = rawSentences[i];
      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        current = part;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
  }

  // High-fidelity streaming audio fallback (guarantees authentic native Bengali & Hindi pronunciation anywhere)
  private playStreamingTTS(text: string, lang: Language, onFinish: () => void): boolean {
    const targetLang = lang === 'bn' ? 'bn' : lang === 'hi' ? 'hi' : 'en';
    const chunks = this.splitTextIntoChunks(text, 140);
    let chunkIndex = 0;

    const playNextChunk = async () => {
      if (this.isCancelled || chunkIndex >= chunks.length) {
        onFinish();
        return;
      }

      const currentText = chunks[chunkIndex++];
      const proxyUrl = `/api/tts?lang=${targetLang}&text=${encodeURIComponent(currentText)}`;
      const directGoogleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(currentText)}`;

      // ROUTE 1: Web Audio API decoding (bypasses browser autoplay restrictions because AudioContext was unlocked on click)
      const ctx = this.unlockAudioContext();
      if (ctx) {
        try {
          let arrayBuffer: ArrayBuffer | null = null;
          try {
            const res = await fetch(proxyUrl);
            if (res.ok) {
              arrayBuffer = await res.arrayBuffer();
            }
          } catch (e) {
            // fallback to direct fetch if proxy fails
            try {
              const res2 = await fetch(directGoogleUrl);
              if (res2.ok) {
                arrayBuffer = await res2.arrayBuffer();
              }
            } catch (e2) {
              // ignore
            }
          }

          if (arrayBuffer && !this.isCancelled) {
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            if (this.isCancelled) return;

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            this.activeSourceNode = source;

            source.onended = () => {
              this.activeSourceNode = null;
              playNextChunk();
            };

            source.start(0);
            return;
          }
        } catch (webAudioErr) {
          console.warn('Web Audio API decode error, falling back to HTML5 audio element:', webAudioErr);
        }
      }

      // ROUTE 2: Direct HTML5 Audio element fallback
      if (this.isCancelled) return;
      try {
        const audio = new Audio();
        this.activeHtmlAudio = audio;

        audio.onended = () => {
          this.activeHtmlAudio = null;
          playNextChunk();
        };

        audio.onerror = () => {
          console.warn(`Primary audio source failed for ${lang}, trying direct Google URL.`);
          this.activeHtmlAudio = null;
          const directAudio = new Audio(directGoogleUrl);
          this.activeHtmlAudio = directAudio;
          directAudio.onended = () => {
            this.activeHtmlAudio = null;
            playNextChunk();
          };
          directAudio.onerror = () => {
            this.activeHtmlAudio = null;
            playNextChunk();
          };
          directAudio.play().catch(() => playNextChunk());
        };

        audio.preload = 'auto';
        audio.src = proxyUrl;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play restricted by autoplay policy:', err);
            setTimeout(() => {
              if (!this.isCancelled) playNextChunk();
            }, 3000);
          });
        }
      } catch (err) {
        console.error('Audio stream failure:', err);
        setTimeout(onFinish, 2000);
      }
    };

    playNextChunk();
    return true;
  }
}

// Global audio controller singleton
export const audioController = new VernacularAudioController();

// React Hook for Vernacular Audio state synchronization
export function useVernacularAudio() {
  const [audioState, setAudioState] = useState<VernacularAudioState>(audioController.getState());

  useEffect(() => {
    const unsubscribe = audioController.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  return {
    ...audioState,
    stopAudio: () => audioController.stop(),
    playAudio: (text: string, lang: Language, id?: string | null, onFinish?: () => void) =>
      audioController.play(text, lang, id, onFinish),
  };
}

// Public API helper functions
export function speakVernacular(text: string, lang: Language = 'en', id: string | null = null): boolean {
  return audioController.play(text, lang, id);
}

export function stopVernacularSpeech() {
  audioController.stop();
}

export function testVernacularVoice(lang: Language): boolean {
  let sample = 'Welcome to Kabadiwala Connect. Voice audio readout is active.';
  if (lang === 'bn') {
    sample = 'কবাডিওয়ালা কানেক্টে স্বাগতম। বাংলা ভয়েস অডিও সফলভাবে চালু হয়েছে।';
  } else if (lang === 'hi') {
    sample = 'कबाड़ीवाला कनेक्ट में आपका स्वागत है। हिंदी आवाज सफलतापूर्वक चालू है।';
  }
  return audioController.play(sample, lang, 'test-voice');
}
