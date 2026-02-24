
import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
  onOpenLoader: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose, onOpenLoader }) => {
  const [mode, setMode] = useState<'ask' | 'guide'>('ask');
  const [guideStep, setGuideStep] = useState(0);

  const guideSteps = [
    {
      title: "STEP 1: ACCESS THE LOADER",
      text: "CLICK THE [ LOAD ] BUTTON IN THE TOP RIGHT CORNER OR SIMPLY DRAG ANY .HTML FILE DIRECTLY ONTO THIS WINDOW.",
      icon: "fas fa-upload"
    },
    {
      title: "STEP 2: INITIALIZE GAMES",
      text: "USE THE DASHED BOX TO SELECT YOUR FILES. THE SYSTEM WILL AUTOMATICALLY INITIALIZE THEM INTO YOUR LOCAL LIBRARY.",
      icon: "fas fa-file-import"
    }
  ];

  const handleNo = () => {
    setMode('guide');
  };

  const handleNext = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      onOpenLoader();
      onClose();
    }
  };

  if (mode === 'ask') {
    return (
      <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-black border-8 border-accent max-w-xl w-full p-10 shadow-[0_0_100px_rgba(0,255,65,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <i className="fas fa-question-circle text-9xl"></i>
          </div>
          
          <h2 className="text-4xl font-black text-accent mb-6 uppercase tracking-tighter glitch font-graffiti">
            KNOWLEDGE CHECK
          </h2>
          
          <p className="text-2xl font-bold text-white mb-12 uppercase leading-tight">
            DO YOU KNOW HOW TO IMPORT GAMES INTO THIS TERMINAL?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              className="border-4 border-accent p-6 text-white font-black hover:bg-white hover:text-black transition-all uppercase tracking-widest text-lg"
            >
              [ YES ]
            </button>
            <button 
              onClick={handleNo}
              className="border-4 border-accent p-6 text-white font-black hover:bg-accent hover:text-black transition-all uppercase tracking-widest text-lg"
            >
              [ NO ]
            </button>
          </div>
          
          <p className="mt-8 text-[10px] font-mono text-white/30 uppercase text-center">
            SYSTEM VERSION 2.1.2 // GAME INGESTION PROTOCOL
          </p>
        </div>
      </div>
    );
  }

  const current = guideSteps[guideStep];

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-black border-8 border-accent max-w-xl w-full p-10 shadow-[0_0_100px_rgba(0,255,65,0.1)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent flex items-center justify-center">
              <i className={`${current.icon} text-accent`}></i>
            </div>
            <h2 className="text-2xl font-black text-accent uppercase tracking-tighter font-graffiti">
              {current.title}
            </h2>
          </div>
          <span className="text-white/40 font-mono text-xs font-black uppercase">
            PHASE {guideStep + 1}/{guideSteps.length}
          </span>
        </div>

        <p className="text-xl font-bold text-white mb-12 uppercase leading-relaxed">
          {current.text}
        </p>

        <div className="flex gap-4">
           <button 
            onClick={handleNext}
            className="flex-1 border-4 border-accent p-5 text-white font-black hover:bg-accent hover:text-black transition-all uppercase tracking-[0.2em] text-xl"
          >
            {guideStep === guideSteps.length - 1 ? '[ OPEN LOADER ]' : '[ NEXT PHASE ]'}
          </button>
        </div>

        <div className="mt-8 h-2 bg-white/10 w-full overflow-hidden">
           <div 
             className="h-full bg-accent transition-all duration-500"
             style={{ width: `${((guideStep + 1) / guideSteps.length) * 100}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
