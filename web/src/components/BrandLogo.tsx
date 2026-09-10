interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo = ({ size = 'md', showSubtitle = true }: BrandLogoProps) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl flex items-center justify-center p-0.5 shadow-md shadow-amber-900/10 border border-slate-700/50 group overflow-hidden`}>
        <img src="/logo.svg" alt="ACE Logo" className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]}`}>
            ACE
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60">
            {__APP_VERSION__}
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5">
            A Cuánto Está
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
