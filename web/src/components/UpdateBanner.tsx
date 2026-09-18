import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';

interface ReleaseInfo {
  version?: string;
  note?: string;
}

/**
 * Update banner: fires when the new service worker is waiting
 * (registerType: 'prompt'). Brutalist styling per project palette.
 */
export const UpdateBanner: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    if (!needRefresh) return;
    fetch('/release-info.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRelease(data))
      .catch(() => setRelease(null));
  }, [needRefresh]);

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-[70] flex justify-center px-4">
      <div className="w-full max-w-md bg-black text-white border-4 border-brutal-yellow shadow-brutal-lg animate-slide-up flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Sparkles className="w-6 h-6 text-brutal-yellow shrink-0" />
          <div className="min-w-0">
            <p className="font-black uppercase leading-tight">
              NUEVA VERSIÓN DISPONIBLE
            </p>
            {(release?.version || release?.note) && (
              <p className="text-xs font-bold text-brutal-yellow uppercase truncate">
                {release.version ? `${release.version}` : ''}
                {release.version && release.note ? ' — ' : ''}
                {release.note || ''}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-brutal-yellow border-2 border-brutal-yellow text-black text-xs font-black uppercase hover:bg-white hover:border-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ACTUALIZAR</span>
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            aria-label="Cerrar"
            className="p-2 border-2 border-white/40 text-white/60 hover:bg-brutal-red hover:text-white hover:border-brutal-red transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;
