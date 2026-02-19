
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import GamePlayer from './components/GamePlayer';
import { GAMES, CATEGORIES } from './constants';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const favoriteGames = useMemo(() => {
    return GAMES.filter(game => favorites.includes(game.id));
  }, [favorites]);

  if (selectedGame) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onHome={() => setSelectedGame(null)} 
        />
        <GamePlayer 
          game={selectedGame} 
          onBack={() => setSelectedGame(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-slate-950">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onHome={() => setSelectedGame(null)} 
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {!searchQuery && selectedCategory === 'All' && (
          <section className="mb-12 relative overflow-hidden rounded-3xl bg-indigo-600/10 border border-indigo-500/20 p-8 sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Play the Best <span className="text-indigo-400">Unblocked</span> Games
              </h1>
              <p className="text-lg text-slate-400 mb-8">
                Fast, ad-free, and always accessible. Your ultimate hub for premium web-based gaming experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setSelectedGame(GAMES[Math.floor(Math.random() * GAMES.length)])}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                >
                  <i className="fas fa-random"></i>
                  Random Game
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </section>
        )}

        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {favorites.length > 0 && !searchQuery && selectedCategory === 'All' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-heart text-red-500"></i> Your Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedGame}
                />
              ))}
            </div>
          </section>
        )}

        <section id="all-games">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Trending Games' : `${selectedCategory} Games`}
          </h2>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedGame}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <i className="fas fa-ghost text-slate-500 text-3xl mb-4"></i>
              <p className="text-slate-400">No games matched your criteria</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-800 py-10 bg-slate-900/50 text-center">
        <p className="text-slate-500 text-sm">© 2024 Nexus Games Hub</p>
      </footer>
    </div>
  );
};

export default App;
