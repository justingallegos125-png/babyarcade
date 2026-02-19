
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Navbar = ({ searchQuery, setSearchQuery, onHome, onLogoClick }) => {
  return html`
    <nav className="sticky top-0 z-50 bg-black border-b-4 px-6 py-5 flex items-center justify-between rgb-border">
      <div className="flex items-center gap-4 cursor-pointer group" onClick=${(e) => {
        onHome();
        onLogoClick?.();
      }}>
        <div className="w-12 h-12 border-4 flex items-center justify-center group-hover:scale-110 transition-all rgb-border">
          <i className="fas fa-gamepad text-white group-hover:rgb-text text-2xl"></i>
        </div>
        <span className="text-3xl font-black tracking-tighter hidden sm:block select-none retro-text-shadow rgb-text glitch">
          JUSTINS_ARCADE
        </span>
      </div>

      <div className="flex-1 max-w-lg mx-10">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 rgb-text text-xl font-bold">></span>
          <input
            type="text"
            placeholder="SEARCH_DB..."
            value=${searchQuery}
            onChange=${(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border-4 py-3 pl-12 pr-6 focus:scale-[1.02] transition-transform text-xl rgb-border"
          />
        </div>
      </div>

      <button onClick=${onHome} className="border-4 w-14 h-12 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border">
        <i className="fas fa-home text-2xl"></i>
      </button>
    </nav>
  `;
};

export default Navbar;
