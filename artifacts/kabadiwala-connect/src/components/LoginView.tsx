import React, { useState } from 'react';
import {
  User,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Sparkles,
  Phone,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { AuthUser, AppView, Language } from '../types';
import { defaultHouseholdUser, defaultCollectorUser } from '../data/mockData';
import { getTranslation } from '../lib/i18n';

interface LoginViewProps {
  onLogin: (user: AuthUser, initialView: AppView) => void;
  onExploreESG?: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onExploreESG,
  language,
  onLanguageChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<'household' | 'collector'>('household');
  const t = getTranslation(language);

  // Custom household inputs
  const [hName, setHName] = useState(defaultHouseholdUser.name);
  const [hPhone, setHPhone] = useState(defaultHouseholdUser.phone);
  const [hAddress, setHAddress] = useState(defaultHouseholdUser.address || '');

  // Custom collector inputs
  const [cName, setCName] = useState(defaultCollectorUser.name);
  const [cPhone, setCPhone] = useState(defaultCollectorUser.phone);
  const [cVehicle, setCVehicle] = useState(defaultCollectorUser.vehicle || 'Electric Cargo Trike (WB-02-AK-4192)');
  const [cZone, setCZone] = useState(defaultCollectorUser.zone || 'South Kolkata & Central Route Cluster');

  const handleQuickDemoHousehold = () => {
    onLogin({ ...defaultHouseholdUser, preferredLanguage: language }, 'household');
  };

  const handleQuickDemoCollector = () => {
    onLogin({ ...defaultCollectorUser, preferredLanguage: language }, 'collector');
  };

  const handleCustomHouseholdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AuthUser = {
      id: `usr-h-${Date.now().toString(36)}`,
      role: 'household',
      name: hName.trim() || 'Resident Citizen',
      phone: hPhone.trim() || '+91 98300 00000',
      address: hAddress.trim() || 'Ballygunge Park Road, Kolkata',
      zone: 'Kolkata Metro Cluster',
      completedTrips: 4,
      preferredLanguage: language,
    };
    onLogin(user, 'household');
  };

  const handleCustomCollectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AuthUser = {
      id: `usr-c-${Date.now().toString(36)}`,
      role: 'collector',
      name: cName.trim() || 'Field Partner',
      phone: cPhone.trim() || '+91 98310 00000',
      partnerId: `KC-EPR-${Math.floor(100 + Math.random() * 900)}`,
      vehicle: cVehicle.trim() || 'Cargo Vehicle',
      zone: cZone.trim() || 'South Kolkata Axis',
      rating: 4.9,
      completedTrips: 184,
      preferredLanguage: language,
    };
    onLogin(user, 'collector');
  };

  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-10">
      {/* Top Banner / Hero */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 tracking-wide">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Formal E-Waste & Scrap Recycling Network · CPCB EPR Compliant</span>
        </div>
        <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t.appTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {t.tagline}
        </p>
      </div>

      {/* Role Selection Switcher */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1.5 shadow-2xs">
          <button
            id="role-tab-household"
            type="button"
            onClick={() => setSelectedRole('household')}
            className={`flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold transition-all ${
              selectedRole === 'household'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="h-4 w-4 text-emerald-600" />
            <span>{t.citizenPortal}</span>
          </button>
          <button
            id="role-tab-collector"
            type="button"
            onClick={() => setSelectedRole('collector')}
            className={`flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold transition-all ${
              selectedRole === 'collector'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="h-4 w-4 text-emerald-600" />
            <span>{t.collectorPortal}</span>
          </button>
        </div>
      </div>

      {/* Role Specific Login Card */}
      <div className="mt-6">
        {selectedRole === 'household' ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    {language === 'hi' ? 'नागरिक व घरेलू पोर्टल' : language === 'mr' ? 'घरगुती व रहिवासी पोर्टल' : 'Household & Citizen'}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {language === 'hi'
                    ? 'घर से ई-कचरा व रद्दी स्क्रैप बेचें'
                    : language === 'mr'
                    ? 'घरी बसून ई-कचरा व भंगार विका'
                    : 'Schedule Doorstep E-Waste & Scrap Collection'}
                </h2>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {language === 'hi'
                    ? 'पारदर्शी डिजिटल तौल, मौके पर नकद भुगतान और प्रमाणित रीसाइक्लिंग रसीद।'
                    : language === 'mr'
                    ? 'अचूक डिजिटल वजन, तात्काळ रोख रक्कम आणि अधिकृत रिसायकलिंग खात्री.'
                    : 'Get fair market pricing, doorstep collection, instant cash on scale weighing, and guaranteed formal recycling.'}
                </p>

                {/* Quick 1-Click Demo Login */}
                <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-900">
                        {language === 'hi' ? 'त्वरित डेमो परीक्षण' : language === 'mr' ? 'झटपट डेमो प्रवेश' : 'One-Tap Quick Demo'}
                      </div>
                      <div className="text-xs text-emerald-700">
                        Deblina Mukherjee (+91 98301 44829)
                      </div>
                    </div>
                    <button
                      id="quick-login-household-btn"
                      type="button"
                      onClick={handleQuickDemoHousehold}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span>
                        {language === 'hi' ? 'सीधे प्रवेश करें' : language === 'mr' ? 'प्रवेश करा' : 'Enter Portal'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Custom Form */}
                <form onSubmit={handleCustomHouseholdSubmit} className="mt-5 space-y-3.5 border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === 'hi' ? 'या अपना विवरण दर्ज करें' : language === 'mr' ? 'किंवा आपली माहिती भरा' : 'Or Enter Custom Details'}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'पूरा नाम' : language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                      </label>
                      <input
                        id="household-name-input"
                        type="text"
                        value={hName}
                        onChange={(e) => setHName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Deblina Mukherjee"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'मोबाइल नंबर' : language === 'mr' ? 'मोबाईल नंबर' : 'Phone Number'}
                      </label>
                      <input
                        id="household-phone-input"
                        type="text"
                        value={hPhone}
                        onChange={(e) => setHPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="+91 98300 00000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      {language === 'hi' ? 'घर का पता' : language === 'mr' ? 'घराचा पत्ता' : 'Address'}
                    </label>
                    <input
                      id="household-address-input"
                      type="text"
                      value={hAddress}
                      onChange={(e) => setHAddress(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Street address, building, locality"
                      required
                    />
                  </div>

                  <button
                    id="custom-household-submit-btn"
                    type="submit"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    {language === 'hi' ? 'कस्टम खाते से लॉगिन करें' : language === 'mr' ? 'खाते उघडून पुढे जा' : 'Continue with Details'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <Truck className="h-3.5 w-3.5" />
                  <span>
                    {language === 'hi' ? 'कबाड़ीवाला व फील्ड पार्टनर' : language === 'mr' ? 'कबाडी व संकलन भागीदार' : 'Field Collector Partner'}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {language === 'hi'
                    ? 'अनौपचारिक कबाड़ी साथी ईपीआर नेटवर्क'
                    : language === 'mr'
                    ? 'असंघटित कबाडी अधिकृत ईपीआर नेटवर्क'
                    : 'Formal Recycler Linkage & Digital Scale Portal'}
                </h2>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {language === 'hi'
                    ? 'कांटे का सामग्री-वार डिजिटल तौल, नकद कैलकुलेटर, आज का भाव बोर्ड, व अधिकृत रीसाइक्लर्स को सीधा हैंडओवर।'
                    : language === 'mr'
                    ? 'वस्तूनिहाय डिजिटल वजन, रोख गणक, आजचे थेट बाजारभाव आणि अधिकृत रीसायकलर्सकडे थेट विक्री.'
                    : 'Access itemized digital scale calculator, daily price discovery, safety training, digital lot creation, and direct handovers.'}
                </p>

                {/* Quick 1-Click Demo Login */}
                <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-900">
                        {language === 'hi' ? 'साथी त्वरित डेमो लॉगिन' : language === 'mr' ? 'भागीदार झटपट लॉगिन' : 'Certified Partner Quick Demo'}
                      </div>
                      <div className="text-xs text-emerald-700">
                        Raju Das (Partner ID: KC-EPR-204 · Electric Cargo Trike)
                      </div>
                    </div>
                    <button
                      id="quick-login-collector-btn"
                      type="button"
                      onClick={handleQuickDemoCollector}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span>
                        {language === 'hi' ? 'फील्ड पोर्टल खोलें' : language === 'mr' ? 'फील्ड पोर्टल उघडा' : 'Open Field Portal'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Custom Form */}
                <form onSubmit={handleCustomCollectorSubmit} className="mt-5 space-y-3.5 border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === 'hi' ? 'या अपना साथी विवरण दर्ज करें' : language === 'mr' ? 'किंवा नवीन भागीदार नोंदणी' : 'Or Custom Partner Setup'}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'साथी का नाम' : language === 'mr' ? 'भागीदाराचे नाव' : 'Partner Name'}
                      </label>
                      <input
                        id="collector-name-input"
                        type="text"
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Raju Das"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'मोबाइल नंबर' : language === 'mr' ? 'मोबाईल नंबर' : 'Phone Number'}
                      </label>
                      <input
                        id="collector-phone-input"
                        type="text"
                        value={cPhone}
                        onChange={(e) => setCPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="+91 98312 00000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'वाहन का प्रकार' : language === 'mr' ? 'वाहनाचा प्रकार' : 'Vehicle'}
                      </label>
                      <input
                        id="collector-vehicle-input"
                        type="text"
                        value={cVehicle}
                        onChange={(e) => setCVehicle(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Electric Cargo Trike / Pushcart"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        {language === 'hi' ? 'सक्रिय कार्यक्षेत्र / क्लस्टर' : language === 'mr' ? 'कार्यक्षेत्र' : 'Operating Route / Cluster'}
                      </label>
                      <input
                        id="collector-zone-input"
                        type="text"
                        value={cZone}
                        onChange={(e) => setCZone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. South Kolkata Axis"
                      />
                    </div>
                  </div>

                  <button
                    id="custom-collector-submit-btn"
                    type="submit"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    {language === 'hi' ? 'साथी खाते से लॉगिन करें' : language === 'mr' ? 'भागीदार म्हणून पुढे जा' : 'Continue as Collector Partner'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Municipal & EPR Impact Link */}
      <div className="mt-8 text-center">
        <button
          id="explore-esg-btn"
          type="button"
          onClick={onExploreESG}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          <span>
            {language === 'hi'
              ? 'नगरपालिका ईपीआर रीसाइक्लिंग व ई-कचरा डेटा डैशबोर्ड देखें'
              : language === 'mr'
              ? 'महानगरपालिका ईपीआर व ई-कचरा प्रभाव डॅशबोर्ड पहा'
              : 'View Municipal EPR Circular Economy & E-Waste Impact Dashboard'}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
