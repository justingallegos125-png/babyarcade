
import React, { useState, useEffect, useMemo } from 'react';
import htm from 'htm';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GamePlayer from './components/GamePlayer.js';
import { GAMES, CATEGORIES } from './constants.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_favs');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'All' || game.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const favoriteGames = useMemo(() => GAMES.filter(g => favorites.includes(g.id)), [favorites]);

  if (selectedGame) {
    return html`
      <div className="min-h-screen flex flex-col bg-slate-950">
        <${Navbar} searchQuery=${searchQuery} setSearchQuery=${setSearchQuery} onHome=${() => setSelectedGame(null)} />
        <${GamePlayer} game=${selectedGame} onBack=${() => setSelectedGame(null)} />
      </div>
    `;
  }

  return html`
    <div className="min-h-screen flex flex-col bg-slate-950 pb-20">
      <${Navbar} searchQuery=${searchQuery} setSearchQuery=${setSearchQuery} onHome=${() => setSelectedGame(null)} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-8">
        ${!searchQuery && selectedCategory === 'All' && html`
          <section className="mb-12 relative overflow-hidden rounded-3xl bg-indigo-900/20 border border-indigo-500/20 p-8 md:p-12">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Gaming</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mb-8">
                Your portal to unblocked, high-performance web games. Ad-free, fast, and always accessible.
              </p>
              <button 
                onClick=${() => setSelectedGame(GAMES[Math.floor(Math.random() * GAMES.length)])}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <i className="fas fa-play"></i> Quick Play
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </section>
        `}

        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          ${CATEGORIES.map(cat => html`
            <button
              key=${cat}
              onClick=${() => setSelectedCategory(cat)}
              className=${`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              ${cat}
            </button>
          `)}
        </div>

        ${favoriteGames.length > 0 && !searchQuery && selectedCategory === 'All' && html`
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-star text-yellow-400"></i> Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              ${favoriteGames.map(game => html`
                <${GameCard} key=${game.id} game=${game} isFavorite=${true} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
              `)}
            </div>
          </section>
        `}

        <section>
          <h2 className="text-xl font-bold mb-6">
            ${searchQuery ? `Results for "${searchQuery}"` : 'All Games'}
          </h2>
          ${filteredGames.length > 0 ? html`
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              ${filteredGames.map(game => html`
                <${GameCard} key=${game.id} game=${game} isFavorite=${favorites.includes(game.id)} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
              `)}
            </div>
          ` : html`
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
              <p className="text-slate-500">No games found matching your search.</p>
            </div>
          `}
        </section>
      </main>

      <footer className="mt-20 border-t border-slate-900 py-10 text-center">
        <p className="text-slate-600 text-sm">Nexus Gaming Hub • 2024</p>
      </footer>
    </div>
  `;
};

export default App;
