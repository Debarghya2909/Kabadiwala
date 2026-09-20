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
  ShieldAlert,
  TrendingUp,
  Banknote,
  ChevronRight,
  Info,
  Volume2,
  VolumeX,
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
  getCalculatedPayoutEstimate,
  materialCatalog,
  readDigitalLotsFromStorage,
  saveDigitalLotsToStorage,
  readHandoversFromStorage,
  saveHandoversToStorage,
  authorizedRecyclers,
} from '../data/mockData';
import { getTranslation, speakVernacular, stopVernacularSpeech } from '../lib/i18n';
import { SafetyModule } from './SafetyModule';
import { PriceBoard } from './PriceBoard';
import { RecyclerDirectory } from './RecyclerDirectory';
import { DigitalLotCreator } from './DigitalLotCreator';
import { HandoverLedger } from './HandoverLedger';

interface CollectorPortalProps {
  pickups: Pickup[];
  onUpdatePickups: (next: Pickup[]) => void;
  authUser: AuthUser;
  tab: CollectorTab;
  onSelectTab: (tab: CollectorTab) => void;
  language: Language;
  onSwitchToHousehold?: () => void;
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
  const [selectedWeightType, setSelectedWeightType] = useState<WeightTier>('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  // Distinct areas from open pending jobs
  const distinctAreas = useMemo(() => {
    const set = new Set<string>();
    openJobs.forEach((job) => {
      const area = job.area || deriveArea(job.address);
      if (area) set.add(area);
    });
    return Array.from(set).sort();
  }, [openJobs]);

  // Filtered jobs in queue
  const filteredJobs = useMemo(() => {
    return openJobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAddress = job.address.toLowerCase().includes(q);
        const matchesLandmark = (job.landmark || '').toLowerCase().includes(q);
        const matchesUser = job.userName.toLowerCase().includes(q);
        const matchesNotes = (job.notes || '').toLowerCase().includes(q);
        if (!matchesAddress && !matchesLandmark && !matchesUser && !matchesNotes) {
          return false;
        }
      }
      if (selectedArea !== 'all') {
        const area = job.area || deriveArea(job.address);
        if (area !== selectedArea) return false;
      }
      if (selectedWeightType !== 'all') {
        const kg = job.estimatedKg;
        if (selectedWeightType === 'light' && kg > 10) return false;
        if (selectedWeightType === 'medium' && (kg <= 10 || kg > 25)) return false;
        if (selectedWeightType === 'heavy' && kg <= 25) return false;
      }
      if (selectedUrgency !== 'all') {
        const urgency = job.urgency || deriveUrgency(job.slot);
        if (urgency !== selectedUrgency) return false;
      }
      return true;
    });
  }, [openJobs, searchQuery, selectedArea, selectedWeightType, selectedUrgency]);

  // ITEMIZED SCALE WEIGHT CALCULATOR STATE
  const [itemizedRows, setItemizedRows] = useState<ItemizedWeighItem[]>([]);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [scaleSuccessAlert, setScaleSuccessAlert] = useState<{
    payout: number;
    kg: number;
    id: string;
  } | null>(null);

  const [isSpeakingScale, setIsSpeakingScale] = useState(false);

  // Text-To-Speech audio readout for scale weighing calculator (low-literacy accessible)
  const handleSpeakScaleReadout = () => {
    if (isSpeakingScale) {
      stopVernacularSpeech();
      setIsSpeakingScale(false);
      return;
    }

    const itemsSummary = itemizedRows
      .map(
        (r) =>
          `${r.kg} ${language === 'hi' ? 'किलो' : language === 'mr' ? 'किलो' : 'kg'} ${r.label}`
      )
      .join(', ');

    let textToSpeak = '';
    if (language === 'hi') {
      textToSpeak = `डिजिटल तौल सारांश। सामग्री: ${itemsSummary}। कुल कांटा वजन ${totalScaleKg} किलोग्राम। कुल देय नकद राशि ₹${totalScalePayout}। नकद भुगतान की पुष्टि के लिए नागरिक का 4-अंकों का पिन दर्ज करें।`;
    } else if (language === 'mr') {
      textToSpeak = `डिजिटल वजन तपशील. साहित्य: ${itemsSummary}. एकूण वजन ${totalScaleKg} किलो. एकूण रोख रक्कम ₹${totalScalePayout}. रोख रक्कम देण्यासाठी 4 अंकी पिन टाका.`;
    } else {
      textToSpeak = `Verified scale weighing summary. Items: ${itemsSummary}. Total verified weight is ${totalScaleKg} kilograms. Total calculated cash payout is ${totalScalePayout} rupees. Please verify resident 4 digit PIN to confirm cash handover.`;
    }

    stopVernacularSpeech();
    setIsSpeakingScale(true);
    const started = speakVernacular(textToSpeak, language);
    if (!started) {
      setIsSpeakingScale(false);
    }

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
      // Default to general scrap
      setItemizedRows([
        {
          key: 'pcb',
          label: 'Printed Circuit Boards (PCBs)',
          rate: 285,
          kg: 2,
          subtotal: 570,
        },
      ]);
    }
    setEnteredOtp(activeJob.verificationOtp || '');
  }, [activeJob?.id]);

  // Itemized weight change handler
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

  // Add extra material row to scale calculator
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

  // Calculations for Scale
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

  // Handler: Mark Arrived at Doorstep
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
              note: `${authUser.name} reached the address. Commencing itemized digital weighing.`,
            },
          ],
        };
      }
      return p;
    });
    onUpdatePickups(updated);
  };

  // Handler: Confirm Scale Weight & Hand Cash
  const handleConfirmScaleAndCash = () => {
    if (!activeJob) return;
    if (totalScaleKg <= 0) {
      alert(
        language === 'hi'
          ? 'कृपया 0 किग्रा से अधिक कांटा वजन दर्ज करें।'
          : language === 'mr'
          ? 'कृपया 0 किलोपेक्षा जास्त वजन प्रविष्ट करा.'
          : 'Please enter verified scale weight greater than 0 kg.'
      );
      return;
    }

    // Handover security verification: check 4-digit OTP
    if (enteredOtp.trim().length !== 4) {
      alert(
        language === 'hi'
          ? 'कृपया नकद भुगतान करने से पहले नागरिक का 4-अंकों का सुरक्षा पिन दर्ज करें।'
          : language === 'mr'
          ? 'कृपया रोख रक्कम देण्यापूर्वी नागरिकाचा 4-अंकी सुरक्षा पिन टाका.'
          : 'Please enter the resident 4-digit security PIN before confirming cash handover.'
      );
      return;
    }

    if (activeJob.verificationOtp && enteredOtp.trim() !== activeJob.verificationOtp) {
      const allowOverride = window.confirm(
        language === 'hi'
          ? `दर्ज किया गया पिन (${enteredOtp.trim()}) मेल नहीं खाता। क्या आप फील्ड सुपरवाइज़र ओवरराइड के साथ आगे बढ़ना चाहते हैं?`
          : `Entered PIN (${enteredOtp.trim()}) does not match resident security PIN (${activeJob.verificationOtp}). Do you want to authorize field supervisor override to finalize cash handover?`
      );
      if (!allowOverride) return;
    }

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
              note: `Weighed ${totalScaleKg} kg across ${itemizedRows.length} itemized categories. Handed over ${formatINR(
                totalScalePayout
              )} in cash.`,
            },
          ],
        };
      }
      return p;
    });

    // Also auto-log transaction into Earnings Ledger
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
      gpsLocation: `${activeJob.lat || 22.5186}° N, ${activeJob.lng || 88.3644}° E`,
      photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      recyclerConfirmed: true,
      notes: `Doorstep scrap collection completed from ${activeJob.userName}.`,
    };
    handleSaveHandovers([autoLedgerRecord, ...handovers]);

    onUpdatePickups(updated);
    setScaleSuccessAlert({
      payout: totalScalePayout,
      kg: totalScaleKg,
      id: activeJob.id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Modal / Banner after Weighing Completion */}
      {scaleSuccessAlert && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  {language === 'hi'
                    ? 'तौल पूरा हुआ और नकद भुगतान सफल!'
                    : language === 'mr'
                    ? 'वजन पूर्ण आणि रोख रक्कम दिली गेली!'
                    : 'Weighing Verified & Cash Handover Successful!'}
                </h3>
                <p className="mt-1 text-xs text-emerald-800">
                  Job #{scaleSuccessAlert.id}: {scaleSuccessAlert.kg} kg verified. Handed over{' '}
                  <span className="font-bold text-emerald-900">
                    {formatINR(scaleSuccessAlert.payout)}
                  </span>{' '}
                  in cash to resident. Record saved to your Earnings Ledger.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setScaleSuccessAlert(null);
                onSelectTab('queue');
              }}
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
            >
              Continue to Queue
            </button>
          </div>
        </div>
      )}

      {/* Collector Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs">
        <button
          id="tab-queue"
          type="button"
          onClick={() => onSelectTab('queue')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'queue'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>{t.tabQueue}</span>
          {openJobs.length > 0 && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white font-extrabold">
              {openJobs.length}
            </span>
          )}
        </button>

        <button
          id="tab-active"
          type="button"
          onClick={() => onSelectTab('active')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'active'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>{t.tabActive}</span>
          {activeJob && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          id="tab-lots"
          type="button"
          onClick={() => onSelectTab('lots')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'lots'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{t.tabLots}</span>
        </button>

        <button
          id="tab-prices"
          type="button"
          onClick={() => onSelectTab('prices')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'prices'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{t.tabPrices}</span>
        </button>

        <button
          id="tab-recyclers"
          type="button"
          onClick={() => onSelectTab('recyclers')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'recyclers'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{t.tabRecyclers}</span>
        </button>

        <button
          id="tab-handover"
          type="button"
          onClick={() => onSelectTab('handover')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'handover'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>{t.tabHandover}</span>
        </button>

        <button
          id="tab-safety"
          type="button"
          onClick={() => onSelectTab('safety')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
            tab === 'safety'
              ? 'bg-red-700 text-white shadow-2xs'
              : 'text-red-700 hover:bg-red-50'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{t.tabSafety}</span>
        </button>
      </div>

      {/* TAB 1: PICKUP QUEUE */}
      {tab === 'queue' && (
        <div className="space-y-4">
          {/* Active Job Callout if ongoing */}
          {activeJob && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500 p-2 text-slate-950 font-bold">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Active Job In Progress
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {activeJob.userName} · {activeJob.address}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('active')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                <span>Go to Scale Weighing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by address, landmark, resident name..."
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {distinctAreas.length > 0 && (
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 font-semibold"
                >
                  <option value="all">All Sectors ({distinctAreas.length})</option>
                  {distinctAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={selectedWeightType}
                onChange={(e) => setSelectedWeightType(e.target.value as WeightTier)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 font-semibold"
              >
                <option value="all">All Weight Tiers</option>
                <option value="light">Light (&lt;10 kg)</option>
                <option value="medium">Medium (10–25 kg)</option>
                <option value="heavy">Heavy (&gt;25 kg)</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredJobs.map((job) => {
              const estimate = getCalculatedPayoutEstimate(job);
              const isUrgent = (job.urgency || deriveUrgency(job.slot)) === 'urgent';

              return (
                <div
                  key={job.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {job.id}
                      </span>
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
                          <Zap className="h-3 w-3" />
                          Priority Urgent
                        </span>
                      ) : (
                        <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {job.slot}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                      {job.userName}
                    </h4>

                    <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{job.address}</span>
                    </div>

                    {job.landmark && (
                      <div className="mt-0.5 text-[11px] text-slate-400 pl-5">
                        Landmark: {job.landmark}
                      </div>
                    )}

                    {/* Material breakdown pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.materials.map((m, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-50 border border-slate-200/80 px-2 py-1 text-[11px] font-medium text-slate-700"
                        >
                          {m.label} ({m.kg} kg)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Estimated Payout & Accept button */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        Est. Payout
                      </div>
                      <div className="text-lg font-extrabold text-emerald-700">
                        {estimate.payoutRangeLabel}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAcceptJob(job)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span>Accept Route Job</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No matching open jobs in queue. Check other filters or wait for residents to book scrap.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE JOB & ITEMIZED SCALE WEIGHT CALCULATOR */}
      {tab === 'active' && (
        <div>
          {activeJob ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Job Info & Arrival Step */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      JOB #{activeJob.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                        activeJob.status === 'arrived'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {activeJob.status === 'arrived' ? 'At Doorstep' : 'En Route'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeJob.userName}
                    </h3>
                    <a
                      href={`tel:${activeJob.userPhone}`}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{activeJob.userPhone}</span>
                    </a>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1 border border-slate-200">
                    <div className="font-bold text-slate-800">{activeJob.address}</div>
                    {activeJob.landmark && (
                      <div className="text-slate-500">Landmark: {activeJob.landmark}</div>
                    )}
                    {activeJob.notes && (
                      <div className="text-amber-800 font-medium">Note: {activeJob.notes}</div>
                    )}
                  </div>

                  {/* Arrival Toggle */}
                  {activeJob.status === 'accepted' ? (
                    <button
                      type="button"
                      onClick={handleMarkArrived}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-black text-slate-950 shadow-md hover:bg-amber-400"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>I HAVE ARRIVED AT DOORSTEP</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span>Doorstep arrival confirmed. Weighing materials now.</span>
                    </div>
                  )}

                  {/* Resident Security PIN */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        {t.residentOtp}
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        (Ask Resident)
                      </span>
                    </div>
                    <input
                      id="collector-pin-input"
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 7412"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center font-mono text-xl font-bold text-slate-900 tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    {/* Visual PIN match indicator */}
                    {enteredOtp.length === 4 && enteredOtp === activeJob.verificationOtp ? (
                      <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 py-1 px-2 rounded-md">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>✓ PIN Verified with Resident App</span>
                      </div>
                    ) : enteredOtp.length === 4 ? (
                      <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 py-1 px-2 rounded-md">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        <span>Code mismatch. Check resident screen.</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-center text-[10px] text-slate-400">
                        Ask citizen for 4-digit handover PIN shown on their screen
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: ITEMIZED SCALE WEIGHT CALCULATOR */}
              <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      <Scale className="h-4 w-4" />
                      <span>Verified Physical Weighing</span>
                    </div>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                      {t.scaleTitle}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.scaleSubtitle}
                    </p>
                  </div>

                  {/* Text-To-Speech audio button on Scale Calculator */}
                  <button
                    id="listen-scale-calculator-btn"
                    type="button"
                    onClick={handleSpeakScaleReadout}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold shadow-2xs transition-all shrink-0 ${
                      isSpeakingScale
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    }`}
                    title="Listen to weighing summary aloud"
                  >
                    {isSpeakingScale ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-emerald-700" />
                    )}
                    <span>{isSpeakingScale ? t.stopAudio : t.listenScale}</span>
                  </button>
                </div>

                {/* Material rows */}
                <div className="space-y-3">
                  {itemizedRows.map((row, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50"
                      >
                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="font-bold text-sm text-slate-900">
                            {row.label}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Rate: <span className="font-bold text-emerald-700">{formatINR(row.rate)}/kg</span>
                          </div>
                        </div>

                        {/* Weight Input Field with +/- Quick Touch Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleItemizedWeightChange(idx, row.kg - 0.5)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
                            title="Decrease 0.5 kg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={row.kg}
                              onChange={(e) =>
                                handleItemizedWeightChange(idx, parseFloat(e.target.value) || 0)
                              }
                              className="h-10 w-24 rounded-lg border border-slate-300 bg-white text-center font-mono text-base font-extrabold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <span className="absolute right-2 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                              kg
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleItemizedWeightChange(idx, row.kg + 0.5)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
                            title="Increase 0.5 kg"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Subtotal Display */}
                        <div className="w-28 text-right font-mono font-extrabold text-slate-900 text-base">
                          {formatINR(row.subtotal)}
                        </div>

                        {/* Remove line if extra */}
                        {itemizedRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterialRow(idx)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove row"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Additional Material Option */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Add another scrap item:
                  </span>
                  {(
                    [
                      'pcb',
                      'cables',
                      'batteries',
                      'lcd',
                      'crt',
                      'motors',
                      'mixed_plastics',
                      'iron',
                      'cardboard',
                      'newspaper',
                    ] as MaterialKey[]
                  )
                    .filter((k) => !itemizedRows.some((r) => r.key === k))
                    .slice(0, 4)
                    .map((k) => {
                      const mat = materialCatalog.find((m) => m.key === k);
                      if (!mat) return null;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => handleAddMaterialToScale(k)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="h-3 w-3" />
                          <span>{mat.short}</span>
                        </button>
                      );
                    })}
                </div>

                {/* Bottom Total Calculated Payout Banner */}
                <div className="rounded-xl border border-slate-900 bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase tracking-wider">
                    <span>Total Measured Weight: {totalScaleKg} kg</span>
                    <span>Doorstep Cash Balance</span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold">
                        {t.totalCalculatedPayout}
                      </div>
                      <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                        {formatINR(totalScalePayout)}
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-300">
                      {itemizedRows.length} item types weighed
                    </div>
                  </div>

                  <button
                    id="confirm-scale-cash-btn"
                    type="button"
                    onClick={handleConfirmScaleAndCash}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-base font-black text-slate-950 shadow-md hover:bg-emerald-400 active:scale-[0.99] transition-all"
                  >
                    <Banknote className="h-5 w-5" />
                    <span>
                      {language === 'hi'
                        ? `वजन की पुष्टि करें व नकद सौंपें (${formatINR(totalScalePayout)})`
                        : language === 'mr'
                        ? `वजन निश्चित करा व रोख द्या (${formatINR(totalScalePayout)})`
                        : `CONFIRM SCALE WEIGHT & HAND CASH (${formatINR(totalScalePayout)})`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              <Scale className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-bold text-base text-slate-900">
                No Active Pickup Selected
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Accept a pickup job from the Available Pickups queue to initiate the itemized scale weight calculator.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('queue')}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Go to Pickup Queue
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIGITAL LOT CREATION */}
      {tab === 'lots' && (
        <DigitalLotCreator
          authUser={authUser}
          language={language}
          lots={digitalLots}
          onSaveLots={handleSaveLots}
          onMatchRecycler={(lot) => {
            onSelectTab('recyclers');
          }}
        />
      )}

      {/* TAB 4: DAILY PRICE BOARD */}
      {tab === 'prices' && <PriceBoard language={language} />}

      {/* TAB 5: AUTHORIZED RECYCLERS */}
      {tab === 'recyclers' && (
        <RecyclerDirectory
          language={language}
          onInitiateHandoverWithRecycler={(recycler) => {
            onSelectTab('handover');
          }}
        />
      )}

      {/* TAB 6: DIGITAL HANDOVER RECORD & EARNINGS LEDGER */}
      {tab === 'handover' && (
        <HandoverLedger
          language={language}
          handovers={handovers}
          onSaveHandovers={handleSaveHandovers}
        />
      )}

      {/* TAB 7: SAFETY GUIDANCE */}
      {tab === 'safety' && <SafetyModule language={language} />}
    </div>
  );
};
