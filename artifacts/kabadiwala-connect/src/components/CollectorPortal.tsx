import React, { useState, useMemo, useEffect } from 'react';
import {
  Truck,
  Scale,
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  Phone,
  ArrowRight,
  AlertCircle,
  X,
  Plus,
  Minus,
  KeyRound,
  FileCheck,
  RotateCcw,
  Clock,
  Sparkles,
  Search,
  Filter,
  Zap,
  CalendarDays,
  Layers,
  Building2,
  Receipt,
  TrendingUp,
  Banknote,
  ChevronRight,
  Volume2,
  VolumeX,
  Navigation,
} from 'lucide-react';
import {
  Pickup,
  AuthUser,
  CollectorTab,
  Language,
  MaterialKey,
  ItemizedWeighItem,
  AuthorizedRecycler,
  DigitalLot,
  HandoverRecord,
  WeightTier,
} from '../types';
import {
  formatINR,
  formatTimestamp,
  formatDateShort,
  deriveArea,
  deriveUrgency,
  materialCatalog,
  readDigitalLotsFromStorage,
  saveDigitalLotsToStorage,
  readHandoversFromStorage,
  saveHandoversToStorage,
} from '../data/mockData';
import { getTranslation, useVernacularAudio } from '../lib/i18n';
import { SafetyModule } from './SafetyModule';
import { PriceBoard } from './PriceBoard';
import { RecyclerDirectory } from './RecyclerDirectory';
import { DigitalLotCreator } from './DigitalLotCreator';
import { HandoverLedger } from './HandoverLedger';
import { CardboardBoxIcon, PlasticBottleIcon, EwastePhoneIcon } from './Illustrations';

interface CollectorPortalProps {
  pickups: Pickup[];
  onUpdatePickups: (next: Pickup[]) => void;
  authUser: AuthUser;
  tab: CollectorTab;
  onSelectTab: (tab: CollectorTab) => void;
  language: Language;
}

