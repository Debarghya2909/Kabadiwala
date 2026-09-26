import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface EnterpriseFooterProps {
  language?: Language;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({ language = 'en' }) => {
  const t = getTranslation(language);

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-4 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold text-slate-700">{t.footerTitle}</span>
        <span className="text-slate-400">{t.footerCompliance}</span>
      </div>
    </footer>
  );
};
