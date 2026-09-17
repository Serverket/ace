import { useState, useEffect, useMemo } from 'react';
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

const INITIAL_RATES: RateItem[] = [
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
    sourceDesc: 'Promedio Top 10 USDT/VES',
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
];

export function useRates() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rates, setRates] = useState<RateItem[]>(INITIAL_RATES);

  const fetchRates = async () => {
    setRefreshing(true);
    try {
      // Runtime decryption of XOR endpoints (Zero Static Exposure)
      const urlDolares = decodeX(_E1, _XOR_KEY);
      const urlEuros = decodeX(_E2, _XOR_KEY);
      const urlYadio = decodeX(_E3, _XOR_KEY);

      const [resDolares, resEuros, resYadio, resBinance] = await Promise.all([
        fetch(urlDolares).then((r) => r.json()).catch(() => []),
        fetch(urlEuros).then((r) => r.json()).catch(() => ({})),
        fetch(urlYadio).then((r) => r.json()).catch(() => ({})),
        // Same-origin serverless proxy: real top-10 USDT/VES sell average.
        // Browser can't call p2p.binance.com directly (no CORS headers).
        fetch('/api/binance', { signal: AbortSignal.timeout(8000) })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      const bcv = resDolares.find((r: any) => r.fuente === 'oficial')?.promedio || null;
      const paralelo = resDolares.find((r: any) => r.fuente === 'paralelo')?.promedio || null;
      const euro = resEuros?.promedio || null;

      // Priority: our Binance proxy (top-10 avg, same as ace.py) -> Yadio -> paralelo estimate
      let binance = resBinance?.rate || resYadio?.VES?.rate_p2p || null;
      if (binance) binance = Number(binance.toFixed(2));
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
          sourceDesc: 'Promedio Top 10 Sell P2P',
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
  const binanceRate = rates.find((r) => r.id === 'binance')?.value;

  const spreadData = useMemo(() => {
    if (!bcvRate || !paraleloRate) return null;
    const diffBs = paraleloRate - bcvRate;
    const diffPercent = (diffBs / bcvRate) * 100;
    return {
      diffBs: diffBs.toFixed(2),
      diffPercent: diffPercent.toFixed(1),
    };
  }, [bcvRate, paraleloRate]);

  return {
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
  };
}
