
import React from 'react';
import htm from 'htm';
import GameIcon from './GameIcon.js';

const html = htm.bind(React.createElement);

const UnityLauncher = ({ games, favorites, onSelectGame, onHome, activeGameId }) => {
  const pinnedGames = games.slice(0, 6);
  const favoriteGames = games.filter(g => favorites.includes(g.id));
  const launcherGames = Array.from(new Set([...pinnedGames, ...favoriteGames])).slice(0, 10);

  return html`
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-black/90 flex flex-col items-center py-4 z-[60] border-r-4 rgb-border backdrop-blur-md transition-all hover:w-20 group/launcher">
      <button 
        onClick=${onHome}
        className="w-12 h-12 mb-6 flex items-center justify-center border-2 border-white/20 hover:rgb-border hover:scale-110 transition-all bg-black group"
        title="HOME SECTOR"
      >
        <i className="fas fa-th-large text-white group-hover:rgb-text"></i>
      </button>

      <div className="flex-1 w-full flex flex-col items-center gap-4 overflow-y-auto no-scrollbar pb-20">
        ${launcherGames.map(game => html`
          <div key=${game.id} className="relative group/item">
            <button 
              onClick=${() => onSelectGame(game)}
              className=${`w-12 h-12 border-2 transition-all flex items-center justify-center overflow-hidden ${
                activeGameId === game.id ? 'rgb-border scale-110' : 'border-white/10 hover:rgb-border hover:scale-110'
              }`}
            >
              <${GameIcon} title=${game.title} className="scale-150" />
            </button>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-4 px-3 py-1 bg-black border-2 rgb-border text-white text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover/item:opacity-100 pointer-events-none z-50 transition-opacity tracking-widest">
              ${game.title}
            </div>
            ${activeGameId === game.id && html`<div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 rgb-bg rounded-r"></div>`}
          </div>
        `)}
        <div className="h-[1px] w-8 bg-white/10 my-2"></div>
        <button 
          onClick=${() => onSelectGame(games[Math.floor(Math.random() * games.length)])}
          className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-white/20 hover:rgb-border hover:scale-110 transition-all text-white"
          title="RANDOM BOOT"
        >
          <i className="fas fa-random text-xs"></i>
        </button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        <div className="text-[8px] font-black rgb-text rotate-180 [writing-mode:vertical-lr] opacity-30 tracking-widest uppercase">
          UNITY OS V2
        </div>
      </div>
    </aside>
  `;
};

export default UnityLauncher;
