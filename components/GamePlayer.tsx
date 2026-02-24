
import React, { useState, useMemo, useEffect } from 'react';
import { Game } from '../types';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const gameUrl = useMemo(() => {
    if (game.iframeUrl) return game.iframeUrl;
    if (game.htmlContent) {
      const blob = new Blob([game.htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }
    return null;
  }, [game.iframeUrl, game.htmlContent]);

  // Reset loading state when game changes
  useEffect(() => {
    setIsLoading(true);
  }, [game.id]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (gameUrl && gameUrl.startsWith('blob:')) {
        URL.revokeObjectURL(gameUrl);
      }
    };
  }, [gameUrl]);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      if (!isFullscreen) {
        if (iframe.requestFullscreen) iframe.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Controls Bar - Floating Style */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6 pointer-events-none">
        <div className="bg-black/80 border-2 border-accent/30 rounded-full p-2 flex items-center justify-between backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="flex items-center gap-4 pl-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all"
              title="EXIT"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <h2 className="font-black text-white truncate max-w-[200px] sm:max-w-md uppercase text-sm tracking-widest">
              {game.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <button 
              onClick={() => {
                const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
                if (iframe) {
                  setIsLoading(true);
                  iframe.src = iframe.src;
                }
              }}
              className="w-10 h-10 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              title="RELOAD"
            >
              <i className="fas fa-sync-alt text-xs"></i>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              title="FULLSCREEN"
            >
              <i className="fas fa-expand text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Iframe Area */}
      <div className="flex-1 relative bg-black">
        {isLoading && gameUrl && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(0,255,0,0.5)]"></div>
              <div className="absolute inset-4 border-2 border-secondary/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-microchip text-accent text-xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-accent font-black text-2xl tracking-[0.4em] uppercase glitch mb-3">INITIALIZING</h3>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className="w-3 h-1 bg-accent/40 rounded-full overflow-hidden"
                  >
                    <div 
                      className="w-full h-full bg-accent animate-[shimmer_1.5s_infinite]" 
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.5em] mt-6">Establishing Secure Link...</p>
            </div>
          </div>
        )}

        {gameUrl ? (
          <iframe
            id="game-iframe"
            src={gameUrl}
            title={game.title}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-none"
            allowFullScreen
            allow="autoplay; gamepad; fullscreen"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-accent font-black uppercase">ERR: NO LOADABLE CONTENT</p>
          </div>
        )}
        
        {/* Status Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm border-2 border-white/10 rounded-full px-4 py-1.5 text-[9px] text-white/50 font-mono uppercase tracking-widest">
            NODE: {(() => {
              try {
                if (!gameUrl) return 'OFFLINE';
                if (gameUrl.startsWith('blob:')) return 'LOCAL_BLOB';
                const urlObj = new URL(gameUrl, window.location.origin);
                if (urlObj.pathname === '/api/proxy') {
                  const target = urlObj.searchParams.get('url');
                  if (target) return new URL(target).hostname;
                }
                return urlObj.hostname;
              } catch (e) {
                return 'REMOTE';
              }
            })()}
          </div>
          <div className="bg-accent/10 backdrop-blur-sm border-2 border-accent/20 rounded-full px-4 py-1.5 text-[9px] text-accent font-mono uppercase tracking-widest animate-pulse">
            SECURE LINK: ESTABLISHED
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
