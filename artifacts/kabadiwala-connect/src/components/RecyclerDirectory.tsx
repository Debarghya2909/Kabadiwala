import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  ArrowRight,
  ExternalLink,
  Filter,
  Layers,
} from 'lucide-react';
import { AuthorizedRecycler, Language, MaterialKey } from '../types';
import { authorizedRecyclers, materialCatalog, formatINR } from '../data/mockData';
import { getTranslation } from '../lib/i18n';

interface RecyclerDirectoryProps {
  language: Language;
  onInitiateHandoverWithRecycler?: (recycler: AuthorizedRecycler) => void;
}

export const RecyclerDirectory: React.FC<RecyclerDirectoryProps> = ({
  language,
  onInitiateHandoverWithRecycler,
}) => {
  const [filterMaterial, setFilterMaterial] = useState<MaterialKey | 'all'>('all');
  const t = getTranslation(language);

  const filteredRecyclers = authorizedRecyclers.filter((rec) => {
    if (filterMaterial === 'all') return true;
    return rec.acceptedMaterials.includes(filterMaterial);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              <span>CPCB & State PCB Authorized Facility Directory</span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {language === 'hi'
                ? 'अधिकृत रीसाइक्लर व एग्रीगेटर डायरेक्टरी'
                : language === 'mr'
                ? 'अधिकृत रीसायकलर्स व संकलन केंद्र सूची'
                : 'Authorized E-Waste Recyclers & Aggregators'}
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              {language === 'hi'
                ? 'ईपीआर (EPR) नियमों के तहत प्रमाणित प्लांट जो अनौपचारिक कबाड़ियों से सीधे उचित भाव पर माल खरीदते हैं।'
                : language === 'mr'
                ? 'ईपीआर नियमांनुसार नोंदणीकृत प्लांट्स जे कबाडी मित्रांकडून थेट योग्य दराने ई-कचरा खरेदी करतात.'
                : 'Connect directly with certified downstream recovery hubs offering formal pricing premiums and compliant EPR receipts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-900">
            <span>4 Certified Facilities Active</span>
          </div>
        </div>
      </div>

      {/* Filter by Material */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mr-1">
          <Filter className="h-3.5 w-3.5" />
          Filter by Scrap Type:
        </span>
        <button
          type="button"
          onClick={() => setFilterMaterial('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            filterMaterial === 'all'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Recyclers
        </button>
        {(['pcb', 'cables', 'batteries', 'motors', 'lcd', 'crt', 'mixed_plastics'] as MaterialKey[]).map(
          (mKey) => {
            const mat = materialCatalog.find((m) => m.key === mKey);
            if (!mat) return null;
            const isSelected = filterMaterial === mKey;
            return (
              <button
                key={mKey}
                type="button"
                onClick={() => setFilterMaterial(mKey)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mat.short}
              </button>
            );
          }
        )}
      </div>

      {/* Recycler Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredRecyclers.map((rec) => {
          return (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div>
                {/* Authorization Status Badge & Distance */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{rec.authorizationStatus}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    ~{rec.distanceKm} km away
                  </span>
                </div>

                <h3 className="mt-2.5 text-base font-bold text-slate-900 leading-snug">
                  {rec.name}
                </h3>

                {/* Location & Reg */}
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{rec.facilityLocation}, {rec.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <span>Reg: {rec.authorizationNumber}</span>
                    <span>· Valid to {rec.validUntil}</span>
                  </div>
                </div>

                {/* Logistics pickup mode */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                  <Truck className="h-3.5 w-3.5 text-slate-500" />
                  <span>{rec.pickupAvailability} ({rec.serviceArea})</span>
                </div>

                {/* Accepted Materials & Offered Rates */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    Accepted E-Waste & Direct Buying Rates:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {rec.acceptedMaterials.map((mKey) => {
                      const mat = materialCatalog.find((m) => m.key === mKey);
                      const offeredRate = rec.offeredRates[mKey];
                      return (
                        <div
                          key={mKey}
                          className="flex items-center justify-between rounded-md bg-slate-50/80 px-2 py-1.5 border border-slate-200/60"
                        >
                          <span className="text-slate-700 font-medium">
                            {mat?.short || mKey}
                          </span>
                          <span className="font-bold text-emerald-700">
                            {offeredRate ? formatINR(offeredRate) + '/kg' : 'Market'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <a
                  href={`tel:${rec.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{rec.phone}</span>
                </a>

                {onInitiateHandoverWithRecycler && (
                  <button
                    type="button"
                    onClick={() => onInitiateHandoverWithRecycler(rec)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                  >
                    <span>Initiate Handover</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
