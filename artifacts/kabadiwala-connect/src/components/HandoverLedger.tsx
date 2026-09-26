import React, { useState } from 'react';
import {
  FileCheck2,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  QrCode,
  DollarSign,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { HandoverRecord, Language } from '../types';
import { formatINR, formatTimestamp, authorizedRecyclers } from '../data/mockData';
import { getTranslation } from '../lib/i18n';

interface HandoverLedgerProps {
  language: Language;
  handovers: HandoverRecord[];
  onSaveHandovers: (records: HandoverRecord[]) => void;
}

export const HandoverLedger: React.FC<HandoverLedgerProps> = ({
  language,
  handovers,
  onSaveHandovers,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'ledger'>('records');
  const [showLogModal, setShowLogModal] = useState(false);
  const t = getTranslation(language);

  // New handover form states
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(authorizedRecyclers[0].id);
  const [customKg, setCustomKg] = useState(25);
  const [customPayout, setCustomPayout] = useState(5500);
  const [paymentMode, setPaymentMode] = useState<'Cash at Hub' | 'Instant Bank Transfer / UPI'>('Cash at Hub');
  const [notes, setNotes] = useState('Clean separated PCB and insulated wiring batch.');

  // Financial statistics
  const totalCashCollected = handovers.reduce((acc, h) => acc + h.totalPayout, 0);
  const totalKgHandedOver = handovers.reduce((acc, h) => acc + h.totalKg, 0);
  const confirmedHandovers = handovers.filter((h) => h.recyclerConfirmed).length;

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    const recycler = authorizedRecyclers.find((r) => r.id === selectedRecyclerId) || authorizedRecyclers[0];

    const newRecord: HandoverRecord = {
      id: `ho-rec-${Date.now().toString(36)}`,
      referenceCode: `EPR-KOL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      collectorId: 'usr-collector-204',
      collectorName: 'Raju Das (Field Partner)',
      recyclerId: recycler.id,
      recyclerName: recycler.name,
      facilityLocation: recycler.facilityLocation,
      materials: [
        { key: 'pcb', label: 'Circuit Boards (PCBs)', kg: customKg * 0.6, rate: 295, subtotal: Math.round(customKg * 0.6 * 295) },
        { key: 'cables', label: 'Copper Cables', kg: customKg * 0.4, rate: 222, subtotal: Math.round(customKg * 0.4 * 222) },
      ],
      totalKg: customKg,
      totalPayout: customPayout,
      paymentMode,
      paymentStatus: 'paid',
      timestamp: new Date().toISOString(),
      gpsLocation: '22.5186° N, 88.3644° E (Certified Hub Terminal)',
      photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      recyclerConfirmed: true,
      notes,
    };

    onSaveHandovers([newRecord, ...handovers]);
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalCashReceived}
            </span>
            <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">
              <Banknote className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {formatINR(totalCashCollected)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {handovers.length} {language === 'hi' ? 'पूर्ण लेनदेन' : language === 'bn' ? 'সম্পন্ন লেনদেন' : 'completed transactions'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'हस्तांतरित प्रमाणित वजन' : language === 'bn' ? 'হস্তান্তরিত প্রত্যয়িত ওজন' : 'Formal Volume Handed Over'}
            </span>
            <div className="rounded-md bg-blue-50 p-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {totalKgHandedOver.toFixed(1)} {t.kgUnit}
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">
            {language === 'hi' ? '100% सुरक्षित रीसाइक्लिंग में भेजा गया' : language === 'bn' ? '১০০% নিরাপদ রিসাইক্লিংয়ে প্রেরিত' : '100% diverted from backyard dumping'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'प्रमाणित ईपीआर रसीदें' : language === 'bn' ? 'প্রত্যয়িত ইপিআর রসিদ' : 'Certified EPR Records'}
            </span>
            <div className="rounded-md bg-purple-50 p-2 text-purple-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {confirmedHandovers} {language === 'hi' ? 'रसीदें' : language === 'bn' ? 'রসিদ' : 'Receipts'}
          </div>
          <div className="mt-1 text-xs text-purple-700 font-semibold">
            {language === 'hi' ? 'सीपीसीबी नियमों के तहत ऑडिट योग्य' : language === 'bn' ? 'সিপিসিবি বিধির অধীনে অডিটযোগ্য' : 'Auditable under CPCB Rules'}
          </div>
        </div>
      </div>

      {/* Sub Tabs: Handover Receipts vs Earnings Ledger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('records')}
            className={`min-h-[44px] rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
              activeSubTab === 'records'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? 'डिजिटल हैंडओवर रसीदें' : language === 'bn' ? 'ডিজিটাল হস্তান্তর রসিদ' : 'Digital Handover Receipts'} ({handovers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ledger')}
            className={`min-h-[44px] rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 touch-manipulation ${
              activeSubTab === 'ledger'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? 'नकद व भुगतान बहीखाता' : language === 'bn' ? 'নগদ ও অর্থপ্রদান খতিয়ান' : 'Cash & Payment Ledger'}
          </button>
        </div>

        <button
          id="log-handover-btn"
          type="button"
          onClick={() => setShowLogModal(true)}
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>{language === 'hi' ? 'नया हैंडओवर दर्ज करें' : language === 'bn' ? 'নতুন হস্তান্তর যোগ করুন' : 'Record New Handover'}</span>
        </button>
      </div>

      {/* View 1: Digital Handover Receipts */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          {handovers.map((h) => (
            <div
              key={h.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                    {h.referenceCode}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-850 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {language === 'hi' ? 'सीपीसीबी ईपीआर स्वीकृत' : language === 'bn' ? 'সিপিসিবি ইপিআর অনুমোদিত' : 'CPCB EPR Confirmed'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {formatTimestamp(h.timestamp)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <div className="text-base font-bold text-slate-900">
                    {h.recyclerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{h.facilityLocation}</span>
                  </div>

                  {/* Materials itemized */}
                  <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      {language === 'hi' ? 'सत्यापित वजन व उप-योग' : language === 'bn' ? 'যাচাইকৃত ওজন ও উপমোট' : 'Verified Weight & Subtotals'}
                    </div>
                    {h.materials.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-800">
                        <span>
                          {m.label} ({m.kg} {t.kgUnit} @ {formatINR(m.rate)}/{t.kgUnit})
                        </span>
                        <span className="font-black text-slate-900">{formatINR(m.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Photo & Total payout */}
                <div className="flex flex-col justify-between rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200 gap-3">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                      {language === 'hi' ? 'कुल प्रमाणित भुगतान' : language === 'bn' ? 'মোট প্রত্যয়িত পরিশোধ' : 'Total Certified Payout'}
                    </div>
                    <div className="text-2xl font-black text-emerald-800 mt-0.5">
                      {formatINR(h.totalPayout)}
                    </div>
                    <div className="mt-1 text-xs text-emerald-900">
                      {language === 'hi' ? 'भुगतान का तरीका:' : language === 'bn' ? 'পরিশোধের মাধ্যম:' : 'Payment Mode:'} <span className="font-bold">{h.paymentMode}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 font-mono">
                    GPS: {h.gpsLocation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Earnings Ledger Table */}
      {activeSubTab === 'ledger' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              {language === 'hi' ? 'लेनदेन व नकद बहीखाता' : language === 'bn' ? 'লেনদেন ও নগদ খতিয়ান' : 'Transaction & Cash Balance Ledger'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' ? 'प्राप्त नकद, डिजिटल भुगतान और रीसाइक्लर रसीदों का स्पष्ट रिकॉर्ड।' : language === 'bn' ? 'প্রাপ্ত নগদ, ডিজিটাল পরিশোধ ও রিসাইক্লিং রসিদের স্বচ্ছ হিসাব।' : 'Clear record of cash collected, digital payments, and recycler settlement receipts.'}
            </p>
          </div>

          {/* Mobile Card List View (< sm screens) */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {handovers.map((h) => (
              <div key={h.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {h.referenceCode}
                  </span>
                  <span className="text-sm font-black text-emerald-700">
                    +{formatINR(h.totalPayout)}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">{h.recyclerName}</div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatTimestamp(h.timestamp)}</span>
                  <span className="font-bold text-slate-700">{h.totalKg} {t.kgUnit} · {h.paymentMode}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= sm screens) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{language === 'hi' ? 'रेफरेंस' : language === 'bn' ? 'রেফারেন্স' : 'Reference'}</th>
                  <th className="px-4 py-3">{language === 'hi' ? 'रीसाइक्लिंग प्लांट' : language === 'bn' ? 'রিসাইক্লিং প্ল্যান্ট' : 'Facility / Counterparty'}</th>
                  <th className="px-4 py-3">{t.weight}</th>
                  <th className="px-4 py-3">{language === 'hi' ? 'भुगतान माध्यम' : language === 'bn' ? 'পরিশোধ মাধ্যম' : 'Payment Mode'}</th>
                  <th className="px-4 py-3">{language === 'hi' ? 'स्थिति' : language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  <th className="px-4 py-3 text-right">{language === 'hi' ? 'राशि' : language === 'bn' ? 'মূল্য' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {handovers.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {h.referenceCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{h.recyclerName}</div>
                      <div className="text-[11px] text-slate-400">{formatTimestamp(h.timestamp)}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {h.totalKg} {t.kgUnit}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                        {h.paymentMode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        {language === 'hi' ? 'भुगतान संपन्न' : language === 'bn' ? 'পরিশোধিত' : 'Settled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-700">
                      +{formatINR(h.totalPayout)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record New Handover Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'रीसाइक्लर को सामग्री हैंडओवर दर्ज करें' : language === 'bn' ? 'রিসাইক্লারের কাছে বর্জ্য হস্তান্তর নথিভুক্ত করুন' : 'Log Material Handover to Recycler'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'hi' ? 'अधिकृत प्लांट द्वारा सत्यापित डिजिटल ट्रांसफर रसीद तैयार करें।' : language === 'bn' ? 'অনুমোদিত সুবিধা দ্বারা যাচাইকৃত ডিজিটাল সার্টিফিকেট তৈরি করুন।' : 'Generate a digital transfer certificate confirmed by the authorized facility.'}
            </p>

            <form onSubmit={handleCreateHandover} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'अधिकृत रीसाइक्लर चुनें:' : language === 'bn' ? 'অনুমোদিত রিসাইক্লার নির্বাচন করুন:' : 'Select Authorized Recycler:'}
                </label>
                <select
                  value={selectedRecyclerId}
                  onChange={(e) => setSelectedRecyclerId(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  {authorizedRecyclers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.authorizationStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'सत्यापित कुल वजन (किग्रा):' : language === 'bn' ? 'যাচাইকৃত মোট ওজন (কেজি):' : 'Verified Total Weight (kg):'}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.5"
                    value={customKg}
                    onChange={(e) => setCustomKg(parseFloat(e.target.value) || 0)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 p-2 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'भुगतान राशि (₹):' : language === 'bn' ? 'প্রদেয় মূল্য (₹):' : 'Payout Amount (₹):'}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={customPayout}
                    onChange={(e) => setCustomPayout(parseInt(e.target.value, 10) || 0)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 p-2 text-sm font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'भुगतान का माध्यम:' : language === 'bn' ? 'পরিশোধের মাধ্যম:' : 'Payment Mode:'}
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  <option value="Cash at Hub">{language === 'hi' ? 'धर्मकांटा काउंटर पर नकद' : language === 'bn' ? 'হাবে ওজন কাউন্টারে নগদ' : 'Cash Handover at Weighbridge Window'}</option>
                  <option value="Instant Bank Transfer / UPI">{language === 'hi' ? 'तत्काल बैंक ट्रांसफर / यूपीআই' : language === 'bn' ? 'তাৎক্ষণিক ব্যাঙ্ক ট্রান্সফার / ইউপিআই' : 'Instant Bank Transfer / UPI'}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="min-h-[44px] rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all touch-manipulation"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation"
                >
                  {language === 'hi' ? 'पुष्टि करें और रसीद सहेजें' : language === 'bn' ? 'নিশ্চিত করুন এবং রসিদ সংরক্ষণ করুন' : 'Confirm & Save Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
