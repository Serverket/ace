import React, { useState } from 'react';
import { ShieldCheck, Calculator, ArrowRightLeft, Copy, Check } from 'lucide-react';

interface ConverterTerminalProps {
  bcvRate?: number | null;
  eurRate?: number | null;
  binanceRate?: number | null;
}

interface ResultBoxProps {
  id: string;
  label: string;
  dotColor: string;
  badgeClass: string;
  amountClass: string;
  rate?: number | null;
  result: string | null;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}

const ResultBox: React.FC<ResultBoxProps> = ({
  id,
  label,
  dotColor,
  badgeClass,
  amountClass,
  rate,
  result,
  copiedId,
  onCopy,
}) => {
  const isCopied = copiedId === id;

  return (
    <div className="p-6 bg-black border-2 border-white flex flex-col gap-6 justify-between">
      <div>
        <div className="flex items-center justify-between text-sm font-black text-white mb-4 uppercase">
          <span className="flex items-center gap-2">
            <span className={`w-3 h-3 ${dotColor} border-2 border-white`}></span>
            {label}
          </span>
          <span className={`font-mono text-xs px-2 py-1 ${badgeClass}`}>
            {rate ? `${rate} Bs` : 'ERR'}
          </span>
        </div>
        {result ? (
          <div className={`font-mono text-2xl sm:text-3xl lg:text-4xl font-black break-all ${amountClass}`}>
            {result}
          </div>
        ) : (
          <div className="h-9 sm:h-11 w-3/4 bg-white/20 animate-pulse"></div>
        )}
      </div>

      <button
        onClick={() => result && onCopy(id, `${label}: ${result}`)}
        disabled={!result}
        className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-black hover:bg-white text-white hover:text-black border-4 border-white font-black text-sm uppercase transition-colors disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 text-brutal-green" />
            <span className="text-brutal-green">¡COPIADO!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>COPIAR</span>
          </>
        )}
      </button>
    </div>
  );
};

export const ConverterTerminal: React.FC<ConverterTerminalProps> = ({
  bcvRate,
  eurRate,
  binanceRate,
}) => {
  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcDirection, setCalcDirection] = useState<'usdToVes' | 'vesToUsd'>('usdToVes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBs = (rate: number) =>
    `${(calcAmount * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
  const formatDivisa = (rate: number, symbol: string) =>
    `${symbol}${(calcAmount / rate).toFixed(2)}`;

  const resultFor = (rate: number | null | undefined, symbol = '$') =>
    rate ? (calcDirection === 'usdToVes' ? formatBs(rate) : formatDivisa(rate, symbol)) : null;

  return (
    <div
      id="calculadora"
      className="p-5 sm:p-12 bg-black border-8 border-black text-white relative shadow-brutal-lg"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white bg-white">
          <ResultBox
            id="bcv"
            label="BCV OFICIAL"
            dotColor="bg-brutal-blue"
            badgeClass="text-brutal-blue bg-white"
            amountClass="text-white"
            rate={bcvRate}
            result={resultFor(bcvRate)}
            copiedId={copiedId}
            onCopy={handleCopy}
          />
          <ResultBox
            id="euro"
            label="EURO"
            dotColor="bg-brutal-red"
            badgeClass="text-white bg-brutal-red"
            amountClass="text-brutal-red"
            rate={eurRate}
            result={resultFor(eurRate, '€')}
            copiedId={copiedId}
            onCopy={handleCopy}
          />
          <ResultBox
            id="binance"
            label="BINANCE P2P"
            dotColor="bg-brutal-yellow"
            badgeClass="text-black bg-brutal-yellow"
            amountClass="text-brutal-yellow"
            rate={binanceRate}
            result={resultFor(binanceRate)}
            copiedId={copiedId}
            onCopy={handleCopy}
          />
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
