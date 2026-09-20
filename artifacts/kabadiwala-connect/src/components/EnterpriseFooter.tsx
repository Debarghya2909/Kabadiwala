import React from 'react';

export const EnterpriseFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-4 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Kabadiwala Connect — Formal E-Waste & Scrap Recycling Network</span>
        <span className="text-slate-400">Aligned with E-Waste (Management) Rules, 2022 & EPR Framework</span>
      </div>
    </footer>
  );
};
