
import React, { useRef, useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const DataModal = ({ localGames, favorites, onRestore, onClose }) => {
  const fileInputRef = useRef(null);
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

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
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

  return html`
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-black border-8 w-full max-w-xl rgb-border shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden">
        <div className="p-6 border-b-4 rgb-border bg-black flex justify-between items-center">
          <h2 className="text-3xl font-black rgb-text tracking-tighter uppercase glitch">DATA TERMINAL V1</h2>
          <button onClick=${onClose} className="border-4 w-10 h-10 flex items-center justify-center text-white hover:rgb-bg hover:text-black transition-all rgb-border">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 space-y-8 bg-black">
          <div className="border-4 p-6 bg-white/5 rgb-border relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
            <h3 className="text-xl font-black rgb-text mb-4 uppercase tracking-widest">ARCADE BACKUP</h3>
            <p className="text-sm text-white/60 mb-6 uppercase leading-tight">Extract all locally installed modules and user favorites into a secure JSON container for migration.</p>
            <button 
              onClick=${handleExport}
              className="w-full border-4 py-4 text-white font-black hover:rgb-bg hover:text-black transition-all uppercase tracking-[0.3em] rgb-border"
            >
              [ RUN BACKUP SEQUENCE ]
            </button>
          </div>

          <div className="border-4 p-6 border-dashed border-white/20 hover:rgb-border transition-all cursor-pointer relative group" onClick=${() => fileInputRef.current.click()}>
            <input type="file" accept=".json" className="hidden" ref=${fileInputRef} onChange=${handleImport} />
            <div className="flex flex-col items-center gap-3 py-4">
              <i className="fas fa-file-import text-4xl rgb-text"></i>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">RESTORE DATA</h3>
              <p className="text-[10px] text-white/40 uppercase">Drag & Drop backup file here</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase">
             <span>LOCAL MODULES: ${localGames.length}</span>
             <span className=${status !== 'READY' ? 'rgb-text font-black scale-125 transition-all' : ''}>STATUS: ${status}</span>
             <span>FAVORITES: ${favorites.length}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default DataModal;
