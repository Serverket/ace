import React, { useEffect } from 'react';
import { Shield, FileText, X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'tos' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const content = {
    privacy: {
      title: 'POLÍTICA DE PRIVACIDAD',
      icon: <Shield className="w-8 h-8 text-black" />,
      theme: 'bg-brutal-green',
      body: (
        <div className="flex flex-col border-4 border-black bg-white text-base text-black font-bold uppercase leading-relaxed">
          <p className="p-4 border-b-4 border-black bg-brutal-green text-lg font-black">
            CERO RASTREO, CERO TELEMETRÍA. EN ACE, LA PRIVACIDAD ES UN DERECHO FUNDAMENTAL POR DEFECTO.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2 group-hover:bg-white group-hover:text-black">1. RECOPILACIÓN DE DATOS</span> No recopilamos, no almacenamos, ni transmitimos información personal, identificable o métricas de uso. ACE funciona de manera totalmente autónoma.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">2. CONEXIONES A APIs</span> Las conexiones de red se hacen exclusivamente desde tu dispositivo hacia fuentes públicas de datos (DolarAPI, Yadio, etc.). Serverket no actúa como intermediario.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">3. LOCAL STORAGE</span> No utilizamos cookies de rastreo. Preferencias de la app se almacenan únicamente en el Local Storage y jamás abandonan tu equipo.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">4. CÓDIGO ABIERTO</span> El código de ACE es 100% Open Source. Cualquiera puede auditar el software para confirmar la ausencia total de rastreadores.
          </p>
          <p className="p-4 hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">5. VERCEL</span> No conservamos archivos de registro (logs) de nuestra parte; sin embargo, utilizamos Vercel como plataforma de despliegue, la cual tiene su propia Política de Privacidad. Revísala en <a href="https://vercel.com/legal/privacy-policy#customers" target="_blank" rel="noopener noreferrer" className="underline bg-white text-black px-1 font-black">https://vercel.com/legal/privacy-policy#customers</a>.
          </p>
        </div>
      ),
    },
    tos: {
      title: 'TÉRMINOS DE SERVICIO',
      icon: <FileText className="w-8 h-8 text-black" />,
      theme: 'bg-brutal-yellow',
      body: (
        <div className="flex flex-col border-4 border-black bg-white text-base text-black font-bold uppercase leading-relaxed">
          <p className="p-4 border-b-4 border-black bg-brutal-yellow text-lg font-black">
            AL UTILIZAR ACE, ACEPTAS ESTOS TÉRMINOS BÁSICOS DISEÑADOS BAJO LA FILOSOFÍA DEL SOFTWARE LIBRE.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">1. NATURALEZA DEL SERVICIO</span> ACE es una herramienta puramente informativa. Los datos provienen de APIs públicas y se presentan "tal cual" (AS IS). No garantizamos la absoluta exactitud o tiempo real.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">2. SIN CONSEJOS FINANCIEROS</span> La información mostrada en ACE no constituye un consejo financiero, de inversión, legal o fiscal.
          </p>
          <p className="p-4 border-b-4 border-black hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">3. RESPONSABILIDAD</span> El creador (Serverket) no se hace responsable por cualquier pérdida, daño o decisión que resulte del uso de este software.
          </p>
          <p className="p-4 hover:bg-black hover:text-white transition-colors">
            <span className="bg-black text-white px-2 py-1 mr-2">4. LICENCIA (GPLv3)</span> Eres libre de usar, modificar y distribuir el código fuente, preservando la misma licencia y transparencia.
          </p>
        </div>
      ),
    }
  };

  const { title, icon, body, theme } = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/90"
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-3xl bg-white border-8 border-black shadow-brutal-lg flex flex-col ${theme}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-8 border-black bg-white">
          <div className="flex items-center gap-4">
            <div className={`p-2 border-4 border-black shadow-brutal-sm ${theme}`}>
              {icon}
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-black tracking-tighter uppercase">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 border-4 border-black bg-brutal-red text-white hover:bg-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal-sm transition-all"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Body */}
        <div className="p-0 sm:p-6 max-h-[60vh] overflow-y-auto bg-white border-b-8 border-black">
          {body}
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-4 border-4 border-black bg-black text-white text-xl font-black uppercase hover:bg-white hover:text-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};
