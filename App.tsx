
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import GamePlayer from './components/GamePlayer';
import GameLoader from './components/GameLoader';
import ProxyPortal from './components/ProxyPortal';
import CustomizationModal from './components/CustomizationModal';
import DataModal from './components/DataModal';
import UnityLauncher from './components/UnityLauncher';
import TutorialOverlay from './components/TutorialOverlay';
import { GAMES as BASE_GAMES, CATEGORIES } from './constants';
import { Game, DataPackage } from './types';
import { THEMES, Theme } from './themes';

const AuthGate = ({ onCorrect }: { onCorrect: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.toUpperCase() === 'JOSH') {
      onCorrect();
    } else {
      setError(true);
      setPass('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0221] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff00ff_0%,transparent_50%)] animate-pulse"></div>
      </div>

      <div className="w-full max-w-md border-4 border-accent p-8 bg-black/80 backdrop-blur-md shadow-[0_0_50px_rgba(255,0,255,0.2)] relative z-10 glow-border">
        <div className="mb-6">
          <p className="text-accent text-xs mb-2">CYBER OS v3.0.1 - (C) 2026 NEON ARCADE</p>
          <p className="text-secondary text-[10px] font-mono">ENCRYPTION: AES-256-GCM - PROXY NODE: ACTIVE</p>
        </div>
        
        <h1 className="text-4xl font-black mb-8 text-center tracking-widest glitch text-accent font-graffiti">SYSTEM ACCESS</h1>
        
        <form onSubmit={check} className="space-y-6">
          <div className="space-y-2">
            <label className="text-secondary text-sm block uppercase tracking-tighter font-black">Enter Access Code:</label>
            <input 
              type="password"
              autoFocus
              className="w-full bg-black/50 border-2 border-accent p-3 text-2xl text-center tracking-[1em] text-white focus:border-secondary transition-colors"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full border-4 border-accent text-white py-4 hover:bg-accent hover:text-black transition-all font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            [ INITIALIZE CORE ]
          </button>
          {error && <p className="text-red-500 text-center font-bold animate-pulse mt-4 uppercase text-xs">ERR: ACCESS DENIED - RETRY SEQUENCE</p>}
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [localGames, setLocalGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showProxy, setShowProxy] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showThemeNotify, setShowThemeNotify] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cyber-arcade-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setCurrentTheme(parsed);
        applyTheme(parsed);
      } catch (e) {
        applyTheme(THEMES[0]);
      }
    } else {
      applyTheme(THEMES[0]);
      // Show notification after 5 seconds if no theme saved
      const timer = setTimeout(() => setShowThemeNotify(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-secondary', theme.secondary);
    root.style.setProperty('--retro-dark', theme.bg);
    root.style.setProperty('--glow', theme.glow);
    
    // Determine text color based on background brightness
    const isDark = theme.bg === '#000000' || theme.bg === '#0d0221' || theme.bg === '#241734' || theme.bg === '#0f172a' || theme.bg === '#111827';
    const textColor = isDark ? '#ffffff' : '#000000';
    root.style.setProperty('--text-color', textColor);
    
    // Update body styles directly for pattern and font
    document.body.style.backgroundImage = theme.pattern === 'none' ? 'none' : `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, ${theme.bg} 100%), ${theme.pattern}`;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = textColor;
    
    // Update graffiti font class
    const style = document.getElementById('dynamic-theme-style') || document.createElement('style');
    style.id = 'dynamic-theme-style';
    style.innerHTML = `
      .font-graffiti { font-family: ${theme.font} !important; }
      .text-white { color: var(--text-color) !important; }
      .bg-black { background-color: var(--retro-dark) !important; }
      .border-accent { border-color: var(--accent) !important; }
      .border-secondary { border-color: var(--accent-secondary) !important; }
    `;
    if (!document.getElementById('dynamic-theme-style')) document.head.appendChild(style);
  };

  const handleUpdateTheme = (updates: Partial<Theme>) => {
    const newTheme = { ...currentTheme, ...updates };
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('cyber-arcade-theme', JSON.stringify(newTheme));
  };

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
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (isAuthorized) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isAuthorized) return;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const htmlFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.html'));
        if (htmlFiles.length > 0) {
          const processed = await Promise.all(htmlFiles.map(async (file) => {
            const content = await new Promise<string>((res) => {
              const reader = new FileReader();
              reader.onload = (ev) => res(ev.target?.result as string);
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
            } as Game;
          }));
          addLocalGames(processed);
          alert(`SYSTEM: ${processed.length} GAMES AUTO INGESTED SUCCESSFULLY.`);
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

  const handleRestore = (dataPackage: any) => {
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

  const handleProxyLaunch = (proxyUrl: string) => {
    const proxyGame: Game = {
      id: 'proxy-' + Date.now(),
      title: 'CYBER PROXY SESSION',
      description: 'SECURE PROXY TUNNEL ACTIVE',
      category: 'YouTube',
      iframeUrl: proxyUrl,
      tags: ['proxy', 'external']
    };
    setSelectedGame(proxyGame);
  };

  const allGames = useMemo(() => [...BASE_GAMES, ...localGames], [localGames]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addLocalGames = (newGames: Game | Game[]) => {
    const gamesToAdd = Array.isArray(newGames) ? newGames : [newGames];
    setLocalGames(prev => {
      const existingTitles = new Set(prev.map(g => g.title));
      const filtered = gamesToAdd.filter(g => !existingTitles.has(g.title));
      return [...prev, ...filtered];
    });
    setShowLoader(false);
  };

  const deleteLocalGame = (id: string, e: React.MouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if(confirm("TERMINATE THIS GAME PERMANENTLY?")) {
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
    return <AuthGate onCorrect={handleAuth} />;
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onHome={() => setSelectedGame(null)} 
          onOpenLoader={() => setShowLoader(true)}
          onOpenData={() => setShowData(true)}
          onOpenHelp={() => setShowTutorial(true)}
          onOpenProxy={() => setShowProxy(true)}
          onOpenCustom={() => setShowCustom(true)}
        />
        <GamePlayer 
          game={selectedGame} 
          onBack={() => setSelectedGame(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white transition-colors duration-500">
      {isDragging && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center border-[20px] border-dashed border-accent pointer-events-none">
          <i className="fas fa-file-import text-9xl text-accent animate-bounce mb-10"></i>
          <h2 className="text-6xl font-black text-accent tracking-tighter uppercase glitch font-graffiti">READY FOR INGEST</h2>
          <p className="text-2xl text-white font-black mt-4 opacity-70 tracking-widest uppercase">DROP HTML FILES ANYWHERE TO AUTO LOAD</p>
        </div>
      )}

      {showTutorial && <TutorialOverlay onClose={closeTutorial} onOpenLoader={() => setShowLoader(true)} />}

      <UnityLauncher 
        games={allGames} 
        favorites={favorites} 
        onSelectGame={setSelectedGame} 
        onHome={() => setSelectedGame(null)} 
        activeGameId={selectedGame?.id}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-6 z-50 px-8 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <Navbar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onHome={() => setSelectedGame(null)} 
              onOpenLoader={() => setShowLoader(true)}
              onOpenData={() => setShowData(true)}
              onOpenHelp={() => setShowTutorial(true)}
              onOpenProxy={() => setShowProxy(true)}
              onOpenCustom={() => setShowCustom(true)}
            />
          </div>
        </div>
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 pt-12">
          {showLoader && <GameLoader onSave={addLocalGames} onClose={() => setShowLoader(false)} />}
          {showProxy && <ProxyPortal onLaunch={handleProxyLaunch} onClose={() => setShowProxy(false)} />}
          {showCustom && <CustomizationModal currentTheme={currentTheme} onUpdateTheme={handleUpdateTheme} onClose={() => setShowCustom(false)} />}
          {showData && <DataModal localGames={localGames} favorites={favorites} onRestore={handleRestore} onClose={() => setShowData(false)} />}

          {showThemeNotify && (
            <div className="fixed bottom-10 right-24 z-[150] bg-black border-4 border-accent p-6 shadow-[0_0_30px_rgba(255,0,255,0.3)] max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
              <button onClick={() => setShowThemeNotify(false)} className="absolute top-2 right-2 text-white/50 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
              <h4 className="text-accent font-black uppercase tracking-tighter mb-2">Visual Calibration Suggestion</h4>
              <p className="text-xs text-white/80 mb-4 font-mono uppercase">Don't like the way the site looks? Change it! Add custom fonts, colors, and patterns in the customization tab.</p>
              <button 
                onClick={() => { setShowCustom(true); setShowThemeNotify(false); }}
                className="w-full border-2 border-accent py-2 text-[10px] font-black uppercase hover:bg-accent hover:text-black transition-all"
              >
                [ OPEN CUSTOMIZER ]
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <section className="lg:col-span-2 border-[12px] border-accent p-12 bg-black/40 backdrop-blur-sm shadow-[20px_20px_0px_var(--accent-secondary)] relative overflow-hidden flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-network-wired text-9xl text-white"></i>
              </div>
              <div className="relative">
                <h1 className="text-8xl font-black mb-6 tracking-tighter glitch text-accent font-graffiti uppercase leading-none">
                  JOSHY'S ARCADE
                </h1>
                <p className="text-2xl mb-12 text-secondary opacity-90 font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-4 h-4 bg-accent animate-pulse"></span>
                  [ SYSTEM ONLINE ] - BYPASS ACTIVE
                </p>
                <div className="flex flex-wrap gap-6">
                  <button 
                    disabled={allGames.length === 0}
                    onClick={() => setSelectedGame(allGames[Math.floor(Math.random() * allGames.length)])}
                    className="bg-accent text-black border-4 border-black font-black py-5 px-12 transition-all flex items-center gap-3 uppercase text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[8px_8px_0px_#000]"
                  >
                    <i className="fas fa-random"></i> [ RANDOM ]
                  </button>
                  <button 
                    onClick={() => setShowProxy(true)}
                    className="bg-secondary text-white border-4 border-black font-black py-5 px-12 transition-all flex items-center gap-3 uppercase text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[8px_8px_0px_#000]"
                  >
                    <i className="fas fa-network-wired"></i> [ PROXY ]
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-rows-2 gap-8">
              <div className="bg-black border-8 border-secondary p-8 flex flex-col justify-center items-center text-center shadow-[10px_10px_0px_var(--accent)]">
                <i className="fas fa-upload text-5xl text-secondary mb-4"></i>
                <h3 className="text-2xl font-black text-white uppercase mb-2">Ingest Game</h3>
                <p className="text-xs text-white/60 uppercase font-mono mb-6">Drop HTML files to expand library</p>
                <button 
                  onClick={() => setShowLoader(true)}
                  className="w-full border-4 border-secondary py-3 text-white font-black uppercase hover:bg-secondary hover:text-black transition-all"
                >
                  [ LOAD GAME ]
                </button>
              </div>
              <div className="bg-black border-8 border-accent p-8 flex flex-col justify-center items-center text-center shadow-[10px_10px_0px_var(--accent-secondary)]">
                <i className="fas fa-database text-5xl text-accent mb-4"></i>
                <h3 className="text-2xl font-black text-white uppercase mb-2">System Data</h3>
                <p className="text-xs text-white/60 uppercase font-mono mb-6">Manage local storage & backups</p>
                <button 
                  onClick={() => setShowData(true)}
                  className="w-full border-4 border-accent py-3 text-white font-black uppercase hover:bg-accent hover:text-black transition-all"
                >
                  [ ACCESS DATA ]
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12 flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 text-2xl font-black border-4 transition-all uppercase ${
                  selectedCategory === cat 
                  ? 'bg-accent text-black border-white' 
                  : 'bg-black text-white hover:border-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {favoriteGames.length > 0 && !searchQuery && selectedCategory === 'All' && (
            <section className="mb-20">
              <h2 className="text-4xl font-black mb-10 flex items-center gap-4 text-accent uppercase tracking-tighter font-graffiti">
                <i className="fas fa-star"></i> FAVORITE GAMES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {favoriteGames.map(game => (
                  <GameCard key={game.id} game={game} isFavorite={true} onToggleFavorite={toggleFavorite} onClick={setSelectedGame} />
                ))}
              </div>
            </section>
          )}

          <section id="all-games">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-4xl font-black text-accent uppercase tracking-tighter font-graffiti">
                {searchQuery ? `QUERY: "${searchQuery.toUpperCase()}"` : 'SYSTEM RESOURCES'}
              </h2>
              <span className="text-accent text-xl font-black opacity-50 font-mono">{filteredGames.length} GAMES LOCATED</span>
            </div>
            
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredGames.map(game => (
                  <div key={game.id} className="relative group">
                    <GameCard game={game} isFavorite={favorites.includes(game.id)} onToggleFavorite={toggleFavorite} onClick={setSelectedGame} />
                    {localGames.some(lg => lg.id === game.id) && (
                      <button 
                        onClick={(e) => deleteLocalGame(game.id, e)}
                        className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 border-2 border-white hover:bg-red-800 transition-all z-30 font-black text-xs uppercase opacity-0 group-hover:opacity-100"
                      >
                        [ DELETE ]
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-8 border-dashed border-accent">
                <p className="text-accent text-4xl font-black uppercase">ERR: SECTOR EMPTY - NO DATA</p>
                <p className="text-white/40 mt-4 uppercase font-black text-xl">DROP ANY HTML GAME FILE HERE TO AUTO PUT IT IN THE SITE</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                  className="mt-10 text-white border-4 border-accent px-10 py-4 hover:bg-accent hover:text-black transition-all font-black uppercase text-xl"
                >
                  [ RESET FILTERS ]
                </button>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-32 pb-20 px-8">
          <div className="max-w-7xl mx-auto border-t-2 border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-accent text-2xl font-black tracking-widest uppercase font-graffiti mb-2">JOSHY'S ARCADE</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-mono">NEURAL BYPASS ENGINE // V3.0.1</p>
            </div>
            
            <div className="flex gap-12 text-[10px] text-white/40 font-mono uppercase font-black tracking-widest">
               <div className="flex flex-col gap-2">
                 <span className="text-accent/60">STORAGE</span>
                 <span className="text-white">{(JSON.stringify(localGames).length / 1024).toFixed(2)} KB</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-accent/60">STATUS</span>
                 <span className="text-white animate-pulse">ENCRYPTED</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-accent/60">UPTIME</span>
                 <span className="text-white">STABLE</span>
               </div>
            </div>

            <div className="flex gap-4">
               {['TWITTER', 'DISCORD', 'GITHUB'].map(social => (
                 <button key={social} className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all">
                   <i className={`fab fa-${social.toLowerCase()}`}></i>
                 </button>
               ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
