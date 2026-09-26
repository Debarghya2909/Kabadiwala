import React, { useState, useEffect } from 'react';
import {
  Star,
  X,
  Check,
  ShieldCheck,
  Phone,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Award,
  Truck,
  Scale,
  CircleDollarSign,
} from 'lucide-react';
import { Pickup, CollectorRating, Language } from '../types';
import { getTranslation, speakVernacular, stopVernacularSpeech } from '../lib/i18n';
import { formatINR, formatDateShort } from '../data/mockData';

interface CollectorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickup: Pickup | null;
  initialStars?: number;
  language: Language;
  onSubmitRating: (pickupId: string, rating: CollectorRating) => void;
}

export const CollectorFeedbackModal: React.FC<CollectorFeedbackModalProps> = ({
  isOpen,
  onClose,
  pickup,
  initialStars,
  language,
  onSubmitRating,
}) => {
  const t = getTranslation(language);

  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync state when opened or pickup changes
  useEffect(() => {
    if (pickup) {
      if (pickup.rating) {
        setStars(pickup.rating.stars);
        setSelectedTags(pickup.rating.tags || []);
        setComment(pickup.rating.comment || '');
      } else {
        setStars(initialStars && initialStars >= 1 && initialStars <= 5 ? initialStars : 5);
        setSelectedTags([t.tagPunctual, t.tagFairWeighing, t.tagCashImmediate]);
        setComment('');
      }
      setHoverStars(null);
      setIsSpeaking(false);
      setIsSubmitting(false);
    }
  }, [pickup, initialStars, isOpen]);

  // Clean audio on close
  useEffect(() => {
    if (!isOpen) {
      stopVernacularSpeech();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen || !pickup) return null;

  const collectorName = pickup.collectorName || 'Raju Das (Field Partner)';
  const collectorVehicle = pickup.collectorVehicle || 'Electric Cargo Trike (WB-02-AK-4192)';
  const displayStars = hoverStars !== null ? hoverStars : stars;

  const availableTags = [
    t.tagPunctual,
    t.tagFairWeighing,
    t.tagCashImmediate,
    t.tagCleanHandling,
    t.tagSafeHandling,
    t.tagFairPrice,
    t.tagPoliteRespectful,
  ];

  const presets = [
    t.feedbackPreset1,
    t.feedbackPreset2,
    t.feedbackPreset3,
  ];

  const getScoreDescriptor = (score: number) => {
    switch (score) {
      case 1:
        return { label: t.ratingScore1, color: 'text-rose-600 bg-rose-50 border-rose-200', icon: '😞' };
      case 2:
        return { label: t.ratingScore2, color: 'text-amber-700 bg-amber-50 border-amber-200', icon: '😐' };
      case 3:
        return { label: t.ratingScore3, color: 'text-blue-700 bg-blue-50 border-blue-200', icon: '🙂' };
      case 4:
        return { label: t.ratingScore4, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: '😊' };
      case 5:
      default:
        return { label: t.ratingScore5, color: 'text-emerald-800 bg-emerald-100/80 border-emerald-300', icon: '🌟' };
    }
  };

  const descriptor = getScoreDescriptor(displayStars);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleApplyPreset = (presetText: string) => {
    setComment((prev) => {
      if (!prev.trim()) return presetText;
      if (prev.includes(presetText)) return prev;
      return `${prev.trim()} ${presetText}`;
    });
  };

  // Speak review summary in vernacular
  const handleToggleSpeakReview = () => {
    if (isSpeaking) {
      stopVernacularSpeech();
      setIsSpeaking(false);
      return;
    }

    let phrase = `Review for scrap collector ${collectorName}: ${stars} stars. ${descriptor.label}.`;
    if (selectedTags.length > 0) {
      phrase += ` Verified highlights: ${selectedTags.join(', ')}.`;
    }
    if (comment.trim()) {
      phrase += ` Resident comment: ${comment.trim()}`;
    }

    if (language === 'hi') {
      phrase = `कबाड़ी साथी ${collectorName} के लिए समीक्षा: ${stars} सितारे। ${descriptor.label}।`;
      if (selectedTags.length > 0) {
        phrase += ` मुख्य विशेषताएं: ${selectedTags.join(', ')}।`;
      }
      if (comment.trim()) {
        phrase += ` नागरिक की टिप्पणी: ${comment.trim()}`;
      }
    } else if (language === 'bn') {
      phrase = `স্ক্র্যাপ সংগ্রাহক ${collectorName}-এর জন্য মূল্যায়ন: ${stars} তারা। ${descriptor.label}।`;
      if (selectedTags.length > 0) {
        phrase += ` উল্লেখযোগ্য বৈশিষ্ট্য: ${selectedTags.join(', ')}।`;
      }
      if (comment.trim()) {
        phrase += ` বাসিন্দার মন্তব্য: ${comment.trim()}`;
      }
    }

    setIsSpeaking(true);
    const ok = speakVernacular(phrase, language);
    if (!ok) {
      setIsSpeaking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ratingObj: CollectorRating = {
      stars,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      ratedAt: new Date().toISOString(),
    };

    onSubmitRating(pickup.id, ratingObj);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 my-auto text-slate-800">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          aria-label={t.close}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-2xs">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3
              id="feedback-modal-title"
              className="text-lg sm:text-xl font-black text-slate-900 tracking-tight"
            >
              {pickup.rating ? t.editRatingBtn : t.ratingModalTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.ratingModalSubtitle}
            </p>
          </div>
        </div>

        {/* Collector & Pickup Summary Card */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-sm shadow-xs">
                {collectorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {collectorName}
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                    <ShieldCheck className="h-3 w-3 text-emerald-700" />
                    {t.verifiedKycBadge.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Truck className="h-3 w-3 text-slate-400" />
                  <span>{collectorVehicle}</span>
                </div>
              </div>
            </div>

            {pickup.collectorPhone && (
              <a
                href={`tel:${pickup.collectorPhone}`}
                className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-xs font-bold text-emerald-700 border border-slate-200 hover:bg-emerald-50 transition-colors"
                title={t.callPartner}
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.callPartner}</span>
              </a>
            )}
          </div>

          {/* Quick Pickup Key Specs */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-2.5 text-[11px]">
            <div>
              <span className="text-slate-400 block">{t.referenceCode.split(' ')[0]}:</span>
              <strong className="font-mono text-slate-800 font-bold">#{pickup.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t.totalVerifiedLabel.split(' ')[1] || 'Weight'}:</span>
              <strong className="text-slate-800 font-bold">
                {pickup.finalKg || pickup.estimatedKg} {t.kg}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t.total}:</span>
              <strong className="text-emerald-700 font-black">
                ₹{pickup.payout}
              </strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Interactive 5-Star Rating Selector */}
          <div className="rounded-2xl border-2 border-amber-200/80 bg-amber-50/40 p-4 text-center space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.rateCollectorTitle}
            </label>

            {/* Stars Row */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = starIndex <= displayStars;
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onClick={() => setStars(starIndex)}
                    onMouseEnter={() => setHoverStars(starIndex)}
                    onMouseLeave={() => setHoverStars(null)}
                    className="p-1 sm:p-2 rounded-2xl transition-all transform hover:scale-125 active:scale-95 focus:outline-hidden touch-manipulation cursor-pointer"
                    aria-label={`${starIndex} Star - ${getScoreDescriptor(starIndex).label}`}
                  >
                    <Star
                      className={`h-9 w-9 sm:h-10 sm:w-10 transition-colors drop-shadow-xs ${
                        isFilled
                          ? 'fill-amber-400 text-amber-500 filter drop-shadow-sm'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Score Descriptor Badge */}
            <div className="flex items-center justify-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black border transition-all ${descriptor.color}`}
              >
                <span>{descriptor.icon}</span>
                <span>{stars} / 5</span>
                <span>•</span>
                <span>{descriptor.label}</span>
              </span>
            </div>
          </div>

          {/* Service Quality Tags Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                {t.selectComplianceTags}
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedTags.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer touch-manipulation flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : (
                      <span className="text-slate-400 text-xs">+</span>
                    )}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resident Feedback Comments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                {t.optionalCommentPlaceholder}
              </label>
              <span className="text-[11px] text-slate-400">
                {comment.length} / 300
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 mb-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors text-left"
                >
                  💡 "{preset.slice(0, 32)}..."
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              maxLength={300}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.optionalCommentPlaceholder}
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden transition-all resize-none"
            />
          </div>

          {/* Voice Preview Button */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-700">
                {t.audioListenFeedback}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleSpeakReview}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {isSpeaking ? t.stopAudio : t.listenAudio}
            </button>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition-all disabled:opacity-50"
            >
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              <span>{t.submitVerifiedRatingBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
