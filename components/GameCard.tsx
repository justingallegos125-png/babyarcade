
import React from 'react';
import { Game } from '../types';
import GameIcon from './GameIcon';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="group bg-black/40 backdrop-blur-sm border-2 transition-all cursor-pointer relative border-accent/20 hover:border-accent rounded-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(255,0,255,0.15)]"
    >
      <div className="aspect-[16/9] overflow-hidden relative flex items-center justify-center p-6">
        {/* Background Visual */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
          <GameIcon title={game.title} className="scale-150 blur-sm" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <button 
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center z-20 ${
            isFavorite ? 'bg-accent text-white border-white shadow-[0_0_15px_rgba(255,0,255,0.5)]' : 'bg-black/40 text-white border-white/20 hover:bg-accent hover:border-accent'
          }`}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
        </button>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <GameIcon title={game.title} className="scale-110" />
          </div>
          <h3 className="font-black text-2xl text-white mb-2 uppercase tracking-tighter group-hover:text-accent transition-colors line-clamp-2 px-4">{game.title}</h3>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] font-black bg-accent text-black px-3 py-1 rounded-full uppercase tracking-widest">
              {game.category}
            </span>
            <p className="text-[9px] text-white/50 line-clamp-1 uppercase font-mono-readable max-w-[200px]">{game.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
