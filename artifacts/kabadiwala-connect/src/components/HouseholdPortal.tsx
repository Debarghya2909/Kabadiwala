import React, { useState, useMemo } from 'react';
import {
  MapPin,
  CalendarDays,
  Scale,
  Truck,
  Leaf,
  CheckCircle2,
  Clock,
  CircleDollarSign,
  AlertCircle,
  Plus,
  Minus,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Phone,
  Radio,
  FileText,
  KeyRound,
  Zap,
  ArrowRight,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
} from 'lucide-react';
import {
  Pickup,
  AuthUser,
  MaterialKey,
  HouseholdTab,
  PickupStatus,
  Language,
  CollectorRating,
} from '../types';
import {
  materialCatalog,
  formatINR,
  formatTimestamp,
  formatDateShort,
  deriveArea,
  deriveUrgency,
} from '../data/mockData';
import { getTranslation } from '../lib/i18n';
import { SafetyModule } from './SafetyModule';
import { PriceBoard } from './PriceBoard';

interface HouseholdPortalProps {
  pickups: Pickup[];
  onUpdatePickups: (next: Pickup[]) => void;
  authUser: AuthUser;
  tab: HouseholdTab;
  onSelectTab: (tab: HouseholdTab) => void;
  activeTrackingId: string | null;
  onSelectTrackingId: (id: string | null) => void;
  language: Language;
}

