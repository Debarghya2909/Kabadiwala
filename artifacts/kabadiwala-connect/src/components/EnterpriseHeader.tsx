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
  Volume2,
  Lock,
  MapPin,
  Truck,
  Calendar,
  PackageCheck,
  TrendingUp,
  Scale,
  FileText,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { AuthUser, Language, AppView } from '../types';
import { languageNames, getTranslation, testVernacularVoice } from '../lib/i18n';

interface EnterpriseHeaderProps {
  authUser: AuthUser | null;
  onSignOut: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentView: AppView;
  onNavigateView?: (view: AppView) => void;
  onSelectSubTab?: (tab: string) => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  authUser,
  onSignOut,
  language,
  onLanguageChange,
  currentView,
  onSelectSubTab,
}) => {
  const t = getTranslation(language);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(false);

  // Portal label
  const portalLabel =
    currentView === 'collector'
      ? (language === 'hi' ? 'कबाड़ीवाला पार्टनर पोर्टल' : language === 'bn' ? 'সংগ্রাহক পার্টনার পোর্টাল' : 'Field Partner Portal')
      : currentView === 'impact'
      ? (language === 'hi' ? 'नगरपालिका व रीसाइक्लर डेस्क' : language === 'bn' ? 'পৌরসভা ও রিসাইক্লিং ডেস্ক' : 'Municipal & Recycler Desk')
      : currentView === 'household'
      ? (language === 'hi' ? 'नागरिक पोर्टल' : language === 'bn' ? 'নাগরিক পোর্টাল' : 'Citizen Portal')
      : '';

  const handleTestAudio = () => {
    setIsPlayingAudioTest(true);
    testVernacularVoice(language);
    setTimeout(() => {
      setIsPlayingAudioTest(false);
    }, 4500);
  };

  const handleSubTabClick = (tabKey: string) => {
    if (onSelectSubTab) {
      onSelectSubTab(tabKey);
    }
    setDrawerOpen(false);
  };

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
                className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-600 hover:text-white active:scale-95 transition-all focus:outline-none touch-manipulation"
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

          {/* Right: Vernacular Toggle, Alerts & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Vernacular Language Switcher Pills */}
            <div className="flex items-center bg-emerald-800/90 rounded-xl p-0.5 border border-emerald-600/60">
              {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`min-h-[36px] min-w-[34px] flex items-center justify-center rounded-lg px-2 py-1 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
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
                className="relative flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-emerald-100 hover:bg-emerald-600 hover:text-white active:scale-95 transition-all focus:outline-none touch-manipulation"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 stroke-[2.2]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-emerald-700 animate-pulse" />
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-100 bg-white p-3 text-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {language === 'hi' ? 'नगरपालिका व ईपीआर अलर्ट' : language === 'bn' ? 'পৌরসভা ও ইপিআর সতর্কতা' : 'Municipal & EPR Alerts'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="min-h-[36px] px-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      {language === 'hi' ? 'बंद करें' : language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {language === 'hi' ? 'घर पर पृथक्करण सत्यापित' : language === 'bn' ? 'দোরগোড়ায় বর্জ্য বাছাই যাচাইকৃত' : 'Doorstep Segregation Verified'}
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          {language === 'hi' ? 'ऑर्डर #KC-1052 4-अंकीय पिन व डिजिटल कांटे पर सत्यापित।' : language === 'bn' ? 'অর্ডার #KC-1052 ৪-সংখ্যার পিন ও ডিজিটাল স্কেলে যাচাইকৃত।' : 'Order #KC-1052 verified on digital scale with 4-digit PIN.'}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-900 flex items-start gap-2">
                      <Recycle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {language === 'hi' ? 'आज के ईपीआर स्क्रैप भाव सक्रिय' : language === 'bn' ? 'আজকের ইপিআর স্ক্র্যাপ বাজারদর সক্রিয়' : 'Today\'s EPR Scrap Rates Active'}
                        </p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          {language === 'hi' ? 'सर्किट बोर्ड ₹285/किग्रा · तांबा ₹220/किग्रा · गत्ता ₹14/किग्रा' : language === 'bn' ? 'সার্কিট বোর্ড ₹২৮৫/কেজি · তামা ₹২২০/কেজি · পিচবোর্ড ₹১৪/কেজি' : 'PCBs at ₹285/kg · Copper at ₹220/kg · Cardboard at ₹14/kg'}
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
                className="min-h-[40px] flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 border border-emerald-600/80 px-3 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition-all touch-manipulation"
                title="Sign out of current session"
              >
                <LogOut className="h-4 w-4 stroke-[2.2]" />
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
              {/* 1. Active User Profile Summary & KYC Verification */}
              {authUser && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {t.profileTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>{t.verifiedKycBadge}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t.activeSession}:</span>
                      <span className="font-bold text-slate-900 capitalize">{portalLabel}</span>
                    </div>

                    {authUser.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t.phone}:</span>
                        <span className="font-mono font-semibold text-slate-800">{authUser.phone}</span>
                      </div>
                    )}

                    {authUser.zone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t.zone}:</span>
                        <span className="font-semibold text-slate-800">{authUser.zone}</span>
                      </div>
                    )}

                    {authUser.partnerId && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t.partnerId}:</span>
                        <span className="font-mono font-bold text-emerald-700">{authUser.partnerId}</span>
                      </div>
                    )}

                    {authUser.vehicle && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t.vehicle}:</span>
                        <span className="font-semibold text-slate-800">{authUser.vehicle}</span>
                      </div>
                    )}

                    {authUser.address && (
                      <div className="pt-1 border-t border-slate-200/80">
                        <span className="text-[11px] text-slate-500 block">{t.registeredAddress}:</span>
                        <span className="text-[11px] font-semibold text-slate-800 line-clamp-2">{authUser.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Contextual Quick Navigation within Active Portal */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t.quickNav}
                </p>
                <div className="space-y-1">
                  {currentView === 'household' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubTabClick('schedule')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerSchedule}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('tracking')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <PackageCheck className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerTracking}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('prices')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerPriceBoard}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('safety')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerSafety}</span>
                      </button>
                    </>
                  )}

                  {currentView === 'collector' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubTabClick('queue')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerQueue}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('active')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Scale className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerScale}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('handover')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerHandover}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('prices')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerPriceBoard}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('safety')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>{t.drawerSafety}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('recyclers')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Building2 className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerRecyclers}</span>
                      </button>
                    </>
                  )}

                  {currentView === 'impact' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubTabClick('overview')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Activity className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerImpact}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('traceability')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span>{language === 'hi' ? 'ट्रैसेबिलिटी व बैच लॉग' : language === 'bn' ? 'ট্রেসেবিলিটি ও ব্যাচ খতিয়ান' : 'Traceability & Batch Logs'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('recyclers')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <Building2 className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerRecyclers}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabClick('compliance')}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{t.drawerCompliance}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 3. Vernacular Audio Voice Synthesizer Test */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Volume2 className="h-4 w-4 text-emerald-600" />
                    <span>{t.voiceEngineTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">
                    {languageNames[language].native}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 mb-2.5 leading-relaxed">
                  {t.voiceEngineSubtitle} ({languageNames[language].label})
                </p>
                <button
                  id="drawer-test-voice-btn"
                  type="button"
                  onClick={handleTestAudio}
                  disabled={isPlayingAudioTest}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-bold text-white shadow-2xs active:scale-95 transition-all disabled:opacity-75"
                >
                  <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudioTest ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudioTest ? t.testVoicePlaying : t.testVoiceBtn}</span>
                </button>
              </div>

              {/* 4. Vernacular Language Selection inside Drawer */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Language / भाषा / ভাষা
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onLanguageChange(lang)}
                      className={`rounded-xl px-2.5 py-2 text-center transition-all ${
                        language === lang
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                      }`}
                    >
                      <p className="text-xs">{languageNames[lang].native}</p>
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

              {/* 5. Strict Role Isolation Security Callout */}
              <div className="rounded-xl bg-slate-100/90 border border-slate-200/80 p-3 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
                <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{t.sessionLockedNotice}</span>
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors active:scale-95"
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
