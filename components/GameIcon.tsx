
import React from 'react';

interface GameIconProps {
  title: string;
  className?: string;
}

const GameIcon: React.FC<GameIconProps> = ({ title, className = "" }) => {
  // Simple hashing to get unique but consistent colors per title
  const getColors = (str: string) => {
    let hash = 0;
    const input = str || 'Default';
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate two distinct vibrant HSL colors
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 60 + Math.abs((hash >> 8) % 180)) % 360;
    
    return {
      primary: `hsl(${hue1}, 80%, 50%)`,
      secondary: `hsl(${hue2}, 90%, 60%)`,
      dark: `hsl(${hue1}, 70%, 15%)`
    };
  };

  const colors = getColors(title);

  return (
    <div className={`w-full h-full flex items-center justify-center p-4 bg-slate-950 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
        <path 
          d="M50 45 Q 55 25 58 35" 
          stroke={colors.secondary} 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round" 
        />
        
        <rect x="25" y="45" width="4" height="4" fill={colors.secondary} />
        <rect x="22" y="50" width="3" height="3" fill={colors.secondary} />
        <rect x="28" y="42" width="3" height="3" fill={colors.secondary} />
        <rect x="20" y="55" width="4" height="4" fill={colors.secondary} />
        <rect x="26" y="58" width="3" height="3" fill={colors.secondary} />
        <rect x="24" y="63" width="4" height="4" fill={colors.secondary} />
        <rect x="30" y="52" width="3" height="3" fill={colors.secondary} />
        <rect x="32" y="47" width="2" height="2" fill={colors.secondary} />

        <path 
          d="M35 50 C 35 45 45 42 50 45 C 55 42 65 45 65 50 C 65 60 75 65 70 75 C 65 80 55 70 50 70 C 45 70 35 80 30 75 C 25 65 35 60 35 50" 
          fill={colors.dark}
          stroke={colors.primary}
          strokeWidth="1"
        />

        <path 
          d="M40 55 H 44 V 51 H 46 V 55 H 50 V 57 H 46 V 61 H 44 V 57 H 40 Z" 
          fill="white" 
        />

        <circle cx="68" cy="55" r="1.5" fill="white" />
        <circle cx="71" cy="58" r="1.5" fill="white" />
        <circle cx="65" cy="58" r="1.5" fill="white" />
        <circle cx="68" cy="61" r="1.5" fill="white" />
        
        <path d="M38 48 Q 42 45 46 47" stroke={colors.secondary} fill="none" strokeWidth="0.5" opacity="0.6" />
      </svg>
    </div>
  );
};

export default GameIcon;
