
import React, { useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const GamePlayer = ({ game, onBack }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INIT BOOT SEQUENCE...');

  const steps = [
    { threshold: 15, text: 'MOUNTING SYSTEM ASSETS...' },
    { threshold: 30, text: 'ALLOCATING VRAM...' },
    { threshold: 50, text: 'INJECTING PAYLOAD...' },
    { threshold: 75, text: 'SYNCING INPUT LAYER...' },
    { threshold: 90, text: 'FINAL CHECKSUM OK...' },
    { threshold: 100, text: 'SYSTEM STABLE READY.' }
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 12 + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 800);
      }
      
      setProgress(currentProgress);
      const currentStep = steps.find(s => currentProgress <= s.threshold) || steps[steps.length - 1];
      setLoadingText(currentStep.text);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    let content = game.htmlContent;
    if (!content && game.iframeUrl) {
      content = `
<!DOCTYPE html>
<html>
<head>
    <title>${game.title}</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="${game.iframeUrl}" allow="autoplay; gamepad; fullscreen; keyboard"></iframe>
</body>
</html>`;
    }
    if (!content) {
      alert("ERROR: NO DATA TO EXTRACT");
      return;
    }
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.title.replace(/\s+/g, ' ').toUpperCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <div className="flex flex-col h-[calc(100vh-88px)] bg-black overflow-hidden border-t-8 rgb-border">
      <div className="bg-black border-b-8 p-4 flex items-center justify-between z-10 rgb-border">
        <button onClick=${onBack} className="text-white border-4 px-6 py-2 hover:rgb-bg hover:text-black transition-all text-xl uppercase font-black rgb-border">
          [ EXIT TERMINAL ]
        </button>
        <h2 className="font-black truncate px-6 text-4xl tracking-tighter rgb-text glitch">
          RUNNING: ${game.title.toUpperCase()}.EXE
        </h2>
        <div className="flex gap-4">
          <button onClick=${handleDownload} className="w-14 h-12 border-4 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border" title="DOWNLOAD MODULE">
            <i className="fas fa-download"></i>
          </button>
          <button onClick=${() => window.location.reload()} className="w-14 h-12 border-4 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border" title="RELOAD">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button onClick=${toggleFs} className="w-14 h-12 border-4 flex items-center justify-center text-white hover:scale-110 transition-all rgb-border" title="FULLSCREEN">
            <i className=${fullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-black overflow-hidden relative">
        ${loading && html`
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 border-[12px] m-10 rgb-border">
            <div className="w-full max-w-3xl space-y-16">
              <div className="flex flex-col items-center gap-10">
                <div className="text-center">
                  <h3 className="text-7xl font-black tracking-[0.2em] glitch rgb-text uppercase">JOSH OS LOADER</h3>
                  <p className="text-3xl font-black mt-8 tracking-widest uppercase rgb-text">${loadingText}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end text-3xl font-black rgb-text uppercase tracking-widest">
                  <span>BOOTING MODULE...</span>
                  <span>${Math.round(progress)}%</span>
                </div>
                <div className="w-full h-16 bg-black border-4 p-2 rgb-border">
                  <div 
                    className="h-full rgb-bg transition-all duration-200 shadow-[0_0_20px_white]"
                    style=${{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs rgb-text opacity-40 font-mono uppercase font-black">
                  <span>BLOCK: 0x889AFF2</span>
                  <span>SECURE BOOT: ENABLED</span>
                </div>
              </div>

              <div className="border-4 p-8 flex items-center gap-10 bg-black rgb-border">
                <div className="w-24 h-24 border-8 flex items-center justify-center rgb-border animate-bounce">
                   <i className="fas fa-bolt text-5xl rgb-text"></i>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-4xl font-black rgb-text truncate uppercase">${game.title}</p>
                   <p className="text-xl text-white/60 uppercase font-black mt-2">TYPE: [${game.category.toUpperCase()}]</p>
                </div>
              </div>
            </div>
          </div>
        `}

        <iframe
          id="game-frame"
          srcdoc=${game.htmlContent || undefined}
          src=${!game.htmlContent ? (game.iframeUrl || '') : undefined}
          className=${`w-full h-full border-none transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; gamepad; fullscreen; keyboard"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals allow-presentation"
          title=${game.title}
        ></iframe>

        <div className="absolute bottom-8 right-8 pointer-events-none transition-all">
           <div className="bg-black/90 border-4 px-6 py-3 rgb-border shadow-2xl">
              <p className="rgb-text text-lg font-black tracking-widest uppercase">JOSHYS ARCADE PRO // 120FPS</p>
           </div>
        </div>
      </div>
    </div>
  `;
};

export default GamePlayer;
