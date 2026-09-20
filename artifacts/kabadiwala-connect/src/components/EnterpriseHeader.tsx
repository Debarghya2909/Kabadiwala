import React, { useState, useEffect } from 'react';
import {
  Recycle,
  LogOut,
  Globe,
  BarChart3,
  Truck,
  Home,
  UserCheck,
  CheckCircle2,
  Wifi,
  WifiOff,
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
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Product Title & Clean Micro-Text Subtitle (No bulky badge) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (authUser) {
                onNavigateView(authUser.role === 'collector' ? 'collector' : 'household');
              } else {
                onNavigateView('login');
              }
            }}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Recycle className="h-5 w-5 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  Kabadiwala Connect
                </span>
                <span className="hidden text-slate-300 md:inline">·</span>
                {/* Refined clean micro-text subtitle meeting CPCB compliance without prototype badge */}
                <span className="hidden text-[11px] font-medium text-slate-500 md:inline">
                  {language === 'hi'
                    ? 'औपचारिक ई-कचरा व रीसाइक्लिंग नेटवर्क'
                    : language === 'bn'
                    ? 'আনুষ্ঠানিক ই-বর্জ্য ও স্ক্র্যাপ রিসাইক্লিং নেটওয়ার্ক'
                    : 'Formal E-Waste & Scrap Recycling Network'}
                </span>
              </div>
              <div className="text-[11px] font-medium text-emerald-700 md:hidden">
                {language === 'hi'
                  ? 'अधिकृत रीसाइक्लिंग नेटवर्क'
                  : language === 'bn'
                  ? 'অনুমোদিত রিসাইক্লিং নেটওয়ার্ক'
                  : 'Formal Recycling Network'}
              </div>
            </div>
          </button>
        </div>

        {/* Center: Navigation Items (Portal vs Municipal ESG Impact) */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100/80 p-1">
          {authUser ? (
            <button
              id="header-nav-portal-btn"
              type="button"
              onClick={() =>
                onNavigateView(authUser.role === 'collector' ? 'collector' : 'household')
              }
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                currentView === 'household' || currentView === 'collector'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {authUser.role === 'collector' ? (
                <>
                  <Truck className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{t.collectorPortal}</span>
                </>
              ) : (
                <>
                  <Home className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{t.citizenPortal}</span>
                </>
              )}
            </button>
          ) : (
            <button
              id="header-nav-login-btn"
              type="button"
              onClick={() => onNavigateView('login')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                currentView === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5 text-slate-600" />
              <span>Role Selection</span>
            </button>
          )}

          <button
            id="header-nav-impact-btn"
            type="button"
            onClick={() => onNavigateView('impact')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              currentView === 'impact'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{t.tabImpact}</span>
          </button>
        </nav>

        {/* Right side: Offline-First Indicator + Vernacular Switcher + User Status / Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Mobile Impact button if lg is hidden */}
          <button
            id="header-mobile-impact-btn"
            type="button"
            onClick={() => onNavigateView(currentView === 'impact' ? (authUser ? (authUser.role === 'collector' ? 'collector' : 'household') : 'login') : 'impact')}
            className={`lg:hidden inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              currentView === 'impact'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
            title="Toggle Municipal ESG Impact Dashboard"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ESG</span>
          </button>

          {/* Offline-First Sync Status Indicator */}
          <div
            id="offline-sync-status"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs"
            title={
              isOnline
                ? 'Online: LocalStorage database synced seamlessly across browser tabs'
                : 'Offline Mode: Field transactions saved safely to device LocalStorage'
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isOnline ? t.offlineSyncOnline : t.offlineSyncOffline}
            </span>
          </div>

          {/* Vernacular Language Switcher */}
          <div
            id="vernacular-language-toggle"
            className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-2xs"
            role="group"
            aria-label="Language Selector"
          >
            <div className="hidden items-center pl-2 pr-1 text-slate-500 sm:flex">
              <Globe className="h-3.5 w-3.5" />
            </div>
            {(['en', 'hi', 'bn'] as Language[]).map((lang) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  id={`lang-btn-${lang}`}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`Switch to ${languageNames[lang].label}`}
                >
                  {languageNames[lang].native}
                </button>
              );
            })}
          </div>

          {/* Authenticated User info & Explicit Sign Out button */}
          {authUser && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
              <div className="hidden text-right xl:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {authUser.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {authUser.role === 'collector'
                    ? language === 'hi'
                      ? 'कबाड़ीवाला साथी'
                      : language === 'bn'
                      ? 'কবাডিওয়ালা সাথী'
                      : 'Collector Partner'
                    : language === 'hi'
                    ? 'नागरिक खाता'
                    : language === 'bn'
                    ? 'নাগরিক অ্যাকাউন্ট'
                    : 'Household Citizen'}
                </div>
              </div>

              <button
                id="header-sign-out-btn"
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                title="Sign Out to Role Selection"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'लॉग आउट' : language === 'bn' ? 'লগ আউট' : 'Sign Out'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
