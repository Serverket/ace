import React, { useEffect } from 'react';
import { X, Share, Plus, Smartphone } from 'lucide-react';

interface InstallSheetProps {
  isOpen: boolean;
  isIOS: boolean;
  onClose: () => void;
}

export const InstallSheet: React.FC<InstallSheetProps> = ({ isOpen, isIOS, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/90"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-white border-t-8 sm:border-8 border-black shadow-brutal-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-8 border-black bg-brutal-yellow">
          <div className="flex items-center gap-4">
            <div className="p-2 border-4 border-black bg-white shadow-brutal-sm">
              <Smartphone className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tighter uppercase">
              INSTALAR ACE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 border-4 border-black bg-brutal-red text-white hover:bg-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal-sm transition-all"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-white text-base text-black font-bold uppercase leading-relaxed">
          {isIOS ? (
            <div className="flex flex-col border-4 border-black">
              <p className="p-4 border-b-4 border-black bg-brutal-green text-lg font-black">
                EN IOS LA INSTALACIÓN ES MANUAL — 10 SEGUNDOS:
              </p>
              <p className="p-4 border-b-4 border-black">
                <span className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 mr-2">
                  <Share className="w-4 h-4" /> 1
                </span>
                TOCA EL BOTÓN <span className="bg-brutal-yellow px-1 border-2 border-black">COMPARTIR</span> EN LA BARRA DE SAFARI.
              </p>
              <p className="p-4 border-b-4 border-black">
                <span className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 mr-2">
                  <Plus className="w-4 h-4" /> 2
                </span>
                ELIGE <span className="bg-brutal-yellow px-1 border-2 border-black">"AÑADIR A PANTALLA DE INICIO"</span>.
              </p>
              <p className="p-4">
                <span className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 mr-2">
                  3
                </span>
                CONFIRMA CON <span className="bg-brutal-yellow px-1 border-2 border-black">"AÑADIR"</span>. ACE QUEDARÁ COMO APP NATIVA.
              </p>
            </div>
          ) : (
            <div className="flex flex-col border-4 border-black">
              <p className="p-4 border-b-4 border-black bg-brutal-green text-lg font-black">
                INSTALACIÓN DIRECTA NO DISPONIBLE AHORA MISMO:
              </p>
              <p className="p-4 border-b-4 border-black">
                ABRE EL <span className="bg-brutal-yellow px-1 border-2 border-black">MENÚ DEL NAVEGADOR</span> Y BUSCA
                <span className="bg-brutal-yellow px-1 border-2 border-black"> "INSTALAR APLICACIÓN"</span> O
                <span className="bg-brutal-yellow px-1 border-2 border-black"> "AÑADIR A PANTALLA DE INICIO"</span>.
              </p>
              <p className="p-4">
                EN CHROME/EDGE TAMBIÉN APARECE UN ICONO DE INSTALACIÓN EN LA BARRA DE DIRECCIONES.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white flex justify-end border-t-8 border-black">
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

export default InstallSheet;
