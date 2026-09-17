import { useSyncExternalStore } from 'react';

const STANDALONE_QUERIES = [
  '(display-mode: standalone)',
  '(display-mode: window-controls-overlay)',
  '(display-mode: minimal-ui)',
];

const MOBILE_QUERY = '(max-width: 767px)';

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
}

function matchesStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS Safari legacy flag
  if ((navigator as any).standalone === true) return true;
  return STANDALONE_QUERIES.some((q) => window.matchMedia(q).matches);
}

/**
 * App mode = installed PWA (standalone) OR mobile viewport.
 * Desktop browsers always get the landing experience.
 */
export function useAppMode(): boolean {
  const isStandalone = useSyncExternalStore(
    (callback) => {
      const unsubs = STANDALONE_QUERIES.map((q) => subscribeMedia(q)(callback));
      // iOS fires no media events for navigator.standalone, but it is set at load time
      return () => unsubs.forEach((u) => u());
    },
    matchesStandalone,
    () => false,
  );

  const isMobile = useSyncExternalStore(
    subscribeMedia(MOBILE_QUERY),
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );

  return isStandalone || isMobile;
}
