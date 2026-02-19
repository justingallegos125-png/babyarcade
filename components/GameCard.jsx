
import React from 'react';

const GameCard = ({ game, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-indigo-600 p-3 rounded-full scale-50 group-hover:scale-100 transition-transform">
             <i className="fas fa-play text-white"></i>
           </div>
        </div>
        <button 
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-slate-900/40 text-white hover:bg-red-500'
          }`}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
            {game.title}
          </h3>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-700 rounded text-slate-400">
            {game.category}
          </span>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
