import React from 'react';
import { TrendingUp, Copy, Check } from 'lucide-react';
import type { RateItem } from '../hooks/useRates';

interface RatesBoardProps {
  rates: RateItem[];
  refreshing: boolean;
  copiedId: string | null;
  spreadData: { diffBs: string; diffPercent: string } | null;
  formatPrice: (val: number | null) => string;
  onCopyRate: (rate: RateItem) => void;
}

export const RatesBoard: React.FC<RatesBoardProps> = ({
  rates,
  refreshing,
  copiedId,
  spreadData,
  formatPrice,
  onCopyRate,
}) => {
  return (
    <>
      {/* Spread Notice Banner (Brecha Cambiaria) */}
      {spreadData && (
        <div className="mb-12 p-6 bg-white border-4 border-black shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brutal-yellow border-2 border-black text-black shadow-brutal-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-black text-black uppercase">
                BRECHA CAMBIARIA
              </h4>
              <p className="text-sm font-bold text-black uppercase">
                Spread Paralelo vs BCV
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="px-4 py-2 bg-white border-4 border-black text-black font-black text-lg">
              Δ +{spreadData.diffBs} Bs
            </span>
            <span className="px-4 py-2 bg-brutal-green border-4 border-black text-black font-black text-lg shadow-brutal-sm">
              +{spreadData.diffPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Live Rates 4 Cards Grid - No gaps style via thick borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-black bg-black">
        {rates.map((rate) => {
          const isCopied = copiedId === rate.id;
          // Map original gradient colors to brutalist solids for the badge if desired, or just use black/white
          let brutalColor = 'bg-black';
          if (rate.id === 'bcv') brutalColor = 'bg-brutal-blue text-white';
          if (rate.id === 'paralelo') brutalColor = 'bg-brutal-green text-black';
          if (rate.id === 'binance') brutalColor = 'bg-brutal-yellow text-black';
          if (rate.id === 'euro') brutalColor = 'bg-brutal-red text-white';

          return (
            <div
              key={rate.id}
              className="p-6 bg-white border-2 border-black flex flex-col justify-between group"
            >
              {/* Top Badge & Live Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 border-4 border-black flex items-center justify-center font-black text-2xl shadow-brutal-sm ${brutalColor}`}>
                  {rate.symbol}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-xs font-black text-black shadow-brutal-sm">
                  <span className="w-2 h-2 bg-brutal-red animate-pulse"></span>
                  <span>LIVE</span>
                </div>
              </div>

              {/* Rate Names & Description */}
              <div>
                <h3 className="text-2xl font-black text-black mb-2 uppercase">
                  {rate.name}
                </h3>
                <p className="text-xs font-bold text-black mb-8 h-8 uppercase border-b-4 border-black pb-4">
                  {rate.sourceDesc}
                </p>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline justify-between mb-8">
                <div className="flex items-baseline gap-2 font-mono">
                  {refreshing ? (
                    <div className="h-12 w-32 bg-black animate-pulse"></div>
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black text-black tracking-tighter tabular-numbers">
                      {formatPrice(rate.value)}
                    </span>
                  )}
                  <span className="text-lg font-black text-black">Bs</span>
                </div>
              </div>

              {/* Card Action / Copy Button */}
              <button
                onClick={() => onCopyRate(rate)}
                disabled={!rate.value}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white hover:bg-black text-black hover:text-white border-4 border-black font-black transition-colors uppercase shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5 text-brutal-green" />
                    <span className="text-brutal-green">¡COPIADO!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>COPIAR</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RatesBoard;
