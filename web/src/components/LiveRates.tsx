import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useRates } from '../hooks/useRates';
import RatesBoard from './RatesBoard';
import ConverterTerminal from './ConverterTerminal';

export const LiveRates: React.FC = () => {
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
    paraleloRate,
    binanceRate,
  } = useRates();

  return (
    <section id="cotizaciones" className="bg-white border-t-8 border-black">
      <div className="px-6 py-16 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col gap-6 justify-between items-start mb-12 md:flex-row md:items-end">
          <div>
            <div className="inline-flex gap-2 items-center px-3 py-1 mb-4 text-xs font-black tracking-wider text-white uppercase bg-black border-2 border-transparent">
              <span className="w-2 h-2 animate-ping bg-brutal-green"></span>
              EN TIEMPO REAL
            </div>
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-black uppercase sm:text-6xl">
              PIZARRA FINANCIERA
            </h2>
            <p className="pl-4 max-w-2xl text-lg font-bold text-black uppercase border-l-4 sm:text-xl border-brutal-red">
              Consulta las cotizaciones con precisión milimétrica. Esta demo consume las fuentes oficiales de manera asíncrona y ofuscada.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center">
            {lastUpdated && (
              <span className="px-4 py-2 font-mono text-sm font-black text-black border-4 border-black bg-brutal-yellow shadow-brutal-sm">
                UPDATED: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchRates}
              disabled={refreshing}
              className="flex gap-2 items-center px-6 py-3 text-sm font-black text-white uppercase border-4 border-black transition-all bg-brutal-blue shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'LOADING...' : 'REFRESH'}</span>
            </button>
          </div>
        </div>

        <div className="mb-16">
          <RatesBoard
            rates={rates}
            refreshing={refreshing}
            copiedId={copiedId}
            spreadData={spreadData}
            formatPrice={formatPrice}
            onCopyRate={handleCopyRate}
          />
        </div>

        {/* Integrated Quick Currency Calculator - Terminal Brutalist Style */}
        <ConverterTerminal
          bcvRate={bcvRate}
          paraleloRate={paraleloRate}
          binanceRate={binanceRate}
        />
      </div>
    </section>
  );
};

export default LiveRates;
