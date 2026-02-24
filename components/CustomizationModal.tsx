
import React from 'react';
import { THEMES, FONTS, PATTERNS, Theme } from '../themes';

interface CustomizationModalProps {
  currentTheme: Theme;
  onUpdateTheme: (updates: Partial<Theme>) => void;
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ currentTheme, onUpdateTheme, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-black border-8 border-accent w-full max-w-2xl overflow-hidden shadow-[0_0_80px_rgba(255,0,255,0.15)] flex flex-col max-h-[90vh]">
        <div className="p-6 border-b-4 border-accent flex justify-between items-center bg-black">
          <h2 className="text-4xl font-black text-accent flex items-center gap-4 tracking-tighter uppercase glitch font-graffiti">
            <i className="fas fa-palette"></i> CUSTOMIZE OS
          </h2>
          <button onClick={onClose} className="border-4 border-accent w-12 h-12 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
          {/* Quick Themes */}
          <section className="space-y-4">
            <h3 className="text-secondary font-black uppercase tracking-widest text-sm border-l-4 border-secondary pl-3">PRESET THEMES</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateTheme(theme)}
                  className={`p-4 border-4 transition-all text-left group ${
                    currentTheme.id === theme.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white group-hover:text-accent">{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Colors */}
          <section className="space-y-4">
            <h3 className="text-secondary font-black uppercase tracking-widest text-sm border-l-4 border-secondary pl-3">MANUAL CALIBRATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase">Primary Accent</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    value={currentTheme.accent} 
                    onChange={(e) => onUpdateTheme({ accent: e.target.value, id: 'custom' })}
                    className="w-12 h-12 cursor-pointer bg-transparent border-none p-0"
                  />
                  <input 
                    type="text" 
                    value={currentTheme.accent}
                    onChange={(e) => onUpdateTheme({ accent: e.target.value, id: 'custom' })}
                    className="flex-1 bg-black border-2 border-white/10 p-2 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase">Secondary Accent</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    value={currentTheme.secondary} 
                    onChange={(e) => onUpdateTheme({ secondary: e.target.value, id: 'custom' })}
                    className="w-12 h-12 cursor-pointer bg-transparent border-none p-0"
                  />
                  <input 
                    type="text" 
                    value={currentTheme.secondary}
                    onChange={(e) => onUpdateTheme({ secondary: e.target.value, id: 'custom' })}
                    className="flex-1 bg-black border-2 border-white/10 p-2 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Fonts */}
          <section className="space-y-4">
            <h3 className="text-secondary font-black uppercase tracking-widest text-sm border-l-4 border-secondary pl-3">TYPOGRAPHY GAME</h3>
            <div className="flex flex-wrap gap-3">
              {FONTS.map(font => (
                <button
                  key={font.name}
                  onClick={() => onUpdateTheme({ font: font.value, id: 'custom' })}
                  style={{ fontFamily: font.value }}
                  className={`px-4 py-2 border-2 transition-all text-sm ${
                    currentTheme.font === font.value ? 'border-accent text-accent' : 'border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </section>

          {/* Patterns */}
          <section className="space-y-4">
            <h3 className="text-secondary font-black uppercase tracking-widest text-sm border-l-4 border-secondary pl-3">VISUAL TEXTURE</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PATTERNS.map(pattern => (
                <button
                  key={pattern.name}
                  onClick={() => onUpdateTheme({ pattern: pattern.value, id: 'custom' })}
                  className={`p-4 border-2 transition-all text-center relative overflow-hidden ${
                    currentTheme.pattern === pattern.value ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: pattern.value }}></div>
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white">{pattern.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t-4 border-accent bg-accent/5 flex justify-center">
          <button 
            onClick={onClose}
            className="border-4 border-accent px-12 py-3 text-white font-black uppercase tracking-[0.5em] hover:bg-accent hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,255,0.2)]"
          >
            [ SAVE CONFIG ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
