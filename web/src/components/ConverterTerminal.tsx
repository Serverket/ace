import React, { useState } from 'react';
import { ShieldCheck, Calculator, ArrowRightLeft } from 'lucide-react';

interface ConverterTerminalProps {
  bcvRate?: number | null;
  paraleloRate?: number | null;
  binanceRate?: number | null;
}

export const ConverterTerminal: React.FC<ConverterTerminalProps> = ({
  bcvRate,
  paraleloRate,
  binanceRate,
}) => {
  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcDirection, setCalcDirection] = useState<'usdToVes' | 'vesToUsd'>('usdToVes');

  return (
    <div
      id="calculadora"
      className="p-8 sm:p-12 bg-black border-8 border-black text-white relative shadow-brutal-lg"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b-4 border-white pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-xs font-black uppercase mb-4 shadow-brutal-sm">
              <Calculator className="w-4 h-4" />
              TERMINAL CAMBIARIA
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white uppercase">
              CONVERSIÓN MULTI-TASA
            </h3>
          </div>

          {/* Conversion Direction Toggle */}
          <button
            onClick={() => setCalcDirection(calcDirection === 'usdToVes' ? 'vesToUsd' : 'usdToVes')}
            className="flex items-center gap-2 px-6 py-3 bg-brutal-yellow text-black border-4 border-white font-black text-sm uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all self-start md:self-auto"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span>
              {calcDirection === 'usdToVes' ? 'DIVISAS -> BS' : 'BS -> DIVISAS'}
            </span>
          </button>
        </div>

        {/* Calculator Input Box */}
        <div className="mb-12">
          <label className="block text-xl font-black text-white uppercase mb-4">
            {calcDirection === 'usdToVes' ? 'MONTO (USD / EUR):' : 'MONTO EN BOLÍVARES (BS):'}
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-full sm:w-96">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black text-2xl">
                {calcDirection === 'usdToVes' ? '$' : 'Bs'}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={calcAmount || ''}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-12 pr-4 py-4 bg-white border-4 border-white text-black font-mono font-black text-3xl focus:outline-none focus:border-brutal-yellow transition-colors"
                placeholder="100"
              />
            </div>

            {/* Quick amount presets */}
            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
              {(calcDirection === 'usdToVes' ? [10, 50, 100, 500, 1000] : [500, 1000, 5000, 10000]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCalcAmount(preset)}
                  className={`px-4 py-2 border-4 font-mono font-black transition-all ${
                    calcAmount === preset
                      ? 'bg-brutal-blue border-white text-white shadow-brutal-sm'
                      : 'bg-black border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {calcDirection === 'usdToVes' ? `$${preset}` : `${preset.toLocaleString('es-VE')} Bs`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Across Rates Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-4 border-white bg-white">
          {/* BCV Result */}
          <div className="p-6 bg-black border-2 border-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-sm font-black text-white mb-4 uppercase">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-brutal-blue border-2 border-white"></span>
                BCV OFICIAL
              </span>
              <span className="font-mono text-xs text-brutal-blue bg-white px-2 py-1">
                {bcvRate ? `${bcvRate} Bs` : 'ERR'}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-white truncate">
              {bcvRate
                ? calcDirection === 'usdToVes'
                  ? `${(calcAmount * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
                  : `$${(calcAmount / bcvRate).toFixed(2)}`
                : '---'}
            </div>
          </div>

          {/* Paralelo Result */}
          <div className="p-6 bg-black border-2 border-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-sm font-black text-white mb-4 uppercase">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-brutal-green border-2 border-white"></span>
                PARALELO
              </span>
              <span className="font-mono text-xs text-black bg-brutal-green px-2 py-1">
                {paraleloRate ? `${paraleloRate} Bs` : 'ERR'}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-brutal-green truncate">
              {paraleloRate
                ? calcDirection === 'usdToVes'
                  ? `${(calcAmount * paraleloRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
                  : `$${(calcAmount / paraleloRate).toFixed(2)}`
                : '---'}
            </div>
          </div>

          {/* Binance Result */}
          <div className="p-6 bg-black border-2 border-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-sm font-black text-white mb-4 uppercase">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-brutal-yellow border-2 border-white"></span>
                BINANCE P2P
              </span>
              <span className="font-mono text-xs text-black bg-brutal-yellow px-2 py-1">
                {binanceRate ? `${binanceRate} Bs` : 'ERR'}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-brutal-yellow truncate">
              {binanceRate
                ? calcDirection === 'usdToVes'
                  ? `${(calcAmount * binanceRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
                  : `$${(calcAmount / binanceRate).toFixed(2)}`
                : '---'}
            </div>
          </div>
        </div>

        {/* Anti Scraping Notice */}
        <div className="mt-8 flex items-center gap-4 text-white font-mono text-sm border-t-4 border-white pt-6">
          <ShieldCheck className="w-8 h-8 text-brutal-green shrink-0" />
          <span className="uppercase font-bold tracking-tight">
            ENDPOINTS BLINDADOS CON CIFRADO XOR DINÁMICO E INTERCEPCIÓN DE APIS PARA SALTAR BLOQUEOS CORS.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConverterTerminal;
