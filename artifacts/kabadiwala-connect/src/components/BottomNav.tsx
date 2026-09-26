import React from 'react';
import {
  Home,
  Package,
  CircleDollarSign,
  Scale,
  ShieldCheck,
  TrendingUp,
  Layers,
  Building2,
  Recycle,
} from 'lucide-react';
import { AppView, AuthUser, Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface BottomNavProps {
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  authUser: AuthUser | null;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  activeTab,
  onSelectTab,
  authUser,
  language = 'en',
}) => {
  if (currentView === 'login') return null;
  const t = getTranslation(language);

  // 1. Household / Citizen Portal Bottom Navigation
  if (currentView === 'household') {
    return (
      <nav
        id="mobile-bottom-nav-household"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-300/80 bg-white/98 backdrop-blur-md px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden"
        aria-label="Household Navigation"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {/* Tab 1: Schedule Pickup */}
          <button
            type="button"
            id="mobile-tab-household-schedule"
            onClick={() => onSelectTab && onSelectTab('schedule')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'schedule'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomSchedule}</span>
          </button>

          {/* Tab 2: Live Orders */}
          <button
            type="button"
            id="mobile-tab-household-tracking"
            onClick={() => onSelectTab && onSelectTab('tracking')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'tracking'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'tracking'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomMyOrders}</span>
          </button>

          {/* Tab 3: Daily Scrap Rates */}
          <button
            type="button"
            id="mobile-tab-household-prices"
            onClick={() => onSelectTab && onSelectTab('prices')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'prices'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'prices'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Scale className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomDailyRates}</span>
          </button>

          {/* Tab 4: Safe Segregation */}
          <button
            type="button"
            id="mobile-tab-household-safety"
            onClick={() => onSelectTab && onSelectTab('safety')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'safety'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'safety'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomSegregation}</span>
          </button>
        </div>
      </nav>
    );
  }

  // 2. Collector / Field Partner Bottom Navigation
  if (currentView === 'collector') {
    return (
      <nav
        id="mobile-bottom-nav-collector"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-300/80 bg-white/98 backdrop-blur-md px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden"
        aria-label="Collector Field Navigation"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {/* Tab 1: Available Jobs */}
          <button
            type="button"
            id="mobile-tab-collector-queue"
            onClick={() => onSelectTab && onSelectTab('queue')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'queue'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'queue'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5">{t.bottomJobQueue}</span>
          </button>

          {/* Tab 2: Scale Weighing */}
          <button
            type="button"
            id="mobile-tab-collector-active"
            onClick={() => onSelectTab && onSelectTab('active')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'active'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Scale className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5">{t.bottomWeighing}</span>
          </button>

          {/* Tab 3: Earnings Ledger */}
          <button
            type="button"
            id="mobile-tab-collector-handover"
            onClick={() => onSelectTab && onSelectTab('handover')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'handover' || activeTab === 'earnings'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'handover' || activeTab === 'earnings'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CircleDollarSign className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5">{t.bottomEarnings}</span>
          </button>

          {/* Tab 4: Price Board */}
          <button
            type="button"
            id="mobile-tab-collector-prices"
            onClick={() => onSelectTab && onSelectTab('prices')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'prices'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'prices'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5">{t.bottomDailyRates}</span>
          </button>

          {/* Tab 5: Safety */}
          <button
            type="button"
            id="mobile-tab-collector-safety"
            onClick={() => onSelectTab && onSelectTab('safety')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
              activeTab === 'safety'
                ? 'text-emerald-900 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                activeTab === 'safety'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-4.5 w-4.5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5">{t.bottomSafety}</span>
          </button>
        </div>
      </nav>
    );
  }

  // 3. Authorized Recycler & Municipal Dashboard Navigation
  return (
    <nav
      id="mobile-bottom-nav-impact"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-300/80 bg-white/98 backdrop-blur-md px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden"
      aria-label="Municipal ESG Navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        <button
          type="button"
          id="mobile-tab-impact-overview"
          onClick={() => onSelectTab && onSelectTab('overview')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
            activeTab === 'overview' || !activeTab
              ? 'text-emerald-900 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              activeTab === 'overview' || !activeTab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Recycle className="h-4.5 w-4.5 stroke-[2.4]" />
          </div>
          <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomEsgOverview}</span>
        </button>

        <button
          type="button"
          id="mobile-tab-impact-traceability"
          onClick={() => onSelectTab && onSelectTab('traceability')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
            activeTab === 'traceability'
              ? 'text-emerald-900 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              activeTab === 'traceability'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-4.5 w-4.5 stroke-[2.4]" />
          </div>
          <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomTraceability}</span>
        </button>

        <button
          type="button"
          id="mobile-tab-impact-handovers"
          onClick={() => onSelectTab && onSelectTab('handovers')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
            activeTab === 'handovers'
              ? 'text-emerald-900 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              activeTab === 'handovers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-4.5 w-4.5 stroke-[2.4]" />
          </div>
          <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomBulkYards}</span>
        </button>

        <button
          type="button"
          id="mobile-tab-impact-audit"
          onClick={() => onSelectTab && onSelectTab('audit')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 px-1 min-h-[50px] transition-all active:scale-95 touch-manipulation ${
            activeTab === 'audit'
              ? 'text-emerald-900 font-black'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4.5 w-4.5 stroke-[2.4]" />
          </div>
          <span className="text-[11px] tracking-tight leading-none mt-0.5">{t.bottomCpcbAudit}</span>
        </button>
      </div>
    </nav>
  );
};
