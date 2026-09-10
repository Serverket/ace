import { useState } from 'react';
import { Monitor, Apple, Terminal, MousePointerClick, RefreshCw, Copy, Check, Pin, BellRing } from 'lucide-react';

type OS = 'linux' | 'windows' | 'macos';
type SourceKey = 'bcv' | 'paralelo' | 'binance' | 'euro';

interface SourceRateInfo {
  label: string;
  name: string;
  priceStr: string;
  currency: string;
  bgColor: string;
  textColor: string;
  tag: string;
}

const SAMPLE_RATES: Record<SourceKey, SourceRateInfo> = {
  bcv: {
    label: 'BCV $',
    name: 'Banco Central de Venezuela (Dólar Oficial)',
    priceStr: '43,50',
    currency: 'Bs',
    bgColor: 'bg-[#0038a8]',
    textColor: 'text-blue-700',
    tag: 'OFICIAL'
  },
  paralelo: {
    label: 'Paralelo $',
    name: 'Promedio Mercado Paralelo',
    priceStr: '52,40',
    currency: 'Bs',
    bgColor: 'bg-[#059669]',
    textColor: 'text-emerald-700',
    tag: 'PARALELO'
  },
  binance: {
    label: 'Binance $',
    name: 'Binance P2P (Promedio Top 10)',
    priceStr: '51,80',
    currency: 'Bs',
    bgColor: 'bg-[#d97706]',
    textColor: 'text-amber-700',
    tag: 'P2P'
  },
  euro: {
    label: 'BCV €',
    name: 'Banco Central de Venezuela (Euro)',
    priceStr: '47,15',
    currency: 'Bs',
    bgColor: 'bg-[#4338ca]',
    textColor: 'text-indigo-700',
    tag: 'OFICIAL EUR'
  }
};

