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
            {handovers.length} completed transactions
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Formal Volume Handed Over
            </span>
            <div className="rounded-md bg-blue-50 p-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {totalKgHandedOver.toFixed(1)} kg
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">
            100% diverted from backyard dumping
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Certified EPR Records
            </span>
            <div className="rounded-md bg-purple-50 p-2 text-purple-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {confirmedHandovers} Receipts
          </div>
          <div className="mt-1 text-xs text-purple-700 font-semibold">
            Auditable under CPCB Rules
          </div>
        </div>
      </div>

      {/* Sub Tabs: Handover Receipts vs Earnings Ledger */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('records')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'records'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Digital Handover Receipts ({handovers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ledger')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'ledger'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cash & Payment Ledger
          </button>
        </div>

        <button
          id="log-handover-btn"
          type="button"
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>Record New Handover</span>
        </button>
      </div>

      {/* View 1: Digital Handover Receipts */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          {handovers.map((h) => (
            <div
              key={h.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {h.referenceCode}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    CPCB EPR Confirmed
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {formatTimestamp(h.timestamp)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <div className="text-sm font-bold text-slate-900">
                    {h.recyclerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{h.facilityLocation}</span>
                  </div>

                  {/* Materials itemized */}
                  <div className="mt-3 space-y-1.5 rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Verified Weight & Subtotals
                    </div>
                    {h.materials.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-700">
                        <span>
                          {m.label} ({m.kg} kg @ {formatINR(m.rate)}/kg)
                        </span>
                        <span className="font-semibold">{formatINR(m.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Photo & Total payout */}
                <div className="flex flex-col justify-between rounded-lg bg-emerald-50/60 p-4 border border-emerald-100">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Total Certified Payout
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {formatINR(h.totalPayout)}
                    </div>
                    <div className="mt-1 text-xs text-emerald-800">
                      Payment Mode: <span className="font-bold">{h.paymentMode}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500 font-mono">
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
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Transaction & Cash Balance Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Clear record of cash collected, digital payments, and recycler settlement receipts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Facility / Counterparty</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
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
                      {h.totalKg} kg
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                        {h.paymentMode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        Settled
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Log Material Handover to Recycler
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Generate a digital transfer certificate confirmed by the authorized facility.
            </p>

            <form onSubmit={handleCreateHandover} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Authorized Recycler:
                </label>
                <select
                  value={selectedRecyclerId}
                  onChange={(e) => setSelectedRecyclerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  {authorizedRecyclers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.authorizationStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Total Weight (kg):
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={customKg}
                    onChange={(e) => setCustomKg(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payout Amount (₹):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customPayout}
                    onChange={(e) => setCustomPayout(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Mode:
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
                >
                  <option value="Cash at Hub">Cash Handover at Weighbridge Window</option>
                  <option value="Instant Bank Transfer / UPI">Instant Bank Transfer / UPI</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Confirm & Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
