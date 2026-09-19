import React from 'react';
import { TrendingUp, Copy, Check } from 'lucide-react';
import type { RateItem } from '../hooks/useRates';

interface RatesBoardProps {
  rates: RateItem[];
  refreshing: boolean;
  copiedId: string | null;
  spreadData: { diffBs: string; diffPercent: string } | null;
  weekendTag?: string | null;
  formatPrice: (val: number | null) => string;
  onCopyRate: (rate: RateItem) => void;
}

export const RatesBoard: React.FC<RatesBoardProps> = ({
  rates,
  refreshing,
  copiedId,
  spreadData,
  weekendTag,
  formatPrice,
  onCopyRate,
}) => {
  return (
    <>
      {/* Spread Notice Banner (Brecha Cambiaria) */}
      {spreadData && (
        <div className="flex flex-col gap-6 justify-between items-start p-6 mb-12 bg-white border-4 border-black shadow-brutal sm:flex-row sm:items-center">
          <div className="flex gap-4 items-center">
            <div className="p-3 text-black border-2 border-black bg-brutal-yellow shadow-brutal-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-black text-black uppercase">
                BRECHA CAMBIARIA
              </h4>
              <p className="text-sm font-bold text-black uppercase">
                Spread P2P vs BCV
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center font-mono">
            <span className="px-4 py-2 text-lg font-black text-black bg-white border-4 border-black">
              Δ {spreadData.diffBs} Bs
            </span>
            <span className="px-4 py-2 text-lg font-black text-black border-4 border-black bg-brutal-green shadow-brutal-sm">
              {spreadData.diffPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Live Rates 3 Cards Grid - No gaps style via thick borders */}
      <div className="grid grid-cols-1 gap-0 bg-black border-4 border-black md:grid-cols-3">
        {rates.map((rate) => {
          const isCopied = copiedId === rate.id;
          // Map original gradient colors to brutalist solids for the badge if desired, or just use black/white
          let brutalColor = 'bg-black';
          if (rate.id === 'bcv') brutalColor = 'bg-brutal-blue text-white';
          if (rate.id === 'binance') brutalColor = 'bg-brutal-yellow text-black';
          if (rate.id === 'euro') brutalColor = 'bg-brutal-red text-white';

          return (
            <div
              key={rate.id}
              className="flex flex-col justify-between p-6 bg-white border-2 border-black group"
            >
              {/* Top Badge & Live Indicator */}
              <div className="flex justify-between items-center mb-8">
                <div className={`flex justify-center items-center w-14 h-14 text-2xl font-black border-4 border-black shadow-brutal-sm ${brutalColor}`}>
                  {rate.symbol}
                </div>
                <div className="flex gap-2 items-center">
                  {weekendTag && rate.value != null && (rate.id === 'bcv' || rate.id === 'euro') && (
                    <div
                      title="Tasa BCV vigente para el lunes"
                      className="flex items-center gap-1.5 px-2 py-1 bg-brutal-yellow border-2 border-black text-[10px] font-black text-black shadow-brutal-sm uppercase"
                    >
                      <span>Tasa {weekendTag}</span>
                    </div>
                  )}
                  <div className="flex gap-2 items-center px-3 py-1 text-xs font-black text-black bg-white border-2 border-black shadow-brutal-sm">
                    <span className="w-2 h-2 animate-pulse bg-brutal-red"></span>
                    <span>LIVE</span>
                  </div>
                </div>
              </div>

              {/* Rate Names & Description */}
              <div>
                <h3 className="mb-2 text-2xl font-black text-black uppercase">
                  {rate.name}
                </h3>
                <p className="pb-4 mb-8 h-8 text-xs font-bold text-black uppercase border-b-4 border-black">
                  {rate.sourceDesc}
                </p>
              </div>

              {/* Price Display */}
              <div className="flex justify-between items-baseline mb-8">
                <div className="flex gap-2 items-baseline font-mono">
                  {refreshing ? (
                    <div className="w-32 h-12 bg-black animate-pulse"></div>
                  ) : (
                    <span className="text-4xl font-black tracking-tighter text-black sm:text-5xl tabular-numbers">
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
                className="flex gap-2 justify-center items-center px-4 py-4 w-full font-black text-black uppercase bg-white border-4 border-black transition-colors hover:bg-black hover:text-white shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
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
