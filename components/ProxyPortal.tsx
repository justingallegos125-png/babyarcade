import React, { useState } from 'react';

interface ProxyPortalProps {
  onClose: () => void;
  onLaunch: (url: string) => void;
}

const ProxyPortal: React.FC<ProxyPortalProps> = ({ onClose, onLaunch }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let targetUrl = url.trim();
    
    // Simple regex to check if it looks like a URL/domain
    const isUrl = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i.test(targetUrl);
    
    if (isUrl) {
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
    } else {
      // Treat as search query - use gbv=1 for basic version which is more proxy-friendly
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}&gbv=1`;
    }
    
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
    onLaunch(proxyUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-black border-8 border-secondary w-full max-w-3xl overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.15)] flex flex-col relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 border-4 border-secondary w-10 h-10 flex items-center justify-center text-white hover:bg-secondary hover:text-black transition-all z-10">
          <i className="fas fa-times text-lg"></i>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-12">
          {/* Cyber Proxy Logo */}
          <div className="text-center select-none flex flex-col items-center">
            <div className="relative mb-6">
               <div className="w-24 h-24 border-4 border-secondary flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-500">
                  <i className="fas fa-network-wired text-4xl text-secondary -rotate-45 group-hover:-rotate-90 transition-transform duration-500"></i>
               </div>
               <div className="absolute -bottom-2 -right-6 bg-accent text-white font-black px-3 py-1 text-xs uppercase tracking-widest border-2 border-white skew-x-[-10deg]">
                 ALPHA
               </div>
            </div>
            <h1 className="text-6xl font-black tracking-tighter font-graffiti glitch retro-text-shadow text-white uppercase">
              Cyber Proxy
            </h1>
            <p className="text-[10px] text-secondary mt-2 tracking-[0.5em] uppercase font-black opacity-50">
              NEURAL BYPASS ENGINE // PROTOCOL 3.0.1
            </p>
          </div>

          {/* Search/URL Bar Area */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary text-xl">
                <i className="fas fa-terminal"></i>
              </div>
              <input 
                type="text"
                autoFocus
                placeholder="ENTER URL OR SEARCH QUERY..."
                className="w-full bg-black/40 border-4 border-secondary py-6 pl-16 pr-16 text-xl text-white font-mono-readable focus:border-accent focus:shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-all outline-none uppercase tracking-tighter"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary text-black w-14 h-14 flex items-center justify-center hover:bg-accent transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] group"
              >
                <i className="fas fa-chevron-right text-2xl group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>

            <div className="flex justify-center gap-8">
               <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  ENCRYPTION: ACTIVE
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  NODE: SECURE
               </div>
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
             {['GOOGLE', 'YOUTUBE', 'GITHUB', 'REDDIT'].map(site => (
               <button 
                key={site}
                type="button"
                onClick={() => setUrl(site.toLowerCase() + '.com')}
                className="bg-white/5 border-2 border-secondary/20 p-3 hover:border-secondary hover:bg-secondary/10 transition-all text-[10px] font-black uppercase text-white tracking-widest"
               >
                 {site}
               </button>
             ))}
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-secondary/5 border-t-4 border-secondary/20 p-4 flex justify-center">
          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.3em]">
            SYSTEM BYPASS AUTHORIZED // NO LOGS RECORDED
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProxyPortal;
