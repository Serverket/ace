import { Download, Terminal, Shield, Zap, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import BrandLogo from './BrandLogo';

export const Hero = () => {
  return (
    <>
      {/* Brutalist Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="sm" />

          <nav className="hidden md:flex items-center gap-6 font-black text-black">
            <a href="#cotizaciones" className="hover:bg-brutal-yellow px-2 py-1 border-2 border-transparent hover:border-black transition-none">
              PIZARRA
            </a>
            <a href="#calculadora" className="hover:bg-brutal-yellow px-2 py-1 border-2 border-transparent hover:border-black transition-none">
              CALCULADORA
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-brutal-green border-2 border-black text-black font-black text-xs uppercase shadow-brutal-sm">
              <span className="w-2 h-2 bg-black animate-pulse"></span>
              Mercado Activo
            </div>

            <a
              href="https://github.com/Serverket/ace"
              target="_blank"
              rel="noreferrer"
              className="p-2 border-2 border-black bg-white shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            <a
              href="https://github.com/Serverket/ace/releases"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-brutal-blue border-2 border-black text-white text-sm font-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              <Download className="w-4 h-4" />
              <span>DESCARGAR</span>
            </a>
          </div>
        </div>
      </header>

      {/* Brutalist Hero Body */}
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
            <a
              href="https://github.com/Serverket/ace/releases"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-brutal-blue border-4 border-black text-white font-black text-xl shadow-brutal-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase"
            >
              <Download className="w-6 h-6" />
              <span>DESCARGAR AHORA</span>
            </a>

            <a
              href="#cotizaciones"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white border-4 border-black text-black font-black text-xl shadow-brutal-lg hover:bg-black hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase"
            >
              <span>VER PIZARRA</span>
              <ChevronDown className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
