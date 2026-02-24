
import React from 'react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onHome: () => void;
  onOpenLoader: () => void;
  onOpenData: () => void;
  onOpenHelp: () => void;
  onOpenProxy: () => void;
  onOpenCustom: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery, onHome, onOpenLoader, onOpenData, onOpenHelp, onOpenProxy, onOpenCustom }) => {
  return (
    <nav className="bg-black/80 border-4 border-accent px-6 py-3 flex items-center justify-between rounded-full backdrop-blur-md shadow-[0_0_30px_rgba(255,0,255,0.1)]">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={onHome}>
        <div className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center group-hover:scale-105 transition-all">
          <i className="fas fa-gamepad text-white group-hover:text-accent text-xl"></i>
        </div>
        <span className="text-2xl font-black tracking-tighter hidden lg:block select-none retro-text-shadow text-accent glitch text-nowrap uppercase font-graffiti">
          Joshy's Arcade
        </span>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-lg font-bold">&gt;</span>
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-2 border-accent/30 rounded-full py-1.5 pl-10 pr-6 focus:border-accent transition-all text-sm uppercase font-mono-readable"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onOpenProxy} 
          className="border-2 border-secondary px-3 h-10 flex items-center justify-center text-white hover:bg-secondary hover:text-black transition-all font-black text-[10px] uppercase tracking-tighter rounded-full"
          title="CYBER PROXY"
        >
          <i className="fas fa-network-wired mr-2"></i> [ PROXY ]
        </button>
        <button 
          onClick={onOpenCustom} 
          className="border-2 border-accent w-10 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all rounded-full"
          title="CUSTOMIZE OS"
        >
          <i className="fas fa-palette text-sm"></i>
        </button>
        <button 
          onClick={onOpenHelp} 
          className="border-2 border-accent w-10 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all rounded-full"
          title="SYSTEM GUIDE"
        >
          <i className="fas fa-question text-sm"></i>
        </button>
        <button 
          onClick={onOpenData} 
          className="border-2 border-accent px-3 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all font-black text-[10px] uppercase tracking-tighter rounded-full"
          title="BACKUP DATA"
        >
          <i className="fas fa-database mr-2"></i> [ DATA ]
        </button>
        <button 
          onClick={onOpenLoader} 
          className="border-2 border-accent px-3 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all font-black text-[10px] uppercase tracking-tighter rounded-full"
          title="LOAD GAMES"
        >
          <i className="fas fa-upload mr-2"></i> [ LOAD ]
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
