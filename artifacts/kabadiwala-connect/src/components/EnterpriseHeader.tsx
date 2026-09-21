import React, { useState } from 'react';
import {
  Recycle,
  Menu,
  Bell,
  User,
  LogOut,
  Globe,
  CheckCircle2,
  X,
  ShieldCheck,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { AuthUser, Language, AppView } from '../types';
import { languageNames, getTranslation } from '../lib/i18n';

interface EnterpriseHeaderProps {
  authUser: AuthUser | null;
  onSignOut: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  authUser,
  onSignOut,
  language,
  onLanguageChange,
  currentView,
  onNavigateView,
}) => {
  const t = getTranslation(language);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Portal label
  const portalLabel =
    currentView === 'collector'
      ? 'Field Partner Portal'
      : currentView === 'impact'
      ? 'Municipal & Recycler Desk'
      : currentView === 'household'
      ? 'Citizen Portal'
      : '';

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-700 text-white shadow-md transition-all">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
          {/* Left: Brand & Active Portal Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {authUser && (
              <button
                id="header-menu-button"
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-600 hover:text-white transition-colors focus:outline-none"
                aria-label="Open profile drawer"
              >
                <Menu className="h-5 w-5 stroke-[2.3]" />
              </button>
            )}

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                <Recycle className="h-5 w-5 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  Kabadiwala Connect
                </span>
                {portalLabel && (
                  <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-200 mt-0.5 tracking-tight">
                    {portalLabel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center: Offline Ready Live Sync Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-800/80 px-3 py-1 text-[11px] font-bold text-emerald-100 border border-emerald-600/60 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Offline Ready • Local Sync Active</span>
          </div>

          {/* Right: Vernacular Toggle, Alerts & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Vernacular Language Switcher Pills */}
            <div className="flex items-center bg-emerald-800/90 rounded-xl p-0.5 border border-emerald-600/60">
              {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-all ${
                    language === lang
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                  title={languageNames[lang].label}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'বা'}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-600 hover:text-white transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-emerald-700 animate-pulse" />
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-100 bg-white p-3 text-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Municipal & EPR Alerts
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Doorstep Segregation Verified</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Order #KC-1052 verified on digital scale with 4-digit PIN.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-900 flex items-start gap-2">
                      <Recycle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Today's EPR Scrap Rates Active</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          PCBs at ₹285/kg · Copper at ₹220/kg · Cardboard at ₹14/kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strict Authentication: Explicit Sign Out Button */}
            {authUser ? (
              <button
                id="header-sign-out-btn"
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 border border-emerald-600/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                title="Sign out of current session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.signOut}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Slide-out Menu / Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white text-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-emerald-700 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">Kabadiwala Connect</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-600 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User badge if logged in */}
              {authUser && (
                <div className="mt-4 rounded-xl bg-emerald-800/90 p-3 border border-emerald-600/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                      {authUser.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sm truncate">{authUser.name}</p>
                      <p className="text-xs text-emerald-200 capitalize">
                        {portalLabel}
                      </p>
                      {authUser.phone && (
                        <p className="text-[11px] text-emerald-300 mt-0.5">{authUser.phone}</p>
                      )}
                    </div>
                  </div>
                  {authUser.zone && (
                    <div className="mt-2 text-[11px] text-emerald-100 bg-emerald-900/40 px-2 py-1 rounded-lg">
                      Zone: {authUser.zone}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Field Sync Status Card */}
              <div className="rounded-xl bg-emerald-50/80 p-3.5 border border-emerald-100 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <span>Offline Ready • Local Sync Active</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  All weighing records, PIN authorizations, and payouts are persisted securely in local storage and synced automatically.
                </p>
              </div>

              {/* Institutional Certification */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>CPCB & EPR Compliant</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Meets E-Waste Management Rules 2022 & Municipal Solid Waste Segregation Standards.
                </p>
              </div>

              {/* Safety Helpline */}
              <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-100 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <PhoneCall className="h-4 w-4 text-amber-600" />
                  <span>Municipal EPR Helpline</span>
                </div>
                <p className="text-[11px] text-amber-800 font-mono font-bold mt-0.5">
                  1800-SWACHH-EPR (Toll Free)
                </p>
              </div>

              {/* Language Selection inside Drawer */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Language / भाषा / ভাষা
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-colors ${
                        language === lang
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <p>{languageNames[lang].native}</p>
                      <p
                        className={`text-[10px] ${
                          language === lang ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {languageNames[lang].label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explicit Sign Out in Drawer Footer */}
            <div className="border-t border-slate-100 p-4">
              {authUser ? (
                <button
                  id="drawer-sign-out-btn"
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onSignOut();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.signOut}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
