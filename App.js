
import React, { useState, useEffect, useMemo } from 'react';
import htm from 'htm';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GamePlayer from './components/GamePlayer.js';
import AdminPanel from './components/AdminPanel.js';
import DataModal from './components/DataModal.js';
import UnityLauncher from './components/UnityLauncher.js';
import TutorialOverlay from './components/TutorialOverlay.js';
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
      <div className="w-full max-w-md border-4 p-8 bg-black rgb-border shadow-[0_0_50px_rgba(255,255,255,0.05)]">
        <div className="mb-6">
          <p className="rgb-text text-xs mb-2">JOSH OS v2.1.2 - (C) 2024 JOSHYS ARCADE</p>
          <p className="text-white/40 text-[10px] font-mono">KERNEL: 0x800412AF - AUTO INGEST DAEMON: ACTIVE</p>
        </div>
        
        <h1 className="text-4xl font-black mb-8 text-center tracking-widest glitch rgb-text">ACCESS REQUIRED</h1>
        
        <form onSubmit=${check} className="space-y-6">
          <div className="space-y-2">
            <label className="rgb-text text-sm block uppercase tracking-tighter">Enter Auth Token:</label>
            <input 
              type="password"
              autoFocus
              className="w-full bg-black border-2 p-3 text-2xl text-center tracking-[1em] rgb-border text-white"
              value=${pass}
              onChange=${(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full border-4 text-white py-4 hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest rgb-border">
            [ INITIALIZE ARCADE ]
          </button>
          ${error && html`<p className="text-red-500 text-center font-bold animate-pulse mt-4 uppercase text-xs">ERR: AUTH FAILURE - RETRY SEQUENCE</p>`}
        </form>
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
  const [showData, setShowData] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('josh-favs');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }
    const savedGames = localStorage.getItem('josh-local-games');
    if (savedGames) {
      try { setLocalGames(JSON.parse(savedGames)); } catch (e) { console.error(e); }
    }
    const authorized = sessionStorage.getItem('josh-auth');
    if (authorized) setIsAuthorized(true);

    const tutorialShown = localStorage.getItem('josh-tutorial-shown');
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('josh-favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('josh-local-games', JSON.stringify(localGames));
    } catch (e) {
      console.error("Storage Error:", e);
    }
  }, [localGames]);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (isAuthorized) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isAuthorized) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const htmlFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.html'));
        if (htmlFiles.length > 0) {
          const processed = await Promise.all(htmlFiles.map(async (file) => {
            const content = await new Promise((res) => {
              const reader = new FileReader();
              reader.onload = (ev) => res(ev.target.result);
              reader.readAsText(file);
            });
            const title = file.name.replace('.html', '').replace(/[-_]/g, ' ');
            return {
              id: 'local-' + Math.random().toString(36).substr(2, 9),
              title: title,
              description: `AUTO INGESTED ${title.toUpperCase()}`,
              category: 'Action',
              htmlContent: content,
              iframeUrl: '',
              tags: ['local', 'auto-ingest']
            };
          }));
          addLocalGames(processed);
          alert(`SYSTEM: ${processed.length} MODULES AUTO INGESTED SUCCESSFULLY.`);
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isAuthorized, localGames]);

  const handleAuth = () => {
    setIsAuthorized(true);
    sessionStorage.setItem('josh-auth', 'true');
  };

  const handleRestore = (dataPackage) => {
    if (dataPackage.localGames) {
      addLocalGames(dataPackage.localGames);
    }
    if (dataPackage.favorites) {
      setFavorites(prev => Array.from(new Set([...prev, ...dataPackage.favorites])));
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('josh-tutorial-shown', 'true');
  };

  const allGames = useMemo(() => [...BASE_GAMES, ...localGames], [localGames]);

  const toggleFavorite = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
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
    if(confirm("TERMINATE THIS MODULE PERMANENTLY?")) {
      setLocalGames(prev => prev.filter(g => g.id !== id));
    }
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

  return html`
    <div className="min-h-screen flex bg-black">
      ${isDragging && html`
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center border-[20px] border-dashed rgb-border pointer-events-none">
          <i className="fas fa-file-import text-9xl rgb-text animate-bounce mb-10"></i>
          <h2 className="text-6xl font-black rgb-text tracking-tighter uppercase glitch">READY FOR AUTO INGEST</h2>
          <p className="text-2xl text-white font-black mt-4 opacity-70 tracking-widest uppercase">DROP HTML FILES ANYWHERE TO AUTO ADD TO SITE</p>
        </div>
      `}

      ${showTutorial && html`<${TutorialOverlay} onClose=${closeTutorial} onOpenAdmin=${() => setShowAdmin(true)} />`}

      <${UnityLauncher} 
        games=${allGames} 
        favorites=${favorites} 
        onSelectGame=${setSelectedGame} 
        onHome=${() => setSelectedGame(null)} 
        activeGameId=${selectedGame?.id}
      />

      <div className="flex-1 flex flex-col ml-16 min-h-screen">
        <${Navbar} 
          searchQuery=${searchQuery} 
          setSearchQuery=${setSearchQuery} 
          onHome=${() => setSelectedGame(null)} 
          onOpenAdmin=${() => setShowAdmin(true)} 
          onOpenData=${() => setShowData(true)}
          onOpenHelp=${() => setShowTutorial(true)}
        />
        
        ${selectedGame ? html`
          <${GamePlayer} game=${selectedGame} onBack=${() => setSelectedGame(null)} />
        ` : html`
          <main className="flex-1 max-w-7xl mx-auto w-full px-8 pt-10">
            ${showAdmin && html`<${AdminPanel} onSave=${addLocalGames} onClose=${() => setShowAdmin(false)} />`}
            ${showData && html`<${DataModal} localGames=${localGames} favorites=${favorites} onRestore=${handleRestore} onClose=${() => setShowData(false)} />`}

            <section className="mb-12 border-8 p-12 bg-black rgb-border shadow-[0_0_60px_rgba(255,255,255,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <i className="fas fa-microchip text-9xl text-white"></i>
              </div>
              <div className="relative">
                <h1 className="text-7xl font-black mb-4 tracking-tighter glitch rgb-text">
                  JOSHYS ARCADE OS V2.1.2
                </h1>
                <p className="text-xl mb-12 rgb-text opacity-90 font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                  [ AUTO INGEST READY ] - DROP FILES ANYWHERE TO AUTO LOAD
                </p>
                <div className="flex gap-4">
                  <button 
                    disabled=${allGames.length === 0}
                    onClick=${() => setSelectedGame(allGames[Math.floor(Math.random() * allGames.length)])}
                    className="border-4 text-white hover:bg-white hover:text-black font-black py-4 px-10 transition-all flex items-center gap-3 rgb-border uppercase text-xl"
                  >
                    <i className="fas fa-random"></i> [ RUN RANDOM ]
                  </button>
                  <button 
                    onClick=${() => setShowData(true)}
                    className="border-4 text-white hover:bg-white hover:text-black font-black py-4 px-10 transition-all flex items-center gap-3 rgb-border uppercase text-xl"
                  >
                    <i className="fas fa-save"></i> [ SAVE MY DATA ]
                  </button>
                </div>
              </div>
            </section>

            <div className="mb-12 flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
              ${CATEGORIES.map(cat => html`
                <button
                  key=${cat}
                  onClick=${() => setSelectedCategory(cat)}
                  className=${`px-8 py-3 text-2xl font-black border-4 transition-all uppercase ${
                    selectedCategory === cat 
                    ? 'rgb-bg text-black border-white' 
                    : 'bg-black text-white hover:rgb-border'
                  }`}
                >
                  ${cat}
                </button>
              `)}
            </div>

            ${favoriteGames.length > 0 && !searchQuery && selectedCategory === 'All' && html`
              <section className="mb-20">
                <h2 className="text-4xl font-black mb-10 flex items-center gap-4 rgb-text uppercase tracking-tighter">
                  <i className="fas fa-star"></i> FAVORITE MODULES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  ${favoriteGames.map(game => html`
                    <${GameCard} key=${game.id} game=${game} isFavorite=${true} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
                  `)}
                </div>
              </section>
            `}

            <section id="all-games">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-black rgb-text uppercase tracking-tighter">
                  ${searchQuery ? `QUERY: "${searchQuery.toUpperCase()}"` : 'SYSTEM RESOURCES'}
                </h2>
                <span className="rgb-text text-xl font-black opacity-50 font-mono">${filteredGames.length} MODULES LOCATED</span>
              </div>
              
              ${filteredGames.length > 0 ? html`
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  ${filteredGames.map(game => html`
                    <div key=${game.id} className="relative group">
                      <${GameCard} game=${game} isFavorite=${favorites.includes(game.id)} onToggleFavorite=${toggleFavorite} onClick=${setSelectedGame} />
                      ${localGames.some(lg => lg.id === game.id) && html`
                        <button 
                          onClick=${(e) => deleteLocalGame(game.id, e)}
                          className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 border-2 border-white hover:bg-red-800 transition-all z-30 font-black text-xs uppercase opacity-0 group-hover:opacity-100"
                        >
                          [ DELETE ]
                        </button>
                      `}
                    </div>
                  `)}
                </div>
              ` : html`
                <div className="text-center py-24 border-8 border-dashed rgb-border">
                  <p className="rgb-text text-4xl font-black uppercase">ERR: SECTOR EMPTY - NO DATA</p>
                  <p className="text-white/40 mt-4 uppercase font-black text-xl">DROP ANY HTML GAME FILE HERE TO AUTO PUT IT IN THE SITE</p>
                  <button 
                    onClick=${() => {setSearchQuery(''); setSelectedCategory('All');}}
                    className="mt-10 text-white border-4 px-10 py-4 hover:rgb-bg hover:text-black transition-all font-black uppercase text-xl rgb-border"
                  >
                    [ RESET FILTERS ]
                  </button>
                </div>
              `}
            </section>
          </main>
        `}

        <footer className="mt-24 border-t-8 rgb-border py-16 text-center bg-black">
          <p className="rgb-text text-3xl font-black tracking-[15px] uppercase">JOSHYS ARCADE (C) 2024</p>
          <div className="flex justify-center gap-12 mt-8 text-xs text-white/20 font-mono uppercase font-black">
             <span>SYSTEM STORAGE: ${(JSON.stringify(localGames).length / 1024).toFixed(2)} KB</span>
             <span>OS: JOSH OS V2.1.2</span>
             <span>TUTORIAL PROTOCOL: READY</span>
          </div>
        </footer>
      </div>
    </div>
  `;
};

export default App;
