import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Language, MaterialLine } from '../types';
import { materialCatalog, formatINR } from '../data/mockData';
import { getTranslation, useVernacularAudio } from '../lib/i18n';

interface PriceBoardProps {
  language: Language;
}

export const PriceBoard: React.FC<PriceBoardProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = getTranslation(language);
  const { isPlaying, activeId, playAudio, stopAudio, text: spokenActiveText } = useVernacularAudio();
  const isSpeaking = isPlaying && activeId === 'price-board';

  const filteredMaterials = materialCatalog.filter((m) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ewaste') return m.category === 'ewaste' || m.category === 'display';
    if (selectedCategory === 'metals') return m.category === 'metal';
    if (selectedCategory === 'batteries') return m.category === 'battery';
    if (selectedCategory === 'others') return m.category === 'plastic' || m.category === 'paper';
    return true;
  });

  const handleSpeakAllRates = () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }

    let spokenText = '';
    if (language === 'hi') {
      spokenText =
        'आज के प्रमुख ई-कचरा व स्क्रैप भाव: सर्किट बोर्ड 285 रुपये किलो. तांबे की केबल 220 रुपये किलो. बैटरियां 95 रुपये किलो. मोटर्स 58 रुपये किलो. एलसीडी पैनल 52 रुपये किलो. लोहा 34 रुपये किलो. गत्ता 14 रुपये किलो.';
    } else if (language === 'bn') {
      spokenText =
        'আজকের প্রধান ই-বর্জ্য ও স্ক্র্যাপের বাজারদর: সার্কিট বোর্ড প্রতি কেজি ২৮৫ টাকা, তামার তার প্রতি কেজি ২২০ টাকা, ব্যাটারি প্রতি কেজি ৯৫ টাকা, মোটর প্রতি কেজি ৫৮ টাকা, এলসিডি প্যানেল প্রতি কেজি ৫২ টাকা, লোহা প্রতি কেজি ৩৪ টাকা, কার্টন ও পিচবোর্ড প্রতি কেজি ১৪ টাকা।';
    } else {
      spokenText =
        'Today\'s verified EPR scrap rates: PCBs at 285 rupees per kg. Copper cables at 220 rupees per kg. Batteries at 95 rupees per kg. Motors at 58 rupees per kg. LCD panels at 52 rupees per kg. Iron at 34 rupees per kg. Cardboard at 14 rupees per kg.';
    }

    playAudio(spokenText, language, 'price-board');
  };

  return (
    <div className="space-y-6">
      {/* Header and Voice Readout Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>{language === 'hi' ? 'सीपीसीबी ईपीआर बेंचमार्क दरें' : language === 'bn' ? 'সিপিসিবি ইপিআর বাজারদর অনুসন্ধান' : 'EPR Benchmark Discovery'}</span>
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {t.priceBoardTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            {t.priceBoardSubtitle}
          </p>
        </div>

        {/* Audio Speech Readout Button */}
        <button
          id="listen-price-board-btn"
          type="button"
          onClick={handleSpeakAllRates}
          className={`w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-xs transition-all active:scale-95 touch-manipulation ${
            isSpeaking
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500'
          }`}
          title={isSpeaking ? t.stopAudio : t.listenPrices}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-5 w-5" />
              <span>{t.stopAudio}</span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              <span>{t.listenPrices}</span>
            </>
          )}
        </button>
      </div>

      {/* Synchronized Visual Text Subtitle Banner for Price Readout */}
      {isSpeaking && (
        <div className="rounded-2xl bg-slate-900 text-white p-4 border-2 border-emerald-500 shadow-md animate-in fade-in flex items-start gap-3">
          <Volume2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {language === 'hi' ? 'हिंदी ध्वनि वाचन सक्रिय' : language === 'bn' ? 'বাংলা অডিও বার্তা সক্রিয়' : 'Spoken Audio Active'}
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'दैनिक भाव सारांश' : language === 'bn' ? 'দৈনিক বাজারদর সারাংশ' : 'Daily Rates Summary'}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-medium text-emerald-50 leading-relaxed font-sans">
              "{spokenActiveText}"
            </p>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: language === 'hi' ? 'सभी सामग्रियां' : language === 'bn' ? 'সকল বিভাগ' : 'All Categories' },
          { id: 'ewaste', label: language === 'hi' ? 'ई-कचरा व सर्किट्स' : language === 'bn' ? 'ই-বর্জ্য ও পিসিবি' : 'E-Waste & PCBs' },
          { id: 'metals', label: language === 'hi' ? 'तांबा, केबल व धातु' : language === 'bn' ? 'তামা, তার ও ধাতু' : 'Copper & Metals' },
          { id: 'batteries', label: language === 'hi' ? 'बैटरियां' : language === 'bn' ? 'ব্যাটারি' : 'Batteries' },
          { id: 'others', label: language === 'hi' ? 'प्लास्टिक, गत्ता व रद्दी' : language === 'bn' ? 'প্লাস্টিক ও পিচবোর্ড' : 'Plastics & Paper' },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`price-filter-${cat.id}`}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[44px] rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((mat) => {
          const label =
            language === 'hi'
              ? mat.labelHi
              : language === 'bn'
              ? (mat.labelBn || mat.label)
              : mat.label;
          const desc =
            language === 'hi'
              ? mat.descriptionHi
              : language === 'bn'
              ? (mat.descriptionBn || mat.description)
              : mat.description;

          return (
            <div
              key={mat.key}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {label}
                  </h3>
                  {mat.trend === 'up' ? (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {mat.trendPercent}
                    </span>
                  ) : mat.trend === 'down' ? (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
                      <TrendingDown className="h-3.5 w-3.5" />
                      {mat.trendPercent}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                      <Minus className="h-3.5 w-3.5" />
                      {language === 'hi' ? 'स्थिर' : language === 'bn' ? 'স্থিতিশীল' : 'Steady'}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {desc}
                </p>

                {mat.hazardousNote && (
                  <div className="mt-2.5 rounded-md border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-[11px] font-medium text-amber-900">
                    <span className="font-bold">{language === 'hi' ? 'सावधानी:' : language === 'bn' ? 'বিজ্ঞপ্তি:' : 'Notice:'}</span> {mat.hazardousNote}
                  </div>
                )}
              </div>

              {/* Price & Range */}
              <div className="mt-5 border-t border-slate-100 pt-3.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {t.currentRate}
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {formatINR(mat.rate)}
                      <span className="text-xs font-normal text-slate-600"> {t.perKg}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {t.fairMarketRange}
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      {mat.marketRange}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
