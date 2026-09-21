import React, { useState } from 'react';
import {
  Recycle,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  TreePine,
  Scale,
  Link as LinkIcon,
  Home,
  Truck,
  Layers,
  Sparkles,
  Phone,
  CheckCircle2,
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
        name: name.trim() || 'Raju Mondal',
        phone: phone.trim() || '+91 98310 12345',
        partnerId: `KC-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicle: 'Electric Cargo Trike (WB-02-AK-4192)',
        zone: area.trim() || 'Gariahat & South Kolkata',
        rating: 4.9,
        completedTrips: 184,
        preferredLanguage: language,
      };
      onLogin(user, 'collector');
    } else if (showCustomModal === 'recycler') {
      const user: AuthUser = {
        id: `r-${Date.now().toString(36)}`,
        role: 'recycler',
        name: name.trim() || 'Municipal Waste & Recycler Desk',
        phone: phone.trim() || '+91 33 2286 1000',
        partnerId: 'EPR-AUDIT-KMC-2026',
        zone: area.trim() || 'Central Municipal Yard',
        rating: 5.0,
        completedTrips: 1420,
        preferredLanguage: language,
      };
      onLogin(user, 'impact');
    } else {
      const user: AuthUser = {
        id: `h-${Date.now().toString(36)}`,
        role: 'household',
        name: name.trim() || 'Deblina Mukherjee',
        phone: phone.trim() || '+91 98300 54321',
        address: area.trim() || 'Flat 3B, Ballygunge Park Road, Kolkata',
        zone: 'Ballygunge Ward 69',
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
              <span>National Urban Waste Mission • Formal Municipal E-Waste & Scrap Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Kabadiwala Connect
            </h1>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              Institutional Solid Waste Segregation, Disposal, and Sanitization Platform.
              Connecting households directly with informal waste collectors, on-site verified digital scales, and authorized CPCB recycling yards under EPR 2022.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 100% Manual Address (No Maps)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 4-Digit Security PIN
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> CPCB Traceability
              </span>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="md:col-span-5 flex justify-center">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/60 to-emerald-100/40 p-4 border border-emerald-100 w-full max-w-xs shadow-2xs">
              <CollectorHeroIllustration className="w-full h-auto max-h-48 object-contain" />
              <div className="mt-2 text-center">
                <p className="text-[11px] font-bold text-slate-800">
                  Doorstep Segregation • Digital Scale • Cash on Delivery
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
            Select Your Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Choose your role in the three-sided recycling ecosystem to enter your dedicated, isolated workspace.
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
                  Source & Demand Side
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  1. Household / Citizen Portal
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Practice source segregation across Dry Recyclables, Wet/Compostable Waste, and E-Waste. Request doorstep scrap pickups with manual address entry and live lifecycle tracking.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Itemized scrap selection & est. payout</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Doorstep address & landmark entry</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>4-digit resident security PIN</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Post-pickup rating & segregation audit</span>
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
                <span>Enter Household Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('household')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-700 py-1"
              >
                Or enter custom citizen phone / address &rarr;
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
                  Execution & Field Side
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  2. Informal Collector Portal
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Empowering informal waste collectors and trike partners. Accept nearby household jobs, arrive at doorstep, unlock scale weighing via 4-digit PIN, and track earnings ledger.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-emerald-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Live job queue & 1-click acceptance</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Doorstep arrival & PIN unlock</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Itemized digital scale weight calculator</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Daily earnings ledger & yard handovers</span>
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
                <span>Enter Collector Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('collector')}
                className="w-full text-center text-[11px] font-semibold text-slate-600 hover:text-emerald-800 py-1"
              >
                Or enter custom collector ID &rarr;
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
                  Compliance & ESG Desk
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  3. Authorized Recycler & Municipal Desk
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Institutional visibility for municipal corporations and formal CPCB recyclers. Dynamic ESG metrics, landfill diversion logs, segregation compliance rate, and chain-of-custody audit.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Landfill waste diverted (kg) & CO₂ offset</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Source segregation compliance rate %</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>End-to-end traceability audit table</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>1-click CPCB Form IV EPR CSV export</span>
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
                <span>Enter Municipal / Recycler Desk</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCustomModal('recycler')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-700 py-1"
              >
                Or enter institutional credentials &rarr;
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
            <p className="text-xs font-bold text-slate-900">Landfill Diversion</p>
            <p className="text-[11px] text-slate-500">
              Recover high-purity copper, PCBs, & dry fractions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/70 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Fair Field Weighing</p>
            <p className="text-[11px] text-slate-500">
              Itemized digital scales with daily EPR benchmark rates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/70 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <LinkIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Formal Recycler Link</p>
            <p className="text-[11px] text-slate-500">
              Zero open burning; 100% CPCB yard custody
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
                ? 'Informal Collector Credentials'
                : showCustomModal === 'recycler'
                ? 'Municipal / Recycler Credentials'
                : 'Household Citizen Details'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your details to personalize your portal session.
            </p>

            <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    showCustomModal === 'collector'
                      ? 'e.g. Ramesh Mondal'
                      : showCustomModal === 'recycler'
                      ? 'e.g. KMC Inspection Officer'
                      : 'e.g. Ananya Sen'
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number / Partner ID
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
                  Area / Ward / Street Address
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Ballygunge Ward 69, Kolkata"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Enter Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
