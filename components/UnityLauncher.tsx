
import React from 'react';
import GameIcon from './GameIcon';
import { Game } from '../types';

interface UnityLauncherProps {
  games: Game[];
  favorites: string[];
  onSelectGame: (game: Game) => void;
  onHome: () => void;
  activeGameId?: string;
}

const UnityLauncher: React.FC<UnityLauncherProps> = ({ games, favorites, onSelectGame, onHome, activeGameId }) => {
  const pinnedGames = games.slice(0, 6);
  const favoriteGames = games.filter(g => favorites.includes(g.id));
  const launcherGames = Array.from(new Set([...pinnedGames, ...favoriteGames])).slice(0, 10);

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 w-16 bg-black/80 flex flex-col items-center py-6 z-[60] border-4 border-accent backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(255,0,255,0.2)] transition-all hover:w-20 group/launcher">
      <button 
        onClick={onHome}
        className="w-12 h-12 mb-8 flex items-center justify-center border-2 border-white/20 rounded-full hover:border-accent hover:scale-110 transition-all bg-black group shadow-[0_0_10px_rgba(255,0,255,0.2)]"
        title="HOME SECTOR"
      >
        <i className="fas fa-th-large text-white group-hover:text-accent"></i>
      </button>

      <div className="flex-1 w-full flex flex-col items-center gap-5 overflow-y-auto no-scrollbar">
        {launcherGames.map(game => (
          <div key={game.id} className="relative group/item">
            <button 
              onClick={() => onSelectGame(game)}
              className={`w-12 h-12 border-2 rounded-full transition-all flex items-center justify-center overflow-hidden ${
                activeGameId === game.id ? 'border-accent scale-110 shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'border-white/10 hover:border-accent hover:scale-110'
              }`}
            >
              <GameIcon title={game.title} className="scale-150" />
            </button>
            <div className="absolute right-16 top-1/2 -translate-y-1/2 mr-4 px-3 py-1 bg-black border-2 border-accent text-white text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover/item:opacity-100 pointer-events-none z-50 transition-opacity tracking-widest shadow-[0_0_15px_rgba(255,0,255,0.3)]">
              {game.title}
            </div>
            {activeGameId === game.id && <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-l shadow-[0_0_10px_rgba(255,0,255,0.8)]"></div>}
          </div>
        ))}
        <div className="h-[1px] w-8 bg-white/10 my-2"></div>
        <button 
          onClick={() => onSelectGame(games[Math.floor(Math.random() * games.length)])}
          className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-white/20 rounded-full hover:border-accent hover:scale-110 transition-all text-white"
          title="RANDOM BOOT"
        >
          <i className="fas fa-random text-xs"></i>
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]"></div>
      </div>
    </aside>
  );
};

export default UnityLauncher;
