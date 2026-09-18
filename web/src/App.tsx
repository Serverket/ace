import SiteHeader from './components/SiteHeader';
import HeroSection from './components/Hero';
import LiveRates from './components/LiveRates';
import SiteFooter from './components/SiteFooter';
import { LegalModal } from './components/LegalModals';
import MobileApp from './components/app/MobileApp';
import InstallBanner from './components/app/InstallBanner';
import UpdateBanner from './components/UpdateBanner';
import { useAppMode } from './hooks/useAppMode';
import { useState } from 'react';

function App() {
  const isAppMode = useAppMode();
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'tos' | null>(null);

  return (
    <>
      {isAppMode ? (
        // Mobile viewport / installed PWA -> app experience with bottom nav
        <MobileApp />
      ) : (
        // Desktop -> full marketing landing
        <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
          {/* Main Content Sections */}
          <main className="flex-1 flex flex-col">
            <SiteHeader />
            <HeroSection />
            <div className="h-4 bg-black border-y-4 border-black w-full" />
            <LiveRates />
          </main>

          {/* High-Craft Premium Footer -> Brutalist Footer */}
          <SiteFooter onLegal={setLegalModalType} />

          {/* Legal Modals */}
          <LegalModal
            isOpen={legalModalType !== null}
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />
        </div>
      )}

      {/* PWA chrome — shared across both modes */}
      <InstallBanner />
      <UpdateBanner />
    </>
  );
}

export default App;
