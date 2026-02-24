
import React, { useState, useRef } from 'react';
import { Game } from '../types';
import GameIcon from './GameIcon';

interface GameLoaderProps {
  onSave: (games: Game | Game[]) => void;
  onClose: () => void;
}

const GameLoader: React.FC<GameLoaderProps> = ({ onSave, onClose }) => {
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    category: 'Action',
    htmlContent: ''
  });
  const [batchGames, setBatchGames] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
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
        description: `GAME ${title.toUpperCase()}`,
        category: gameData.category,
        htmlContent: content,
        iframeUrl: '',
        tags: ['local', 'auto put', gameData.category.toLowerCase()]
      };
    }));
    setBatchGames(prev => [...prev, ...processed]);
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchGames.length > 0) {
      onSave(batchGames);
      return;
    }
    if (!gameData.title || !gameData.htmlContent) {
      alert("TITLE AND HTML PAYLOAD REQUIRED.");
      return;
    }
    const newGame: any = {
      id: 'local-' + Date.now(),
      title: gameData.title,
      description: gameData.description || `GAME ${gameData.title.toUpperCase()}`,
      category: gameData.category,
      htmlContent: gameData.htmlContent,
      iframeUrl: '',
      tags: ['local', gameData.category.toLowerCase()]
    };
    onSave(newGame);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-black border-2 border-accent/20 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh]">
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-graffiti">
              Game Ingestor
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Neural Bypass Engine // Expansion Unit</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/10 hover:border-accent hover:bg-accent/5'
              }`}
            >
              <input type="file" accept=".html" multiple className="hidden" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <i className="fas fa-file-upload text-xl"></i>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-white uppercase tracking-widest">Upload Files</p>
                <p className="text-[9px] text-white/30 uppercase mt-1">Select .html games</p>
              </div>
            </div>

            <div 
              onClick={() => folderInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isProcessing ? 'animate-pulse opacity-50' : 'border-white/10 hover:border-accent hover:bg-accent/5'
              }`}
            >
              <input type="file" {...({ webkitdirectory: "true", directory: "true" } as any)} className="hidden" ref={folderInputRef} onChange={(e) => handleFiles(e.target.files)} />
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <i className="fas fa-folder-open text-xl"></i>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-white uppercase tracking-widest">Ingest Folder</p>
                <p className="text-[9px] text-white/30 uppercase mt-1">Load entire directory</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
               <i className="fas fa-info-circle"></i>
             </div>
             <p className="text-[10px] text-white/60 uppercase tracking-widest leading-relaxed">
               Tip: Drag and drop files anywhere on the main interface to automatically load them into the system.
             </p>
          </div>

          {batchGames.length > 0 && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
               <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                 <p className="text-xs font-black text-white uppercase tracking-widest">Games Ready</p>
                 <span className="text-[9px] font-mono bg-accent text-black px-2 py-0.5 rounded-full">{batchGames.length} UNITS</span>
               </div>
               <div className="max-h-40 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {batchGames.map(g => (
                    <div key={g.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
                         <i className="fas fa-cube text-[10px]"></i>
                      </div>
                      <div className="flex-1 truncate text-[10px] text-white/80 uppercase tracking-widest font-mono">
                        {g.title}
                      </div>
                      <button type="button" onClick={() => setBatchGames(prev => prev.filter(pg => pg.id !== g.id))} className="w-6 h-6 rounded-full hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-center">
                        <i className="fas fa-times text-[10px]"></i>
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isProcessing || (batchGames.length === 0 && !gameData.htmlContent)}
              className={`w-full bg-accent text-black font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-sm ${
                isProcessing || (batchGames.length === 0 && !gameData.htmlContent) ? 'opacity-30 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,0,255,0.2)]'
              }`}
            >
              {batchGames.length > 0 ? `Initialize ${batchGames.length} Games` : 'Load Single Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameLoader;
