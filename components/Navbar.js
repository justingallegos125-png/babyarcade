
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Navbar = ({ searchQuery, setSearchQuery, onHome, onOpenAdmin, onOpenData, onOpenHelp }) => {
  return html`
    <nav className="sticky top-0 z-50 bg-black border-b-4 px-6 py-4 flex items-center justify-between rgb-border">
      <div className="flex items-center gap-4 cursor-pointer group" onClick=${onHome}>
        <div className="w-12 h-12 border-4 flex items-center justify-center group-hover:scale-105 transition-all rgb-border">
          <i className="fas fa-gamepad text-white group-hover:rgb-text text-2xl"></i>
        </div>
        <span className="text-3xl font-black tracking-tighter hidden sm:block select-none retro-text-shadow rgb-text glitch text-nowrap">
          JOSHYS ARCADE
        </span>
      </div>

      <div className="flex-1 max-w-lg mx-6">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 rgb-text text-xl font-bold">></span>
          <input
            type="text"
            placeholder="SEARCH LIBRARY..."
            value=${searchQuery}
            onChange=${(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border-4 py-2 pl-12 pr-6 focus:scale-[1.01] transition-transform text-xl rgb-border"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick=${onOpenHelp} 
          className="border-4 w-12 h-12 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all rgb-border"
          title="SYSTEM GUIDE"
        >
          <i className="fas fa-question text-lg"></i>
        </button>
        <button 
          onClick=${onOpenData} 
          className="border-4 px-4 h-12 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all rgb-border font-black text-xs uppercase tracking-tighter"
          title="BACKUP DATA"
        >
          <i className="fas fa-database mr-2"></i> [ DATA ]
        </button>
        <button 
          onClick=${onOpenAdmin} 
          className="border-4 px-4 h-12 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all rgb-border font-black text-xs uppercase tracking-tighter"
          title="ADMIN PANEL"
        >
          <i className="fas fa-tools mr-2"></i> [ ADMIN ]
        </button>
        <button 
          onClick=${onHome} 
          className="border-4 w-12 h-12 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border"
          title="HOME"
        >
          <i className="fas fa-home text-xl"></i>
        </button>
      </div>
    </nav>
  `;
};

export default Navbar;
