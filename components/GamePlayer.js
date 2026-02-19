
import React, { useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const GamePlayer = ({ game, onBack }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INIT_BOOT_SEQUENCE...');

  const steps = [
    { threshold: 15, text: 'MOUNTING_REMOTE_DRIVE...' },
    { threshold: 30, text: 'PARSING_MANIFEST.DIR...' },
    { threshold: 50, text: 'EXTRACTING_CHROMA_SECTORS...' },
    { threshold: 75, text: 'DECRYPTING_NEON_ASSETS...' },
    { threshold: 90, text: 'VERIFYING_RGB_CHECKSUM...' },
    { threshold: 100, text: 'EXECUTION_READY.' }
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 1200);
      }
      
      setProgress(currentProgress);
      const currentStep = steps.find(s => currentProgress <= s.threshold) || steps[steps.length - 1];
      setLoadingText(currentStep.text);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const toggleFs = () => {
    const frame = document.getElementById('game-frame');
    if (frame) {
      if (!fullscreen) {
        if (frame.requestFullscreen) frame.requestFullscreen();
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
        else if (frame.msRequestFullscreen) frame.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
      setFullscreen(!fullscreen);
    }
  };

  return html`
    <div className="flex flex-col h-[calc(100vh-88px)] bg-black overflow-hidden border-t-4 rgb-border">
      <div className="bg-black border-b-4 p-4 flex items-center justify-between z-10 rgb-border">
        <button onClick=${onBack} className="text-white border-4 px-6 py-2 hover:rgb-bg hover:text-black transition-all text-lg uppercase font-black rgb-border">
          [ EXIT_TERMINAL ]
        </button>
        <h2 className="font-black truncate px-6 text-3xl tracking-widest rgb-text glitch">
          RUNNING: ${game.title.toUpperCase()}.EXE
        </h2>
        <div className="flex gap-3">
          <button onClick=${() => window.location.reload()} className="w-14 h-12 border-4 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button onClick=${toggleFs} className="w-14 h-12 border-4 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border">
            <i className=${fullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-black overflow-hidden relative">
        ${loading && html`
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-10 border-8 m-6 rgb-border">
            <div className="w-full max-w-2xl space-y-12">
              <div className="flex flex-col items-center gap-8">
                <div className="text-center">
                  <h3 className="text-6xl font-black tracking-[0.3em] glitch rgb-text uppercase">LOADING_ARCADE</h3>
                  <p className="text-2xl font-mono mt-6 tracking-widest uppercase rgb-text">${loadingText}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end text-2xl font-black rgb-text uppercase tracking-widest">
                  <span>UNPACKING_DATA...</span>
                  <span>${Math.round(progress)}%</span>
                </div>
                <div className="w-full h-12 bg-black border-4 p-2 rgb-border">
                  <div 
                    className="h-full rgb-bg transition-all duration-300"
                    style=${{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm rgb-text opacity-50 font-mono uppercase font-black">
                  <span>ADDR: 0xCHROMA_BUFF</span>
                  <span>STATUS: NEON_STABLE</span>
                </div>
              </div>

              <div className="border-4 p-6 flex items-center gap-8 bg-black rgb-border">
                <div className="w-24 h-24 border-4 flex items-center justify-center rgb-border">
                   <i className="fas fa-bolt text-5xl animate-pulse rgb-text"></i>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-2xl font-black rgb-text truncate">MODULE: ${game.title.toUpperCase()}</p>
                   <p className="text-lg text-white/60 uppercase">CLASS: [${game.category.toUpperCase()}]</p>
                </div>
              </div>
            </div>
          </div>
        `}

        <iframe
          id="game-frame"
          srcdoc=${game.htmlContent || undefined}
          src=${!game.htmlContent ? (game.iframeUrl || '') : undefined}
          className=${`w-full h-full border-none transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; gamepad; fullscreen; keyboard"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals allow-presentation"
          title=${game.title}
        ></iframe>

        <div className="absolute bottom-6 right-6 pointer-events-none transition-all">
           <div className="bg-black/80 border-2 px-4 py-2 rgb-border">
              <p className="rgb-text text-[12px] font-black tracking-widest uppercase">POWER_CHROMA_ACTIVE // 60FPS</p>
           </div>
        </div>
      </div>
    </div>
  `;
};

export default GamePlayer;
