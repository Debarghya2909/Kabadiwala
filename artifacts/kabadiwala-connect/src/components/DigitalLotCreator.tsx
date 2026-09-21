import React, { useState } from 'react';
import {
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Upload,
  Plus,
} from 'lucide-react';
import { AuthUser, DigitalLot, Language, MaterialKey } from '../types';
import { materialCatalog, formatINR, authorizedRecyclers } from '../data/mockData';
import { getTranslation } from '../lib/i18n';

interface DigitalLotCreatorProps {
  authUser: AuthUser;
  language: Language;
  lots: DigitalLot[];
  onSaveLots: (lots: DigitalLot[]) => void;
  onMatchRecycler?: (lot: DigitalLot) => void;
}

const samplePhotos: Record<MaterialKey, string> = {
  pcb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  cables: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  batteries: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  crt: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
  lcd: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  motors: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  mixed_plastics: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  iron: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  cardboard: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  newspaper: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
  glass: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
  wet_waste: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
};

export const DigitalLotCreator: React.FC<DigitalLotCreatorProps> = ({
  authUser,
  language,
  lots,
  onSaveLots,
  onMatchRecycler,
}) => {
  const [category, setCategory] = useState<MaterialKey>('pcb');
  const [approxWeight, setApproxWeight] = useState<number>(15);
  const [condition, setCondition] = useState<'Separated' | 'Mixed' | 'Unprocessed' | 'Intact'>('Separated');
  const [photoUrl, setPhotoUrl] = useState<string>(samplePhotos['pcb']);
  const [locationStr, setLocationStr] = useState<string>(
    authUser.zone || 'Kasba Aggregation Hub, Kolkata'
  );
  const [notes, setNotes] = useState<string>('Segregated e-waste collection ready for certified hub handover.');
  const [lotSuccess, setLotSuccess] = useState<DigitalLot | null>(null);

  const selectedMaterial = materialCatalog.find((m) => m.key === category) || materialCatalog[0];
  const estimatedLotValue = Math.round((approxWeight || 0) * selectedMaterial.rate);

  const handleCategoryChange = (key: MaterialKey) => {
    setCategory(key);
    setPhotoUrl(samplePhotos[key] || samplePhotos.pcb);
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (approxWeight <= 0) return;

    const newLot: DigitalLot = {
      id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      collectorId: authUser.id,
      collectorName: authUser.name,
      title: `${selectedMaterial.label} (${condition})`,
      category,
      approxWeightKg: approxWeight,
      estimatedValue: estimatedLotValue,
      condition,
      photoUrl,
      location: locationStr,
      createdAt: new Date().toISOString(),
      status: 'available',
    };

    const nextLots = [newLot, ...lots];
    onSaveLots(nextLots);
    setLotSuccess(newLot);
  };

  const handleDeleteLot = (lotId: string) => {
    const nextLots = lots.filter((l) => l.id !== lotId);
    onSaveLots(nextLots);
  };

  return (
    <div className="space-y-6">
      {/* Creator Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Layers className="h-4 w-4" />
          <span>EPR Batch Lot Creation</span>
        </div>
        <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
          {language === 'hi'
            ? 'नया ई-कचरा डिजिटल लॉट बनाएं'
            : language === 'bn'
            ? 'নতুন ই-বর্জ্য ডিজিটাল লট তৈরি করুন'
            : language === 'mr'
            ? 'नवीन ई-कचरा डिजिटल लॉट तयार करा'
            : 'Create Digital Scrap & E-Waste Lot'}
        </h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          {language === 'hi'
            ? 'अपनी एकत्रित सामग्री का फोटो लें, वजन दर्ज करें और तुरंत सर्वोत्तम रीसाइक्लर से मिलान पाएं।'
            : language === 'bn'
            ? 'আপনার সংগৃহীত সামগ্রীর ছবি তুলুন, ওজন লিখুন এবং অনুমোদিত রিসাইক্লারের কাছ থেকে তাৎক্ষণিক মূল্য পান।'
            : language === 'mr'
            ? 'गोळा केलेल्या साहित्याचा फोटो घ्या, वजन टाका आणि तात्काळ सर्वोत्तम रीसायकलर्स मिळवा.'
            : 'Aggregate collected materials into digital lots with verified photos and instant EPR valuation.'}
        </p>

        {lotSuccess && (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">
                  {language === 'hi'
                    ? `डिजिटल लॉट ${lotSuccess.id} सफलतापूर्वक बनाया गया!`
                    : language === 'bn'
                    ? `ডিজিটাল লট ${lotSuccess.id} সফলভাবে তৈরি হয়েছে!`
                    : language === 'mr'
                    ? `डिजिटल लॉट ${lotSuccess.id} तयार झाला!`
                    : `Digital Lot ${lotSuccess.id} created successfully!`}
                </p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {lotSuccess.approxWeightKg} kg · Estimated Value: {formatINR(lotSuccess.estimatedValue)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLotSuccess(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleCreateLot} className="mt-6 space-y-5">
          {/* Material Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Select Scrap Material Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  'pcb',
                  'cables',
                  'batteries',
                  'crt',
                  'lcd',
                  'motors',
                  'mixed_plastics',
                  'iron',
                ] as MaterialKey[]
              ).map((k) => {
                const mat = materialCatalog.find((m) => m.key === k);
                if (!mat) return null;
                const isSelected = category === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleCategoryChange(k)}
                    className={`flex flex-col items-start rounded-lg p-2.5 text-left border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900">{mat.short}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {formatINR(mat.rate)}/kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Approx Weight and Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approximate Lot Weight (kg):
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={approxWeight}
                onChange={(e) => setApproxWeight(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Material Segregation State:
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Separated">Separated & Clean (Highest Value)</option>
                <option value="Intact">Intact Appliance / Unit</option>
                <option value="Mixed">Mixed Metal / Plastic Casings</option>
                <option value="Unprocessed">Unprocessed Scrap</option>
              </select>
            </div>
          </div>

          {/* Photo & Instant Valuation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lot Photograph:
              </label>
              <img
                src={photoUrl}
                alt="Lot preview"
                className="h-28 w-full rounded-lg object-cover border border-slate-300 shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Instant Valuation Estimate
              </div>
              <div className="text-3xl font-extrabold text-emerald-700">
                {formatINR(estimatedLotValue)}
              </div>
              <p className="text-xs text-slate-600">
                Calculated at fair EPR rate of {formatINR(selectedMaterial.rate)}/kg for {approxWeight} kg of {selectedMaterial.short}.
              </p>
            </div>
          </div>

          <button
            id="create-digital-lot-submit-btn"
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
          >
            Create Digital Lot & Publish to Recyclers
          </button>
        </form>
      </div>

      {/* Existing Digital Lots */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Your Active Digital Lots ({lots.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lots.map((lot) => {
            const matchedRecycler = authorizedRecyclers.find((r) => r.id === lot.matchedRecyclerId);
            return (
              <div
                key={lot.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {lot.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                        lot.status === 'handed_over'
                          ? 'bg-slate-100 text-slate-700'
                          : lot.status === 'matched'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {lot.status === 'handed_over'
                        ? 'Handed Over'
                        : lot.status === 'matched'
                        ? 'Matched to Recycler'
                        : 'Available for Pickup'}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-3">
                    <img
                      src={lot.photoUrl}
                      alt={lot.title}
                      className="h-16 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {lot.title}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Weight: <span className="font-bold text-slate-800">{lot.approxWeightKg} kg</span>
                      </div>
                      <div className="text-sm font-extrabold text-emerald-700 mt-1">
                        Est. {formatINR(lot.estimatedValue)}
                      </div>
                    </div>
                  </div>

                  {matchedRecycler && (
                    <div className="mt-3 rounded-md bg-blue-50 p-2 text-xs text-blue-900 border border-blue-200">
                      <span className="font-bold">Matched Facility:</span> {matchedRecycler.name}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="text-[11px] text-slate-400">
                    {lot.location}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteLot(lot.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                      title="Remove Lot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {onMatchRecycler && lot.status === 'available' && (
                      <button
                        type="button"
                        onClick={() => onMatchRecycler(lot)}
                        className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        Match Recycler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
