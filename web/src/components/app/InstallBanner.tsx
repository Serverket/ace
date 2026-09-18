import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { shouldShowInstall, snoozeInstall, dismissInstallPermanently } from '../../lib/pwaDismiss';
import InstallSheet from './InstallSheet';

const ENGAGEMENT_DELAY_MS = 30_000;

/**
 * Smart install banner. Shown only when: not standalone, not installed,
 * not dismissed (snooze/permanent policy), after 30s of engagement, and
 * the platform can actually install (beforeinstallprompt or iOS Safari).
 */
export const InstallBanner: React.FC = () => {
  const isAppMode = useAppMode();
  const { canInstall, isInstalled, isIOS, requestInstall } = usePwaInstall();
  const [engaged, setEngaged] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEngaged(true), ENGAGEMENT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const eligible =
    engaged && !hidden && !isInstalled && shouldShowInstall() && (canInstall || isIOS);

  if (!eligible) return null;

  const handleInstall = async () => {
    const result = await requestInstall();
    if (result === 'ios-fallback') {
      setSheetOpen(true);
    } else {
      // 'prompted' or 'unavailable' — either way, stop nagging
      setHidden(true);
    }
  };

  const handleNotNow = () => {
    snoozeInstall();
    setHidden(true);
  };

  const handleNever = () => {
    dismissInstallPermanently();
    setHidden(true);
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    snoozeInstall();
    setHidden(true);
  };

  const bottomPos = isAppMode
    ? 'bottom-[calc(6rem+env(safe-area-inset-bottom))]'
    : 'bottom-4';

  return (
    <>
      <div className={`fixed inset-x-0 ${bottomPos} z-[60] flex justify-center px-4`}>
        <div className="w-full max-w-md bg-brutal-yellow border-4 border-black shadow-brutal-lg animate-slide-up">
          {/* Header: brand + quick dismiss */}
          <div className="flex items-start justify-between gap-3 p-4 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 border-2 border-black bg-white shadow-brutal-sm flex items-center justify-center p-1">
                <img src="/logo.svg" alt="ACE" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-black text-black uppercase leading-tight">
                  INSTALA ACE
                </p>
                <p className="text-xs font-bold text-black uppercase">
                  La pizarra como app nativa, sin browser
                </p>
              </div>
            </div>
            <button
              onClick={handleNotNow}
              aria-label="Ahora no"
              className="p-1.5 border-2 border-black bg-white text-black shadow-brutal-sm hover:bg-black hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="p-4 flex flex-col gap-3">
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brutal-blue border-4 border-black text-white font-black uppercase shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Download className="w-5 h-5" />
              <span>INSTALAR APP</span>
            </button>
            <div className="flex items-center justify-between text-xs font-black uppercase">
              <button
                onClick={handleNotNow}
                className="px-2 py-1 text-black hover:bg-black hover:text-white transition-colors border-b-2 border-black"
              >
                AHORA NO
              </button>
              <button
                onClick={handleNever}
                className="px-2 py-1 text-black/60 hover:bg-brutal-red hover:text-white transition-colors border-b-2 border-transparent"
              >
                NO VOLVER A PREGUNTAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstallSheet isOpen={sheetOpen} isIOS={isIOS} onClose={handleSheetClose} />
    </>
  );
};

export default InstallBanner;
