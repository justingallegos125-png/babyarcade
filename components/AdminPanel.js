
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
      return;
    }

    if (htmlFiles.length === 1 && !folderInputRef.current.files.length) {
      const content = await readFileAsText(htmlFiles[0]);
      const title = htmlFiles[0].name.replace('.html', '').replace(/[-_]/g, ' ');
      setGameData(prev => ({
        ...prev,
        htmlContent: content,
        title: title
      }));
      setBatchGames([]);
    } else {
      const processed = await Promise.all(htmlFiles.map(async (file) => {
        const content = await readFileAsText(file);
        const title = file.name.replace('.html', '').replace(/[-_]/g, ' ');
        return {
          id: 'local-' + Math.random().toString(36).substr(2, 9),
          title: title,
          description: `MODULE_${title.toUpperCase()}`,
          category: gameData.category,
          htmlContent: content,
          iframeUrl: '',
          tags: ['local', 'batch', gameData.category.toLowerCase()]
        };
      }));
      setBatchGames(processed);
    }
    setIsProcessing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (batchGames.length > 0) {
      onSave(batchGames);
      return;
    }

    if (!gameData.title || !gameData.htmlContent) return;

    const newGame = {
      id: 'local-' + Date.now(),
      title: gameData.title,
      description: gameData.description || `MODULE_${gameData.title.toUpperCase()}`,
      category: gameData.category,
      htmlContent: gameData.htmlContent,
      iframeUrl: '',
      tags: ['local', gameData.category.toLowerCase()]
    };

    onSave(newGame);
  };

  return html`
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl">
      <div className="bg-black border-8 w-full max-w-3xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.2)] flex flex-col max-h-[90vh] rgb-border">
        <div className="p-6 border-b-4 flex justify-between items-center bg-black rgb-border">
          <h2 className="text-4xl font-black rgb-text flex items-center gap-4 tracking-tighter uppercase glitch">
            <i className="fas fa-microchip"></i> MODULE_LOADER
          </h2>
          <button onClick=${onClose} className="border-4 w-12 h-12 flex items-center justify-center text-white hover:rgb-bg hover:text-black transition-all rgb-border">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit=${handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick=${() => fileInputRef.current?.click()}
              className=${`group border-4 border-dashed p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-full ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/20 hover:rgb-border'
              }`}
            >
              <input 
                type="file" 
                accept=".html" 
                multiple
                className="hidden" 
                ref=${fileInputRef}
                onChange=${(e) => handleFiles(e.target.files)}
              />
              <i className="fas fa-file-import text-4xl rgb-text"></i>
              <p className="text-sm font-black text-white text-center uppercase tracking-widest">FILES_INJECTION.LNK</p>
              <p className="text-[10px] text-white/40 uppercase">Select single or multiple HTML</p>
            </div>

            <div 
              onClick=${() => folderInputRef.current?.click()}
              className=${`group border-4 border-dashed p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-full ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/20 hover:rgb-border'
              }`}
            >
              <input 
                type="file" 
                webkitdirectory="true"
                directory="true"
                className="hidden" 
                ref=${folderInputRef}
                onChange=${(e) => handleFiles(e.target.files)}
              />
              <i className="fas fa-folder-tree text-4xl rgb-text"></i>
              <p className="text-sm font-black text-white text-center uppercase tracking-widest">DIRECTORY_EXTRACTION.DIR</p>
              <p className="text-[10px] text-white/40 uppercase">Extract all HTML from a folder</p>
            </div>
          </div>

          ${batchGames.length > 0 && html`
            <div className="border-4 p-4 rgb-border bg-[#ff00ff]/5">
               <div className="flex justify-between items-center mb-4">
                 <p className="text-xl font-black rgb-text uppercase tracking-tighter">BATCH_QUEUE_SYNCED</p>
                 <span className="text-white bg-black border px-2 font-mono text-xs">${batchGames.length} MODULES</span>
               </div>
               <div className="max-h-40 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar pr-2">
                  ${batchGames.map(g => html`
                    <div key=${g.id} className="flex items-center gap-3 border-b border-white/10 pb-1">
                      <div className="w-8 h-8 border border-white/20">
                         <${GameIcon} title=${g.title} />
                      </div>
                      <div className="flex-1 truncate">
                        <span className="text-[#00ff41]">></span> LOADED: ${g.title}
                      </div>
                    </div>
                  `)}
               </div>
               <p className="mt-4 text-sm rgb-text font-black uppercase animate-pulse">Ready to persist batch to local storage.</p>
            </div>
          `}

          ${batchGames.length === 0 && html`
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-3">
                  <label className="text-lg font-black rgb-text uppercase tracking-widest">APP_NAME</label>
                  <input 
                    type="text" 
                    className="w-full p-4 outline-none text-xl font-black"
                    placeholder="Enter Game Title"
                    value=${gameData.title}
                    onChange=${(e) => setGameData({...gameData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-black rgb-text uppercase tracking-widest">SECTOR</label>
                  <select 
                    className="w-full p-4 outline-none text-xl font-black"
                    value=${gameData.category}
                    onChange=${(e) => setGameData({...gameData, category: e.target.value})}
                  >
                    ${Object.values(GameCategory).map(cat => html`<option key=${cat} value=${cat}>${cat.toUpperCase()}</option>`)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-black rgb-text uppercase tracking-widest">PREVIEW_CHROMA_ICON</label>
                <div className="flex gap-4">
                  <div className="w-24 h-24 border-4 rgb-border bg-black shrink-0 overflow-hidden relative group">
                    <${GameIcon} title=${gameData.title || 'Preview'} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-[10px] rgb-text opacity-70 uppercase tracking-widest">The icon color scheme is derived automatically from the game title for a unique RGB experience.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-black rgb-text uppercase tracking-widest">SOURCE_PAYLOAD (HTML)</label>
                <textarea 
                  className="w-full p-4 h-32 outline-none font-mono text-xs rgb-border"
                  placeholder="Paste HTML source here or upload above..."
                  value=${gameData.htmlContent}
                  onChange=${(e) => setGameData({...gameData, htmlContent: e.target.value})}
                />
              </div>
            </div>
          `}

          <div className="pt-6">
            <button 
              type="submit"
              disabled=${isProcessing || (batchGames.length === 0 && !gameData.htmlContent)}
              className=${`w-full border-8 text-white font-black py-6 transition-all uppercase tracking-[1em] text-2xl rgb-border ${
                isProcessing || (batchGames.length === 0 && !gameData.htmlContent) ? 'opacity-30 cursor-not-allowed' : 'hover:rgb-bg hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]'
              }`}
            >
              [ ${batchGames.length > 0 ? `EXEC_BATCH_${batchGames.length}` : 'INJECT_CORE'} ]
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

export default AdminPanel;
