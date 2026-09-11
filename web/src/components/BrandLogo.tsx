interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo = ({ size = 'md', showSubtitle = true }: BrandLogoProps) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center p-1 border-4 border-black bg-brutal-yellow shadow-brutal-sm group overflow-hidden`}>
        <img src="/logo.svg" alt="ACE Logo" className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 leading-none">
          <span className={`font-black tracking-tighter text-black uppercase ${textSizes[size]}`}>
            ACE
          </span>
          <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest px-2 py-0.5 bg-black text-brutal-green shadow-brutal-sm">
            {__APP_VERSION__}
          </span>
        </div>
        {showSubtitle && (
          <span className="text-xs font-bold text-black uppercase tracking-wider mt-1 block w-fit border-b-2 border-black">
            A CUÁNTO ESTÁ
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
