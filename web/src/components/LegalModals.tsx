import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      title: 'Política de Privacidad',
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Cero Rastreo, Cero Telemetría.</strong> En ACE (A Cuánto Está), creemos que la privacidad es un derecho fundamental por defecto, no una característica adicional (opcional).
          </p>
          <p>
            <strong>1. Recopilación de Datos:</strong> No recopilamos, no almacenamos, ni transmitimos ningún tipo de información personal, identificable o métricas de uso (analíticas) hacia nuestros servidores ni a terceros. ACE funciona de manera totalmente autónoma.
          </p>
          <p>
            <strong>2. Conexiones a APIs:</strong> Las conexiones de red que realiza esta aplicación web o el cliente de escritorio se hacen exclusivamente desde tu dispositivo hacia las fuentes públicas de datos cambiarios (DolarAPI, Yadio, etc.) para consultar las tasas actuales. Serverket no actúa como intermediario en estas conexiones.
          </p>
          <p>
            <strong>3. Cookies y Almacenamiento Local:</strong> No utilizamos cookies de rastreo ni de sesión. Cualquier preferencia guardada (como preferencias de tema o calculadora) se almacena única y exclusivamente en tu dispositivo (Local Storage) y jamás abandona tu navegador.
          </p>
          <p>
            <strong>4. Transparencia de Código Abierto:</strong> Nuestro compromiso es verificable. El código de ACE es 100% de código abierto (Open Source), lo que significa que cualquier persona puede auditar el software para confirmar la ausencia total de rastreadores.
          </p>
        </div>
      ),
    },
    tos: {
      title: 'Términos de Servicio',
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Al descargar, acceder o utilizar ACE, aceptas estos términos básicos, diseñados bajo la filosofía del software libre.
          </p>
          <p>
            <strong>1. Naturaleza del Servicio:</strong> ACE es una herramienta puramente informativa y de visualización. Los datos de las cotizaciones cambiarias provienen de fuentes externas (APIs públicas) y se presentan "tal cual" (AS IS). No garantizamos la absoluta exactitud o tiempo real de los datos suministrados por dichos terceros.
          </p>
          <p>
            <strong>2. Sin Consejos Financieros:</strong> La información proporcionada en ACE, incluyendo los cálculos en la pizarra o el simulador, no constituye bajo ningún concepto un consejo financiero, de inversión, legal o fiscal.
          </p>
          <p>
            <strong>3. Responsabilidad:</strong> El creador (Serverket) no se hace responsable por cualquier pérdida, daño o decisión que resulte del uso de la información mostrada por este software.
          </p>
          <p>
            <strong>4. Licencia de Uso (GPLv3):</strong> ACE se distribuye bajo la Licencia Pública General de GNU v3. Eres libre de usar, modificar y distribuir el código fuente, siempre y cuando se preserve la misma licencia y transparencia.
          </p>
        </div>
      ),
    }
  };

  const { title, icon, body } = content[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {body}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all active:scale-95"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
