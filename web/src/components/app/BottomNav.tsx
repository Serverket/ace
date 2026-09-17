import React, { useState } from 'react';
import { TrendingUp, Calculator, Download, Check, RefreshCw } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import InstallSheet from './InstallSheet';

export type AppTab = 'pizarra' | 'conversor';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  { id: 'pizarra', label: 'PIZARRA', icon: <TrendingUp className="w-6 h-6" /> },
  { id: 'conversor', label: 'CONVERSOR', icon: <Calculator className="w-6 h-6" /> },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isInstalled, isIOS, requestInstall } = usePwaInstall();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isInstalled || installing) return;
    setInstalling(true);
    try {
      const result = await requestInstall();
      if (result === 'ios-fallback' || result === 'unavailable') {
        setSheetOpen(true);
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 inset-x-0 z-50 bg-white border-t-4 border-black pb-[env(safe-area-inset-bottom)]"
      >
        <div className="relative flex items-stretch">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                aria-pressed={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 font-black text-xs uppercase transition-colors ${
                  isActive
                    ? 'bg-black text-brutal-yellow'
                    : 'bg-white text-black hover:bg-brutal-yellow'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Elevated Install FAB */}
          <div className="relative w-24 shrink-0 flex items-start justify-center">
            <button
              onClick={handleInstallClick}
              disabled={isInstalled || installing}
              aria-label={isInstalled ? 'ACE ya está instalada' : 'Instalar ACE'}
              className={`absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-black flex flex-col items-center justify-center font-black uppercase shadow-brutal transition-all ${
                isInstalled
                  ? 'bg-brutal-green text-black'
                  : 'bg-brutal-blue text-white hover:translate-y-1 hover:shadow-none'
              } ${installing ? 'opacity-80' : ''}`}
            >
              {isInstalled ? (
                <Check className="w-7 h-7" />
              ) : installing ? (
                <RefreshCw className="w-7 h-7 animate-spin" />
              ) : (
                <Download className="w-7 h-7" />
              )}
              <span className="text-[9px] leading-none mt-1">
                {isInstalled ? 'LISTA' : 'INSTALAR'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <InstallSheet isOpen={sheetOpen} isIOS={isIOS} onClose={() => setSheetOpen(false)} />
    </>
  );
};

export default BottomNav;
