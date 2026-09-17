/**
 * Vercel Serverless Function — same-origin proxy for Binance P2P.
 * The browser cannot call p2p.binance.com directly (no CORS headers),
 * so we replicate ace.py's methodology server-side: average price of
 * the top 10 USDT/VES sell offers.
 */

const BINANCE_P2P_URL =
  'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';

const PAYLOAD = {
  asset: 'USDT',
  fiat: 'VES',
  merchantCheck: false,
  page: 1,
  payTypes: [],
  publisherType: null,
  rows: 10,
  tradeType: 'SELL',
};

export default async function handler(_req: any, res: any) {
  try {
    const response = await fetch(BINANCE_P2P_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(PAYLOAD),
      signal: AbortSignal.timeout(8000),
    });

    const data = await response.json();

    if (data?.code === '000000' && Array.isArray(data?.data)) {
      const prices = data.data
        .map((item: any) => parseFloat(item?.adv?.price))
        .filter((p: number) => Number.isFinite(p));

      if (prices.length > 0) {
        const rate = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({
          rate: Number(rate.toFixed(2)),
          count: prices.length,
          source: 'binance-p2p-top10',
        });
      }
    }

    return res.status(502).json({ error: 'Binance returned no usable offers' });
  } catch {
    return res.status(502).json({ error: 'Binance upstream request failed' });
  }
}
