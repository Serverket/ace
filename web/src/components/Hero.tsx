import { Download, Terminal, Shield, Zap, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';

export const Hero = () => {
  return (
    <>
      {/* Top Floating Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-subtle-card">
          <BrandLogo size="sm" />

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#cotizaciones" className="hover:text-blue-600 transition-colors">
              Pizarra en Vivo
            </a>
            <a href="#calculadora" className="hover:text-blue-600 transition-colors">
              Calculadora
            </a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Mercado Activo</span>
            </div>

            <a
              href="https://github.com/Serverket/ace"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              title="Ver código fuente en GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            <a
              href="https://github.com/Serverket/ace/releases"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10 hover:shadow-amber-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar {__APP_VERSION__}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Body */}
      <section className="relative pt-36 sm:pt-44 pb-20 overflow-hidden">
        {/* Animated Ambient Golden Glow Spheres */}
        <motion.div 
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-yellow-400/20 via-amber-300/15 to-orange-400/15 blur-3xl -z-10 rounded-full pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Currency Symbols (Golden Identity) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.div
            className="absolute left-[15%] top-[30%] text-6xl text-amber-500/15 font-black blur-[2px]"
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >$</motion.div>
          <motion.div
            className="absolute right-[20%] top-[25%] text-7xl text-yellow-500/15 font-black blur-[3px]"
            animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >Bs</motion.div>
          <motion.div
            className="absolute right-[10%] bottom-[20%] text-5xl text-orange-500/15 font-black blur-[1px]"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >€</motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-sm mb-8 hover:border-blue-300 transition-all cursor-default">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-[10px] text-white font-black">
              ★
            </span>
            <span className="text-slate-500">Nueva versión:</span>
            <span className="text-amber-600 font-bold">ACE {__APP_VERSION__}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Nativo & Sin Telemetría
            </span>
          </div>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.12]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            El Monitor Cambiario Definitivo <br className="hidden sm:inline" />
            <motion.span 
              className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto]"
              animate={{ backgroundPosition: ['0%', '200%', '0%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              en tu Barra de Tareas
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Visualiza en tiempo real las cotizaciones de <strong className="text-slate-900 font-semibold">BCV Oficial</strong>, <strong className="text-slate-900 font-semibold">Paralelo</strong> y <strong className="text-slate-900 font-semibold">Binance P2P</strong> directamente integrado en Windows, macOS y GNU/Linux.
          </motion.p>

          {/* Core Feature Badges Strip */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>&lt; 15 MB de RAM</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Sin Rastreos ni Telemetría</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Precio Siempre Visible en Píxeles</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>AppImage, PowerShell & Mac</span>
            </div>
          </motion.div>

          {/* Main Action CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/Serverket/ace/releases"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Gratis {__APP_VERSION__}</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#cotizaciones"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all hover:-translate-y-0.5"
            >
              <span>Ver Pizarra en Vivo</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
