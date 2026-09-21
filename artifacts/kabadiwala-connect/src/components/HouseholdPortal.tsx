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
  Search,
  ArrowLeft,
  Navigation,
  ThumbsUp,
  Award,
  Package,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  Pickup,
  AuthUser,
  MaterialKey,
  HouseholdTab,
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
import { getTranslation, speakVernacular, stopVernacularSpeech } from '../lib/i18n';
import {
  CollectorAvatarIllustration,
  CardboardBoxIcon,
  PlasticBottleIcon,
  MetalBeamIcon,
  GlassBottleIcon,
  EwastePhoneIcon,
  CableCoilIcon,
} from './Illustrations';
import { PriceBoard } from './PriceBoard';
import { SafetyModule } from './SafetyModule';

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

// Segregation Category Type
export type SegregationCategory = 'dry' | 'wet' | 'ewaste';

interface DisplayMaterial {
  key: MaterialKey;
  name: string;
  nameHi: string;
  nameBn: string;
  rate: number;
  category: SegregationCategory;
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultQty: number;
  unit: string;
}

const SEGREGATED_MATERIALS: DisplayMaterial[] = [
  // 1. Dry Recyclables
  {
    key: 'cardboard',
    name: 'Paper & Cardboard',
    nameHi: 'कागज व गत्ता (रद्दी)',
    nameBn: 'কাগজ ও পিচবোর্ড (রদ্দি)',
    rate: 14,
    category: 'dry',
    categoryLabel: 'Dry Recyclables',
    icon: CardboardBoxIcon,
    defaultQty: 2,
    unit: 'kg',
  },
  {
    key: 'mixed_plastics',
    name: 'Plastic (PET & Containers)',
    nameHi: 'प्लास्टिक की बोतलें व डिब्बे',
    nameBn: 'প্লাস্টিকের বোতল ও পাত্র',
    rate: 18,
    category: 'dry',
    categoryLabel: 'Dry Recyclables',
    icon: PlasticBottleIcon,
    defaultQty: 1,
    unit: 'kg',
  },
  {
    key: 'iron',
    name: 'Scrap Metal (Iron & Steel)',
    nameHi: 'लोहा व धातु का कबाड़',
    nameBn: 'লোহা ও ধাতব স্ক্র্যাপ',
    rate: 28,
    category: 'dry',
    categoryLabel: 'Dry Recyclables',
    icon: MetalBeamIcon,
    defaultQty: 0,
    unit: 'kg',
  },
  {
    key: 'glass',
    name: 'Glass Bottles & Jars',
    nameHi: 'कांच की बोतलें व शीशियां',
    nameBn: 'কাঁচের বোতল ও বয়াম',
    rate: 6,
    category: 'dry',
    categoryLabel: 'Dry Recyclables',
    icon: GlassBottleIcon,
    defaultQty: 0,
    unit: 'kg',
  },
  // 2. Wet / Compostable
  {
    key: 'wet_waste',
    name: 'Segregated Organic / Kitchen Waste',
    nameHi: 'गीला / रसोई का जैविक कचरा',
    nameBn: 'আলাদা করা ভেজা রান্নাঘরের জৈব বর্জ্য',
    rate: 2,
    category: 'wet',
    categoryLabel: 'Wet Compostable',
    icon: Leaf,
    defaultQty: 0,
    unit: 'kg',
  },
  // 3. E-Waste & Electronics
  {
    key: 'pcb',
    name: 'Circuit Boards & PCBs',
    nameHi: 'मदरबोर्ड व सर्किट बोर्ड',
    nameBn: 'মাদারবোর্ড ও সার্কিট বোর্ড',
    rate: 285,
    category: 'ewaste',
    categoryLabel: 'E-Waste',
    icon: EwastePhoneIcon,
    defaultQty: 1,
    unit: 'kg',
  },
  {
    key: 'batteries',
    name: 'Batteries (Li-ion & UPS)',
    nameHi: 'बैटरियां (लिथियम व यूपीएस)',
    nameBn: 'ব্যাটারি (লিথিয়াম ও ইউপিএস)',
    rate: 95,
    category: 'ewaste',
    categoryLabel: 'E-Waste',
    icon: CableCoilIcon,
    defaultQty: 0,
    unit: 'kg',
  },
  {
    key: 'cables',
    name: 'Old Devices, Cables & Appliances',
    nameHi: 'पुराने उपकरण, केबल व चार्जर',
    nameBn: 'পুরনো ইলেকট্রনিক্স, তার ও চার্জার',
    rate: 45,
    category: 'ewaste',
    categoryLabel: 'E-Waste',
    icon: CableCoilIcon,
    defaultQty: 0,
    unit: 'kg',
  },
];

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

  // Wizard Step State (1: Materials, 2: Address, 3: Details, 4: Confirm)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Material weights for scheduling wizard
  const [weights, setWeights] = useState<Record<string, number>>({
    cardboard: 3,
    mixed_plastics: 2,
    iron: 0,
    glass: 0,
    wet_waste: 0,
    pcb: 1,
    batteries: 0,
    cables: 0,
  });

  // Category Filter for Step 1
  const [selectedSegCategory, setSelectedSegCategory] = useState<'all' | 'dry' | 'wet' | 'ewaste'>('all');

  // Address State (Strictly manual text, NO interactive maps or coordinates)
  const [address, setAddress] = useState(
    authUser?.address || 'Flat 3B, Ballygunge Park Road, Kolkata'
  );
  const [landmark, setLandmark] = useState('Near Birla Mandir');
  const [selectedAreaPill, setSelectedAreaPill] = useState('Ballygunge');

  // Details State
  const [timeSlot, setTimeSlot] = useState('Today (11:30 AM - 1:30 PM)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Audio helper state
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  // Rating & Audit state
  const [ratingStars, setRatingStars] = useState(5);
  const [selectedAuditTags, setSelectedAuditTags] = useState<string[]>([
    'Maintained Segregation',
    'Accurate Scale Weighing',
  ]);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmittedId, setRatingSubmittedId] = useState<string | null>(null);

  // Filter & Search in My Orders
  const [ordersTab, setOrdersTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Voice speech helper for individual material rates
  const handleSpeakRate = (mat: DisplayMaterial) => {
    if (speakingKey === mat.key) {
      stopVernacularSpeech();
      setSpeakingKey(null);
      return;
    }

    stopVernacularSpeech();
    setSpeakingKey(mat.key);

    let phrase = `${mat.name}: ${mat.rate} rupees per kilogram.`;
    if (language === 'hi') {
      phrase = `${mat.nameHi}: ${mat.rate} रुपये प्रति किलो.`;
    } else if (language === 'bn') {
      phrase = `${mat.nameBn}: প্রতি কেজি ${mat.rate} টাকা.`;
    }

    const ok = speakVernacular(phrase, language);
    if (!ok) setSpeakingKey(null);

    setTimeout(() => {
      setSpeakingKey((curr) => (curr === mat.key ? null : curr));
    }, 4500);
  };

  // Adjust material weight
  const adjustWeight = (key: string, delta: number) => {
    setWeights((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  };

  // Calculations for Step 1
  const totalKg = useMemo(() => {
    return Object.values(weights).reduce((acc, curr) => acc + curr, 0);
  }, [weights]);

  const totalEstimatedPayout = useMemo(() => {
    return SEGREGATED_MATERIALS.reduce((acc, mat) => {
      const qty = weights[mat.key] || 0;
      return acc + qty * mat.rate;
    }, 0);
  }, [weights]);

  // Handle Booking Creation
  const handleConfirmBooking = () => {
    const selectedMaterialsList = SEGREGATED_MATERIALS.filter(
      (m) => (weights[m.key] || 0) > 0
    ).map((m) => ({
      key: m.key,
      label: m.name,
      kg: weights[m.key] || 0,
      rate: m.rate,
    }));

    // Detect multi-fraction source segregation
    const selectedCategories = new Set(
      SEGREGATED_MATERIALS.filter((m) => (weights[m.key] || 0) > 0).map(
        (m) => m.category
      )
    );
    const isSegregated = selectedCategories.size >= 1;

    const random4DigitPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newPickupId = `KC-${Math.floor(1050 + Math.random() * 8900)}`;

    const newPickup: Pickup = {
      id: newPickupId,
      userId: authUser?.id || 'usr-household-101',
      userName: authUser?.name || 'Deblina Mukherjee',
      userPhone: authUser?.phone || '+91 98301 44829',
      address: `${address}${landmark ? `, Near ${landmark}` : ''}`,
      landmark,
      area: selectedAreaPill,
      urgency: 'standard',
      slot: timeSlot,
      materials: selectedMaterialsList,
      estimatedKg: totalKg,
      payout: totalEstimatedPayout,
      status: 'pending', // Starts in Searching...
      verificationOtp: random4DigitPin,
      notes: specialInstructions || undefined,
      createdAt: new Date().toISOString(),
      isSegregated,
      timeline: [
        {
          status: 'pending',
          title: 'Searching for Nearby Collector',
          timestamp: new Date().toISOString(),
          note: 'Pickup request broadcast to certified area collectors.',
        },
      ],
    };

    const updatedList = [newPickup, ...pickups];
    onUpdatePickups(updatedList);
    onSelectTrackingId(newPickupId);
    onSelectTab('tracking');
    setOrdersTab('active');
    setWizardStep(1);
  };

  // Filtered orders list
  const activePickupsList = useMemo(() => {
    return pickups.filter((p) => p.status !== 'completed' && p.status !== 'cancelled');
  }, [pickups]);

  const historyPickupsList = useMemo(() => {
    return pickups.filter((p) => p.status === 'completed');
  }, [pickups]);

  const displayedOrders = ordersTab === 'active' ? activePickupsList : historyPickupsList;

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return displayedOrders;
    const q = searchQuery.toLowerCase().trim();
    return displayedOrders.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.materials.some((m) => m.label.toLowerCase().includes(q))
    );
  }, [displayedOrders, searchQuery]);

  // Selected tracked pickup
  const trackedPickup = useMemo(() => {
    if (activeTrackingId) {
      return pickups.find((p) => p.id === activeTrackingId) || pickups[0] || null;
    }
    return activePickupsList[0] || pickups[0] || null;
  }, [pickups, activeTrackingId, activePickupsList]);

  // Handle Post-Pickup Rating Submission
  const handleSubmitRating = (pickupId: string) => {
    const updated = pickups.map((p) => {
      if (p.id === pickupId) {
        const ratingObj: CollectorRating = {
          stars: ratingStars,
          tags: selectedAuditTags,
          comment: ratingComment.trim() || undefined,
          ratedAt: new Date().toISOString(),
        };
        return {
          ...p,
          rating: ratingObj,
        };
      }
      return p;
    });

    onUpdatePickups(updated);
    setRatingSubmittedId(pickupId);
    setTimeout(() => {
      setRatingSubmittedId(null);
    }, 4000);
  };

  const toggleAuditTag = (tag: string) => {
    setSelectedAuditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter materials for Step 1
  const filteredWizardMaterials = useMemo(() => {
    if (selectedSegCategory === 'all') return SEGREGATED_MATERIALS;
    return SEGREGATED_MATERIALS.filter((m) => m.category === selectedSegCategory);
  }, [selectedSegCategory]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          id="household-tab-schedule"
          onClick={() => onSelectTab('schedule')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'schedule'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.tabSchedule}
        </button>
        <button
          type="button"
          id="household-tab-tracking"
          onClick={() => onSelectTab('tracking')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'tracking'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.tabTracking} {activePickupsList.length > 0 ? `(${activePickupsList.length})` : ''}
        </button>
        <button
          type="button"
          id="household-tab-prices"
          onClick={() => onSelectTab('prices')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'prices'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.tabPrices}
        </button>
        <button
          type="button"
          id="household-tab-safety"
          onClick={() => onSelectTab('safety')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'safety'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.tabSafety}
        </button>
      </div>

      {/* VIEW: SCHEDULE PICKUP WIZARD */}
      {tab === 'schedule' && (
        <div className="rounded-3xl bg-white p-4 sm:p-7 shadow-xs border border-slate-200/80">
          {/* Wizard Stepper Progress Bar */}
          <div className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Step {wizardStep} of 4
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {wizardStep === 1 && 'Source Segregation & Scrap Selection'}
                  {wizardStep === 2 && 'Doorstep Address Entry (Manual)'}
                  {wizardStep === 3 && 'Pickup Time & Instructions'}
                  {wizardStep === 4 && 'Confirm & Request Collector'}
                </h2>
              </div>

              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Visual Step Indicator Line */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => {
                    if (stepNum < wizardStep) {
                      setWizardStep(stepNum as any);
                    }
                  }}
                  disabled={stepNum > wizardStep}
                  className={`h-2 rounded-full transition-all text-left ${
                    wizardStep >= stepNum ? 'bg-emerald-600' : 'bg-slate-200'
                  } ${stepNum < wizardStep ? 'cursor-pointer hover:bg-emerald-700' : 'cursor-default'}`}
                  title={`Step ${stepNum}`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: SOURCE SEGREGATION & SCRAP SELECTION */}
          {wizardStep === 1 && (
            <div className="space-y-5">
              {/* Segregation Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedSegCategory('all')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedSegCategory === 'all'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSegCategory('dry')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedSegCategory === 'dry'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                  }`}
                >
                  Dry Recyclables (PET/Cardboard/Metal/Glass)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSegCategory('wet')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedSegCategory === 'wet'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Wet / Compostable
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSegCategory('ewaste')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedSegCategory === 'ewaste'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  E-Waste (PCBs/Batteries/Devices)
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredWizardMaterials.map((mat) => {
                  const qty = weights[mat.key] || 0;
                  const isSelected = qty > 0;
                  const Icon = mat.icon;
                  const isSpeaking = speakingKey === mat.key;

                  return (
                    <div
                      key={mat.key}
                      className={`flex flex-col justify-between rounded-2xl p-4 transition-all border ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200/90 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-xl bg-slate-100/90 text-slate-800">
                            <Icon className="h-6 w-6" />
                          </div>

                          {/* Audio Price Button */}
                          <button
                            type="button"
                            onClick={() => handleSpeakRate(mat)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              isSpeaking
                                ? 'bg-red-600 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                            }`}
                            title="Listen to rate in selected language"
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {mat.categoryLabel}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {mat.name}
                          </h4>
                          <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                            ₹{mat.rate} / {mat.unit}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Stepper (- / +) */}
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() => adjustWeight(mat.key, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-black text-slate-900 px-2">
                          {qty} {mat.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustWeight(mat.key, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-2xs hover:bg-emerald-100 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Est. Payout Calculation Card */}
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Est. Total Scrap: <strong className="text-sm font-black">{totalKg} kg</strong>
                  </p>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Live Verified Payout on Digital Scale:{' '}
                    <strong className="text-base font-black text-emerald-900">
                      ₹{totalEstimatedPayout}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-200/80 px-3 py-1 text-[11px] font-bold text-emerald-900">
                    Direct Cash / UPI
                  </span>
                  <button
                    type="button"
                    disabled={totalKg <= 0}
                    onClick={() => setWizardStep(2)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all"
                  >
                    <span>Next: Doorstep Address</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DOORSTEP ADDRESS ENTRY (MANUAL ONLY, ZERO MAPS) */}
          {wizardStep === 2 && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Accurate Doorstep Location
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Enter Manual Street Address & Landmark
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our verified partner arrives on an electric cargo trike with a digital scale. Enter exact flat number and nearest landmark.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address & Flat / Building
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 3B, Ballygunge Park Road, Kolkata"
                    className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark / Cross Street
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Birla Mandir, Near Gate 2"
                    className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Popular Area / Neighborhood Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Cluster / Ward
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Ballygunge', 'Gariahat', 'Salt Lake', 'New Town', 'Jadavpur', 'Kasba'].map(
                      (areaPill) => (
                        <button
                          key={areaPill}
                          type="button"
                          onClick={() => {
                            setSelectedAreaPill(areaPill);
                            if (!address.includes(areaPill)) {
                              setAddress((prev) => `${prev.split(',')[0] || ''}, ${areaPill}, Kolkata`);
                            }
                          }}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                            selectedAreaPill === areaPill
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {areaPill}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  disabled={!address.trim()}
                  onClick={() => setWizardStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  <span>Next: Time & Instructions</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TIME SLOT & INSTRUCTIONS */}
          {wizardStep === 3 && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Scheduling Preferences
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Select Convenient Doorstep Slot
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'Today (11:30 AM - 1:30 PM)',
                    'Today (2:30 PM - 4:30 PM)',
                    'Tomorrow Morning (9:00 AM - 11:00 AM)',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`flex flex-col rounded-2xl p-3 text-left border text-xs font-bold transition-all ${
                        timeSlot === slot
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="h-4 w-4 text-emerald-600 mb-1" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Please ring bell twice; scrap is bundled in white sacks in balcony."
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {wizardStep === 4 && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Final Step
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Confirm Doorstep Pickup Request
                </h3>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Address:</span>
                  <span className="font-bold text-slate-900 text-right">{address}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Pickup Slot:</span>
                  <span className="font-bold text-slate-900">{timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Estimated Weight:</span>
                  <span className="font-bold text-emerald-800">{totalKg} kg</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-700 text-sm">Estimated Cash Payout:</span>
                  <span className="font-black text-emerald-700 text-lg">
                    ₹{totalEstimatedPayout}
                  </span>
                </div>
              </div>

              {/* Security PIN Notice */}
              <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <KeyRound className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">4-Digit Security PIN Verification</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Upon arrival, your collector partner will weigh every material item on a certified digital scale. You will share your 4-digit PIN only when the scale readout matches and you receive payment.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  id="confirm-pickup-button"
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Broadcast Request to Nearby Collectors</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: LIVE TRACKING & ORDERS */}
      {tab === 'tracking' && (
        <div className="space-y-4">
          {/* Toggle between Active and History */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrdersTab('active')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  ordersTab === 'active'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Active Pickups ({activePickupsList.length})
              </button>
              <button
                type="button"
                onClick={() => setOrdersTab('history')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  ordersTab === 'history'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Completed & Past History ({historyPickupsList.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectTab('schedule');
                setWizardStep(1);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Pickup</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-slate-200/90 shadow-2xs">
            <Search className="h-4 w-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, materials, or address..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Orders List */}
          <div className="space-y-3.5">
            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
                <Package className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-800">No Pickups Found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {ordersTab === 'active'
                    ? 'You have no active ongoing pickups.'
                    : 'No completed pickups in your history.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((pickup) => {
                const isSearching = pickup.status === 'pending';
                const isAssigned = pickup.status === 'accepted';
                const isArrived = pickup.status === 'arrived';
                const isCompleted = pickup.status === 'completed';

                const statusLabel = isSearching
                  ? 'Searching...'
                  : isAssigned
                  ? 'Assigned to Collector'
                  : isArrived
                  ? 'Out for Pickup (At Doorstep)'
                  : 'Completed';

                const statusColor = isSearching
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : isAssigned
                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                  : isArrived
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                const isExpanded = trackedPickup?.id === pickup.id;

                return (
                  <div
                    key={pickup.id}
                    className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-300"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900">
                          #{pickup.id}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {formatDateShort(pickup.createdAt)}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold border ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Materials Summary */}
                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {pickup.materials.map((m) => m.label).join(' • ') || 'Mixed Scrap'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {pickup.address}
                      </p>
                    </div>

                    {/* Meta Row: Payout & Collector */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-400">Total Weight:</span>{' '}
                          <strong className="text-slate-800 font-bold">
                            {pickup.finalKg || pickup.estimatedKg} kg
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Payout:</span>{' '}
                          <strong className="text-emerald-700 font-black">
                            ₹{pickup.payout}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onSelectTrackingId(isExpanded ? null : pickup.id)
                        }
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Lifecycle'}</span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* EXPANDED LIFECYCLE TRACKING DRAWER */}
                    {isExpanded && (
                      <div className="mt-4 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100 space-y-4 animate-in fade-in duration-150">
                        {/* 4-Stage Lifecycle Stepper */}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2">
                            Real-Time Lifecycle Progress
                          </p>
                          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-[11px] font-bold">
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isSearching || isAssigned || isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>1. Searching...</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isAssigned || isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>2. Assigned</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>3. Out for Pickup</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>4. Completed</span>
                            </div>
                          </div>
                        </div>

                        {/* Resident 4-Digit Security PIN Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 border border-emerald-200 shadow-2xs">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <KeyRound className="h-4 w-4 text-emerald-600" />
                              <span>Your Doorstep Security PIN</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Share this PIN with your collector only after verifying the scale weight.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xl font-black text-emerald-800 tracking-widest bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                              {pickup.verificationOtp || '4192'}
                            </span>
                          </div>
                        </div>

                        {/* Collector Details if Assigned */}
                        {(isAssigned || isArrived || isCompleted) && (
                          <div className="rounded-xl bg-white p-3 border border-slate-200 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                {pickup.collectorName ? pickup.collectorName.charAt(0) : 'R'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">
                                  {pickup.collectorName || 'Raju Das (Field Partner)'}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {pickup.collectorVehicle || 'Electric Cargo Trike (WB-02-AK-4192)'}
                                </p>
                              </div>
                            </div>
                            {pickup.collectorPhone && (
                              <a
                                href={`tel:${pickup.collectorPhone}`}
                                className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 hover:bg-emerald-100"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                <span>Call Partner</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* POST-PICKUP RATING & AUDIT CARD */}
                        {isCompleted && (
                          <div className="rounded-2xl bg-white p-4 border border-emerald-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                Post-Pickup Rating & Segregation Audit
                              </span>
                              {pickup.rating && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                  Audit Recorded
                                </span>
                              )}
                            </div>

                            {pickup.rating ? (
                              <div className="space-y-1.5 text-xs text-slate-700">
                                <div className="flex items-center gap-1 text-amber-500">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        pickup.rating!.stars >= star
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-200'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 font-bold text-slate-800">
                                    {pickup.rating.stars} / 5 Stars
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {pickup.rating.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200"
                                    >
                                      ✓ {tag}
                                    </span>
                                  ))}
                                </div>
                                {pickup.rating.comment && (
                                  <p className="text-[11px] text-slate-600 italic mt-1">
                                    "{pickup.rating.comment}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-xs text-slate-600">
                                  Help informal collectors build verified trust with authorized municipal recycling networks.
                                </p>

                                {/* Star Selectors */}
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRatingStars(star)}
                                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                                    >
                                      <Star
                                        className={`h-6 w-6 ${
                                          ratingStars >= star
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-200'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>

                                {/* Quick Audit Tags */}
                                <div>
                                  <p className="text-[11px] font-bold text-slate-700 mb-1.5">
                                    Select Compliance & Quality Tags:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {[
                                      'Maintained Segregation',
                                      'Accurate Scale Weighing',
                                      'Polite & Professional',
                                      'Paid Instantly',
                                      'Clean Handling',
                                    ].map((tag) => {
                                      const isSelected = selectedAuditTags.includes(tag);
                                      return (
                                        <button
                                          key={tag}
                                          type="button"
                                          onClick={() => toggleAuditTag(tag)}
                                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                                            isSelected
                                              ? 'bg-emerald-600 text-white shadow-2xs'
                                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                          }`}
                                        >
                                          {isSelected ? '✓ ' : '+ '}
                                          {tag}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Optional Feedback */}
                                <div>
                                  <input
                                    type="text"
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder="Optional comment on collector service..."
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSubmitRating(pickup.id)}
                                  className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                                >
                                  Submit Verified Rating & Audit
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW: DAILY RATES BOARD */}
      {tab === 'prices' && <PriceBoard language={language} />}

      {/* VIEW: SAFE SEGREGATION MODULE */}
      {tab === 'safety' && <SafetyModule language={language} />}
    </div>
  );
};
