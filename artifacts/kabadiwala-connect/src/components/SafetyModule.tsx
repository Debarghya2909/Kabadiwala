import React from 'react';
import {
  Flame,
  FlaskConical,
  BatteryCharging,
  Tv2,
  ShieldAlert,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Language, SafetyGuideItem } from '../types';
import { safetyGuides } from '../data/mockData';
import { getTranslation, useVernacularAudio } from '../lib/i18n';

interface SafetyModuleProps {
  language: Language;
}

export const SafetyModule: React.FC<SafetyModuleProps> = ({ language }) => {
  const t = getTranslation(language);
  const { isPlaying, activeId, playAudio, stopAudio } = useVernacularAudio();

  const handlePlayAudio = (guide: SafetyGuideItem) => {
    if (isPlaying && activeId === guide.id) {
      stopAudio();
      return;
    }

    let textToSpeak = guide.audioSpeechText;
    if (language === 'hi') textToSpeak = guide.audioSpeechTextHi;
    if (language === 'bn') textToSpeak = guide.audioSpeechTextBn || guide.audioSpeechText;

    playAudio(textToSpeak, language, guide.id);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="h-6 w-6 text-red-600" />;
      case 'FlaskConical':
        return <FlaskConical className="h-6 w-6 text-amber-600" />;
      case 'BatteryCharging':
        return <BatteryCharging className="h-6 w-6 text-rose-600" />;
      case 'Tv2':
        return <Tv2 className="h-6 w-6 text-blue-600" />;
      default:
        return <ShieldAlert className="h-6 w-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl border border-red-200 bg-red-50/70 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-600 p-2.5 text-white shadow-xs">
              <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-950 sm:text-xl">
                {t.safetyTitle}
              </h2>
              <p className="mt-1 text-xs text-red-800 sm:text-sm">
                {t.safetySubtitle}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-red-900 bg-white/80 border border-red-200 px-3 py-1.5 rounded-lg">
            {language === 'hi'
              ? 'ई-कचरा नियम 2022 के अनुरूप'
              : language === 'bn'
              ? 'ই-বর্জ্য বিধি ২০২২ অনুযায়ী'
              : 'E-Waste Rules 2022 Compliant'}
          </div>
        </div>
      </div>

      {/* Grid of Safety Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {safetyGuides.map((guide) => {
          const isItemPlaying = isPlaying && activeId === guide.id;
          const title =
            language === 'hi' ? guide.titleHi : language === 'bn' ? (guide.titleBn || guide.title) : guide.title;
          const danger =
            language === 'hi'
              ? guide.dangerDescriptionHi
              : language === 'bn'
              ? (guide.dangerDescriptionBn || guide.dangerDescription)
              : guide.dangerDescription;
          const safe =
            language === 'hi'
              ? guide.safePracticeHi
              : language === 'bn'
              ? (guide.safePracticeBn || guide.safePractice)
              : guide.safePractice;
          const economic =
            language === 'hi'
              ? guide.economicBenefitHi
              : language === 'bn'
              ? (guide.economicBenefitBn || guide.economicBenefit)
              : guide.economicBenefit;

          return (
            <div
              key={guide.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                {/* Header row with pictorial icon and Audio button */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
                      {getIcon(guide.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm">
                        {guide.severity === 'critical'
                          ? language === 'hi'
                            ? 'गंभीर खतरा'
                            : language === 'bn'
                            ? 'মারাত্মক ঝুঁকি'
                            : 'Critical Hazard'
                          : language === 'hi'
                          ? 'सावधानी'
                          : language === 'bn'
                          ? 'সতর্কতা'
                          : 'High Caution'}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-slate-900 leading-snug">
                        {title}
                      </h3>
                    </div>
                  </div>

                  {/* Audio Listen Button */}
                  <button
                    id={`safety-audio-btn-${guide.id}`}
                    type="button"
                    onClick={() => handlePlayAudio(guide)}
                    className={`min-h-[44px] inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
                      isItemPlaying
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                    title={isItemPlaying ? t.stopAudio : t.listenAudio}
                  >
                    {isItemPlaying ? (
                      <>
                        <VolumeX className="h-4 w-4 animate-pulse" />
                        <span>{t.stopAudio}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 text-emerald-600" />
                        <span>{language === 'hi' ? 'ऑडियो सुनें' : language === 'bn' ? 'অডিও শুনুন' : 'Listen'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Danger Section */}
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{t.hazardousPractice}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-red-800">
                    {danger}
                  </p>
                </div>

                {/* Safe Practice Section */}
                <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t.safeAlternative}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-800">
                    {safe}
                  </p>
                </div>
              </div>

              {/* Economic Advantage / Profit comparison */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t.economicValue}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {economic}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
