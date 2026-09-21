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
import { getTranslation, speakVernacular, stopVernacularSpeech } from '../lib/i18n';
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

  const [isSpeakingScale, setIsSpeakingScale] = useState(false);

  // Text-To-Speech audio readout for scale weighing calculator
  const handleSpeakScaleReadout = () => {
    if (isSpeakingScale) {
      stopVernacularSpeech();
      setIsSpeakingScale(false);
      return;
    }

    const itemsSummary = itemizedRows
      .map((r) => `${r.kg} kg ${r.label}`)
      .join(', ');

    const textToSpeak = `Scale summary. Items: ${itemsSummary}. Total verified weight is ${totalScaleKg} kilograms. Calculated payout is ${totalScalePayout} rupees. Enter resident 4 digit PIN to confirm cash payment.`;

    stopVernacularSpeech();
    setIsSpeakingScale(true);
    const started = speakVernacular(textToSpeak, language);
    if (!started) setIsSpeakingScale(false);

    setTimeout(() => {
      setIsSpeakingScale(false);
    }, 12000);
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
          subtotal: Math.round(m.kg * rate),
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
    const validKg = Math.max(0, Math.round(newKg * 10) / 10);
    setItemizedRows((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = {
          ...copy[index],
          kg: validKg,
          subtotal: Math.round(validKg * copy[index].rate),
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
    return Math.round(itemizedRows.reduce((acc, row) => acc + (row.kg || 0), 0) * 10) / 10;
  }, [itemizedRows]);

  const totalScalePayout = useMemo(() => {
    return itemizedRows.reduce((acc, row) => acc + (row.subtotal || 0), 0);
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onSelectTab('queue')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'queue'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Available Pickups ({openJobs.length})
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('active')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'active'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Scale Weighing {activeJob && '●'}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('handover')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'handover' || (tab as any) === 'earnings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Earnings & Ledger
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('prices')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'prices'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Daily Rates
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('safety')}
          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
            tab === 'safety'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Safety Guide
        </button>
      </div>

      {/* 4 Macro Metrics Overview Cards */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          id="collector-metric-pickups"
          onClick={() => onSelectTab('queue')}
          className="rounded-2xl bg-emerald-50/60 p-2.5 text-center border border-emerald-100/80 shadow-2xs hover:bg-emerald-100/80 hover:border-emerald-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden"
          title="View Pickup Queue"
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Total Pickups
          </p>
          <p className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">
            {macroPickups}
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-weight"
          onClick={() => onSelectTab('active')}
          className="rounded-2xl bg-sky-50/60 p-2.5 text-center border border-sky-100/80 shadow-2xs hover:bg-sky-100/80 hover:border-sky-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden"
          title="Open Scale Weighing"
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Total Weight
          </p>
          <p className="text-base sm:text-lg font-black text-sky-700 mt-0.5">
            {macroWeight} kg
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-payout"
          onClick={() => onSelectTab('handover')}
          className="rounded-2xl bg-purple-50/60 p-2.5 text-center border border-purple-100/80 shadow-2xs hover:bg-purple-100/80 hover:border-purple-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden"
          title="View Earnings & Ledger"
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Total Payout
          </p>
          <p className="text-base sm:text-lg font-black text-purple-700 mt-0.5">
            ₹{macroPayout.toLocaleString('en-IN')}
          </p>
        </button>

        <button
          type="button"
          id="collector-metric-co2"
          onClick={() => onSelectTab('handover')}
          className="rounded-2xl bg-emerald-50/60 p-2.5 text-center border border-emerald-100/80 shadow-2xs hover:bg-emerald-100/80 hover:border-emerald-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden"
          title="View Environmental Impact"
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            CO2 Saved
          </p>
          <p className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">
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
              <p className="text-sm font-bold">Cash Payment Complete & Logged!</p>
              <p className="text-xs text-emerald-100">
                Paid ₹{scaleSuccessAlert.payout} for {scaleSuccessAlert.kg} kg scrap.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScaleSuccessAlert(null)}
            className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30"
          >
            Done
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
                placeholder="Search by address, material or order ID..."
                className="w-full text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              All
            </span>
          </div>

          {/* Job Cards */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
                <Truck className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-800">No Open Jobs In Queue</p>
                <p className="text-xs text-slate-500 mt-1">
                  All neighborhood scrap requests have been accepted.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const materialsSummary = job.materials.map((m) => m.label).join(' + ');
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
                        Available Job
                      </span>
                    </div>

                    {/* Materials & Location */}
                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {materialsSummary || 'Mixed Scrap Materials'}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{job.address}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span>Resident: {job.userName}</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-700">
                          ~{totalEstimatedKg} kg (₹{estPayout})
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.slot || 'Today'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptJob(job)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                      >
                        <span>Accept Job</span>
                        <ChevronRight className="h-4 w-4" />
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
        <div className="rounded-3xl bg-white p-4 sm:p-5 border border-slate-100 shadow-xs space-y-4">
          {!activeJob ? (
            <div className="py-8 text-center">
              <Scale className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-bold text-slate-800">No Active Job In Progress</p>
              <p className="text-xs text-slate-500 mt-1">
                Please accept a pickup from the Available Pickups queue.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('queue')}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                View Available Pickups
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
                      {activeJob.status === 'arrived' ? 'At Doorstep' : 'En Route'}
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
                    className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 shadow-2xs"
                  >
                    I Have Arrived
                  </button>
                )}
              </div>

              {/* Vernacular Audio Readout Button */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Volume2 className="h-4 w-4 text-emerald-600" />
                  <span>Audio Scale Readout</span>
                </div>
                <button
                  type="button"
                  onClick={handleSpeakScaleReadout}
                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  {isSpeakingScale ? 'Stop Audio' : 'Speak Summary'}
                </button>
              </div>

              {/* Itemized Scale Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Itemized Digital Scale
                  </h4>
                  <span className="text-xs font-bold text-emerald-700">
                    Total: {totalScaleKg} kg
                  </span>
                </div>

                <div className="space-y-2">
                  {itemizedRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-200/70"
                    >
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {row.label}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Rate: ₹{row.rate}/kg · Subtotal: <strong className="text-slate-800">₹{row.subtotal}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleItemizedWeightChange(idx, row.kg - 0.5)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-12 text-center text-xs font-black text-slate-900">
                          {row.kg} kg
                        </span>
                        <button
                          type="button"
                          onClick={() => handleItemizedWeightChange(idx, row.kg + 0.5)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Extra Material to Scale */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                    + Add Extra Recyclable Fraction Found On-Site:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {materialCatalog.map((cat) => {
                      const alreadyAdded = itemizedRows.some((r) => r.key === cat.key);
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => handleAddMaterialToScale(cat.key)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                            alreadyAdded
                              ? 'bg-slate-100 text-slate-400 cursor-default'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          + {cat.label} (₹{cat.rate}/kg)
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resident OTP Verification */}
              <div className="rounded-2xl border border-slate-200 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Resident 4-Digit Security PIN
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Required to Complete Handover
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ask resident for PIN (e.g. 4192)"
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm font-mono tracking-widest text-center font-bold focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {activeJob.verificationOtp && (
                  <p className="text-[11px] text-slate-500">
                    💡 Resident security check: Enter resident's 4-digit code (
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-200">
                      {activeJob.verificationOtp}
                    </span>
                    ) displayed on their screen.
                  </p>
                )}
              </div>

              {scaleError && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                  {scaleError}
                </div>
              )}

              {/* Total & Confirm Button */}
              <div className="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-800 font-medium">Total Payout to Resident</p>
                  <p className="text-xl font-black text-emerald-900">₹ {totalScalePayout}</p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmScaleAndCash}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirm Cash Payout</span>
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
