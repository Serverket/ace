// "Already-clicked" dismissal policy for the install banner.
// Snooze hides the banner for 7 days; permanent suppresses it forever
// (set on explicit opt-out, successful install, or appinstalled event).

const DISMISS_KEY = 'ace-pwa-install-dismissed';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

interface DismissRecord {
  permanent?: boolean;
  until?: number;
}

function getDismissRecord(): DismissRecord {
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function shouldShowInstall(): boolean {
  const record = getDismissRecord();
  if (record.permanent === true) return false;
  if (record.until && Date.now() < record.until) return false;
  return true;
}

function setDismissRecord(record: DismissRecord): void {
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode, quota) — dismiss only for this session
  }
}

export function snoozeInstall(): void {
  setDismissRecord({ until: Date.now() + SNOOZE_MS });
}

export function dismissInstallPermanently(): void {
  setDismissRecord({ permanent: true });
}
