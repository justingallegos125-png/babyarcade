
import React, { useState } from 'react';

const GamePlayer = ({ game, onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950">
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back to Hub</span>
          </button>
          <div className="h-6 w-[1px] bg-slate-800"></div>
          <h2 className="font-bold text-indigo-400 truncate max-w-[200px] sm:max-w-md">
            {game.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all"
            title="Reload"
          >
            <i className="fas fa-redo"></i>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all"
            title="Fullscreen"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden">
        <iframe
          id="game-iframe"
          src={game.iframeUrl}
          title={game.title}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay; gamepad; fullscreen"
        />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50 text-xs text-slate-500">
            Game provided by {new URL(game.iframeUrl).hostname}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
