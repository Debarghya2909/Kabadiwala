import React, { useState, useMemo, useEffect } from 'react';
import {
  Recycle,
  Leaf,
  CircleDollarSign,
  ArrowDownRight,
  Database,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  ArrowLeft,
  Truck,
  Droplets,
  Radio,
  Search,
  Layers,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Pickup, HandoverRecord, Language, AppView } from '../types';
import {
  materialCatalog,
  formatINR,
  formatTimestamp,
  formatDateShort,
  readPickupsFromStorage,
  readHandoversFromStorage,
  UPDATE_EVENT_PICKUPS,
} from '../data/mockData';
import { getTranslation } from '../lib/i18n';

interface ImpactDashboardProps {
  pickups: Pickup[];
  onBack?: () => void;
  language: Language;
  onNavigateView?: (view: AppView) => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  pickups: initialPickups,
  onBack,
  language,
  onNavigateView,
}) => {
  const t = getTranslation(language);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeLedgerTab, setActiveLedgerTab] = useState<'all' | 'pickups' | 'handovers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Dynamic local storage readings
  const [pickups, setPickups] = useState<Pickup[]>(() => {
    const fromStorage = readPickupsFromStorage();
    return fromStorage && fromStorage.length > 0 ? fromStorage : initialPickups;
  });

  const [handovers, setHandovers] = useState<HandoverRecord[]>(() => {
    return readHandoversFromStorage();
  });

  // Listen to cross-tab and local state updates
  useEffect(() => {
    const syncData = () => {
      setPickups(readPickupsFromStorage());
      setHandovers(readHandoversFromStorage());
    };

    window.addEventListener('storage', syncData);
    window.addEventListener(UPDATE_EVENT_PICKUPS, syncData);

    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener(UPDATE_EVENT_PICKUPS, syncData);
    };
  }, []);

  // Aggregated Computations from completed pickups and handovers
  const completedPickups = useMemo(() => {
    return pickups.filter((p) => p.status === 'completed');
  }, [pickups]);

  // Doorstep collection stats
  const pickupKg = useMemo(() => {
    return completedPickups.reduce((acc, p) => acc + (p.finalKg || p.estimatedKg || 0), 0);
  }, [completedPickups]);

  const pickupPayout = useMemo(() => {
    return completedPickups.reduce((acc, p) => acc + (p.payout || 0), 0);
  }, [completedPickups]);

  // Recycler handover stats
  const handoverKg = useMemo(() => {
    return handovers.reduce((acc, h) => acc + (h.totalKg || 0), 0);
  }, [handovers]);

  const handoverPayout = useMemo(() => {
    return handovers.reduce((acc, h) => acc + (h.totalPayout || 0), 0);
  }, [handovers]);

  // Total Kilograms Diverted
  const totalKgDiverted = useMemo(() => {
    return pickupKg + handoverKg;
  }, [pickupKg, handoverKg]);

  // Total Formalized Payouts
  const totalEarningsFormalized = useMemo(() => {
    return pickupPayout + handoverPayout;
  }, [pickupPayout, handoverPayout]);

  // Environmental Impact metrics
  const carbonAvoidedKg = useMemo(() => {
    return (totalKgDiverted * 1.72).toFixed(1);
  }, [totalKgDiverted]);

  const paperKg = useMemo(() => {
    const fromPickups = completedPickups.reduce((acc, p) => {
      const line = p.materials?.find((m) => m.key === 'newspaper' || m.key === 'cardboard');
      return acc + (line ? line.kg : 0);
    }, 0);
    const fromHandovers = handovers.reduce((acc, h) => {
      const line = h.materials?.find((m) => m.key === 'newspaper' || m.key === 'cardboard');
      return acc + (line ? line.kg : 0);
    }, 0);
    return fromPickups + fromHandovers;
  }, [completedPickups, handovers]);

  const treesSaved = useMemo(() => {
    return (paperKg * 0.08).toFixed(1);
  }, [paperKg]);

  const landfillSpaceSavedM3 = useMemo(() => {
    return (totalKgDiverted * 0.0024).toFixed(2);
  }, [totalKgDiverted]);

  const heavyMetalsDivertedKg = useMemo(() => {
    // Diverting lead, cadmium, arsenic, mercury safely from backyard acid leaching
    return (totalKgDiverted * 0.072).toFixed(1);
  }, [totalKgDiverted]);

  const groundwaterProtectedLiters = useMemo(() => {
    return Math.round(totalKgDiverted * 780);
  }, [totalKgDiverted]);

  // Material Category Aggregations across both streams
  const categoryTotals = useMemo(() => {
    return materialCatalog.map((mat) => {
      const kgFromPickups = completedPickups.reduce((acc, p) => {
        const item = p.materials?.find((m) => m.key === mat.key);
        return acc + (item ? item.kg : 0);
      }, 0);

      const revFromPickups = completedPickups.reduce((acc, p) => {
        const item = p.materials?.find((m) => m.key === mat.key);
        return acc + (item ? item.kg * item.rate : 0);
      }, 0);

      const kgFromHandovers = handovers.reduce((acc, h) => {
        const item = h.materials?.find((m) => m.key === mat.key);
        return acc + (item ? item.kg : 0);
      }, 0);

      const revFromHandovers = handovers.reduce((acc, h) => {
        const item = h.materials?.find((m) => m.key === mat.key);
        return acc + (item ? item.kg * item.rate : 0);
      }, 0);

      const divertedKg = kgFromPickups + kgFromHandovers;
      const revenue = revFromPickups + revFromHandovers;

      return {
        ...mat,
        divertedKg,
        revenue,
      };
    });
  }, [completedPickups, handovers]);

  const maxCategoryKg = Math.max(...categoryTotals.map((c) => c.divertedKg), 1);

  // Filtered ledger rows
  const filteredPickups = useMemo(() => {
    return pickups.filter((p) => {
      if (selectedCategoryFilter !== 'all') {
        const hasMat = p.materials?.some((m) => m.key === selectedCategoryFilter);
        if (!hasMat) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = p.id.toLowerCase().includes(q);
        const matchAddr = p.address.toLowerCase().includes(q);
        const matchUser = p.userName.toLowerCase().includes(q);
        const matchCol = (p.collectorName || '').toLowerCase().includes(q);
        if (!matchId && !matchAddr && !matchUser && !matchCol) return false;
      }
      return true;
    });
  }, [pickups, selectedCategoryFilter, searchQuery]);

  const filteredHandovers = useMemo(() => {
    return handovers.filter((h) => {
      if (selectedCategoryFilter !== 'all') {
        const hasMat = h.materials?.some((m) => m.key === selectedCategoryFilter);
        if (!hasMat) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchRef = h.referenceCode.toLowerCase().includes(q);
        const matchRec = h.recyclerName.toLowerCase().includes(q);
        const matchCol = h.collectorName.toLowerCase().includes(q);
        if (!matchRef && !matchRec && !matchCol) return false;
      }
      return true;
    });
  }, [handovers, selectedCategoryFilter, searchQuery]);

  // Export comprehensive CSV
  const handleExportReport = () => {
    const csvRows = [
      [
        'Record Type',
        'Reference ID',
        'Date',
        'Entity / Location',
        'Category Summary',
        'Weight (KG)',
        'Payout (INR)',
        'Verification Status',
      ],
      ...pickups.map((p) => [
        'Doorstep Collection',
        p.id,
        p.createdAt.slice(0, 10),
        `"${p.address.replace(/"/g, '""')}"`,
        `"${p.materials.map((m) => `${m.label} (${m.kg}kg)`).join('; ')}"`,
        p.finalKg || p.estimatedKg,
        p.payout,
        p.status,
      ]),
      ...handovers.map((h) => [
        'Recycler Handover',
        h.referenceCode,
        h.timestamp.slice(0, 10),
        `"${h.recyclerName.replace(/"/g, '""')}"`,
        `"${h.materials.map((m) => `${m.label} (${m.kg}kg)`).join('; ')}"`,
        h.totalKg,
        h.totalPayout,
        'Authorized Handover (CPCB EPR Verified)',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `kabadiwala_esg_audit_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Return */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                id="back-to-portal-btn"
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.backToPortal}</span>
              </button>
            )}

            <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              <Database className="h-3.5 w-3.5 text-emerald-700" />
              <span>Municipal EPR & E-Waste Impact Dashboard</span>
            </div>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {language === 'hi'
              ? 'नगरपालिका ई-कचरा व अनौपचारिक श्रम औपचारिककरण डैशबोर्ड'
              : language === 'mr'
              ? 'महानगरपालिका ई-कचरा व असंघटित कामगार औपचारिकीकरण डॅशबोर्ड'
              : 'Citywide E-Waste Diversion & Labor Formalization'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            Real-time verified metrics under CPCB E-Waste (Management) Rules, 2022. Tracking doorstep collections, authorized recycler handovers, informal income formalization, and hazardous environmental offsets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="export-esg-report-btn"
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Audit CSV Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          <span>ESG CSV Report exported successfully to your downloads!</span>
        </div>
      )}

      {/* 4 Macro-Level Analytics Metric Cards dynamically computed from localStorage */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Kilograms Diverted */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              Total Material Diverted
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Recycle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
            {totalKgDiverted.toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {(totalKgDiverted / 1000).toFixed(2)} metric tons diverted from open dumps & acid leaching
          </p>
        </div>

        {/* Metric 2: Total Formalized Payouts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              Formalized Payouts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-700">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
            {formatINR(totalEarningsFormalized)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Directly transferred to informal field partners & collectors
          </p>
        </div>

        {/* Metric 3: Authorized Recycler Handovers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              Recycler Handovers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
            {handovers.length}{' '}
            <span className="text-sm font-normal text-slate-500">batches</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {handoverKg.toFixed(1)} kg transferred under formal CPCB EPR rules
          </p>
        </div>

        {/* Metric 4: Carbon & Environmental Impact */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              CO₂e Offset
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
            {carbonAvoidedKg}{' '}
            <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Avoided via formal sorting vs backyard open-air cable burning
          </p>
        </div>
      </div>

      {/* Environmental Metrics Highlight Banner */}
      <div className="grid gap-4 sm:grid-cols-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Groundwater Protected
            </div>
            <div className="font-mono text-base font-bold text-slate-900">
              {groundwaterProtectedLiters.toLocaleString()} Liters
            </div>
            <div className="text-[11px] text-slate-600">
              Shielded from toxic PCB acid leaching
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Toxic Heavy Metals Diverted
            </div>
            <div className="font-mono text-base font-bold text-slate-900">
              {heavyMetalsDivertedKg} kg
            </div>
            <div className="text-[11px] text-slate-600">
              Lead, cadmium & mercury safely contained
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Trees Conserved & Landfill Saved
            </div>
            <div className="font-mono text-base font-bold text-slate-900">
              {treesSaved} Trees · {landfillSpaceSavedM3} m³
            </div>
            <div className="text-[11px] text-slate-600">
              From paper, cardboard & e-waste recovery
            </div>
          </div>
        </div>
      </div>

      {/* Diversion Volume by Scrap Category + Municipal Ward Distribution */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Material Category Distribution (7 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900">
                Diversion Volume by Scrap Category
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated verified kilograms across door-to-door pickups & certified handovers.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400">KG / REVENUE</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {categoryTotals.map((cat) => {
              const pct = ((cat.divertedKg / maxCategoryKg) * 100).toFixed(0);
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-xs inline-block shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.label}</span>
                    </span>
                    <span className="font-mono font-semibold text-slate-600">
                      {cat.divertedKg.toFixed(1)} kg · {formatINR(cat.revenue)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Municipal Clusters & Readiness (5 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900">
              Active Municipal Clusters
            </h2>
            <p className="text-xs text-slate-500">
              Doorstep coverage and formal aggregator integration.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ward 80 — Central Sector</div>
                <div className="text-[11px] text-slate-500">8 Certified Partners · 98.2% on-time</div>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ward 174 — South District</div>
                <div className="text-[11px] text-slate-500">6 Certified Partners · 96.8% on-time</div>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ward 150 — East Corridor</div>
                <div className="text-[11px] text-slate-500">10 Certified Partners · 99.1% on-time</div>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ward 11 — West Industrial Hub</div>
                <div className="text-[11px] text-slate-500">5 Certified Partners · Pilot Program</div>
              </div>
              <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800">
                PILOT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Verified Audit Ledger Table (Pickups & Handovers) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-slate-900">
              Live Verified Transactions Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Real-time audit records linking door-to-door collections with registered recycling partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Tab switchers: All vs Pickups vs Handovers */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setActiveLedgerTab('all')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  activeLedgerTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Records
              </button>
              <button
                type="button"
                onClick={() => setActiveLedgerTab('pickups')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  activeLedgerTab === 'pickups'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doorstep ({pickups.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveLedgerTab('handovers')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  activeLedgerTab === 'handovers'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Recycler Handovers ({handovers.length})
              </button>
            </div>

            {/* Material Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-2xs focus:outline-none"
              >
                <option value="all">All Material Types</option>
                {materialCatalog.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Location / Facility</th>
                <th className="py-2.5 px-3">Materials Breakdown</th>
                <th className="py-2.5 px-3 text-right">Verified Weight</th>
                <th className="py-2.5 px-3 text-right">Payout</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Doorstep Pickups */}
              {(activeLedgerTab === 'all' || activeLedgerTab === 'pickups') &&
                filteredPickups.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        <Truck className="h-3 w-3 text-emerald-700" />
                        Doorstep
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatDateShort(tx.createdAt)}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs truncate">{tx.address}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {tx.materials.map((m) => `${m.label} (${m.kg}kg)`).join(', ')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {tx.finalKg || tx.estimatedKg} kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-800">
                      {formatINR(tx.payout)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          tx.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'arrived'
                            ? 'bg-amber-100 text-amber-900'
                            : tx.status === 'accepted'
                            ? 'bg-sky-100 text-sky-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}

              {/* Recycler Handovers */}
              {(activeLedgerTab === 'all' || activeLedgerTab === 'handovers') &&
                filteredHandovers.map((ho) => (
                  <tr key={ho.id} className="hover:bg-emerald-50/30">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        <Building2 className="h-3 w-3 text-emerald-700" />
                        Recycler Hub
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                      {ho.referenceCode}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatDateShort(ho.timestamp)}
                    </td>
                    <td className="py-3 px-3 text-slate-800 max-w-xs truncate font-semibold">
                      {ho.recyclerName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {ho.materials.map((m) => `${m.label} (${m.kg}kg)`).join(', ')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {ho.totalKg} kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-800">
                      {formatINR(ho.totalPayout)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
                        CPCB EPR Verified
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
