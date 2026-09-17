import { Terminal, Shield, Zap, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface HeroSectionProps {
  // In app mode the rates board lives behind a bottom-nav tab above the
  // landing — the CTA switches to it instead of pointing at a dead anchor
  onAppCta?: () => void;
}

export const HeroSection = ({ onAppCta }: HeroSectionProps) => {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden bg-brutal-yellow">

      {/* Typographic background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center font-mono opacity-20">
        <div className="text-[20rem] font-black leading-none tracking-tighter mix-blend-overlay">ACE</div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10 border-4 border-black bg-white p-8 sm:p-16 shadow-brutal-lg">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-black uppercase mb-8 shadow-brutal border-2 border-white">
          <span className="text-brutal-yellow">{__APP_VERSION__}</span>
          <span>|</span>
          <span className="flex items-center gap-1 text-brutal-green">
            <CheckCircle2 className="w-4 h-4" /> 100% NATIVO
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-black mb-8 leading-[1.0] uppercase">
          EL MONITOR CAMBIARIO <br />
          <span className="bg-brutal-red text-white px-2">DEFINITIVO</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-3xl text-black max-w-3xl mx-auto mb-10 font-bold uppercase border-l-8 border-brutal-blue pl-4 text-left">
          Visualiza en tiempo real las cotizaciones de BCV Oficial, Paralelo y Binance P2P directamente integrado en Windows, macOS y GNU/Linux.
        </p>

        {/* Core Feature Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black shadow-brutal text-sm font-black uppercase">
            <Zap className="w-5 h-5 text-brutal-red" />
            <span>&lt; 15 MB RAM</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black shadow-brutal text-sm font-black uppercase">
            <Shield className="w-5 h-5 text-brutal-blue" />
            <span>SIN TELEMETRÍA</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black shadow-brutal text-sm font-black uppercase">
            <Sparkles className="w-5 h-5 text-brutal-yellow" />
            <span>SIEMPRE VISIBLE</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black shadow-brutal text-sm font-black uppercase">
            <Terminal className="w-5 h-5 text-brutal-green" />
            <span>MULTI-PLATAFORMA</span>
          </div>
        </div>

        {/* Main Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 max-w-2xl mx-auto">
          <DownloadButton variant="hero" />

          {onAppCta ? (
            <button
              onClick={onAppCta}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white border-4 border-black text-black font-black text-xl shadow-brutal-lg hover:bg-black hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase"
            >
              <span>IR A LA PIZARRA</span>
              <ChevronUp className="w-6 h-6" />
            </button>
          ) : (
            <a
              href="#cotizaciones"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white border-4 border-black text-black font-black text-xl shadow-brutal-lg hover:bg-black hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase"
            >
              <span>VER PIZARRA</span>
              <ChevronDown className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
