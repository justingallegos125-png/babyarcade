
import React, { useState, useRef, useEffect } from 'react';
import htm from 'htm';
import { GameCategory } from '../types.js';
import GameIcon from './GameIcon.js';

const html = htm.bind(React.createElement);

const AdminPanel = ({ onSave, onClose }) => {
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    category: 'Action',
    htmlContent: ''
  });
  const [batchGames, setBatchGames] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const htmlFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.html'));
    if (htmlFiles.length === 0) {
      setIsProcessing(false);
      alert("ERROR: No .html files detected. You must provide HTML files to play games.");
      return;
    }
    const processed = await Promise.all(htmlFiles.map(async (file) => {
      const content = await readFileAsText(file);
      const title = file.name.replace('.html', '').replace(/[-_]/g, ' ');
      return {
        id: 'local-' + Math.random().toString(36).substr(2, 9),
        title: title,
        description: `MODULE ${title.toUpperCase()}`,
        category: gameData.category,
        htmlContent: content,
        iframeUrl: '',
        tags: ['local', 'auto put', gameData.category.toLowerCase()]
      };
    }));
    setBatchGames(prev => [...prev, ...processed]);
    setIsProcessing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (batchGames.length > 0) {
      onSave(batchGames);
      return;
    }
    if (!gameData.title || !gameData.htmlContent) {
      alert("TITLE AND HTML PAYLOAD REQUIRED.");
      return;
    }
    const newGame = {
      id: 'local-' + Date.now(),
      title: gameData.title,
      description: gameData.description || `MODULE ${gameData.title.toUpperCase()}`,
      category: gameData.category,
      htmlContent: gameData.htmlContent,
      iframeUrl: '',
      tags: ['local', gameData.category.toLowerCase()]
    };
    onSave(newGame);
  };

  return html`
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-black border-8 w-full max-w-3xl overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.15)] flex flex-col max-h-[90vh] rgb-border">
        <div className="p-6 border-b-4 flex justify-between items-center bg-black rgb-border">
          <h2 className="text-4xl font-black rgb-text flex items-center gap-4 tracking-tighter uppercase glitch">
            <i className="fas fa-microchip"></i> ARCADE AUTO PUT LOADER
          </h2>
          <button onClick=${onClose} className="border-4 w-12 h-12 flex items-center justify-center text-white hover:rgb-bg hover:text-black transition-all rgb-border">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="bg-red-900/20 p-4 border-b-4 rgb-border">
          <p className="text-[#00ff41] font-black text-center uppercase tracking-widest animate-pulse">
            !! SYSTEM STATUS: STANDBY - AUTO PUT ANY HTML GAME FILES HERE !!
          </p>
        </div>

        <form onSubmit=${handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick=${() => fileInputRef.current?.click()}
              className=${`group border-4 border-dashed p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-full ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/20 hover:rgb-border'
              }`}
            >
              <input type="file" accept=".html" multiple className="hidden" ref=${fileInputRef} onChange=${(e) => handleFiles(e.target.files)} />
              <i className="fas fa-upload text-4xl rgb-text"></i>
              <p className="text-sm font-black text-white text-center uppercase tracking-widest">AUTO PUT FILES</p>
              <p className="text-[10px] text-white/40 uppercase">Select .html game files</p>
            </div>

            <div 
              onClick=${() => folderInputRef.current?.click()}
              className=${`group border-4 border-dashed p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-full ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/20 hover:rgb-border'
              }`}
            >
              <input type="file" webkitdirectory="true" directory="true" className="hidden" ref=${folderInputRef} onChange=${(e) => handleFiles(e.target.files)} />
              <i className="fas fa-folder-open text-4xl rgb-text"></i>
              <p className="text-sm font-black text-white text-center uppercase tracking-widest">AUTO PUT FOLDER</p>
              <p className="text-[10px] text-white/40 uppercase">Ingest entire directory of modules</p>
            </div>
          </div>

          <div className="border-4 p-8 bg-black/50 rgb-border flex flex-col items-center justify-center border-dashed group">
             <i className="fas fa-mouse-pointer text-2xl rgb-text mb-2 group-hover:scale-125 transition-transform"></i>
             <p className="text-white font-black uppercase text-center tracking-tighter">TIP: YOU CAN ALSO DRAG AND DROP FILES ANYWHERE ON THE MAIN SITE TO AUTO PUT THEM INTO THE ARCADE.</p>
          </div>

          ${batchGames.length > 0 && html`
            <div className="border-4 p-4 rgb-border bg-white/5">
               <div className="flex justify-between items-center mb-4">
                 <p className="text-xl font-black rgb-text uppercase tracking-tighter">MODULES READY FOR PUT</p>
                 <span className="text-white bg-black border px-2 font-mono text-xs">${batchGames.length} MODULES</span>
               </div>
               <div className="max-h-40 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar pr-2">
                  ${batchGames.map(g => html`
                    <div key=${g.id} className="flex items-center gap-3 border-b border-white/10 pb-1">
                      <div className="w-8 h-8 border border-white/20">
                         <${GameIcon} title=${g.title} />
                      </div>
                      <div className="flex-1 truncate uppercase">
                        <span className="text-white">></span> RECOGNIZED: ${g.title}
                      </div>
                      <button type="button" onClick=${() => setBatchGames(prev => prev.filter(pg => pg.id !== g.id))} className="text-red-500 hover:rgb-text">[X]</button>
                    </div>
                  `)}
               </div>
            </div>
          `}

          <div className="pt-4">
            <button 
              type="submit"
              disabled=${isProcessing || (batchGames.length === 0 && !gameData.htmlContent)}
              className=${`w-full border-8 text-white font-black py-5 transition-all uppercase tracking-[0.5em] text-2xl rgb-border ${
                isProcessing || (batchGames.length === 0 && !gameData.htmlContent) ? 'opacity-30 cursor-not-allowed' : 'hover:rgb-bg hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              }`}
            >
              [ ${batchGames.length > 0 ? `AUTO PUT ALL ${batchGames.length}` : 'PUT SINGLE MODULE'} ]
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

export default AdminPanel;
