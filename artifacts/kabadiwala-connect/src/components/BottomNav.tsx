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
import { AppView, AuthUser } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  authUser: AuthUser | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  activeTab,
  onSelectTab,
  authUser,
}) => {
  if (currentView === 'login') return null;

  // 1. Household / Citizen Portal Bottom Navigation
  if (currentView === 'household') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-3 py-1.5 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {/* Tab 1: Schedule Pickup */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('schedule')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
              activeTab === 'schedule'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'schedule' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Home className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] tracking-tight">Schedule</span>
          </button>

          {/* Tab 2: Live Orders */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('tracking')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
              activeTab === 'tracking'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'tracking' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Package className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] tracking-tight">My Orders</span>
          </button>

          {/* Tab 3: Daily Scrap Rates */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('prices')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
              activeTab === 'prices'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'prices' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Scale className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] tracking-tight">Daily Rates</span>
          </button>

          {/* Tab 4: Safe Segregation */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('safety')}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
              activeTab === 'safety'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'safety' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[11px] tracking-tight">Segregation</span>
          </button>
        </div>
      </nav>
    );
  }

  // 2. Collector / Field Partner Bottom Navigation
  if (currentView === 'collector') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {/* Tab 1: Available Jobs */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('queue')}
            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
              activeTab === 'queue'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'queue' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Package className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">Job Queue</span>
          </button>

          {/* Tab 2: Scale Weighing */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('active')}
            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
              activeTab === 'active'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'active' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Scale className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">Weighing</span>
          </button>

          {/* Tab 3: Earnings Ledger */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('handover')}
            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
              activeTab === 'handover' || activeTab === 'earnings'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'handover' || activeTab === 'earnings'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-slate-500'
              }`}
            >
              <CircleDollarSign className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">Earnings</span>
          </button>

          {/* Tab 4: Price Board */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('prices')}
            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
              activeTab === 'prices'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'prices' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <TrendingUp className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">Price Board</span>
          </button>

          {/* Tab 5: Safety */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('safety')}
            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
              activeTab === 'safety'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                activeTab === 'safety' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">Safety</span>
          </button>
        </div>
      </nav>
    );
  }

  // 3. Authorized Recycler & Municipal Dashboard Navigation
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-3 py-1.5 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('overview')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
            activeTab === 'overview' || !activeTab
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              activeTab === 'overview' || !activeTab
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500'
            }`}
          >
            <Recycle className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] tracking-tight">ESG Overview</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('traceability')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
            activeTab === 'traceability'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              activeTab === 'traceability'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500'
            }`}
          >
            <Layers className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] tracking-tight">Traceability</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('handovers')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
            activeTab === 'handovers'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              activeTab === 'handovers'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-500'
            }`}
          >
            <Building2 className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] tracking-tight">Bulk Yards</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('audit')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all ${
            activeTab === 'audit'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              activeTab === 'audit' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] tracking-tight">CPCB Audit</span>
        </button>
      </div>
    </nav>
  );
};
