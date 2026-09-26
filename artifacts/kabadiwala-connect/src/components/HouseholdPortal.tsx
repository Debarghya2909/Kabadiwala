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
  Edit3,
  Sparkles,
  MessageSquare,
  X,
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
import { CollectorFeedbackModal } from './CollectorFeedbackModal';

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
    'Punctual & Prompt',
    'Accurate Scale Weighing',
  ]);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmittedId, setRatingSubmittedId] = useState<string | null>(null);

  // Dedicated Star Rating & Feedback Modal state
  const [feedbackModalPickup, setFeedbackModalPickup] = useState<Pickup | null>(null);
  const [feedbackInitialStars, setFeedbackInitialStars] = useState<number>(5);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; pickupId: string } | null>(null);

  const handleOpenFeedbackModal = (pickup: Pickup, initialStars?: number) => {
    setFeedbackModalPickup(pickup);
    setFeedbackInitialStars(initialStars || pickup.rating?.stars || 5);
  };

  const handleSaveRating = (pickupId: string, rating: CollectorRating) => {
    const updated = pickups.map((p) => {
      if (p.id === pickupId) {
        return {
          ...p,
          rating,
        };
      }
      return p;
    });

    onUpdatePickups(updated);
    setRatingSubmittedId(pickupId);

    const targetPickup = pickups.find((p) => p.id === pickupId);
    const name = targetPickup?.collectorName || 'Raju Das';
    const msg = t.feedbackSuccessToast.replace('{name}', name);
    setFeedbackToast({ message: msg, pickupId });

    // Friendly vernacular voice confirmation
    let spokenToast = `Thank you! Your ${rating.stars}-star rating for ${name} has been verified and saved.`;
    if (language === 'hi') {
      spokenToast = `धन्यवाद! ${name} के लिए आपकी ${rating.stars} सितारा रेटिंग दर्ज कर ली गई है।`;
    } else if (language === 'bn') {
      spokenToast = `ধন্যবাদ! ${name}-এর জন্য আপনার ${rating.stars} তারা মূল্যায়ন সফলভাবে সংরক্ষিত হয়েছে।`;
    }
    speakVernacular(spokenToast, language);

    setTimeout(() => {
      setFeedbackToast((curr) => (curr?.pickupId === pickupId ? null : curr));
      setRatingSubmittedId((curr) => (curr === pickupId ? null : curr));
    }, 5000);
  };

  // Filter & Search in My Orders
  const [ordersTab, setOrdersTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Voice speech helper for individual material rates
  const [spokenMaterialPhrase, setSpokenMaterialPhrase] = useState<string | null>(null);

  const handleSpeakRate = (mat: DisplayMaterial) => {
    if (speakingKey === mat.key) {
      stopVernacularSpeech();
      setSpeakingKey(null);
      setSpokenMaterialPhrase(null);
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

    setSpokenMaterialPhrase(phrase);
    const ok = speakVernacular(phrase, language);
    if (!ok) {
      setSpeakingKey(null);
      setSpokenMaterialPhrase(null);
    }

    setTimeout(() => {
      setSpeakingKey((curr) => {
        if (curr === mat.key) {
          setSpokenMaterialPhrase(null);
          return null;
        }
        return curr;
      });
    }, 4500);
  };

  // Set direct material weight
  const handleSetWeight = (key: string, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.round(value * 100) / 100),
    }));
  };

  // Adjust material weight
  const adjustWeight = (key: string, delta: number) => {
    setWeights((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, Math.round((current + delta) * 100) / 100);
      return { ...prev, [key]: next };
    });
  };

  // Calculations for Step 1
  const totalKg = useMemo(() => {
    const sum = Object.values(weights).reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum * 100) / 100;
  }, [weights]);

  const totalEstimatedPayout = useMemo(() => {
    const total = SEGREGATED_MATERIALS.reduce((acc, mat) => {
      const qty = weights[mat.key] || 0;
      return acc + qty * mat.rate;
    }, 0);
    return Math.round(total * 100) / 100;
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

  // Handle Post-Pickup Rating Submission from inline form
  const handleSubmitRating = (pickupId: string) => {
    const ratingObj: CollectorRating = {
      stars: ratingStars,
      tags: selectedAuditTags,
      comment: ratingComment.trim() || undefined,
      ratedAt: new Date().toISOString(),
    };
    handleSaveRating(pickupId, ratingObj);
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
      {/* Verified Feedback Success Banner */}
      {feedbackToast && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 shadow-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-emerald-950">
                {feedbackToast.message}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {t.verifiedHouseholdReview} • #{feedbackToast.pickupId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
                  {t.wizardStepOf.replace('{current}', wizardStep.toString()).replace('{total}', '4')}
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {wizardStep === 1 && t.step1Title}
                  {wizardStep === 2 && t.step2Title}
                  {wizardStep === 3 && t.step3Title}
                  {wizardStep === 4 && t.step4Title}
                </h2>
              </div>

              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.backBtn}</span>
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
                  {t.allScrap}
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
                  {t.dryRecyclables}
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
                  {t.wetCompostable}
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
                  {t.ewasteElectronics}
                </button>
              </div>

              {/* Synchronized Live Audio Transcript Banner */}
              {spokenMaterialPhrase && (
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                        {language === 'hi'
                          ? 'लाइव हिंदी भाव प्रसारण'
                          : language === 'bn'
                          ? 'লাইভ বাংলা দর সম্প্রচার'
                          : 'Live Rate Voice Announcement'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        stopVernacularSpeech();
                        setSpeakingKey(null);
                        setSpokenMaterialPhrase(null);
                      }}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2 py-0.5"
                    >
                      {t.stopAudio}
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm font-black text-slate-900 leading-snug">
                    "{spokenMaterialPhrase}"
                  </p>
                </div>
              )}

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredWizardMaterials.map((mat) => {
                  const qty = weights[mat.key] || 0;
                  const isSelected = qty > 0;
                  const Icon = mat.icon;
                  const isSpeaking = speakingKey === mat.key;
                  const localizedMatName =
                    language === 'bn' ? mat.nameBn : language === 'hi' ? mat.nameHi : mat.name;

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
                            className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-all touch-manipulation active:scale-95 ${
                              isSpeaking
                                ? 'bg-red-600 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200'
                            }`}
                            title={isSpeaking ? t.stopAudio : t.listenAudio}
                            aria-label={`Listen to scrap rate for ${localizedMatName}`}
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-5 w-5 stroke-[2.2]" />
                            ) : (
                              <Volume2 className="h-5 w-5 stroke-[2.2]" />
                            )}
                          </button>
                        </div>

                        <div className="mt-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                            {mat.category === 'dry'
                              ? t.dryRecyclables.split('(')[0]
                              : mat.category === 'wet'
                              ? t.wetCompostable
                              : t.ewasteElectronics.split('(')[0]}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {localizedMatName}
                          </h4>
                          <p className="text-sm font-black text-emerald-800 mt-0.5">
                            ₹{mat.rate} / {t.kg}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Stepper & Direct Decimal Input */}
                      <div className="mt-4 flex items-center justify-between gap-1 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => adjustWeight(mat.key, -0.5)}
                          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 shadow-xs hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
                          aria-label={`Decrease ${localizedMatName} weight`}
                        >
                          <Minus className="h-4 w-4 stroke-[2.5]" />
                        </button>
                        <div className="flex items-center justify-center gap-1 flex-1">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={qty === 0 ? '' : qty}
                            placeholder="0.00"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              handleSetWeight(mat.key, isNaN(val) ? 0 : val);
                            }}
                            className="w-16 min-h-[40px] text-center text-sm font-black text-slate-900 bg-white rounded-lg border border-slate-300 px-1 py-1 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            aria-label={`${localizedMatName} weight in ${t.kg}`}
                          />
                          <span className="text-xs font-bold text-slate-600">{t.kg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => adjustWeight(mat.key, 0.5)}
                          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
                          aria-label={`Increase ${localizedMatName} weight`}
                        >
                          <Plus className="h-4 w-4 stroke-[2.5]" />
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
                    {t.estTotalScrap}: <strong className="text-sm font-black">{totalKg.toFixed(2)} {t.kg}</strong>
                  </p>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {t.liveVerifiedPayout}:{' '}
                    <strong className="text-base font-black text-emerald-900">
                      {formatINR(totalEstimatedPayout, true)}
                    </strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                  <span className="hidden sm:inline-block rounded-full bg-emerald-200/90 px-3 py-1 text-[11px] font-bold text-emerald-950 text-center">
                    {t.directCashUpi}
                  </span>
                  <button
                    type="button"
                    disabled={totalKg <= 0}
                    onClick={() => setWizardStep(2)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 min-h-[48px] text-sm font-black text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation w-full sm:w-auto"
                  >
                    <span>{t.nextAddressBtn}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
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
                  {t.featureNoMaps}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {t.manualAddressTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.manualAddressSubtitle}
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.streetAddressInputLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.streetAddressPlaceholder}
                    className="w-full min-h-[48px] rounded-2xl border border-slate-300 p-3.5 text-base sm:text-sm font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.landmarkInputLabel}
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={t.landmarkPlaceholder}
                    className="w-full min-h-[48px] rounded-2xl border border-slate-300 p-3.5 text-base sm:text-sm font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Popular Area / Neighborhood Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.selectClusterWardLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'Ballygunge', labelHi: 'बालीगंज', labelBn: 'বালিগঞ্জ' },
                      { key: 'Gariahat', labelHi: 'गड़ियाहाट', labelBn: 'গড়িয়াহাট' },
                      { key: 'Salt Lake', labelHi: 'साल्ट लेक', labelBn: 'সল্টলেক' },
                      { key: 'New Town', labelHi: 'न्यू टाउन', labelBn: 'নিউ টাউন' },
                      { key: 'Jadavpur', labelHi: 'जादवपुर', labelBn: 'যাদবপুর' },
                      { key: 'Kasba', labelHi: 'कस्बा', labelBn: 'কসবা' },
                    ].map((areaObj) => {
                      const displayPill =
                        language === 'hi'
                          ? areaObj.labelHi
                          : language === 'bn'
                          ? areaObj.labelBn
                          : areaObj.key;

                      return (
                        <button
                          key={areaObj.key}
                          type="button"
                          onClick={() => {
                            setSelectedAreaPill(areaObj.key);
                            if (!address.includes(areaObj.key)) {
                              setAddress((prev) => `${prev.split(',')[0] || ''}, ${areaObj.key}, Kolkata`);
                            }
                          }}
                          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
                            selectedAreaPill === areaObj.key
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {displayPill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="min-h-[48px] rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all touch-manipulation"
                >
                  &larr; {t.backBtn}
                </button>
                <button
                  type="button"
                  disabled={!address.trim()}
                  onClick={() => setWizardStep(3)}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98] transition-all touch-manipulation"
                >
                  <span>{t.nextTimeBtn}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TIME SLOT & INSTRUCTIONS */}
          {wizardStep === 3 && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.step3Title}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {t.timeSlotTitle}
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  {t.preferredTimeSlotLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      slotKey: 'Today (11:30 AM - 1:30 PM)',
                      labelHi: 'आज (दोपहर 11:30 - 1:30)',
                      labelBn: 'আজ (সকাল ১১:৩০ - দুপুর ১:৩০)',
                    },
                    {
                      slotKey: 'Today (2:30 PM - 4:30 PM)',
                      labelHi: 'आज (दोपहर 2:30 - शाम 4:30)',
                      labelBn: 'আজ (দুপুর ২:৩০ - বিকাল ৪:৩০)',
                    },
                    {
                      slotKey: 'Tomorrow Morning (9:00 AM - 11:00 AM)',
                      labelHi: 'कल सुबह (9:00 - 11:00)',
                      labelBn: 'আগামীকাল সকাল (৯:০০ - ১১:০০)',
                    },
                  ].map((slotObj) => {
                    const displaySlot =
                      language === 'hi'
                        ? slotObj.labelHi
                        : language === 'bn'
                        ? slotObj.labelBn
                        : slotObj.slotKey;

                    return (
                      <button
                        key={slotObj.slotKey}
                        type="button"
                        onClick={() => setTimeSlot(slotObj.slotKey)}
                        className={`min-h-[52px] flex flex-col justify-center rounded-2xl p-3.5 text-left border text-xs font-bold transition-all active:scale-[0.98] touch-manipulation ${
                          timeSlot === slotObj.slotKey
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-emerald-700">
                          <Clock className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-wider">{t.confirmedWindowBadge}</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">{displaySlot}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.specialInstructionsLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder={t.specialInstructionsPlaceholder}
                    className="w-full min-h-[64px] rounded-2xl border border-slate-300 p-3 text-base sm:text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="min-h-[48px] rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all touch-manipulation"
                >
                  &larr; {t.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all touch-manipulation"
                >
                  <span>{t.reviewBookingBtn}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {wizardStep === 4 && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {t.step4Title}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {t.confirmBookingBtn}
                </h3>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-600">{t.addressSummaryLabel}</span>
                  <span className="font-bold text-slate-900 text-right">{address}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-600">{t.pickupSlotSummaryLabel}</span>
                  <span className="font-bold text-slate-900">{timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-600">{t.estWeightSummaryLabel}</span>
                  <span className="font-black text-emerald-800">{totalKg.toFixed(2)} {t.kg}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-800 text-sm">{t.estCashPayoutLabel}</span>
                  <span className="font-black text-emerald-800 text-xl">
                    {formatINR(totalEstimatedPayout, true)}
                  </span>
                </div>
              </div>

              {/* Security PIN Notice */}
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <KeyRound className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-amber-900 text-sm">{t.securityPinVerificationTitle}</p>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {t.securityPinNoticeDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="min-h-[50px] rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all touch-manipulation"
                >
                  &larr; {t.backBtn}
                </button>
                <button
                  id="confirm-pickup-button"
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm sm:text-base font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all touch-manipulation"
                >
                  <CheckCircle2 className="h-5 w-5 stroke-[2.3]" />
                  <span>{t.broadcastRequestBtn}</span>
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
                {t.activePickupsTab} ({activePickupsList.length})
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
                {t.completedHistoryTab} ({historyPickupsList.length})
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
              <span>{t.newPickupBtn}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-slate-200/90 shadow-2xs">
            <Search className="h-4 w-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchQueuePlaceholder}
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Pending Feedback Alert Banner in History Tab */}
          {ordersTab === 'history' && historyPickupsList.some((p) => !p.rating) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/5 p-4 border border-amber-300 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-900 shadow-2xs">
                  <Star className="h-5 w-5 fill-slate-900 text-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {t.ratingPendingBannerTitle} ({historyPickupsList.filter((p) => !p.rating).length})
                    </h4>
                    <span className="rounded-full bg-amber-200/90 px-2 py-0.5 text-[10px] font-black text-amber-950">
                      Review Needed
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    {t.ratingPendingBannerDesc}
                  </p>
                </div>
              </div>
              {(() => {
                const unrated = historyPickupsList.find((p) => !p.rating);
                if (!unrated) return null;
                return (
                  <button
                    type="button"
                    onClick={() => handleOpenFeedbackModal(unrated, 5)}
                    className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 shadow-2xs transition-all active:scale-95 cursor-pointer touch-manipulation"
                  >
                    <Star className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                    <span>{t.rateNowBtn} (#{unrated.id})</span>
                  </button>
                );
              })()}
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-3.5">
            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
                <Package className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-800">{t.noPickupsFound}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {ordersTab === 'active'
                    ? t.noPickupsActiveDesc
                    : t.noPickupsHistoryDesc}
                </p>
              </div>
            ) : (
              filteredOrders.map((pickup) => {
                const isSearching = pickup.status === 'pending';
                const isAssigned = pickup.status === 'accepted';
                const isArrived = pickup.status === 'arrived';
                const isCompleted = pickup.status === 'completed';

                const statusLabel = isSearching
                  ? t.statusSearching
                  : isAssigned
                  ? t.statusAssigned
                  : isArrived
                  ? t.statusAtDoorstep
                  : t.statusCompleted;

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
                        {pickup.materials
                          .map((m) => {
                            const cat = materialCatalog.find((c) => c.key === m.key);
                            if (language === 'bn' && cat?.labelBn) return cat.labelBn;
                            if (language === 'hi' && cat?.labelHi) return cat.labelHi;
                            return m.label;
                          })
                          .join(' • ') || t.mixedScrapMaterials}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {pickup.address}
                      </p>
                    </div>

                    {/* Meta Row: Payout & Collector */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-400">{t.totalVerifiedLabel}</span>{' '}
                          <strong className="text-slate-800 font-bold">
                            {pickup.finalKg || pickup.estimatedKg} {t.kg}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">{t.estCashPayoutLabel}</span>{' '}
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
                        <span>{isExpanded ? t.hideDetails : t.viewLifecycle}</span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* POST-PICKUP STAR RATING & FEEDBACK (Always Visible on Completed Cards) */}
                    {isCompleted && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        {pickup.rating ? (
                          /* Already Rated View */
                          <div className="rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200/90 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        pickup.rating!.stars >= star
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-200 fill-slate-100'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-black text-slate-800">
                                  {t.starsCountLabel.replace('{count}', pickup.rating.stars.toString())}
                                </span>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200">
                                  ✓ {t.auditRecordedBadge}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenFeedbackModal(pickup, pickup.rating!.stars)}
                                className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>{t.editRatingBtn}</span>
                              </button>
                            </div>

                            {/* Tags Chips */}
                            {pickup.rating.tags && pickup.rating.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {pickup.rating.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80 shadow-2xs"
                                  >
                                    ✓ {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Resident Comment Quote */}
                            {pickup.rating.comment && (
                              <p className="text-[11px] text-slate-600 italic bg-white/90 rounded-xl px-2.5 py-1.5 border border-emerald-100">
                                "{pickup.rating.comment}"
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Unrated Completed Pickup Feedback Prompt */
                          <div className="rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                                <span>{t.rateCollectorTitle}</span>
                                <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-black text-amber-900">
                                  {t.noRatingYet}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {t.rateCollectorSubtitle}
                              </p>
                            </div>

                            <div className="flex items-center gap-2.5">
                              {/* 5 Quick Clickable Stars */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleOpenFeedbackModal(pickup, star)}
                                    className="p-1 hover:scale-125 transition-transform text-slate-300 hover:text-amber-400 cursor-pointer"
                                    title={`Rate ${star} star`}
                                  >
                                    <Star className="h-5 w-5 fill-slate-200 text-slate-300 hover:fill-amber-400 hover:text-amber-400" />
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenFeedbackModal(pickup, 5)}
                                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer touch-manipulation"
                              >
                                <Star className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                                <span>{t.rateServiceBtn}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EXPANDED LIFECYCLE TRACKING DRAWER */}
                    {isExpanded && (
                      <div className="mt-4 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100 space-y-4 animate-in fade-in duration-150">
                        {/* 4-Stage Lifecycle Stepper */}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2">
                            {t.viewLifecycle}
                          </p>
                          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-[11px] font-bold">
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isSearching || isAssigned || isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>1. {t.statusSearching}</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isAssigned || isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>2. {t.statusAssigned.split(' ')[0]}</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isArrived || isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>3. {t.statusEnRoute}</span>
                            </div>
                            <div
                              className={`rounded-xl p-2 border transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>4. {t.statusCompleted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Resident 4-Digit Security PIN Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 border border-emerald-200 shadow-2xs">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <KeyRound className="h-4 w-4 text-emerald-600" />
                              <span>{t.securityPinBannerTitle}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {t.securityPinBannerDesc}
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
                                <span>{t.callPartner}</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* POST-PICKUP RATING & AUDIT CARD */}
                        {isCompleted && (
                          <div className="rounded-2xl bg-white p-4 border border-emerald-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                {t.postPickupRatingTitle}
                              </span>
                              {pickup.rating && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                  {t.auditRecordedBadge}
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
                                    {t.starsCountLabel.replace('{count}', pickup.rating.stars.toString())}
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
                                  {t.rateCollectorSubtitle}
                                </p>

                                {/* Star Selectors */}
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRatingStars(star)}
                                      className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center rounded-xl text-amber-400 hover:bg-amber-50 active:scale-110 transition-all touch-manipulation"
                                      aria-label={`Rate ${star} star`}
                                    >
                                      <Star
                                        className={`h-7 w-7 ${
                                          ratingStars >= star
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>

                                {/* Quick Audit Tags */}
                                <div>
                                  <p className="text-xs font-bold text-slate-800 mb-2">
                                    {t.selectComplianceTags}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      t.tagPunctual,
                                      t.tagFairWeighing,
                                      t.tagPolite,
                                      t.tagCashImmediate,
                                      t.tagCleanHandling,
                                    ].map((tag) => {
                                      const isSelected = selectedAuditTags.includes(tag);
                                      return (
                                        <button
                                          key={tag}
                                          type="button"
                                          onClick={() => toggleAuditTag(tag)}
                                          className={`min-h-[40px] rounded-full px-3.5 py-2 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
                                            isSelected
                                              ? 'bg-emerald-600 text-white shadow-xs'
                                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
                                    placeholder={t.optionalCommentPlaceholder}
                                    className="w-full min-h-[48px] rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSubmitRating(pickup.id)}
                                  className="w-full min-h-[48px] rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all touch-manipulation"
                                >
                                  {t.submitVerifiedRatingBtn}
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

      {/* Dedicated Star Rating & Feedback Modal */}
      <CollectorFeedbackModal
        isOpen={!!feedbackModalPickup}
        onClose={() => setFeedbackModalPickup(null)}
        pickup={feedbackModalPickup}
        initialStars={feedbackInitialStars}
        language={language}
        onSubmitRating={handleSaveRating}
      />
    </div>
  );
};
