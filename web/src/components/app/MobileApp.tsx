import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import RatesBoard from '../RatesBoard';
import ConverterTerminal from '../ConverterTerminal';
import HeroSection from '../Hero';
import SiteFooter from '../SiteFooter';
import { LegalModal } from '../LegalModals';
import BottomNav, { type AppTab } from './BottomNav';
import { useRates } from '../../hooks/useRates';

/**
 * App-mode experience for mobile viewports and the installed PWA.
 * The app region (rates board + converter behind bottom-nav tabs) sits on
 * top; the marketing landing stays reachable below via scroll.
 */
export const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('pizarra');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'tos' | null>(null);

  const {
    rates,
    refreshing,
    lastUpdated,
    copiedId,
    fetchRates,
    formatPrice,
    handleCopyRate,
    spreadData,
    bcvRate,
    eurRate,
    binanceRate,
  } = useRates();

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col selection:bg-black selection:text-white font-sans pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {/* Compact App Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3 flex items-center justify-between">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] font-mono font-black text-black bg-brutal-yellow px-2 py-1 border-2 border-black shadow-brutal-sm">
              {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchRates}
            disabled={refreshing}
            aria-label="Actualizar tasas"
            className="p-2 bg-brutal-blue border-2 border-black text-white shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* App Region — tabs keep both views mounted to preserve state */}
      <main id="cotizaciones" className="flex-1">
        <div className={activeTab === 'pizarra' ? 'block' : 'hidden'}>
          <div className="px-4 py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-brutal-green animate-ping"></span>
              EN TIEMPO REAL — PIZARRA FINANCIERA
            </div>
            <RatesBoard
              rates={rates}
              refreshing={refreshing}
              copiedId={copiedId}
              spreadData={spreadData}
              formatPrice={formatPrice}
              onCopyRate={handleCopyRate}
            />
          </div>
        </div>

        <div className={activeTab === 'conversor' ? 'block' : 'hidden'}>
          <div className="px-4 py-6">
            <ConverterTerminal
              bcvRate={bcvRate}
              eurRate={eurRate}
              binanceRate={binanceRate}
            />
          </div>
        </div>
      </main>

      {/* Marketing landing below the app region */}
      <div className="border-t-8 border-black">
        <HeroSection onAppCta={() => handleTabChange('pizarra')} />
      </div>
      <SiteFooter
        onLegal={setLegalModalType}
        onQuotesClick={() => handleTabChange('pizarra')}
        onCalcClick={() => handleTabChange('conversor')}
      />

      {/* App chrome */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};

export default MobileApp;
