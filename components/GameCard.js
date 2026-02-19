
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const GameCard = ({ game, isFavorite, onToggleFavorite, onClick }) => {
  return html`
    <div 
      onClick=${() => onClick(game)}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 neon-border transition-all cursor-pointer relative"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src=${game.thumbnail} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
        
        <button 
          onClick=${(e) => onToggleFavorite(game.id, e)}
          className=${`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center glass border border-white/10 transition-colors ${
            isFavorite ? 'text-red-500' : 'text-white/60 hover:text-red-400'
          }`}
        >
          <i className="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
        </button>

        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 px-2 py-0.5 rounded text-white">
            ${game.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
          ${game.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
          ${game.description}
        </p>
      </div>
    </div>
  `;
};

export default GameCard;
