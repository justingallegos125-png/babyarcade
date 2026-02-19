
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Navbar = ({ searchQuery, setSearchQuery, onHome }) => {
  return html`
    <nav className="sticky top-0 z-50 glass border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group" onClick=${onHome}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
          <i className="fas fa-bolt text-white text-xl"></i>
        </div>
        <span className="text-xl font-black tracking-tighter hidden sm:block">
          NEXUS<span className="text-indigo-500">HUB</span>
        </span>
      </div>

      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input
            type="text"
            placeholder="Search games..."
            value=${searchQuery}
            onChange=${(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
          />
        </div>
      </div>

      <button onClick=${onHome} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
        <i className="fas fa-home text-lg"></i>
      </button>
    </nav>
  `;
};

export default Navbar;
