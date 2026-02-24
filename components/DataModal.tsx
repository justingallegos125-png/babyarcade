
import React, { useRef, useState } from 'react';
import { Game } from '../types';

interface DataModalProps {
  localGames: Game[];
  favorites: string[];
  onRestore: (data: any) => void;
  onClose: () => void;
}

const DataModal: React.FC<DataModalProps> = ({ localGames, favorites, onRestore, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('READY');

  const handleExport = () => {
    const dataPackage = {
      version: '2.1.0',
      timestamp: new Date().toISOString(),
      localGames: localGames,
      favorites: favorites
    };
    const blob = new Blob([JSON.stringify(dataPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JOSH_ARCADE_BACKUP_${new Date().getTime()}.json`.replace(/_/g, ' ');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('BACKUP COMPLETE');
    setTimeout(() => setStatus('READY'), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.localGames && Array.isArray(data.localGames)) {
          if (confirm("RESTORE WILL MERGE DATA. CONTINUE?")) {
            onRestore(data);
            setStatus('RESTORE SUCCESS');
            setTimeout(() => {
                setStatus('READY');
                onClose();
            }, 2000);
          }
        } else {
          alert("ERR: INVALID DATA STRUCTURE");
        }
      } catch (err) {
        alert("ERR: DATA CORRUPTION DETECTED");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-black border-2 border-accent/20 w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col">
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-graffiti">Data Terminal</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Neural Bypass Engine // Storage Unit</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest font-graffiti">Arcade Backup</h3>
            <p className="text-[10px] text-white/50 mb-6 uppercase tracking-widest leading-relaxed">Extract all locally installed games and user favorites into a secure JSON container for migration.</p>
            <button 
              onClick={handleExport}
              className="w-full bg-accent text-black py-4 rounded-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
            >
              Run Backup Sequence
            </button>
          </div>

          <div 
            className="bg-white/5 rounded-2xl p-8 border-2 border-dashed border-white/10 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer flex flex-col items-center gap-4 group" 
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <i className="fas fa-file-import text-xl"></i>
            </div>
            <div className="text-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Restore Data</h3>
              <p className="text-[9px] text-white/30 uppercase mt-1">Select backup .json file</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest pt-4 border-t border-white/5">
             <div className="flex flex-col gap-1">
               <span>GAMES</span>
               <span className="text-white">{localGames.length}</span>
             </div>
             <div className="flex flex-col gap-1 items-center">
               <span>STATUS</span>
               <span className={status !== 'READY' ? 'text-accent font-black animate-pulse' : 'text-white'}>{status}</span>
             </div>
             <div className="flex flex-col gap-1 items-end">
               <span>FAVORITES</span>
               <span className="text-white">{favorites.length}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