export const PlatformPreview: React.FC = () => {
  const [activeOS, setActiveOS] = useState<OS>('linux');
  const [selectedSource, setSelectedSource] = useState<SourceKey>('bcv');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const currentRate = SAMPLE_RATES[selectedSource];

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(`${currentRate.label}: ${currentRate.priceStr} ${currentRate.currency}`);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <section id="simulador" className="py-24 relative overflow-hidden bg-slate-50/70 border-y border-slate-200/80">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Simulador de Experiencia de Usuario
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Integración 100% Nativa en cada SO
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A diferencia de aplicaciones pesadas basadas en Electron, ACE utiliza las librerías nativas de cada sistema operativo. El precio está <strong className="text-slate-800">siempre visible</strong> en la barra de tareas sin tener que colocar el cursor encima.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 mb-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
          {/* OS Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveOS('linux')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeOS === 'linux'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4 text-orange-600" />
              <span>GNU/Linux (GNOME)</span>
            </button>

            <button
              onClick={() => setActiveOS('windows')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeOS === 'windows'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>Windows 11</span>
            </button>

            <button
              onClick={() => setActiveOS('macos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeOS === 'macos'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Apple className="w-4 h-4 text-slate-800" />
              <span>macOS</span>
            </button>
          </div>

          {/* Rate Selector for Preview */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-center flex-wrap">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Moneda fijada:</span>
            {(Object.keys(SAMPLE_RATES) as SourceKey[]).map((key) => {
              const item = SAMPLE_RATES[key];
              const isSelected = selectedSource === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSource(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.bgColor}`}></span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live System Tray Mockup Screen */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-300/80 bg-slate-950 shadow-2xl">
          {/* Header OS Identifier */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-mono text-slate-400">
                {activeOS === 'linux' && 'Ubuntu 24.04 LTS · AyatanaAppIndicator3'}
                {activeOS === 'windows' && 'Windows 11 Pro · Dynamic Pixel Tray'}
                {activeOS === 'macos' && 'macOS Sonoma · Menu Bar Status Item'}
              </span>
            </div>
            <button
              onClick={() => setShowContextMenu(!showContextMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
            >
              <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
              <span>{showContextMenu ? 'Ocultar Menú Contextual' : 'Simular Clic Derecho'}</span>
            </button>
          </div>

          {/* Simulated Workspace Wallpaper */}
          <div className="relative min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            {/* Context menu popup simulation if open */}
            {showContextMenu && (
              <div className="absolute z-30 top-14 right-8 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-1.5 text-slate-200 text-xs font-medium animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ACE Widget {__APP_VERSION__}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[11px] text-slate-400">Cotizaciones actuales:</div>
                  <div className="px-3 py-1 flex items-center justify-between hover:bg-slate-800/80 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0038a8]"></span>
                      BCV $
                    </span>
                    <span className="font-mono font-bold text-slate-100">43,50 Bs</span>
                  </div>
                  <div className="px-3 py-1 flex items-center justify-between hover:bg-slate-800/80 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                      Paralelo $
                    </span>
                    <span className="font-mono font-bold text-slate-100">52,40 Bs</span>
                  </div>
                  <div className="px-3 py-1 flex items-center justify-between hover:bg-slate-800/80 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
                      Binance $
                    </span>
                    <span className="font-mono font-bold text-slate-100">51,80 Bs</span>
                  </div>
                </div>

                <div className="h-px bg-slate-800 my-1"></div>

                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors text-left"
                >
                  {copiedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">¡Copiado al portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar {currentRate.label} al portapapeles</span>
                    </>
                  )}
                </button>

                <div className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 text-left cursor-pointer">
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fijar {currentRate.label} como favorito</span>
                </div>

                <div className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 text-left cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Actualizar ahora</span>
                </div>

                <div className="h-px bg-slate-800 my-1"></div>

                <div className="w-full flex items-center justify-between px-3 py-1.5 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <BellRing className="w-3 h-3 text-blue-400" />
                    Notificaciones
                  </span>
                  <span className="text-emerald-400 font-bold">ON</span>
                </div>
              </div>
            )}

            {/* Desktop Center Watermark */}
            <div className="m-auto text-center pointer-events-none py-10 opacity-70">
              <div className="inline-block p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
                  Renderizado en Tiempo Real
                </p>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentRate.name}
                </div>
                <div className="mt-2 font-mono text-xl sm:text-2xl font-bold text-emerald-400">
                  {currentRate.priceStr} {currentRate.currency}
                </div>
              </div>
            </div>

            {/* Simulated Desktop Bar (Top for GNU/Linux/Mac, Bottom for Windows) */}
            {activeOS === 'linux' && (
              <div className="absolute top-0 left-0 right-0 h-9 bg-black/90 backdrop-blur-md px-4 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 font-sans">
                <div className="flex items-center gap-4 font-semibold">
                  <span>Activities</span>
                  <span className="text-slate-400 font-mono text-[11px]">Mié 18:30</span>
                </div>

                {/* Ayatana Indicator in GNOME Top Bar */}
                <div
                  onClick={() => setShowContextMenu(!showContextMenu)}
                  className="flex items-center gap-2 px-3 py-1 rounded bg-slate-800/90 border border-slate-700/80 cursor-pointer hover:bg-slate-700 transition-all text-white font-medium"
                >
                  <div className={`w-3.5 h-3.5 rounded-sm ${currentRate.bgColor} flex items-center justify-center shrink-0`}>
                    <span className="text-[9px] font-black text-white">$</span>
                  </div>
                  <span className="font-mono font-bold tracking-tight text-emerald-300">
                    {currentRate.label}: {currentRate.priceStr} Bs
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <span>ES</span>
                  <span>📶</span>
                  <span>🔋 98%</span>
                </div>
              </div>
            )}

            {activeOS === 'windows' && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1c1f26]/95 backdrop-blur-lg px-4 flex items-center justify-between border-t border-slate-800 font-sans">
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span>☁️ 24°C Despejado</span>
                </div>

                {/* Windows Centered Taskbar Icons */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    ⊞
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                    📁
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                    🌐
                  </div>
                </div>

                {/* Windows 11 System Tray with Pixel-Rendered Icon */}
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => setShowContextMenu(!showContextMenu)}
                    className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer group"
                    title={`ACE: ${currentRate.label}`}
                  >
                    {/* The dynamic 16x16 / 32x32 pixel tray icon */}
                    <div className={`w-6 h-6 rounded ${currentRate.bgColor} flex flex-col items-center justify-center text-white shadow-sm ring-1 ring-white/20`}>
                      <span className="text-[7px] leading-none font-bold uppercase">$</span>
                      <span className="text-[8px] font-mono font-black leading-none">{currentRate.priceStr.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <span>🔊</span>
                    <span>📶</span>
                    <div className="text-right font-mono text-[11px] leading-tight text-slate-300">
                      <div>18:30</div>
                      <div className="text-[10px] text-slate-500">09/09/2026</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOS === 'macos' && (
              <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900/80 backdrop-blur-xl px-4 flex items-center justify-between text-xs text-slate-200 border-b border-slate-800/80 font-sans">
                <div className="flex items-center gap-4 font-semibold text-[13px]">
                  <span></span>
                  <span className="font-bold text-white">ACE</span>
                  <span className="text-slate-400 font-normal">Archivo</span>
                  <span className="text-slate-400 font-normal">Edición</span>
                  <span className="text-slate-400 font-normal">Ver</span>
                  <span className="text-slate-400 font-normal">Ayuda</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* macOS Menu Bar Status Item */}
                  <div
                    onClick={() => setShowContextMenu(!showContextMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full ${currentRate.bgColor}`}></div>
                    <span className="font-mono font-bold text-[12px] text-white">
                      {currentRate.label}: {currentRate.priceStr}
                    </span>
                  </div>

                  <span className="text-slate-400">⚡ 100%</span>
                  <span className="text-slate-400">Wi-Fi</span>
                  <span className="font-mono text-slate-300 text-[11px]">Mié 6:30 PM</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informative Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-2">
              <Terminal className="w-5 h-5 text-orange-600" />
              <h3>GNU/Linux (Ayatana)</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Muestra directamente texto plano y vivo en el panel superior gracias a <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">AyatanaAppIndicator3</code>. Compatible con GNOME, KDE, XFCE y MATE.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              <h3>Windows (Pixel Render)</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dibuja dinámicamente el precio en el buffer de píxeles del icono con <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">Pillow</code> y <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">pystray</code>. Siempre visible sin necesidad de pasar el ratón.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-2">
              <Apple className="w-5 h-5 text-slate-900" />
              <h3>macOS (Menu Bar)</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Se ancla de manera elegante en la barra de menú superior de macOS como un ítem de estado nativo, con soporte para modo oscuro automático de Apple.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreview;
