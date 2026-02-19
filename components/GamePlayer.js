
import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const GamePlayer = ({ game, onBack }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFs = () => {
    const frame = document.getElementById('game-frame');
    if (frame) {
      if (!fullscreen) frame.requestFullscreen?.();
      else document.exitFullscreen?.();
      setFullscreen(!fullscreen);
    }
  };

  return html`
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between">
        <button onClick=${onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
          <i className="fas fa-chevron-left"></i> Back
        </button>
        <h2 className="text-indigo-400 font-bold truncate px-4">${game.title}</h2>
        <div className="flex gap-2">
          <button onClick=${() => window.location.reload()} className="p-2 text-slate-400 hover:text-white"><i className="fas fa-sync-alt"></i></button>
          <button onClick=${toggleFs} className="p-2 text-slate-400 hover:text-white"><i className="fas fa-expand"></i></button>
        </div>
      </div>
      <div className="flex-1 bg-black overflow-hidden relative">
        <iframe
          id="game-frame"
          src=${game.iframeUrl}
          className="w-full h-full border-none"
          allow="autoplay; gamepad; fullscreen"
        ></iframe>
      </div>
    </div>
  `;
};

export default GamePlayer;
