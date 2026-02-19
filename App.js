
import React, { useState, useEffect, useMemo } from 'react';
import htm from 'htm';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GamePlayer from './components/GamePlayer.js';
import AdminPanel from './components/AdminPanel.js';
import { GAMES as BASE_GAMES, CATEGORIES } from './constants.js';

const html = htm.bind(React.createElement);

const PasswordGate = ({ onCorrect }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const check = (e) => {
    e.preventDefault();
    if (pass.toUpperCase() === 'JOSH') {
      onCorrect();
    } else {
      setError(true);
      setPass('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return html`
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 p-8 bg-black rgb-border">
        <div className="mb-6">
          <p className="rgb-text text-xs mb-2">JUSTIN-OS v1.1.0 - (C) 1994 JUSTIN ARCADE</p>
          <p className="text-white text-xs">KERNEL: 0x800412AF - SECURITY CLEARANCE REQ</p>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center tracking-widest glitch rgb-text">RESTRICTED_ACCESS</h1>
        
        <form onSubmit=${check} className="space-y-6">
          <div className="space-y-2">
            <label className="rgb-text text-sm block uppercase tracking-tighter">Enter Authorization Key:</label>
            <input 
              type="password"
              autoFocus
              className="w-full bg-black border-2 p-3 text-2xl text-center tracking-[1em] rgb-border"
              value=${pass}
              onChange=${(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full border-4 text-white py-4 hover:bg-white hover:text-black transition-all font-bold uppercase tracking-widest rgb-border">
            [ EXECUTE_LOGIN ]
          </button>
          ${error && html`<p className="text-red-600 text-center font-bold animate-pulse mt-4 uppercase">ACCESS_DENIED - SECURITY_ALERT</p>`}
        </form>
        
        <div className="mt-12 text-[10px] rgb-text opacity-50 font-mono">
           <p>IP ADDRESS: TRACKING_LOCAL_NODE...</p>
           <p>USER STATUS: UNAUTHORIZED_SESS</p>
        </div>
      </div>
    </div>
  `;
};

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [localGames, setLocalGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const savedFavs = localStorage.getItem('justin_favs');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }
    const savedGames = localStorage.getItem('justin_local_games');
    if (savedGames) {
      try { setLocalGames(JSON.parse(savedGames)); } catch (e) { console.error(e); }
    }
    const authorized = sessionStorage.getItem('justin_auth');
    if (authorized) setIsAuthorized(true);
  }, []);

  const handleAuth = () => {
    setIsAuthorized(true);
    sessionStorage.setItem('justin_auth', 'true');
  };

  useEffect(() => {
    localStorage.setItem('justin_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('justin_local_games', JSON.stringify(localGames));
    } catch (e) {
      console.error("Storage Error:", e);
    }
  }, [localGames]);

  const allGames = useMemo(() => [...BASE_GAMES, ...localGames], [localGames]);

  const toggleFavorite = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
    if (logoClicks + 1 >= 5) {
      setShowAdmin(true);
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 3000);
  };

  const addLocalGames = (newGames) => {
    const gamesToAdd = Array.isArray(newGames) ? newGames : [newGames];
    setLocalGames(prev => {
      const existingTitles = new Set(prev.map(g => g.title));
      const filtered = gamesToAdd.filter(g => !existingTitles.has(g.title));
      return [...prev, ...filtered];
    });
    setShowAdmin(false);
  };

  const deleteLocalGame = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setLocalGames(prev => prev.filter(g => g.id !== id));
  };

  const filteredGames = useMemo(() => {
    return allGames.filter(game => {
      const matchSearch = (game.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || game.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory, allGames]);

  const favoriteGames = useMemo(() => allGames.filter(g => favorites.includes(g.id)), [favorites, allGames]);

  if (!isAuthorized) {
    return html`<${PasswordGate} onCorrect=${handleAuth} />`;
  }

  if (selectedGame) {
    return html`
      <div className="min-h-screen flex flex-col bg-black">
        <${Navbar} searchQuery=${searchQuery} setSearchQuery=${setSearchQuery} onHome=${() => setSelectedGame(null)} onLogoClick=${handleLogoClick} />
        <${GamePlayer} game=${selectedGame} onBack=${() => setSelectedGame(null)} />
      </div>
    `;
  }

  return html`
    <div className="min-h-screen flex flex-col bg-black pb-20">
      <${Navbar} searchQuery=${searchQuery} setSearchQuery=${setSearchQuery} onHome=${() => setSelectedGame(null)} onLogoClick=${handleLogoClick} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-8">
        ${showAdmin && html`<${AdminPanel} onSave=${addLocalGames} onClose=${() => setShowAdmin(false)} />`}

        <section className="mb-12 border-4 p-10 bg-black rgb-border shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]">
          <div className="relative">
            <h1 className="text-6xl font-black mb-6 tracking-tighter glitch rgb-text">
              JUSTINS_ARCADE_OS.exe
            </h1>
            <p className="text-2xl mb-10 rgb-text opacity-90">
              [ NEON_KERNEL_LOADED ] - AI_IMAGE_GEN: ACTIVE // STATUS: STABLE
            </p>
            <div className="flex gap-4">
              <button 
                disabled=${allGames.length === 0}
                onClick=${() => setSelectedGame(allGames[Math.floor(Math.random() * allGames.length)])}
                className="border-4 text-white hover:bg-white hover:text-black font-black py-4 px-10 transition-all flex items-center gap-3 rgb-border"
              >
                <i className="fas fa-shuffle"></i> [ RANDOM_INIT ]
              </button>
            </div>
          </div>
        </section>

        <div className="mb-10 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          ${CATEGORIES.map(cat => html`
            <button
              key=${cat}
              onClick=${() => setSelectedCategory(cat)}
              className=${`px-6 py-2 text-xl font-black border-4 transition-all ${
                selectedCategory === cat 
                ? 'rgb-bg text-black border-white' 
                : 'bg-black text-white hover:rgb-border'
              }`}
            >
              ${cat.toUpperCase()}
            </button>
          `)}
        </div>

        ${favoriteGames.length > 0 && !searchQuery && selectedCategory === 'All' && html`
          <section className="mb-16">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 rgb-text">
              <i className="fas fa-heart"></i> FAVORITE_SECTORS.DIR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              ${favoriteGames.map(game => html`
                <${GameCard} key=${game.id} game=${game} isFavorite=${true} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
              `)}
            </div>
          </section>
        `}

        <section id="all-games">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-black rgb-text">
              ${searchQuery ? `SEARCH_QUERY: "${searchQuery.toUpperCase()}"` : 'APPLICATIONS_LIBRARY.DIR'}
            </h2>
            <span className="rgb-text text-sm font-mono opacity-50">${filteredGames.length} MODULES_FOUND</span>
          </div>
          
          ${filteredGames.length > 0 ? html`
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              ${filteredGames.map(game => html`
                <div key=${game.id} className="relative group">
                  <${GameCard} game=${game} isFavorite=${favorites.includes(game.id)} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
                  ${localGames.some(lg => lg.id === game.id) && showAdmin && html`
                    <button 
                      onClick=${(e) => deleteLocalGame(game.id, e)}
                      className="absolute top-2 left-2 bg-red-600 text-white p-2 border-2 border-white hover:bg-red-700 transition-all z-30 font-bold hover:scale-110"
                    >
                      [ TERMINATE ]
                    </button>
                  `}
                </div>
              `)}
            </div>
          ` : html`
            <div className="text-center py-20 border-4 border-dashed rgb-border">
              <p className="rgb-text text-3xl font-black">404 - DATA_NOT_FOUND_IN_SECTOR</p>
              <button 
                onClick=${() => {setSearchQuery(''); setSelectedCategory('All');}}
                className="mt-6 text-white border-2 px-6 py-2 hover:rgb-bg hover:text-black transition-all font-black uppercase"
              >
                [ RESET_FILTERS ]
              </button>
            </div>
          `}
        </section>
      </main>

      <footer className="mt-20 border-t-4 rgb-border py-12 text-center bg-black">
        <p className="rgb-text text-xl font-black tracking-[10px] uppercase">JUSTINS ARCADE (C) 1994-2024</p>
        <div className="flex justify-center gap-10 mt-6 text-[10px] text-white/30 font-mono uppercase">
           <span>STORAGE: ${(JSON.stringify(localGames).length / 1024).toFixed(2)} KB</span>
           <span>ENGINE: JUSTIN_CORE_V3</span>
           <span>ENCRYPTION: RGB_V3_ACTIVE</span>
        </div>
      </footer>
    </div>
  `;
};

export default App;
