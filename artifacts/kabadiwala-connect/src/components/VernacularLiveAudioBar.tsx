import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useVernacularAudio, getTranslation, languageNames } from '../lib/i18n';

export const VernacularLiveAudioBar: React.FC = () => {
  const { isPlaying, text, lang, stopAudio } = useVernacularAudio();
  const t = getTranslation(lang);

  if (!isPlaying || !text) {
    return null;
  }

  return (
    <aside
      aria-label="Vernacular audio live caption player"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 shadow-2xl pointer-events-auto"
    >
      <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900/95 text-white p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2.5 mb-2.5">
          {/* Equalizer & Title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black">
              <Volume2 className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {t.liveAudioBarTitle || 'Voice Audio Active'}
                </span>
                <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800/80">
                  {languageNames[lang].native}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.liveAudioPlayingBadge || 'Live Spoken Readout'}
              </p>
            </div>
          </div>

          {/* Sound Wave Animation & Stop Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-1 h-5 px-2">
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-5" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
            </div>

            <button
              type="button"
              id="stop-vernacular-audio-btn"
              onClick={stopAudio}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all"
            >
              <VolumeX className="h-3.5 w-3.5" />
              <span>{t.stopAudio || 'Stop'}</span>
            </button>
          </div>
        </div>

        {/* Live Synchronized Spoken Transcript */}
        <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            {t.spokenTranscriptLabel || 'Spoken Transcript'}:
          </span>
          <p className="text-sm font-semibold text-emerald-100 leading-relaxed break-words font-sans">
            "{text}"
          </p>
        </div>
      </div>
    </aside>
  );
};
