// BCV weekend rule: from Saturday 00:00 to Monday 00:00 (America/Caracas)
// the displayed BCV rate is the one effective for Monday. Binance trades
// 24/7 so it never gets the tag.

const VET_TZ = 'America/Caracas';

function vetNow(): Date {
  // Reinterpret the instant in Caracas civil time (UTC-4, no DST)
  return new Date(new Date().toLocaleString('en-US', { timeZone: VET_TZ }));
}

export function isBcvWeekend(now: Date = vetNow()): boolean {
  const day = now.getDay();
  return day === 6 || day === 0; // Saturday or Sunday in VET
}

export function nextMondayVet(now: Date = vetNow()): string {
  const day = now.getDay();
  const ahead = day === 6 ? 2 : day === 0 ? 1 : (8 - day) % 7 || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + ahead);
  const dd = String(monday.getDate()).padStart(2, '0');
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

// Short tag for UI badges, e.g. "LUNES 21/09" — null outside the window
export function bcvWeekendTag(): string | null {
  const now = vetNow();
  return isBcvWeekend(now) ? `LUNES ${nextMondayVet(now)}` : null;
}
