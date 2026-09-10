import React, { useState } from 'react';
import { Terminal, Monitor, Apple, Code2, Copy, Check, Download, ExternalLink, ShieldAlert } from 'lucide-react';

type TabKey = 'linux' | 'windows' | 'macos' | 'source';

interface InstallTabContent {
  id: TabKey;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  commandSnippet: string;
  downloadButton?: {
    label: string;
    url: string;
  };
  note?: string;
}

export const InstallGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('linux');
  const [copied, setCopied] = useState(false);

  const tabs: InstallTabContent[] = [
    {
      id: 'linux',
      label: 'GNU/Linux (AppImage)',
      icon: <Terminal className="w-4 h-4 text-orange-500" />,
      title: 'Ejecutable Independiente AppImage',
      description: 'Descarga el binario autónomo para GNU/Linux de 64 bits. No requiere compilar dependencias ni configuraciones complejas.',
      commandSnippet: `# 1. Instalar soporte de indicadores en GNOME (Ubuntu/Debian)
sudo apt install -y gir1.2-ayatanaappindicator3-0.1

# 2. Dar permisos de ejecución y correr
chmod +x ACE-${__APP_VERSION__}-x86_64.AppImage
./ACE-${__APP_VERSION__}-x86_64.AppImage`,
      downloadButton: {
        label: `Descargar ACE ${__APP_VERSION__} (.AppImage)`,
        url: 'https://github.com/Serverket/ace/releases',
      },
      note: 'Compatible con Ubuntu, Debian, Fedora, Arch GNU/Linux, Manjaro, Mint y cualquier distribución con soporte AppImage.',
    },
    {
      id: 'windows',
      label: 'Windows (PowerShell)',
      icon: <Monitor className="w-4 h-4 text-blue-500" />,
      title: 'Instalación Automatizada en Windows',
      description: 'El script configura el entorno virtual, descarga las dependencias, crea el acceso directo en el escritorio y lo ancla al inicio de Windows.',
      commandSnippet: `# Ejecutar en PowerShell como tu usuario normal
powershell -ExecutionPolicy Bypass -File .\\install_windows.ps1`,
      downloadButton: {
        label: 'Ver instalador de Windows en GitHub',
        url: 'https://github.com/Serverket/ace/blob/main/install_windows.ps1',
      },
      note: 'Renderiza directamente la cotización en píxeles sobre la bandeja del sistema.',
    },
    {
      id: 'macos',
      label: 'macOS (Menu Bar)',
      icon: <Apple className="w-4 h-4 text-slate-800" />,
      title: 'Instalación Nativa en Barra de Menú',
      description: 'Crea automáticamente un LaunchAgent en ~/Library/LaunchAgents para que ACE inicie de forma silenciosa al encender tu Mac.',
      commandSnippet: `# Ejecutar desde la terminal o hacer doble clic en el archivo
./install_macos.command`,
      downloadButton: {
        label: 'Ver script para macOS en GitHub',
        url: 'https://github.com/Serverket/ace/blob/main/install_macos.command',
      },
      note: 'Compatible con macOS Monterey, Ventura, Sonoma y Sequoia tanto en Apple Silicon (M1/M2/M3/M4) como Intel.',
    },
    {
      id: 'source',
      label: 'Código Fuente',
      icon: <Code2 className="w-4 h-4 text-emerald-500" />,
      title: 'Instalación Manual desde Python',
      description: 'Para desarrolladores que desean auditar el código o correrlo en entornos personalizados.',
      commandSnippet: `git clone https://github.com/Serverket/ace.git
cd ace
python3 -m venv --system-site-packages venv
source venv/bin/activate
pip install -r requirements.txt
python ace.py`,
      downloadButton: {
        label: 'Explorar repositorio en GitHub',
        url: 'https://github.com/Serverket/ace',
      },
      note: 'Requiere Python 3.9 o superior y librerías del sistema según el SO.',
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText?.(currentTab.commandSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="instalacion" className="py-24 relative overflow-hidden bg-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">
            Instalación en Segundos
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Listo para Trabajar en tu Entorno
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Elige tu plataforma y sigue las instrucciones para tener el widget funcionando en tu bandeja de sistema de inmediato.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-2xl mx-auto mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCopied(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Terminal Box Showcase */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-3 text-xs font-mono text-slate-400">
                terminal — {currentTab.label}
              </span>
            </div>

            <button
              onClick={handleCopyCommand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Comando Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Comandos</span>
                </>
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{currentTab.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{currentTab.description}</p>
            </div>

            {/* Code Snippet Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
              {currentTab.commandSnippet}
            </div>

            {/* Note & Action */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-900">
              {currentTab.note && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{currentTab.note}</span>
                </p>
              )}

              {currentTab.downloadButton && (
                <a
                  href={currentTab.downloadButton.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>{currentTab.downloadButton.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallGuide;
