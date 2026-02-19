
import React from 'react';

const Navbar = ({ searchQuery, setSearchQuery, onHome }) => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onHome}>
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <i className="fas fa-gamepad text-white text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight hidden sm:block">
          NEXUS<span className="text-indigo-500">GAMES</span>
        </span>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            placeholder="Search for games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onHome} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-home text-lg"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
