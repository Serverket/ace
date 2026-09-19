import { useCallback, useSyncExternalStore } from 'react';
import { dismissInstallPermanently } from '../lib/pwaDismiss';

// Not yet in lib.dom — Chromium fires this when the PWA is installable
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type InstallResult = 'prompted' | 'ios-fallback' | 'unavailable';

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (navigator as any).standalone === true
  );
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as MacIntel — disambiguate via touch points
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

// Shared module-level store: beforeinstallprompt is a single window-level
// event, so every hook instance (FAB, hero CTA, header) must observe the
// same deferred prompt — otherwise one consumer leaves the others stale.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = detectStandalone();
const isIOS = detectIOS();
const listeners = new Set<() => void>();
let globalListenersAttached = false;

function notify() {
  listeners.forEach((l) => l());
}

function attachGlobalListeners() {
  if (globalListenersAttached || typeof window === 'undefined') return;
  globalListenersAttached = true;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    dismissInstallPermanently();
    notify();
  });
}

function subscribe(callback: () => void) {
  attachGlobalListeners();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function usePwaInstall() {
  const canInstall = useSyncExternalStore(
    subscribe,
    () => deferredPrompt !== null,
    () => false,
  );
  const isInstalled = useSyncExternalStore(
    subscribe,
    () => installed,
    () => detectStandalone(),
  );

  const requestInstall = useCallback(async (): Promise<InstallResult> => {
    if (installed) return 'unavailable';
    const promptEvent = deferredPrompt;
    if (promptEvent) {
      // The event is single-use: release it regardless of the outcome
      deferredPrompt = null;
      notify();
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') dismissInstallPermanently();
      } catch {
        // NotAllowedError et al. — fall through to the instructions sheet
        return isIOS ? 'ios-fallback' : 'unavailable';
      }
      return 'prompted';
    }
    return isIOS ? 'ios-fallback' : 'unavailable';
  }, []);

  return {
    canInstall,
    isInstalled,
    isIOS,
    requestInstall,
  };
}
