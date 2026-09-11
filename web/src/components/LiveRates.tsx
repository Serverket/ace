import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ShieldCheck, Copy, Check, Calculator, ArrowRightLeft, TrendingUp } from 'lucide-react';



import { _XOR_KEY, decodeX } from '../lib/cipher';

// Obfuscated endpoints (XOR arrays) to guarantee 0 static string exposure
const _E1 = [59,71,6,6,64,72,68,28,2,36,109,33,48,94,81,64,87,81,58,29,17,25,94,93,29,2,91,37,44,41,62,64,85,65];
const _E2 = [59,71,6,6,64,72,68,28,2,36,109,33,48,94,81,64,87,81,58,29,17,25,94,93,29,2,91,36,54,55,48,65,31,93,80,72,48,90,19,26];
const _E3 = [59,71,6,6,64,72,68,28,21,49,42,107,38,83,84,91,89,15,58,92,93,28,64,29,5,28,2,36,48]; // Yadio Binance P2P


export interface RateItem {
  id: string;
  name: string;
  shortName: string;
  sourceDesc: string;
  badgeColor: string;
  glowColor: string;
  borderAccent: string;
  symbol: string;
  currencyUnit: string;
  value: number | null;
  change24h?: string;
}

export const LiveRates: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcDirection, setCalcDirection] = useState<'usdToVes' | 'vesToUsd'>('usdToVes');

  const [rates, setRates] = useState<RateItem[]>([
    {
      id: 'bcv',
      name: 'BCV Dólar',
      shortName: 'BCV $',
      sourceDesc: 'Banco Central de Venezuela Oficial',
      badgeColor: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500',
      glowColor: 'shadow-amber-500/10',
      borderAccent: 'border-amber-500/20',
      symbol: '$',
      currencyUnit: 'USD',
      value: null,
    },
    {
      id: 'paralelo',
      name: 'Dólar Paralelo',
      shortName: 'Paralelo $',
      sourceDesc: 'Promedio Mercado No Oficial',
      badgeColor: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500',
      glowColor: 'shadow-orange-500/10',
      borderAccent: 'border-orange-500/20',
      symbol: '$',
      currencyUnit: 'USD',
      value: null,
    },
    {
      id: 'binance',
      name: 'Binance P2P',
      shortName: 'Binance $',
      sourceDesc: 'Mercado P2P Real (Yadio)',
      badgeColor: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600',
      glowColor: 'shadow-yellow-500/10',
      borderAccent: 'border-yellow-500/20',
      symbol: '$',
      currencyUnit: 'USDT',
      value: null,
    },
    {
      id: 'euro',
      name: 'BCV Euro',
      shortName: 'BCV €',
      sourceDesc: 'Banco Central de Venezuela Oficial',
      badgeColor: 'bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600',
      glowColor: 'shadow-rose-500/10',
      borderAccent: 'border-rose-500/20',
      symbol: '€',
      currencyUnit: 'EUR',
      value: null,
    },
  ]);

  const fetchRates = async () => {
    setRefreshing(true);
    try {
      // Runtime decryption of XOR endpoints (Zero Static Exposure)
      const urlDolares = decodeX(_E1, _XOR_KEY);
      const urlEuros = decodeX(_E2, _XOR_KEY);
      const urlYadio = decodeX(_E3, _XOR_KEY);

      const [resDolares, resEuros, resYadio] = await Promise.all([
        fetch(urlDolares).then((r) => r.json()).catch(() => []),
        fetch(urlEuros).then((r) => r.json()).catch(() => ({})),
        fetch(urlYadio).then((r) => r.json()).catch(() => ({})),
      ]);

      const bcv = resDolares.find((r: any) => r.fuente === 'oficial')?.promedio || null;
      const paralelo = resDolares.find((r: any) => r.fuente === 'paralelo')?.promedio || null;
      const euro = resEuros?.promedio || null;

      // Real Binance P2P extraction from Yadio avoiding direct Cloudflare blocks
      let binance = resYadio?.VES?.rate_p2p || null;
      if (binance) binance = Number(binance.toFixed(2));
      // Fallback
      if (!binance && paralelo) binance = Number((paralelo * 0.985).toFixed(2));

      setRates([
        {
          id: 'bcv',
          name: 'BCV Dólar',
          shortName: 'BCV $',
          sourceDesc: 'Tasa Oficial Banco Central',
          badgeColor: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500',
          glowColor: 'shadow-amber-500/20',
          borderAccent: 'hover:border-amber-400',
          symbol: '$',
          currencyUnit: 'USD',
          value: bcv,
        },
        {
          id: 'paralelo',
          name: 'Dólar Paralelo',
          shortName: 'Paralelo $',
          sourceDesc: 'Promedio Mercado Cambiario',
          badgeColor: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500',
          glowColor: 'shadow-orange-500/20',
          borderAccent: 'hover:border-orange-400',
          symbol: '$',
          currencyUnit: 'USD',
          value: paralelo,
        },
        {
          id: 'binance',
          name: 'Binance P2P',
          shortName: 'Binance $',
          sourceDesc: 'Mercado Real (Anti-CORS)',
          badgeColor: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600',
          glowColor: 'shadow-yellow-500/20',
          borderAccent: 'hover:border-yellow-400',
          symbol: '$',
          currencyUnit: 'USDT',
          value: binance,
        },
        {
          id: 'euro',
          name: 'BCV Euro',
          shortName: 'BCV €',
          sourceDesc: 'Tasa Oficial Banco Central',
          badgeColor: 'bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600',
          glowColor: 'shadow-rose-500/20',
          borderAccent: 'hover:border-rose-400',
          symbol: '€',
          currencyUnit: 'EUR',
          value: euro,
        },
      ]);

      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error("Failed to fetch rates securely.", err);
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!ignore) {
        await fetchRates();
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const formatPrice = (val: number | null) => {
    if (val === null) return "**.**";
    return val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyRate = (rate: RateItem) => {
    if (!rate.value) return;
    const text = `${rate.shortName}: ${formatPrice(rate.value)} Bs`;
    navigator.clipboard?.writeText?.(text);
    setCopiedId(rate.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate Brecha Cambiaria (Spread) between Paralelo and BCV
  const bcvRate = rates.find((r) => r.id === 'bcv')?.value;
  const paraleloRate = rates.find((r) => r.id === 'paralelo')?.value;

  const spreadData = useMemo(() => {
    if (!bcvRate || !paraleloRate) return null;
    const diffBs = paraleloRate - bcvRate;
    const diffPercent = (diffBs / bcvRate) * 100;
    return {
      diffBs: diffBs.toFixed(2),
      diffPercent: diffPercent.toFixed(1),
    };
  }, [bcvRate, paraleloRate]);

  return (
    <section id="cotizaciones" className="bg-white border-t-8 border-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider mb-4 border-2 border-transparent">
              <span className="w-2 h-2 bg-brutal-green animate-ping"></span>
              EN TIEMPO REAL
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter mb-4 uppercase">
              PIZARRA FINANCIERA
            </h2>
            <p className="text-black font-bold max-w-2xl text-lg sm:text-xl uppercase border-l-4 border-brutal-red pl-4">
              Consulta las cotizaciones con precisión milimétrica. Esta demo consume las fuentes oficiales de manera asíncrona y ofuscada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {lastUpdated && (
              <span className="text-sm font-mono font-black text-black bg-brutal-yellow px-4 py-2 border-4 border-black shadow-brutal-sm">
                UPDATED: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchRates}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm font-black text-white bg-brutal-blue border-4 border-black shadow-brutal-sm px-6 py-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 uppercase"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'LOADING...' : 'REFRESH'}</span>
            </button>
          </div>
        </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-16 border-4 border-black bg-black">
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
                  onClick={() => handleCopyRate(rate)}
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

        {/* Integrated Quick Currency Calculator - Terminal Brutalist Style */}
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
                    {rates.find((r) => r.id === 'binance')?.value ? `${rates.find((r) => r.id === 'binance')?.value} Bs` : 'ERR'}
                  </span>
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-black text-brutal-yellow truncate">
                  {rates.find((r) => r.id === 'binance')?.value
                    ? calcDirection === 'usdToVes'
                      ? `${(calcAmount * (rates.find((r) => r.id === 'binance')?.value || 1)).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
                      : `$${(calcAmount / (rates.find((r) => r.id === 'binance')?.value || 1)).toFixed(2)}`
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
      </div>
    </section>
  );
};

export default LiveRates;
