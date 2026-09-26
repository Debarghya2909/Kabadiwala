import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Home,
  Truck,
  Building2,
  ArrowRight,
  TreePine,
  Scale,
  Link as LinkIcon,
} from 'lucide-react';
import { AuthUser, Language, AppView } from '../types';
import {
  defaultHouseholdUser,
  defaultCollectorUser,
  defaultRecyclerUser,
} from '../data/mockData';
import { getTranslation, languageNames } from '../lib/i18n';
import { CollectorHeroIllustration } from './Illustrations';

interface LoginViewProps {
  onLogin: (user: AuthUser, initialView: AppView) => void;
  onExploreESG: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onExploreESG,
  language,
  onLanguageChange,
}) => {
  const t = getTranslation(language);
  const [showCustomModal, setShowCustomModal] = useState<
    'collector' | 'household' | 'recycler' | null
  >(null);

  // Custom Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');

  const handleCollectorLogin = () => {
    onLogin({ ...defaultCollectorUser, preferredLanguage: language }, 'collector');
  };

  const handleHouseholdLogin = () => {
    onLogin({ ...defaultHouseholdUser, preferredLanguage: language }, 'household');
  };

  const handleRecyclerLogin = () => {
    onLogin({ ...defaultRecyclerUser, preferredLanguage: language }, 'impact');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCustomModal === 'collector') {
      const user: AuthUser = {
        id: `c-${Date.now().toString(36)}`,
        role: 'collector',
        name: name.trim() || (language === 'bn' ? 'রাজু মণ্ডল' : language === 'hi' ? 'राजू मंडल' : 'Raju Mondal'),
        phone: phone.trim() || '+91 98310 12345',
        partnerId: `KC-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicle: language === 'bn' ? 'ইলেকট্রিক কার্গো ট্রাইক' : language === 'hi' ? 'इलेक्ट्रिक कार्गो ट्राइक' : 'Electric Cargo Trike',
        zone: area.trim() || (language === 'bn' ? 'গড়িয়াহাট ও দক্ষিণ কলকাতা' : language === 'hi' ? 'गड़ियाहाट व दक्षिण कोलकाता' : 'Gariahat & South Kolkata'),
        rating: 4.9,
        completedTrips: 184,
        preferredLanguage: language,
      };
      onLogin(user, 'collector');
    } else if (showCustomModal === 'recycler') {
      const user: AuthUser = {
        id: `r-${Date.now().toString(36)}`,
        role: 'recycler',
        name: name.trim() || (language === 'bn' ? 'পৌর ই-বর্জ্য ও রিসাইক্লার ডেস্ক' : language === 'hi' ? 'नगरपालिका ई-कचरा व रीसाइक्लर डेस्क' : 'Municipal Waste & Recycler Desk'),
        phone: phone.trim() || '+91 33 2286 1000',
        partnerId: 'EPR-AUDIT-KMC-2026',
        zone: area.trim() || (language === 'bn' ? 'সেন্ট্রাল মিউনিসিপ্যাল ইয়ার্ড' : language === 'hi' ? 'केंद्रीय नगरपालिका यार्ड' : 'Central Municipal Yard'),
        rating: 5.0,
        completedTrips: 1420,
        preferredLanguage: language,
      };
      onLogin(user, 'impact');
    } else {
      const user: AuthUser = {
        id: `h-${Date.now().toString(36)}`,
        role: 'household',
        name: name.trim() || (language === 'bn' ? 'দেবলীনা মুখার্জি' : language === 'hi' ? 'देबलीना मुखर्जी' : 'Deblina Mukherjee'),
        phone: phone.trim() || '+91 98300 54321',
        address: area.trim() || (language === 'bn' ? 'ফ্ল্যাট ৩বি, বালিগঞ্জ পার্ক রোড, কলকাতা' : language === 'hi' ? 'फ्लैट 3B, बालीगंज पार्क रोड, कोलकाता' : 'Flat 3B, Ballygunge Park Road, Kolkata'),
        zone: language === 'bn' ? 'বালিগঞ্জ ওয়ার্ড ৬৯' : language === 'hi' ? 'बालीगंज वार्ड 69' : 'Ballygunge Ward 69',
        completedTrips: 7,
        preferredLanguage: language,
      };
      onLogin(user, 'household');
    }
    setShowCustomModal(null);
  };

  return (
    <div className="mx-auto max-w-5xl py-2 sm:py-6 space-y-6">
      {/* Top Banner: Institutional Municipal solid waste & EPR Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t.urbanMissionBanner}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              {t.loginHeroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {t.featureNoMaps}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {t.featurePin}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {t.featureEpr}
              </span>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="md:col-span-5 flex justify-center">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/60 to-emerald-100/40 p-4 border border-emerald-100 w-full max-w-xs shadow-2xs">
              <CollectorHeroIllustration className="w-full h-auto max-h-48 object-contain" />
              <div className="mt-2 text-center">
                <p className="text-[11px] font-bold text-slate-800">
                  {t.heroDoorstepBadge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Isolated Role-Based Login Entry Points */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            {t.selectPortalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.selectPortalSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* PORTAL 1: Household / Citizen */}
          <div
            id="portal-card-household"
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-2xs">
                  <Home className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700 border border-sky-200/80">
                  {t.portalHouseholdBadge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.portalHouseholdTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.portalHouseholdDesc}
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{language === 'bn' ? 'স্ক্র্যাপ নির্বাচন ও আনুমানিক দর' : language === 'hi' ? 'सामग्री चयन व अनुमानित भाव' : 'Itemized scrap selection & est. payout'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{language === 'bn' ? 'সরাসরি দোরগোড়ার ঠিকানা ও ল্যান্ডমার্ক' : language === 'hi' ? 'घर का सीधा पता व लैंडमार्क' : 'Doorstep address & landmark entry'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{language === 'bn' ? '৪-সংখ্যার সিকিউরিটি পিন' : language === 'hi' ? '4-अंकों का सुरक्षा पिन (PIN)' : '4-digit resident security PIN'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{language === 'bn' ? 'সংগ্রাহকের মূল্যায়ন ও অডিট' : language === 'hi' ? 'पिकअप उपरांत रेटिंग व ऑडिट' : 'Post-pickup rating & segregation audit'}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <button
                id="enter-household-portal-btn"
                type="button"
                onClick={handleHouseholdLogin}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <span>{t.enterHouseholdBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('household')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-700 py-1"
              >
                {language === 'bn' ? 'বা কাস্টম নাগরিক তথ্য লিখুন →' : language === 'hi' ? 'या कस्टम नागरिक विवरण लिखें →' : 'Or enter custom citizen phone / address →'}
              </button>
            </div>
          </div>

          {/* PORTAL 2: Informal Collector / Field Partner */}
          <div
            id="portal-card-collector"
            className="group flex flex-col justify-between rounded-3xl border-2 border-emerald-500/80 bg-emerald-50/40 p-5 sm:p-6 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all"
          >
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <Truck className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                  {t.portalCollectorBadge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.portalCollectorTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.portalCollectorDesc}
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-emerald-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{language === 'bn' ? 'লাইভ পিকআপ তালিকা ও গ্রহণ' : language === 'hi' ? 'लाइव जॉब कतार व 1-क्लिक स्वीकृति' : 'Live job queue & 1-click acceptance'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{language === 'bn' ? 'দোরগোড়ায় পৌঁছে পিন আনলক' : language === 'hi' ? 'दरवाजे पर पहुंच व पिन द्वारा सत्यापन' : 'Doorstep arrival & PIN unlock'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{language === 'bn' ? 'আইটেমভিত্তিক ডিজিটাল স্কেল তৌল' : language === 'hi' ? 'सामग्री अनुसार कांटा तौल कैलकुलेटर' : 'Itemized digital scale weight calculator'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{language === 'bn' ? 'দৈনিক খতিয়ান ও রিসাইক্লারে হস্তান্তর' : language === 'hi' ? 'दैनिक कमाई बहीखाता व प्लांट हैंडओवर' : 'Daily earnings ledger & yard handovers'}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <button
                id="enter-collector-portal-btn"
                type="button"
                onClick={handleCollectorLogin}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <span>{t.enterCollectorBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('collector')}
                className="w-full text-center text-[11px] font-semibold text-slate-600 hover:text-emerald-800 py-1"
              >
                {language === 'bn' ? 'বা কাস্টম কবাডিওয়ালা আইডি লিখুন →' : language === 'hi' ? 'या कस्टम कबाड़ीवाला आईडी दर्ज करें →' : 'Or enter custom collector ID →'}
              </button>
            </div>
          </div>

          {/* PORTAL 3: Authorized Recycler & Municipal Dashboard */}
          <div
            id="portal-card-recycler"
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-2xs">
                  <Building2 className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 border border-purple-200/80">
                  {t.portalRecyclerBadge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.portalRecyclerTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.portalRecyclerDesc}
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>{language === 'bn' ? 'ল্যান্ডফিল বর্জ্য হ্রাস ও কার্বন সাশ্রয়' : language === 'hi' ? 'लैंडफिल से बचाया कचरा व CO₂ बचत' : 'Landfill waste diverted (kg) & CO₂ offset'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>{language === 'bn' ? 'বর্জ্য পৃথকীকরণ কমপ্লায়েন্স শতাংশ' : language === 'hi' ? 'स्रोत पर कचरा पृथक्करण अनुपालन %' : 'Source segregation compliance rate %'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>{language === 'bn' ? 'সম্পূর্ণ ট্রেসেবিলিটি অডিট টেবিল' : language === 'hi' ? 'एंड-टू-एंड ट्रैसेबिलिटी ऑडिट तालिका' : 'End-to-end traceability audit table'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>{language === 'bn' ? 'সিপিসিবি ফর্ম ৪ ইপিআর ডাটা এক্সপোর্ট' : language === 'hi' ? '1-क्लिक सीपीसीबी फॉर्म IV ईपीआर रिपोर्ट' : '1-click CPCB Form IV EPR CSV export'}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <button
                id="enter-recycler-portal-btn"
                type="button"
                onClick={handleRecyclerLogin}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
              >
                <span>{t.enterRecyclerBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('recycler')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-700 py-1"
              >
                {language === 'bn' ? 'বা প্রাতিষ্ঠানিক তথ্য দিন →' : language === 'hi' ? 'या संस्थागत क्रेडेंशियल्स दर्ज करें →' : 'Or enter institutional credentials →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/70 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <TreePine className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {language === 'bn' ? 'ল্যান্ডফিল বর্জ্য সাশ্রয়' : language === 'hi' ? 'लैंडफिल से बचाव' : 'Landfill Diversion'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'তামা, সার্কিট বোর্ড ও শুকনো বর্জ্য উদ্ধার' : language === 'hi' ? 'शुद्ध तांबा, सर्किट बोर्ड व सूखा कचरा रीसायकल' : 'Recover high-purity copper, PCBs, & dry fractions'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/70 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {language === 'bn' ? 'সঠিক স্কেল তৌল' : language === 'hi' ? 'पारदर्शी कांटा तौल' : 'Fair Field Weighing'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'ডিজিটাল স্কেল ও নিশ্চিত দৈনিক বাজারদর' : language === 'hi' ? 'डिजिटल कांटा व दैनिक ईपीआर बेंचमार्क रेट' : 'Itemized digital scales with daily EPR benchmark rates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/70 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <LinkIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {language === 'bn' ? 'অনুমোদিত রিসাইক্লিং লিঙ্ক' : language === 'hi' ? 'अधिकृत प्लांट से जुड़ाव' : 'Formal Recycler Link'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'খোলায় না পুড়িয়ে ১০০% সিপিসিবি ইয়ার্ডে হস্তান্তর' : language === 'hi' ? 'बिना खुले जलाए 100% सीपीसीबी यार्ड में हैंडओवर' : 'Zero open burning; 100% CPCB yard custody'}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Credentials Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              {showCustomModal === 'collector'
                ? (language === 'bn' ? 'কবাডিওয়ালা সংগ্রাহক তথ্য' : language === 'hi' ? 'कबाड़ीवाला साथी क्रेडेंशियल्स' : 'Informal Collector Credentials')
                : showCustomModal === 'recycler'
                ? (language === 'bn' ? 'পৌরসভা / রিসাইকলার বিবরণ' : language === 'hi' ? 'नगरपालिका / रीसाइक्लर विवरण' : 'Municipal / Recycler Credentials')
                : (language === 'bn' ? 'নাগরিকের বিস্তারিত তথ্য' : language === 'hi' ? 'नागरिक विवरण' : 'Household Citizen Details')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn'
                ? 'আপনার সেশন শুরু করতে বিবরণ লিখুন।'
                : language === 'hi'
                ? 'अपना सत्र शुरू करने के लिए अपना विवरण दर्ज करें।'
                : 'Enter your details to personalize your portal session.'}
            </p>

            <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পুরো নাম' : language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    showCustomModal === 'collector'
                      ? (language === 'bn' ? 'উদাঃ রমেশ মণ্ডল' : language === 'hi' ? 'जैसे रमेश मंडल' : 'e.g. Ramesh Mondal')
                      : showCustomModal === 'recycler'
                      ? (language === 'bn' ? 'উদাঃ কেএমসি পরিদর্শক' : language === 'hi' ? 'जैसे केएमसी निरीक्षण अधिकारी' : 'e.g. KMC Inspection Officer')
                      : (language === 'bn' ? 'উদাঃ অনন্যা সেন' : language === 'hi' ? 'जैसे अनन्या सेन' : 'e.g. Ananya Sen')
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর / পার্টনার আইডি' : language === 'hi' ? 'मोबाइल नंबर / पार्टनर आईडी' : 'Mobile Number / Partner ID'}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98300 12345"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'অঞ্চল / ওয়ার্ড / ঠিকানা' : language === 'hi' ? 'क्षेत्र / वार्ड / पता' : 'Area / Ward / Street Address'}
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={
                    language === 'bn' ? 'উদাঃ বালিগঞ্জ ওয়ার্ড ৬৯, কলকাতা' : language === 'hi' ? 'जैसे बालीगंज वार्ड 69, कोलकाता' : 'e.g. Ballygunge Ward 69, Kolkata'
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
