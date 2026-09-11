import Hero from './components/Hero';
import LiveRates from './components/LiveRates';
import BrandLogo from './components/BrandLogo';
import { LegalModal } from './components/LegalModals';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'tos' | null>(null);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        <Hero />
        <div className="h-4 bg-black border-y-4 border-black w-full" />
        <LiveRates />
      </main>

      {/* High-Craft Premium Footer -> Brutalist Footer */}
      <footer className="bg-brutal-yellow border-t-8 border-black py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b-4 border-black">
            {/* Brand Logo & Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <BrandLogo size="md" />
              <p className="mt-4 text-lg font-bold text-black max-w-sm leading-snug border-l-4 border-black pl-4">
                WIDGET DE BANDEJA NATIVO, LIGERO Y DE CÓDIGO ABIERTO. MONITOREO EN TIEMPO REAL.
              </p>
            </div>

            {/* Quick Links & GitHub */}
            <div className="flex flex-col items-end justify-center gap-4 text-xl font-black text-black">
              <a href="#cotizaciones" className="hover:bg-black hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-black">
                COTIZACIONES
              </a>
              <a href="#calculadora" className="hover:bg-black hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-black">
                CALCULADORA
              </a>
              <a
                href="https://github.com/Serverket/ace"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-black hover:bg-black hover:text-white px-2 py-1 transition-colors border-2 border-black bg-white shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GITHUB</span>
              </a>
            </div>
          </div>

          {/* Bottom attribution & Stonehenge Serverket link */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold text-black text-center sm:text-left">
            <p className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-white px-4 py-2 border-2 border-black shadow-brutal-sm">
              <span>HECHO CON</span>
              <span className="text-xl" role="img" aria-label="Stonehenge">🗿</span>
              <span>POR</span>
              <a
                href="https://serverket.dev"
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white px-2 hover:bg-brutal-red transition-colors"
              >
                SERVERKET
              </a>
              <span>/ GPLV3</span>
              <button onClick={() => setLegalModalType('tos')} className="hover:bg-black hover:text-white px-1 transition-colors border-b-2 border-black">TÉRMINOS</button>
              <button onClick={() => setLegalModalType('privacy')} className="hover:bg-black hover:text-white px-1 transition-colors border-b-2 border-black">PRIVACIDAD</button>
            </p>

            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black font-mono">
              <ShieldCheck className="w-5 h-5 text-brutal-green" />
              <span>ANTI-SCRAPING ACTIVO</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Legal Modals */}
      <LegalModal 
        isOpen={legalModalType !== null} 
        type={legalModalType} 
        onClose={() => setLegalModalType(null)} 
      />
    </div>
  );
}

export default App;