export const CollectorPortal: React.FC<CollectorPortalProps> = ({
  pickups,
  onUpdatePickups,
  authUser,
  tab,
  onSelectTab,
  language,
}) => {
  const t = getTranslation(language);

  // Digital Lots and Handovers state
  const [digitalLots, setDigitalLots] = useState<DigitalLot[]>(readDigitalLotsFromStorage);
  const [handovers, setHandovers] = useState<HandoverRecord[]>(readHandoversFromStorage);

  const handleSaveLots = (lots: DigitalLot[]) => {
    setDigitalLots(lots);
    saveDigitalLotsToStorage(lots);
  };

  const handleSaveHandovers = (records: HandoverRecord[]) => {
    setHandovers(records);
    saveHandoversToStorage(records);
  };

  // Find active ongoing job for this collector
  const activeJob = useMemo(() => {
    return pickups.find(
      (p) =>
        (p.status === 'accepted' || p.status === 'arrived') &&
        (p.collectorId === authUser.id || !p.collectorId)
    );
  }, [pickups, authUser.id]);

  // Queue of open pending pickups
  const openJobs = useMemo(() => {
    return pickups.filter((p) => p.status === 'pending');
  }, [pickups]);

  // Search & Filter state for Queue
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  // Filtered jobs in queue
  const filteredJobs = useMemo(() => {
    return openJobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAddress = job.address.toLowerCase().includes(q);
        const matchesUser = job.userName.toLowerCase().includes(q);
        const matchesId = job.id.toLowerCase().includes(q);
        if (!matchesAddress && !matchesUser && !matchesId) return false;
      }
      if (selectedArea !== 'all') {
        const area = job.area || deriveArea(job.address);
        if (area !== selectedArea) return false;
      }
      return true;
    });
  }, [openJobs, searchQuery, selectedArea]);

  // Itemized scale weight calculator state
  const [itemizedRows, setItemizedRows] = useState<ItemizedWeighItem[]>([]);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [supervisorOverrideAllowed, setSupervisorOverrideAllowed] = useState(false);
  const [scaleSuccessAlert, setScaleSuccessAlert] = useState<{
    payout: number;
    kg: number;
    id: string;
  } | null>(null);

  const { isPlaying, activeId, playAudio, stopAudio, text: spokenScaleText } = useVernacularAudio();
  const isSpeakingScale = isPlaying && activeId === 'scale-readout';

  // Text-To-Speech audio readout for scale weighing calculator
  const handleSpeakScaleReadout = () => {
    if (isSpeakingScale) {
      stopAudio();
      return;
    }

    let textToSpeak = '';
    if (language === 'bn') {
      const itemsSummaryBn = itemizedRows
        .map((r) => {
          const item = materialCatalog.find((c) => c.key === r.key);
          const name = item?.labelBn || r.label;
          return `${r.kg} কেজি ${name}`;
        })
        .join(', ');
      textToSpeak = `ডিজিটাল স্কেলের বিবরণ। সামগ্রী: ${itemsSummaryBn}। মোট যাচাইকৃত ওজন ${totalScaleKg.toFixed(2)} কেজি। মোট প্রদেয় নগদ অর্থ ${totalScalePayout.toFixed(2)} টাকা। নগদ পরিশোধ নিশ্চিত করতে নাগরিকের ৪-সংখ্যার সিকিউরিটি পিন লিখুন।`;
    } else if (language === 'hi') {
      const itemsSummaryHi = itemizedRows
        .map((r) => {
          const item = materialCatalog.find((c) => c.key === r.key);
          const name = item?.labelHi || r.label;
          return `${r.kg} किलो ${name}`;
        })
        .join(', ');
      textToSpeak = `डिजिटल कांटा तौल सारांश। सामग्री: ${itemsSummaryHi}। कुल सत्यापित वजन ${totalScaleKg.toFixed(2)} किलोग्राम। कुल देय नकद राशि ${totalScalePayout.toFixed(2)} रुपये। नकद भुगतान की पुष्टि के लिए नागरिक का ४-अंकों का पिन दर्ज करें।`;
    } else {
      const itemsSummary = itemizedRows
        .map((r) => `${r.kg} kg ${r.label}`)
        .join(', ');
      textToSpeak = `Scale weighing summary. Items: ${itemsSummary}. Total verified weight is ${totalScaleKg.toFixed(2)} kilograms. Calculated payout is ${totalScalePayout.toFixed(2)} rupees. Enter resident 4 digit PIN to confirm cash payment.`;
    }

    playAudio(textToSpeak, language, 'scale-readout');
  };

  // Sync itemized rows whenever activeJob changes
  useEffect(() => {
    if (!activeJob) {
      setItemizedRows([]);
      setEnteredOtp('');
      return;
    }

    if (activeJob.itemizedWeighing && activeJob.itemizedWeighing.length > 0) {
      setItemizedRows(activeJob.itemizedWeighing);
    } else if (activeJob.materials && activeJob.materials.length > 0) {
      const initial = activeJob.materials.map((m) => {
        const catalogItem = materialCatalog.find((c) => c.key === m.key);
        const rate = m.rate || catalogItem?.rate || 20;
        return {
          key: m.key,
          label: m.label || catalogItem?.label || m.key,
          rate,
          kg: m.kg,
          subtotal: Math.round(m.kg * rate * 100) / 100,
        };
      });
      setItemizedRows(initial);
    } else {
      setItemizedRows([
        {
          key: 'cardboard',
          label: 'Paper & Cardboard',
          rate: 8,
          kg: 12,
          subtotal: 96,
        },
      ]);
    }
    setEnteredOtp('');
  }, [activeJob?.id]);

  const handleItemizedWeightChange = (index: number, newKg: number) => {
    const validKg = Math.max(0, Math.round(newKg * 100) / 100);
    setItemizedRows((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        const subtotal = Math.round(validKg * copy[index].rate * 100) / 100;
        copy[index] = {
          ...copy[index],
          kg: validKg,
          subtotal,
        };
      }
      return copy;
    });
  };

  const handleAddMaterialToScale = (key: MaterialKey) => {
    const mat = materialCatalog.find((m) => m.key === key);
    if (!mat) return;
    setItemizedRows((prev) => [
      ...prev,
      {
        key: mat.key,
        label: mat.label,
        rate: mat.rate,
        kg: 1.0,
        subtotal: mat.rate,
      },
    ]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    setItemizedRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Scale totals
  const totalScaleKg = useMemo(() => {
    return Math.round(itemizedRows.reduce((acc, row) => acc + (row.kg || 0), 0) * 100) / 100;
  }, [itemizedRows]);

  const totalScalePayout = useMemo(() => {
    const sum = itemizedRows.reduce((acc, row) => acc + (row.subtotal || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [itemizedRows]);

  // Handler: Accept Job
  const handleAcceptJob = (job: Pickup) => {
    const updated = pickups.map((p) => {
      if (p.id === job.id) {
        return {
          ...p,
          status: 'accepted' as const,
          collectorId: authUser.id,
          collectorName: authUser.name,
          collectorPhone: authUser.phone,
          collectorVehicle: authUser.vehicle,
          acceptedAt: new Date().toISOString(),
          etaMinutes: 10,
          timeline: [
            ...p.timeline,
            {
              status: 'accepted' as const,
              title: 'Collector Assigned & En Route',
              timestamp: new Date().toISOString(),
              note: `${authUser.name} accepted the pickup request.`,
            },
          ],
        };
      }
      return p;
    });
    onUpdatePickups(updated);
    onSelectTab('active');
  };

  // Handler: Mark Arrived
  const handleMarkArrived = () => {
    if (!activeJob) return;
    const updated = pickups.map((p) => {
      if (p.id === activeJob.id) {
        return {
          ...p,
          status: 'arrived' as const,
          arrivedAt: new Date().toISOString(),
          timeline: [
            ...p.timeline,
            {
              status: 'arrived' as const,
              title: 'Collector Arrived at Doorstep',
              timestamp: new Date().toISOString(),
              note: `${authUser.name} arrived at doorstep. Scale weighing starting.`,
            },
          ],
        };
      }
      return p;
    });
    onUpdatePickups(updated);
  };

  // Handler: Confirm Scale & Cash
  const handleConfirmScaleAndCash = () => {
    if (!activeJob) return;
    if (totalScaleKg <= 0) {
      setScaleError('Please enter verified scale weight greater than 0 kg.');
      return;
    }
    if (enteredOtp.trim().length !== 4) {
      setScaleError('Please enter the resident 4-digit security PIN before confirming payment.');
      return;
    }
    if (activeJob.verificationOtp && enteredOtp.trim() !== activeJob.verificationOtp && !supervisorOverrideAllowed) {
      setScaleError(
        `Entered PIN (${enteredOtp.trim()}) does not match resident PIN (${activeJob.verificationOtp}). Please verify or authorize override.`
      );
      return;
    }

    setScaleError(null);
    setSupervisorOverrideAllowed(false);

    const updated = pickups.map((p) => {
      if (p.id === activeJob.id) {
        return {
          ...p,
          status: 'completed' as const,
          finalKg: totalScaleKg,
          payout: totalScalePayout,
          itemizedWeighing: itemizedRows,
          completedAt: new Date().toISOString(),
          timeline: [
            ...p.timeline,
            {
              status: 'completed' as const,
              title: 'Weighed & Paid in Cash',
              timestamp: new Date().toISOString(),
              note: `Weighed ${totalScaleKg} kg. Paid ${formatINR(totalScalePayout)} in cash.`,
            },
          ],
        };
      }
      return p;
    });

    // Auto log transaction into ledger
    const autoLedgerRecord: HandoverRecord = {
      id: `lead-${Date.now().toString(36)}`,
      referenceCode: `EPR-HO-${Math.floor(1000 + Math.random() * 9000)}`,
      collectorId: authUser.id,
      collectorName: authUser.name,
      recyclerId: 'rec-01',
      recyclerName: 'Kasba Secondary Aggregation Point',
      facilityLocation: activeJob.address,
      materials: itemizedRows.map((r) => ({
        key: r.key,
        label: r.label,
        kg: r.kg,
        rate: r.rate,
        subtotal: r.subtotal,
      })),
      totalKg: totalScaleKg,
      totalPayout: totalScalePayout,
      paymentMode: 'Cash at Hub',
      paymentStatus: 'paid',
      timestamp: new Date().toISOString(),
      gpsLocation: '22.5186° N, 88.3844° E (Kasba Aggregation)',
      photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
      recyclerConfirmed: true,
      notes: `Doorstep verified collection from resident ${activeJob.userName}`,
    };

    handleSaveHandovers([autoLedgerRecord, ...handovers]);
    onUpdatePickups(updated);
    setScaleSuccessAlert({
      payout: totalScalePayout,
      kg: totalScaleKg,
      id: activeJob.id,
    });
  };

  // Macro metrics overview for collector (Screen 6 style)
  const completedJobs = pickups.filter((p) => p.status === 'completed');
  const macroPickups = completedJobs.length || 48;
  const macroWeight = completedJobs.reduce((acc, p) => acc + (p.finalKg || p.estimatedKg || 0), 0) || 342;
  const macroPayout = completedJobs.reduce((acc, p) => acc + (p.payout || 0), 0) || 3680;
  const macroCo2 = Math.round((macroWeight * 1.82) / 10) / 100;

  return (
    <div className="mx-auto max-w-xl pb-24 space-y-4">
      {/* Tab Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
        <button
          type="button"
          onClick={() => onSelectTab('queue')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            tab === 'queue'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {t.collectorAvailablePickups} ({openJobs.length})
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('active')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            tab === 'active'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {t.collectorScaleWeighing} {activeJob && '●'}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('handover')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            tab === 'handover' || (tab as any) === 'earnings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {t.collectorEarningsLedger}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('prices')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            tab === 'prices'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {t.collectorDailyRates}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('safety')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            tab === 'safety'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {t.collectorSafetyGuide}
        </button>
      </div>

      {/* 4 Macro Metrics Overview Cards - Responsive 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          type="button"
          id="collector-metric-pickups"
          onClick={() => onSelectTab('queue')}
          className="min-h-[64px] rounded-2xl bg-emerald-50/80 p-3 text-center border border-emerald-200/90 shadow-2xs hover:bg-emerald-100/90 hover:border-emerald-300 transition-all active:scale-[0.98] cursor-pointer touch-manipulation focus:outline-hidden"
          title="View Pickup Queue"
        >
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
            {t.collectorTotalPickups}
          </p>
          <p className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5">
            {macroPickups}
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-weight"
          onClick={() => onSelectTab('active')}
          className="min-h-[64px] rounded-2xl bg-sky-50/80 p-3 text-center border border-sky-200/90 shadow-2xs hover:bg-sky-100/90 hover:border-sky-300 transition-all active:scale-[0.98] cursor-pointer touch-manipulation focus:outline-hidden"
          title="Open Scale Weighing"
        >
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
            {t.collectorTotalWeight}
          </p>
          <p className="text-lg sm:text-xl font-black text-sky-800 mt-0.5">
            {macroWeight} {t.kg}
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-payout"
          onClick={() => onSelectTab('handover')}
          className="min-h-[64px] rounded-2xl bg-purple-50/80 p-3 text-center border border-purple-200/90 shadow-2xs hover:bg-purple-100/90 hover:border-purple-300 transition-all active:scale-[0.98] cursor-pointer touch-manipulation focus:outline-hidden"
          title="View Earnings & Ledger"
        >
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
            {t.collectorTotalPayout}
          </p>
          <p className="text-lg sm:text-xl font-black text-purple-800 mt-0.5">
            ₹{macroPayout.toLocaleString('en-IN')}
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-co2"
          onClick={() => onSelectTab('handover')}
          className="min-h-[64px] rounded-2xl bg-emerald-50/80 p-3 text-center border border-emerald-200/90 shadow-2xs hover:bg-emerald-100/90 hover:border-emerald-300 transition-all active:scale-[0.98] cursor-pointer touch-manipulation focus:outline-hidden"
          title="View Environmental Impact"
        >
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
            {t.collectorCo2Saved}
          </p>
          <p className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5">
            ~ {macroCo2 || '1.2'} t
          </p>
        </button>
      </div>

      {/* SUCCESS POPUP AFTER CONFIRMING WEIGHING */}
      {scaleSuccessAlert && (
        <div className="rounded-2xl bg-emerald-600 p-4 text-white shadow-lg flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            <div>
              <p className="text-sm font-bold">{t.paymentLoggedSuccess}</p>
              <p className="text-xs text-emerald-100">
                {t.paidForScrapNote.replace('{payout}', formatINR(scaleSuccessAlert.payout, true)).replace('{kg}', scaleSuccessAlert.kg.toFixed(2))}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScaleSuccessAlert(null)}
            className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30"
          >
            {t.done}
          </button>
        </div>
      )}

      {/* TAB 1: AVAILABLE PICKUPS QUEUE (Screen 5 & 6) */}
      {tab === 'queue' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2 border border-slate-200 shadow-2xs">
            <div className="flex flex-1 items-center gap-2 px-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchQueuePlaceholder}
                className="w-full text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              {t.allFilter}
            </span>
          </div>

          {/* Job Cards */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
                <Truck className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-800">{t.queueEmptyTitle}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {t.queueEmptyDesc}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const materialsSummary = job.materials
                  .map((m) => {
                    const catalogItem = materialCatalog.find((c) => c.key === m.key);
                    if (language === 'bn' && catalogItem?.labelBn) return catalogItem.labelBn;
                    if (language === 'hi' && catalogItem?.labelHi) return catalogItem.labelHi;
                    return m.label;
                  })
                  .join(' + ');
                const totalEstimatedKg = job.estimatedKg || 10;
                const estPayout = job.payout || 120;

                return (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-300 transition-all"
                  >
                    {/* Header: Order ID & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        #{job.id}
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                        {t.availableJobBadge}
                      </span>
                    </div>

                    {/* Materials & Location */}
                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {materialsSummary || t.mixedScrapMaterials}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{job.address}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span>{t.residentLabel}: {job.userName}</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-700">
                          ~{totalEstimatedKg} {t.kg} (₹{estPayout})
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.slot || t.todaySlot}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptJob(job)}
                        className="min-h-[44px] flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
                      >
                        <span>{t.acceptJobBtn}</span>
                        <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SCALE WEIGHING CALCULATOR */}
      {tab === 'active' && (
        <div className="rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
          {!activeJob ? (
            <div className="py-8 text-center">
              <Scale className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-bold text-slate-800">{t.scaleNoActiveJob}</p>
              <p className="text-xs text-slate-500 mt-1">
                {t.scalePleaseAccept}
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('queue')}
                className="mt-4 min-h-[44px] rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
              >
                {t.viewQueueBtn}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      #{activeJob.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        activeJob.status === 'arrived'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {activeJob.status === 'arrived' ? t.atDoorstepBadge : t.enRouteBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    {activeJob.userName} · {activeJob.userPhone}
                  </p>
                </div>

                {activeJob.status === 'accepted' && (
                  <button
                    type="button"
                    onClick={handleMarkArrived}
                    className="min-h-[44px] rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white hover:bg-amber-600 shadow-2xs active:scale-95 transition-all touch-manipulation"
                  >
                    {t.arrivedBtn}
                  </button>
                )}
              </div>

              {/* Vernacular Audio Readout Button & Synchronized Visual Transcript */}
              <div className="rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <Volume2 className="h-5 w-5 text-emerald-600" />
                    <span>{t.audioScaleReadoutTitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSpeakScaleReadout}
                    className={`min-h-[44px] rounded-xl px-4 py-2 text-xs font-black transition-all active:scale-95 touch-manipulation ${
                      isSpeakingScale
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                    }`}
                  >
                    {isSpeakingScale ? t.stopAudio : t.speakSummaryBtn}
                  </button>
                </div>

                {isSpeakingScale && spokenScaleText && (
                  <div className="rounded-xl bg-white p-3 border border-emerald-300 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>
                        {language === 'hi'
                          ? 'लाइव हिंदी ऑडियो व सबटाइटल'
                          : language === 'bn'
                          ? 'লাইভ বাংলা অডিও ও ক্যাপশন'
                          : 'Live Vernacular Audio Broadcast'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 leading-relaxed">
                      {spokenScaleText}
                    </p>
                  </div>
                )}
              </div>

              {/* Itemized Scale Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {t.itemizedScaleTitle}
                  </h4>
                  <span className="text-xs font-black text-emerald-800">
                    {t.total}: {totalScaleKg.toFixed(2)} {t.kg}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {itemizedRows.map((row, idx) => {
                    const catalogItem = materialCatalog.find((c) => c.key === row.key);
                    const localizedRowLabel =
                      language === 'bn' && catalogItem?.labelBn
                        ? catalogItem.labelBn
                        : language === 'hi' && catalogItem?.labelHi
                        ? catalogItem.labelHi
                        : row.label;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-200 gap-2.5"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {localizedRowLabel}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {t.rate}: ₹{row.rate}/{t.kg} · {t.subtotal}: <strong className="text-emerald-800 font-black">{formatINR(row.subtotal, true)}</strong>
                          </p>
                        </div>

                        {/* Stepper + Direct Mobile Numeric Input */}
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleItemizedWeightChange(idx, row.kg - 0.5)}
                            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 shadow-xs hover:bg-slate-100 active:scale-95 transition-all touch-manipulation"
                            aria-label={`Decrease ${localizedRowLabel} weight`}
                          >
                            <Minus className="h-4 w-4 stroke-[2.5]" />
                          </button>
                          
                          <div className="flex items-center">
                            <input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min="0"
                              value={row.kg === 0 ? '' : row.kg}
                              placeholder="0.00"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                handleItemizedWeightChange(idx, isNaN(val) ? 0 : val);
                              }}
                              className="w-20 min-h-[44px] text-center font-black text-slate-900 bg-white border border-slate-300 rounded-xl text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                              aria-label={`${localizedRowLabel} weight in ${t.kg}`}
                            />
                            <span className="text-xs font-bold text-slate-500 ml-1.5">{t.kg}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleItemizedWeightChange(idx, row.kg + 0.5)}
                            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
                            aria-label={`Increase ${localizedRowLabel} weight`}
                          >
                            <Plus className="h-4 w-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Extra Material to Scale */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    {t.addExtraFraction}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {materialCatalog.map((cat) => {
                      const alreadyAdded = itemizedRows.some((r) => r.key === cat.key);
                      const catName =
                        language === 'bn' && cat.labelBn
                          ? cat.labelBn
                          : language === 'hi' && cat.labelHi
                          ? cat.labelHi
                          : cat.label;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => handleAddMaterialToScale(cat.key)}
                          className={`min-h-[40px] rounded-full px-3.5 py-2 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
                            alreadyAdded
                              ? 'bg-slate-100 text-slate-400 cursor-default'
                              : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          + {catName} (₹{cat.rate}/{t.kg})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resident OTP Verification */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.residentOtp}
                  </label>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {t.requiredToCompleteHandover}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full min-h-[52px] rounded-2xl border-2 border-slate-300 p-3 text-2xl font-mono tracking-[0.4em] text-center font-black text-slate-900 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
                    aria-label="Enter resident 4-digit PIN"
                  />
                </div>

                {activeJob.verificationOtp && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    💡 {t.residentSecurityCheckTip} (
                    <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                      {activeJob.verificationOtp}
                    </span>
                    )
                  </p>
                )}
              </div>

              {scaleError && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
                  {scaleError}
                </div>
              )}

              {/* Total & Confirm Button */}
              <div className="rounded-2xl bg-emerald-50/90 p-4 border border-emerald-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">{t.totalPayoutToResident}</p>
                  <p className="text-2xl font-black text-emerald-950">{formatINR(totalScalePayout, true)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmScaleAndCash}
                  className="min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all touch-manipulation"
                >
                  <CheckCircle2 className="h-5 w-5 stroke-[2.3]" />
                  <span>{t.confirmCashPayoutBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DAILY PRICE BOARD */}
      {tab === 'prices' && <PriceBoard language={language} />}

      {/* TAB 4: HANDOVER & LEDGER */}
      {tab === 'handover' && (
        <HandoverLedger
          language={language}
          handovers={handovers}
          onSaveHandovers={handleSaveHandovers}
        />
      )}

      {/* TAB 5: SAFETY GUIDE */}
      {tab === 'safety' && <SafetyModule language={language} />}
    </div>
  );
};
