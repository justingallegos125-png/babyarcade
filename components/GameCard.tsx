
import React from 'react';

const GameCard = ({ game, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer relative"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-indigo-600 p-3 rounded-full shadow-lg">
             <i className="fas fa-play text-white"></i>
           </div>
        </div>
        <button 
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-slate-900/60 text-white hover:bg-red-500'
          }`}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-100 mb-1 truncate">{game.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-1">{game.description}</p>
      </div>
    </div>
  );
};

export default GameCard;
