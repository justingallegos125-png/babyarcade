
import React from 'react';
import htm from 'htm';
import GameIcon from './GameIcon.js';

const html = htm.bind(React.createElement);

const GameCard = ({ game, isFavorite, onToggleFavorite, onClick }) => {
  const handleClick = (e) => {
    if (onClick) onClick(game);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(game.id, e);
  };

  return html`
    <div 
      onClick=${handleClick}
      className="group bg-black border-4 transition-all cursor-pointer relative hover:scale-[1.05] rgb-border"
    >
      <div className="aspect-[4/3] relative overflow-hidden transition-all border-b-4 border-white group-hover:rgb-border">
        <${GameIcon} title=${game.title} className="group-hover:scale-110 transition-transform duration-700" />
        
        <button 
          onClick=${handleFavClick}
          className=${`absolute top-2 right-2 w-12 h-12 border-4 transition-all z-20 ${
            isFavorite ? 'rgb-bg border-white text-black' : 'bg-black border-white text-white hover:rgb-border'
          }`}
        >
          <i className="${isFavorite ? 'fas' : 'far'} fa-star text-xl"></i>
        </button>

        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-sm font-black uppercase px-3 py-1 text-black rgb-bg border-2 border-white">
            ${(game.category || 'Action').toUpperCase()}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="text-white font-black text-2xl uppercase rgb-text tracking-widest">[ PLAY_NOW ]</span>
        </div>
      </div>
      
      <div className="p-5 bg-black">
        <h3 className="text-2xl font-black truncate uppercase rgb-text">
          ${game.title || 'Untitled'}
        </h3>
        <p className="text-sm text-white/60 mt-2 line-clamp-1 font-mono uppercase tracking-tighter">
          DESC: ${game.description || 'No description available'}
        </p>
        <div className="mt-5 flex justify-between items-center">
           <span className="text-[10px] rgb-text opacity-50 font-bold uppercase tracking-widest">STATUS: EXECUTABLE</span>
           <span className="text-[10px] text-white opacity-20 font-bold uppercase tracking-widest">ID: ${(game.id || '').substring(0,8)}</span>
        </div>
      </div>
    </div>
  `;
};

export default GameCard;