export const HouseholdPortal: React.FC<HouseholdPortalProps> = ({
  pickups,
  onUpdatePickups,
  authUser,
  tab,
  onSelectTab,
  activeTrackingId,
  onSelectTrackingId,
  language,
}) => {
  const t = getTranslation(language);

  // Scrap material state for scheduling
  const [selectedWeights, setSelectedWeights] = useState<Record<MaterialKey, number>>({
    pcb: 2,
    cables: 3,
    batteries: 0,
    crt: 0,
    lcd: 0,
    motors: 0,
    mixed_plastics: 0,
    iron: 4,
    cardboard: 5,
    newspaper: 6,
  });

  const [address, setAddress] = useState(
    authUser.address || 'Flat 3B, Ballygunge Park Road, Ballygunge, Kolkata'
  );
  const [landmark, setLandmark] = useState('Near Birla Mandir');
  const [slot, setSlot] = useState('⚡ Urgent · Next 45 Mins (Priority)');
  const [notes, setNotes] = useState('');
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // POST-PICKUP COLLECTOR RATING STATE
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Punctual & Prompt',
    'Accurate Scale Weighing',
    'Paid Cash Instantly',
  ]);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [ratingSubmittedId, setRatingSubmittedId] = useState<string | null>(null);

  // Active lines calculation
  const activeLines = useMemo(() => {
    return materialCatalog
      .filter((mat) => (selectedWeights[mat.key] || 0) > 0)
      .map((mat) => ({
        ...mat,
        kg: selectedWeights[mat.key],
      }));
  }, [selectedWeights]);

  const totalKg = activeLines.reduce((acc, l) => acc + l.kg, 0);
  const totalEstimatedPayout = activeLines.reduce((acc, l) => acc + l.kg * l.rate, 0);
  const estimatedCarbonSaved = totalKg * 1.82;

  // Filter pickups for this user
  const userPickups = useMemo(() => {
    return pickups.filter((p) => p.userId === authUser.id || p.userName === authUser.name);
  }, [pickups, authUser]);

  // Determine which pickup is actively being tracked
  const activeTrackedPickup = useMemo(() => {
    if (activeTrackingId) {
      const found = pickups.find((p) => p.id === activeTrackingId);
      if (found) return found;
    }
    const ongoing = userPickups.find((p) => p.status !== 'completed' && p.status !== 'cancelled');
    if (ongoing) return ongoing;
    return userPickups[0] || null;
  }, [activeTrackingId, pickups, userPickups]);

  // Handlers
  const handleWeightChange = (key: MaterialKey, value: number) => {
    setSelectedWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Number.isFinite(value) ? value : 0),
    }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalKg <= 0) {
      alert('Please select at least one material with weight greater than 0 kg.');
      return;
    }

    const newPickupId = `KC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newPickup: Pickup = {
      id: newPickupId,
      userId: authUser.id,
      userName: authUser.name,
      userPhone: authUser.phone,
      address: address.trim(),
      landmark: landmark.trim() || undefined,
      area: deriveArea(address),
      urgency: deriveUrgency(slot),
      slot,
      materials: activeLines.map((l) => ({
        key: l.key,
        label: l.label,
        kg: l.kg,
        rate: l.rate,
      })),
      estimatedKg: totalKg,
      payout: totalEstimatedPayout,
      status: 'pending',
      verificationOtp: newOtp,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          title: 'Scrap Pickup Request Logged',
          timestamp: new Date().toISOString(),
          note: `Requested collection for ${totalKg} kg scrap in ${deriveArea(address)}.`,
        },
      ],
    };

    onUpdatePickups([newPickup, ...pickups]);
    setBookingSuccessId(newPickupId);
    onSelectTrackingId(newPickupId);
    onSelectTab('tracking');
  };

  // Collector Rating Submission Handler
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRating = (pickupId: string) => {
    const updated = pickups.map((p) => {
      if (p.id === pickupId) {
        const rating: CollectorRating = {
          stars: ratingStars,
          tags: selectedTags,
          comment: ratingComment.trim() || undefined,
          ratedAt: new Date().toISOString(),
        };
        return {
          ...p,
          rating,
        };
      }
      return p;
    });

    onUpdatePickups(updated);
    setRatingSubmittedId(pickupId);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs">
        <button
          id="household-tab-schedule"
          type="button"
          onClick={() => onSelectTab('schedule')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
            tab === 'schedule'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>{t.tabSchedule}</span>
        </button>

        <button
          id="household-tab-tracking"
          type="button"
          onClick={() => onSelectTab('tracking')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
            tab === 'tracking'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>{t.tabTracking}</span>
          {userPickups.some((p) => p.status !== 'completed' && p.status !== 'cancelled') && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          id="household-tab-history"
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
            tab === 'history'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{t.tabHistory}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-bold">
            {userPickups.length}
          </span>
        </button>

        <button
          id="household-tab-prices"
          type="button"
          onClick={() => onSelectTab('prices')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
            tab === 'prices'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CircleDollarSign className="h-4 w-4" />
          <span>Daily Rates</span>
        </button>

        <button
          id="household-tab-safety"
          type="button"
          onClick={() => onSelectTab('safety')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
            tab === 'safety'
              ? 'bg-red-700 text-white shadow-2xs'
              : 'text-red-700 hover:bg-red-50'
          }`}
        >
          <Leaf className="h-4 w-4" />
          <span>Safety & EPR</span>
        </button>
      </div>

      {/* TAB 1: SCHEDULE SCRAP PICKUP */}
      {tab === 'schedule' && (
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Material Selection Grid */}
            <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {language === 'hi'
                    ? '1. अपनी ई-कचरा व रद्दी सामग्री चुनें'
                    : language === 'mr'
                    ? '१. ई-कचरा व भंगार साहित्य निवडा'
                    : '1. Select Scrap & E-Waste Materials'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {language === 'hi'
                    ? 'कांटे पर तौल के बाद तुरंत नकद भुगतान प्राप्त करें।'
                    : language === 'mr'
                    ? 'काट्यावर मोजल्यानंतर तात्काळ रोख रक्कम मिळवा.'
                    : 'Fair transparent EPR rates. Exact weight verified by collector on scale.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {materialCatalog.map((mat) => {
                  const currentKg = selectedWeights[mat.key] || 0;
                  const label =
                    language === 'hi' ? mat.labelHi : language === 'mr' ? mat.labelMr : mat.label;
                  const isSelected = currentKg > 0;

                  return (
                    <div
                      key={mat.key}
                      className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {label}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                          {formatINR(mat.rate)} / kg
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleWeightChange(mat.key, currentKg - 1)}
                          disabled={currentKg <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 shadow-2xs"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="w-10 text-center font-mono text-sm font-extrabold text-slate-900">
                          {currentKg}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleWeightChange(mat.key, currentKg + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Cols: Address, Slot & Confirmation */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'hi' ? '2. पिकअप पता व समय' : language === 'mr' ? '२. पत्ता व वेळ' : '2. Doorstep Address & Slot'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No map navigation needed. Enter clear street address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address & Flat No:
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Flat 3B, Ballygunge Park Road, Kolkata"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearby Landmark:
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Near Birla Mandir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pickup Time Window:
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    <option value="⚡ Urgent · Next 45 Mins (Priority)">⚡ Urgent · Next 45 Mins (Priority)</option>
                    <option value="Today · 4:30 PM – 6:30 PM">Today · 4:30 PM – 6:30 PM</option>
                    <option value="Tomorrow · 10:00 AM – 12:00 PM">Tomorrow · 10:00 AM – 12:00 PM</option>
                    <option value="Tomorrow · 3:00 PM – 5:00 PM">Tomorrow · 3:00 PM – 5:00 PM</option>
                  </select>
                </div>

                {/* Estimate Summary */}
                <div className="rounded-xl bg-slate-900 p-4 text-white space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Est. Weight:</span>
                    <span className="font-bold text-white">{totalKg} kg</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-bold uppercase">
                      Est. Payout
                    </span>
                    <span className="font-mono text-2xl font-black text-emerald-400">
                      {formatINR(totalEstimatedPayout)}
                    </span>
                  </div>
                </div>

                <button
                  id="confirm-booking-btn"
                  type="submit"
                  disabled={totalKg <= 0}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  Confirm Doorstep Pickup
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: LIVE TRACKING & POST-PICKUP COLLECTOR RATING */}
      {tab === 'tracking' && (
        <div className="space-y-6">
          {activeTrackedPickup ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      ORDER #{activeTrackedPickup.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        activeTrackedPickup.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : activeTrackedPickup.status === 'arrived'
                          ? 'bg-amber-100 text-amber-900'
                          : activeTrackedPickup.status === 'accepted'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {activeTrackedPickup.status === 'completed'
                        ? 'Completed & Paid'
                        : activeTrackedPickup.status === 'arrived'
                        ? 'Collector at Doorstep'
                        : activeTrackedPickup.status === 'accepted'
                        ? 'Collector En Route'
                        : 'Searching for Nearby Partner'}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {activeTrackedPickup.slot}
                  </h3>
                </div>

                {/* 4-Digit Security PIN */}
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Your Doorstep PIN
                  </div>
                  <div className="font-mono text-2xl font-black text-emerald-700">
                    {activeTrackedPickup.verificationOtp}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    step: '1',
                    label: 'Request Logged',
                    done: true,
                  },
                  {
                    step: '2',
                    label: 'Partner Assigned',
                    done:
                      activeTrackedPickup.status === 'accepted' ||
                      activeTrackedPickup.status === 'arrived' ||
                      activeTrackedPickup.status === 'completed',
                  },
                  {
                    step: '3',
                    label: 'At Doorstep',
                    done:
                      activeTrackedPickup.status === 'arrived' ||
                      activeTrackedPickup.status === 'completed',
                  },
                  {
                    step: '4',
                    label: 'Weighed & Cash Handover',
                    done: activeTrackedPickup.status === 'completed',
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3 border text-center transition-all ${
                      s.done
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="text-xs uppercase font-mono tracking-wider">
                      Step {s.step}
                    </div>
                    <div className="text-xs font-bold mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Assigned Collector Details */}
              {activeTrackedPickup.collectorName && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
                      {activeTrackedPickup.collectorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        Assigned Certified Collector
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {activeTrackedPickup.collectorName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeTrackedPickup.collectorVehicle || 'Electric Cargo Trike'}
                      </div>
                    </div>
                  </div>

                  {activeTrackedPickup.collectorPhone && (
                    <a
                      href={`tel:${activeTrackedPickup.collectorPhone}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{activeTrackedPickup.collectorPhone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* POST-PICKUP COLLECTOR RATING COMPONENT (DISPLAYED WHEN COMPLETED) */}
              {activeTrackedPickup.status === 'completed' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-600 p-2 text-white">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {t.rateCollectorTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {t.rateCollectorSubtitle}
                      </p>
                    </div>
                  </div>

                  {activeTrackedPickup.rating || ratingSubmittedId === activeTrackedPickup.id ? (
                    <div className="rounded-lg bg-white p-4 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">
                          {t.ratingSubmitted}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`h-4 w-4 ${
                              st <=
                              (activeTrackedPickup.rating?.stars || ratingStars)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      {activeTrackedPickup.rating?.comment && (
                        <p className="text-xs text-slate-600 italic">
                          &ldquo;{activeTrackedPickup.rating.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white p-5 border border-slate-200 space-y-4">
                      {/* Star Selection */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          How was your scrap pickup experience?
                        </div>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingStars(star)}
                              className="p-1 transition-transform hover:scale-110 focus:outline-none"
                              title={`${star} Stars`}
                            >
                              <Star
                                className={`h-7 w-7 ${
                                  star <= ratingStars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 font-mono text-xs font-bold text-slate-700">
                            {ratingStars} / 5 Stars
                          </span>
                        </div>
                      </div>

                      {/* Quick Feedback Tags */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          What went well?
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            t.tagPunctual,
                            t.tagFairWeighing,
                            t.tagPolite,
                            t.tagCashImmediate,
                            t.tagCleanHandling,
                          ].map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagToggle(tag)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comment Input */}
                      <div>
                        <input
                          type="text"
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="Optional comment about weight verification or cash payout..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <button
                        id="submit-collector-rating-btn"
                        type="button"
                        onClick={() => handleSubmitRating(activeTrackedPickup.id)}
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                      >
                        {t.submitRating}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              <Truck className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-bold text-base text-slate-900">
                No Active Pickup Request
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Schedule a new doorstep collection from the first tab to track your collector live.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('schedule')}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Schedule Scrap Pickup
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER HISTORY */}
      {tab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Your Scrap & E-Waste Pickup History ({userPickups.length})
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {userPickups.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {p.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDateShort(p.createdAt)}
                    </span>
                  </div>

                  <div className="mt-1 font-bold text-sm text-slate-900">
                    {p.materials.map((m) => `${m.label} (${m.kg} kg)`).join(' · ')}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {p.address}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Payout
                    </div>
                    <div className="text-lg font-extrabold text-emerald-700">
                      {formatINR(p.payout)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrackingId(p.id);
                      onSelectTab('tracking');
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    View Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DAILY RATES */}
      {tab === 'prices' && <PriceBoard language={language} />}

      {/* TAB 5: SAFETY GUIDANCE */}
      {tab === 'safety' && <SafetyModule language={language} />}
    </div>
  );
};
