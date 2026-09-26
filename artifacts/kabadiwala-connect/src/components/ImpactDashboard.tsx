import React, { useState, useMemo, useEffect } from 'react';
import {
  Recycle,
  Leaf,
  CircleDollarSign,
  Building2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  ArrowLeft,
  Truck,
  Search,
  ChevronRight,
  Package,
  Layers,
  FileSpreadsheet,
  Award,
  CalendarDays,
  MapPin,
  ExternalLink,
  Info,
  X,
  Printer,
} from 'lucide-react';
import { Pickup, HandoverRecord, Language, AppView } from '../types';
import {
  materialCatalog,
  formatINR,
  formatTimestamp,
  formatDateShort,
  readPickupsFromStorage,
  readHandoversFromStorage,
  saveHandoversToStorage,
  UPDATE_EVENT_PICKUPS,
} from '../data/mockData';
import { getTranslation } from '../lib/i18n';
import {
  RecyclingWarehouseIllustration,
  CardboardBoxIcon,
  PlasticBottleIcon,
  EwastePhoneIcon,
  MetalBeamIcon,
  GlassBottleIcon,
} from './Illustrations';

interface ImpactDashboardProps {
  pickups: Pickup[];
  onBack?: () => void;
  language: Language;
  onNavigateView?: (view: AppView) => void;
  tab?: 'overview' | 'traceability' | 'handovers' | 'audit';
  onSelectTab?: (tab: 'overview' | 'traceability' | 'handovers' | 'audit') => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  pickups: initialPickups,
  onBack,
  language,
  onNavigateView,
  tab: tabProp,
  onSelectTab,
}) => {
  const t = getTranslation(language);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);

  // Active Sub-tab in Portal 3 (synchronized with parent if provided)
  const [internalTab, setInternalTab] = useState<
    'overview' | 'traceability' | 'handovers' | 'audit'
  >('overview');

  const activeTab = tabProp || internalTab;
  const setActiveTab = (newTab: 'overview' | 'traceability' | 'handovers' | 'audit') => {
    setInternalTab(newTab);
    onSelectTab?.(newTab);
  };

  // Search & Filters in Traceability Logs
  const [traceSearch, setTraceSearch] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');

  // Certificate Modal State
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<any | null>(null);

  // Dynamic state from storage
  const [pickups, setPickups] = useState<Pickup[]>(() => {
    const fromStorage = readPickupsFromStorage();
    return fromStorage && fromStorage.length > 0 ? fromStorage : initialPickups;
  });

  const [handovers, setHandovers] = useState<HandoverRecord[]>(() => {
    return readHandoversFromStorage();
  });

  // Cross-tab sync
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

  // 1. COMPLETED PICKUPS CALCULATION
  const completedPickups = useMemo(() => {
    return pickups.filter((p) => p.status === 'completed');
  }, [pickups]);

  // 2. DYNAMIC ESG METRICS:
  // Metric 1: Total Landfill Waste Diverted (kg)
  const baselineKg = 342;
  const dynamicallyCollectedKg = completedPickups.reduce(
    (acc, p) => acc + (p.finalKg || p.estimatedKg || 0),
    0
  );
  const totalWeightDivertedKg = Math.round((baselineKg + dynamicallyCollectedKg) * 10) / 10;
  const totalCo2SavedTons = Math.round(((totalWeightDivertedKg * 1.82) / 1000) * 10) / 10;

  // Metric 2: Source Segregation Compliance Rate %
  const segregatedCount = completedPickups.filter((p) => p.isSegregated !== false).length;
  const segregationComplianceRate =
    completedPickups.length > 0
      ? Math.round(((42 + segregatedCount) / (48 + completedPickups.length)) * 100)
      : 89;

  // Metric 3: Total Formalized Payouts to Collectors (₹)
  const baselinePayout = 3680;
  const dynamicPayout = completedPickups.reduce((acc, p) => acc + (p.payout || 0), 0);
  const totalFormalizedPayout = baselinePayout + dynamicPayout;

  // Metric 4: Bulk Handover Logs to Authorized Yards
  const totalBulkHandovers = 12 + handovers.length;

  // Available scrap batches to accept into formal lines
  const [availableBatches, setAvailableBatches] = useState([
    {
      id: 'req-01',
      title: 'Paper & Cardboard (Baled)',
      titleHi: 'कागज व गत्ता (बेल बंडल)',
      titleBn: 'কাগজ ও পিচবোর্ড (বেল্ড বান্ডিল)',
      weight: '180 kg',
      rate: '₹14/kg',
      icon: CardboardBoxIcon,
      area: 'Kasba Secondary Aggregation Hub',
      areaHi: 'कसबा द्वितीयक संग्रहण केंद्र',
      areaBn: 'কসবা মাধ্যমিক সংগ্রহ হাব',
      collector: 'Raju Das (Trike #4192)',
      status: 'pending',
    },
    {
      id: 'req-02',
      title: 'Plastic (PET & Flakes)',
      titleHi: 'प्लास्टिक (पीईटी बोतलें व फ्लेक्स)',
      titleBn: 'প্লাস্টিক (পিইটি বোতল ও ফ্লেক্স)',
      weight: '95 kg',
      rate: '₹18/kg',
      icon: PlasticBottleIcon,
      area: 'Ballygunge Ward 69 Depot',
      areaHi: 'बालीगंज वार्ड 69 डिपो',
      areaBn: 'বালিগঞ্জ ওয়ার্ড ৬৯ ডিপো',
      collector: 'Suman Mondal (Partner #108)',
      status: 'pending',
    },
    {
      id: 'req-03',
      title: 'E-Waste (PCBs & Lithium Batteries)',
      titleHi: 'ई-कचरा (सर्किट बोर्ड व बैटरियां)',
      titleBn: 'ই-বর্জ্য (সার্কিট বোর্ড ও ব্যাটারি)',
      weight: '42 kg',
      rate: '₹285/kg',
      icon: EwastePhoneIcon,
      area: 'Salt Lake Sector V Depot',
      areaHi: 'साल्ट लेक सेक्टर 5 डिपो',
      areaBn: 'সল্টলেক সেক্টর ৫ ডিপো',
      collector: 'Amit Ghosh (Trike #302)',
      status: 'pending',
    },
    {
      id: 'req-04',
      title: 'Scrap Metal (Iron & Copper Cable)',
      titleHi: 'धातु स्क्रैप (लोहा व तांबे की केबल)',
      titleBn: 'ধাতব স্ক্র্যাপ (লোহা ও তামার তার)',
      weight: '210 kg',
      rate: '₹28/kg',
      icon: MetalBeamIcon,
      area: 'Gariahat Industrial Axis',
      areaHi: 'गड़ियाहाट इंडस्ट्रियल एक्सिस',
      areaBn: 'গড়িয়াহাট ইন্ডাস্ট্রিয়াল অক্ষ',
      collector: 'Bikash Roy (Trike #512)',
      status: 'pending',
    },
  ]);

  const handleAcceptBatch = (batchId: string, title: string) => {
    setAvailableBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'accepted' } : b))
    );
    setAcceptedNotice(`Batch "${title}" accepted into formal smelting & recycling facility.`);
    setTimeout(() => {
      setAcceptedNotice(null);
    }, 4000);
  };

  // 1-Click CPCB Form IV EPR Audit CSV Export
  const handleExportCSV = () => {
    const csvHeader =
      'EPR Lot ID,Timestamp,Source Citizen/Depot,Field Collector Partner,Recycler Facility,Material Categories,Verified Weight (kg),Payout (INR),Compliance Status\n';
    const csvRows = [
      ...completedPickups.map((p) => {
        const matList = p.materials.map((m) => m.label).join('; ');
        return `"${p.id}","${p.createdAt}","${p.address.replace(/"/g, '""')}","${
          p.collectorName || 'Raju Das'
        }","EcoRecycle CleanTech Hub (CPCB-EPR-4491)","${matList}",${
          p.finalKg || p.estimatedKg
        },${p.payout},"CPCB Form IV Certified"`;
      }),
      ...handovers.map((h) => {
        const matList = h.materials.map((m) => m.label).join('; ');
        return `"${h.referenceCode}","${h.timestamp}","${h.facilityLocation}","${
          h.collectorName
        }","${h.recyclerName}","${matList}",${h.totalKg},${h.totalPayout},"Weighbridge Logged"`;
      }),
    ].join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvHeader + csvRows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `CPCB_EPR_Compliance_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Traceability logs dataset
  const traceabilityRecords = useMemo(() => {
    const records = [
      ...completedPickups.map((p) => ({
        id: p.id,
        lotId: `LOT-${p.id}`,
        timestamp: p.completedAt || p.createdAt,
        source: p.address,
        area: p.area || 'Ballygunge',
        collector: p.collectorName || 'Raju Das (Trike Partner)',
        collectorPhone: p.collectorPhone || '+91 98310 44829',
        recycler: 'EcoRecycle CleanTech Hub (WBPCB-4491)',
        materials: p.materials,
        weight: p.finalKg || p.estimatedKg || 12,
        payout: p.payout,
        isSegregated: p.isSegregated !== false,
        status: 'CPCB Certified',
        chainOfCustody: 'Citizen -> Verified Collector -> Recycler Yard',
      })),
      ...handovers.map((h) => ({
        id: h.id,
        lotId: h.referenceCode,
        timestamp: h.timestamp,
        source: h.facilityLocation,
        area: 'Kasba Secondary Hub',
        collector: h.collectorName,
        collectorPhone: '+91 98300 12345',
        recycler: h.recyclerName,
        materials: h.materials,
        weight: h.totalKg,
        payout: h.totalPayout,
        isSegregated: true,
        status: 'Weighbridge Logged',
        chainOfCustody: 'Collector Trike -> Bulk Aggregation Yard',
      })),
    ];

    return records.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [completedPickups, handovers]);

  // Filtered traceability records
  const filteredTraceability = useMemo(() => {
    return traceabilityRecords.filter((rec) => {
      const matchesSearch =
        rec.lotId.toLowerCase().includes(traceSearch.toLowerCase()) ||
        rec.source.toLowerCase().includes(traceSearch.toLowerCase()) ||
        rec.collector.toLowerCase().includes(traceSearch.toLowerCase()) ||
        rec.recycler.toLowerCase().includes(traceSearch.toLowerCase());

      const matchesMaterial =
        filterMaterial === 'all' ||
        rec.materials.some((m) =>
          m.label.toLowerCase().includes(filterMaterial.toLowerCase())
        );

      return matchesSearch && matchesMaterial;
    });
  }, [traceabilityRecords, traceSearch, filterMaterial]);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-150">
      {/* Institutional Header Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-800 border border-purple-200">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              <span>{language === 'hi' ? 'सीपीसीबी व राज्य प्रदूषण नियंत्रण बोर्ड ईपीआर डेस्क' : language === 'bn' ? 'সিপিসিবি ও রাজ্য দূষণ নিয়ন্ত্রণ বোর্ড ইপিআর ইনস্টিটিউশনাল ডেস্ক' : 'CPCB & State PCB EPR Institutional Desk'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
              {language === 'hi' ? 'अधिकृत रीसाइक्लर व नगरपालिका ईएसजी डैशबोर्ड' : language === 'bn' ? 'অনুমোদিত রিসাইক্লার ও পৌর ইএসজি ড্যাশবোর্ড' : 'Authorized Recycler & Municipal ESG Dashboard'}
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
              {language === 'hi'
                ? 'शहरी ठोस कचरे की एंड-टू-एंड ट्रैसेबिलिटी। स्रोत पर कचरा पृथक्करण, प्रमाणित इलेक्ट्रॉनिक धर्मकांटा रसीदें और अनौपचारिक कबाड़ियों को सीधे भुगतान।'
                : language === 'bn'
                ? 'পৌর কঠিন বর্জ্যের সম্পূর্ণ ট্রেসেবিলিটি। উৎসে বর্জ্য বাছাই, যাচাইকৃত ওয়েব্রিজ রসিদ ও সংগ্রাহকদের সরাসরি অর্থপ্রদান নজরদারি।'
                : 'End-to-end municipal solid waste traceability. Monitoring source segregation compliance, verified electronic weighbridge receipts, and direct cash disbursements to informal collectors under E-Waste Rules 2022.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>
                {downloadSuccess
                  ? (language === 'hi' ? 'फॉर्म IV ऑडिट डाउनलोड हुआ!' : language === 'bn' ? 'ফর্ম ৪ অডিট ডাউনলোড সম্পন্ন!' : 'CPCB Audit Exported!')
                  : (language === 'hi' ? 'फॉर्म IV रिपोर्ट एक्सपोर्ट करें (CSV)' : language === 'bn' ? 'ফর্ম ৪ রিপোর্ট এক্সপোর্ট করুন (CSV)' : 'Export Form IV (CSV)')}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Core Dynamic ESG Metrics */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Total Landfill Waste Diverted */}
          <button
            type="button"
            id="metric-card-landfill-diverted"
            onClick={() => setActiveTab('traceability')}
            className="group rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/80 shadow-2xs text-left hover:bg-emerald-100/70 hover:border-emerald-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            title="Click to view traceability logs"
          >
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                {language === 'hi' ? 'लैंडफिल से बचाया' : language === 'bn' ? 'ল্যান্ডফিল থেকে সংরক্ষিত' : 'Landfill Diverted'}
              </span>
              <Recycle className="h-4 w-4 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">
              {totalWeightDivertedKg.toLocaleString('en-IN')}{' '}
              <span className="text-sm font-bold text-emerald-700">{t.kgUnit}</span>
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>~ {totalCo2SavedTons} {language === 'hi' ? 'टन CO₂ बचत' : language === 'bn' ? 'টন CO₂ হ্রাস' : 'tons CO₂ offset'}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-800" />
            </div>
          </button>

          {/* Metric 2: Source Segregation Compliance Rate */}
          <button
            type="button"
            id="metric-card-source-segregation"
            onClick={() => {
              setActiveTab('traceability');
              setFilterMaterial('all');
            }}
            className="group rounded-2xl bg-sky-50/70 p-4 border border-sky-200/80 shadow-2xs text-left hover:bg-sky-100/70 hover:border-sky-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            title="Click to view segregation audit records"
          >
            <div className="flex items-center justify-between text-sky-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900">
                {language === 'hi' ? 'स्रोत पर पृथक्करण' : language === 'bn' ? 'উৎসে বর্জ্য বাছাই' : 'Source Segregation'}
              </span>
              <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-sky-900 tracking-tight">
              {segregationComplianceRate}%
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-sky-700">
              <span>{segregatedCount} {language === 'hi' ? 'सत्यापित अलग किए लॉट' : language === 'bn' ? 'বাছাইকৃত দোরগোড়ার লট' : 'segregated doorstep lots'}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sky-800" />
            </div>
          </button>

          {/* Metric 3: Total Formalized Payouts to Collectors */}
          <button
            type="button"
            id="metric-card-formalized-payouts"
            onClick={() => setActiveTab('handovers')}
            className="group rounded-2xl bg-purple-50/70 p-4 border border-purple-200/80 shadow-2xs text-left hover:bg-purple-100/70 hover:border-purple-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            title="Click to view verified recycler yard payouts"
          >
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                {language === 'hi' ? 'प्रमाणित नकद भुगतान' : language === 'bn' ? 'আনুষ্ঠানিক মূল্য পরিশোধ' : 'Formalized Payouts'}
              </span>
              <CircleDollarSign className="h-4 w-4 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-purple-900 tracking-tight">
              {formatINR(totalFormalizedPayout)}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-purple-700">
              <span>{language === 'hi' ? 'कबाड़ियों को सीधा नकद व यूपीआई' : language === 'bn' ? 'সংগ্রাহকদের সরাসরি নগদ ও ইউপিআই' : 'Direct cash & UPI to collectors'}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-800" />
            </div>
          </button>

          {/* Metric 4: Bulk Handover Logs to Authorized Yards */}
          <button
            type="button"
            id="metric-card-yard-handovers"
            onClick={() => setActiveTab('handovers')}
            className="group rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80 shadow-2xs text-left hover:bg-amber-100/70 hover:border-amber-300 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            title="Click to inspect authorized yard custody logs"
          >
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                {language === 'hi' ? 'रीसाइक्लिंग यार्ड हैंडओवर' : language === 'bn' ? 'ইয়ার্ডে বর্জ্য হস্তান্তর' : 'Yard Handovers'}
              </span>
              <Building2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-900 tracking-tight">
              {totalBulkHandovers}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-amber-800">
              <span>{language === 'hi' ? 'अधिकृत कस्टडी रसीदें' : language === 'bn' ? 'অনুমোদিত স্থানান্তর রসিদ' : 'Formal custody transfer logs'}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-900" />
            </div>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs within Portal 3 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {language === 'hi' ? 'सप्लाई चेन व थोक स्क्रैप लॉट' : language === 'bn' ? 'সাপ্লাই চেইন ও পাইকারি লট' : 'Supply Chain & Bulk Batches'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('traceability')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            activeTab === 'traceability'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {language === 'hi' ? 'ट्रैसेबिलिटी व कस्टडी लॉग्स' : language === 'bn' ? 'ট্রেসেবিলিটি ও কাস্টডি খতিয়ান' : 'Traceability & Custody Logs'} ({traceabilityRecords.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('handovers')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            activeTab === 'handovers'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {language === 'hi' ? 'अधिकृत रीसाइक्लिंग यार्ड्स (4)' : language === 'bn' ? 'অনুমোদিত রিসাইক্লিং ইয়ার্ড (৪)' : 'Authorized Recycler Yards (4)'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs font-bold transition-all shrink-0 active:scale-95 touch-manipulation ${
            activeTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {language === 'hi' ? 'सीपीसीबी फॉर्म IV ऑडिट डेस्क' : language === 'bn' ? 'সিপিসিবি ফর্ম ৪ অডিট ডেস্ক' : 'CPCB Form IV Audit Desk'}
        </button>
      </div>

      {/* TAB 1: SUPPLY CHAIN & INCOMING BULK BATCHES */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Supply Chain Graphic Banner */}
          <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Institutional Circular Supply Chain
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-lg">
                Direct aggregation from informal collectors to authorized recyclers prevents toxic open-air burning and ensures 100% material recovery.
              </p>
            </div>

            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-2xl bg-emerald-50/50 border border-emerald-100/70 p-2">
                <RecyclingWarehouseIllustration className="w-full h-auto max-h-48 object-contain" />
              </div>
            </div>
          </div>

          {/* Action Alert if Batch Accepted */}
          {acceptedNotice && (
            <div className="rounded-2xl bg-emerald-600 p-3.5 text-xs font-bold text-white shadow-md flex items-center justify-between animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{acceptedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAcceptedNotice(null)}
                className="text-white/80 hover:text-white text-base leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* Incoming Bulk Scrap Batches */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  {language === 'hi' ? 'प्रसंस्करण हेतु आवक थोक स्क्रैप लॉट' : language === 'bn' ? 'প্রক্রিয়াকরণের জন্য আগত পাইকারি স্ক্র্যাপ লট' : 'Incoming Bulk Scrap Batches for Processing'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'hi' ? 'द्वितीयक संकलन केंद्रों पर प्रमाणित धर्मकांटा से तौला गया।' : language === 'bn' ? 'মাধ্যমিক সংগ্রহ পয়েন্টে প্রত্যয়িত প্ল্যাটফর্ম স্কেলে ওজন করা।' : 'Weighed on certified platform scale at secondary aggregation points.'}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                {availableBatches.filter((b) => b.status === 'pending').length} {language === 'hi' ? 'लॉट तैयार' : language === 'bn' ? 'লট প্রস্তুত' : 'Batches Ready'}
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {availableBatches.map((batch) => {
                const Icon = batch.icon;
                const isAccepted = batch.status === 'accepted';
                const title = language === 'hi' ? batch.titleHi : language === 'bn' ? batch.titleBn : batch.title;
                const area = language === 'hi' ? (batch.areaHi || batch.area) : language === 'bn' ? (batch.areaBn || batch.area) : batch.area;
                const weight = batch.weight.replace('kg', t.kgUnit);
                const rate = batch.rate.replace('/kg', `/${t.kgUnit}`).replace('₹', '₹ ');

                return (
                  <div
                    key={batch.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/70 gap-3 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-2xs border border-slate-200/60">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{title}</p>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                            {weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {area} · {language === 'hi' ? 'दर्जकर्ता' : language === 'bn' ? 'নথিভুক্তকারী' : 'Logged by'} {batch.collector}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <span className="text-xs font-extrabold text-slate-700 mr-1">
                        {rate}
                      </span>
                      {isAccepted ? (
                        <span className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{language === 'hi' ? 'स्वीकृत' : language === 'bn' ? 'গৃহীত' : 'Accepted'}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAcceptBatch(batch.id, title)}
                          className="min-h-[44px] flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
                        >
                          <span>{language === 'hi' ? 'लॉट स्वीकार करें' : language === 'bn' ? 'লট গ্রহণ করুন' : 'Accept Batch'}</span>
                          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACEABILITY & CHAIN OF CUSTODY LOGS TABLE */}
      {activeTab === 'traceability' && (
        <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {language === 'hi' ? 'ट्रैसेबिलिटी व कस्टडी ऑडिट बहीखाता' : language === 'bn' ? 'ট্রেসেবিলিটি ও কাস্টডি অডিট খতিয়ান' : 'Traceability & Chain of Custody Audit Ledger'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'लॉट आईडी, डिजिटल कांटा वजन और रीसाइक्लर हैंडओवर प्रमाण के साथ सत्यापित लेनदेन।' : language === 'bn' ? 'লট আইডি, ডিজিটাল স্কেল ওজন ও রিসাইক্লিং হস্তান্তর প্রমাণসহ যাচাইযোগ্য লেনদেন।' : 'Verifiable transactions with lot IDs, digital scale weights, and collector-to-recycler handover proofs.'}
              </p>
            </div>

            {/* Material Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="all">{language === 'hi' ? 'सभी सामग्रियां' : language === 'bn' ? 'সকল সামগ্রী' : 'All Materials'}</option>
                <option value="Cardboard">{language === 'hi' ? 'कागज व गत्ता (रद्दी)' : language === 'bn' ? 'কাগজ ও পিচবোর্ড (রদ্দি)' : 'Cardboard & Paper'}</option>
                <option value="Plastic">{language === 'hi' ? 'प्लास्टिक की बोतलें' : language === 'bn' ? 'প্লাস্টিক বোতল' : 'Plastic (PET)'}</option>
                <option value="Metal">{language === 'hi' ? 'लोहा व तांबा स्क्रैप' : language === 'bn' ? 'লোহা ও তামা স্ক্র্যাপ' : 'Scrap Metal'}</option>
                <option value="Glass">{language === 'hi' ? 'कांच व शीशियां' : language === 'bn' ? 'কাঁচের বোতল' : 'Glass'}</option>
                <option value="PCB">{language === 'hi' ? 'ई-कचरा व सर्किट बोर्ड' : language === 'bn' ? 'ই-বর্জ্য ও সার্কিট বোর্ড' : 'E-Waste / PCBs'}</option>
                <option value="Battery">{language === 'hi' ? 'बैटरियां' : language === 'bn' ? 'ব্যাটারি' : 'Batteries'}</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-2.5 border border-slate-200">
            <Search className="h-4 w-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={traceSearch}
              onChange={(e) => setTraceSearch(e.target.value)}
              placeholder={language === 'hi' ? 'लॉट आईडी, कबाड़ी साथी, पते या रीसाइक्लर से खोजें...' : language === 'bn' ? 'লট আইডি, সংগ্রাহক পার্টনার, ঠিকানা বা রিসাইকলার দিয়ে খুঁজুন...' : 'Search by Lot ID, collector, resident address, or recycler...'}
              className="w-full text-xs text-slate-800 bg-transparent focus:outline-none"
            />
          </div>

          {/* Traceability Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">{language === 'hi' ? 'लॉट आईडी व दिनांक' : language === 'bn' ? 'লট আইডি ও তারিখ' : 'Lot ID & Date'}</th>
                  <th className="p-3">{language === 'hi' ? 'स्रोत व कबाड़ी साथी' : language === 'bn' ? 'উৎস ও সংগ্রাহক' : 'Source & Collector'}</th>
                  <th className="p-3">{language === 'hi' ? 'रीसाइक्लिंग यार्ड' : language === 'bn' ? 'রিসাইক্লিং ইয়ার্ড' : 'Recycler Yard'}</th>
                  <th className="p-3">{language === 'hi' ? 'सामग्री प्रकार' : language === 'bn' ? 'সামগ্রী বিভাগ' : 'Material Fractions'}</th>
                  <th className="p-3">{t.weight} ({t.kgUnit})</th>
                  <th className="p-3">{language === 'hi' ? 'भुगतान राशि' : language === 'bn' ? 'পরিশোধিত মূল্য' : 'Payout'}</th>
                  <th className="p-3">{language === 'hi' ? 'स्थिति' : language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  <th className="p-3 text-right">{language === 'hi' ? 'ऑडिट' : language === 'bn' ? 'অডিট' : 'Audit'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTraceability.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      {language === 'hi' ? 'कोई रिकॉर्ड नहीं मिला।' : language === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No matching traceability records found.'}
                    </td>
                  </tr>
                ) : (
                  filteredTraceability.map((rec) => (
                    <tr key={rec.id} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900">{rec.lotId}</span>
                        <p className="text-[10px] text-slate-400">
                          {formatDateShort(rec.timestamp)}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 truncate max-w-[160px]">
                          {rec.source}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {language === 'hi' ? 'पार्टनर' : language === 'bn' ? 'পার্টনার' : 'Partner'}: {rec.collector}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800 truncate max-w-[160px]">
                          {rec.recycler}
                        </p>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-slate-600">
                          {rec.materials.map((m) => m.label).join(', ') || 'Dry Scrap'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800">
                        {rec.weight} {t.kgUnit}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {formatINR(rec.payout)}
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAuditRecord(rec)}
                          className="rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 text-[11px] font-bold transition-colors"
                        >
                          {language === 'hi' ? 'प्रमाणपत्र' : language === 'bn' ? 'সনদপত্র' : 'Certificate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUTHORIZED RECYCLER YARDS */}
      {activeTab === 'handovers' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Authorized Recycler Yard Network (CPCB Registered)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Certified facilities equipped with calibrated weighbridges, zero-emission smelting lines, and hazardous material scrubbers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Kasba Secondary Aggregation Point
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Plot 14, Kasba Industrial Estate Phase II, Kolkata - 700107
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                  <span>EPR ID: CPCB-WB-2022-814</span>
                  <span className="font-bold text-slate-800">Capacity: 45 MT / mo</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    EcoRecycle CleanTech Hub
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Sector V Electronics Zone, Salt Lake, Kolkata - 700091
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                  <span>EPR ID: WBPCB-EPR-4491</span>
                  <span className="font-bold text-slate-800">Capacity: 80 MT / mo</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Howrah Metal & Scrap Refining Plant
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Jalan Industrial Complex, NH 6, Howrah - 711411
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                  <span>EPR ID: CPCB-HW-2023-110</span>
                  <span className="font-bold text-slate-800">Capacity: 120 MT / mo</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Kolkata Municipal Corp Central Composting Yard
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Dhapa Organic Solid Waste Plant, EM Bypass, Kolkata
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                  <span>EPR ID: KMC-SW-2021-004</span>
                  <span className="font-bold text-slate-800">Capacity: 200 MT / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CPCB FORM IV EPR REGULATORY AUDIT DESK */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                CPCB Form IV Annual Regulatory Compliance Audit
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Under E-Waste (Management) Rules 2022 & Municipal Solid Waste Rules 2016.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Download Form IV Data (.csv)</span>
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-bold text-slate-500">Authorized Agency / Operator:</p>
                <p className="font-bold text-slate-900">
                  Kabadiwala Connect Municipal Solid Waste Consortium
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-500">CPCB Portal Registration #:</p>
                <p className="font-mono font-bold text-emerald-800">
                  CPCB-EPR-2022-WB-88192-A
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-500">Jurisdiction & Municipal Zone:</p>
                <p className="font-bold text-slate-900">
                  Kolkata Municipal Corporation (Wards 1–144)
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-500">Audit Period:</p>
                <p className="font-bold text-slate-900">FY 2025–2026 (Live Electronic Ledger)</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero Open Burning • 100% Digital Weighbridge Authenticated</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Generated from verified local storage audit trails
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIABLE AUDIT CERTIFICATE MODAL */}
      {selectedAuditRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {language === 'hi' ? 'आधिकारिक प्रमाणपत्र' : language === 'bn' ? 'অফিসিয়াল সার্টিফিকেট' : 'Official Certificate'}
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'hi' ? 'सीपीसीबी ईपीआर कस्टडी सत्यापन रिकॉर्ड' : language === 'bn' ? 'সিপিসিবি ইপিআর কাস্টডি যাচাইকরণ রেকর্ড' : 'CPCB EPR Chain of Custody Record'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditRecord(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-2.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'ट्रांजेक्शन लॉट कोड:' : language === 'bn' ? 'লেনদেন লট কোড:' : 'Transaction Lot Code:'}</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedAuditRecord.lotId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'सत्यापन समय:' : language === 'bn' ? 'যাচাইকরণের সময়:' : 'Verification Timestamp:'}</span>
                <span className="text-slate-800">
                  {formatTimestamp(selectedAuditRecord.timestamp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'स्रोत का पता:' : language === 'bn' ? 'উৎসের ঠিকানা:' : 'Source Location:'}</span>
                <span className="text-slate-800 font-bold truncate max-w-[240px]">
                  {selectedAuditRecord.source}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'कबाड़ी साथी:' : language === 'bn' ? 'সংগ্রাহক পার্টনার:' : 'Field Collector Partner:'}</span>
                <span className="text-slate-800 font-bold">{selectedAuditRecord.collector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'अधिकृत रीसाइक्लर:' : language === 'bn' ? 'অনুমোদিত রিসাইক্লার:' : 'Authorized Recycler:'}</span>
                <span className="text-emerald-800 font-bold">{selectedAuditRecord.recycler}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'कांटे पर तौला वजन:' : language === 'bn' ? 'স্কেলে পরিমাপিত ওজন:' : 'Scale Measured Weight:'}</span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {selectedAuditRecord.weight} {t.kgUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'भुगतान की गई राशि:' : language === 'bn' ? 'পরিশোধিত মূল্য:' : 'Disbursed Payout:'}</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {formatINR(selectedAuditRecord.payout)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'स्रोत पर पृथक्करण सत्यापित:' : language === 'bn' ? 'উৎসে বর্জ্য বাছাই যাচাইকৃত:' : 'Source Segregation Verified:'}</span>
                <span className="font-bold text-emerald-700">
                  {selectedAuditRecord.isSegregated ? (language === 'hi' ? '✓ अनुपालन पूर्ण' : language === 'bn' ? '✓ নিয়মমাফিক বাছাইকৃত' : '✓ Compliant') : (language === 'hi' ? 'मिश्रित कचरा' : language === 'bn' ? 'মিশ্রিত বর্জ্য' : 'Mixed Fractions')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedAuditRecord(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Printer className="h-4 w-4" />
                <span>{language === 'hi' ? 'सर्टिफिकेट प्रिंट करें' : language === 'bn' ? 'সার্টিফিকেট প্রিন্ট করুন' : 'Print Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
