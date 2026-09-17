import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { useAppMode } from '../hooks/useAppMode';
import { usePwaInstall } from '../hooks/usePwaInstall';
import InstallSheet from './app/InstallSheet';

interface DownloadButtonProps {
  variant: 'header' | 'hero';
}

const VARIANT_CLASSES = {
  header:
    'hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-brutal-blue border-2 border-black text-white text-sm font-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase',
  hero:
    'flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-brutal-blue border-4 border-black text-white font-black text-xl shadow-brutal-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase',
};

const VARIANT_ICON_SIZES = {
  header: 'w-4 h-4',
  hero: 'w-6 h-6',
};

const VARIANT_LABELS = {
  header: 'DESCARGAR',
  hero: 'DESCARGAR AHORA',
};

/**
 * Desktop: links to GitHub Releases (native widget binaries).
 * App mode (mobile viewport / installed PWA): triggers the PWA install
 * prompt directly, with an instructions sheet as iOS/generic fallback.
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({ variant }) => {
  const isAppMode = useAppMode();
  const { isInstalled, isIOS, requestInstall } = usePwaInstall();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Desktop -> GitHub Releases for the native tray widget
  if (!isAppMode) {
    return (
      <a
        href="https://github.com/Serverket/ace/releases"
        target="_blank"
        rel="noreferrer"
        className={VARIANT_CLASSES[variant]}
      >
        <Download className={VARIANT_ICON_SIZES[variant]} />
        <span>{VARIANT_LABELS[variant]}</span>
      </a>
    );
  }

  const handleInstallClick = async () => {
    const result = await requestInstall();
    if (result === 'ios-fallback' || result === 'unavailable') {
      setSheetOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={isInstalled}
        className={`${VARIANT_CLASSES[variant]} ${isInstalled ? '!bg-brutal-green !text-black' : ''}`}
      >
        {isInstalled ? (
          <>
            <CheckCircle2 className={VARIANT_ICON_SIZES[variant]} />
            <span>INSTALADA</span>
          </>
        ) : (
          <>
            <Download className={VARIANT_ICON_SIZES[variant]} />
            <span>INSTALAR APP</span>
          </>
        )}
      </button>
      <InstallSheet isOpen={sheetOpen} isIOS={isIOS} onClose={() => setSheetOpen(false)} />
    </>
  );
};

export default DownloadButton;
