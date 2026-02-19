
import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const TutorialOverlay = ({ onClose, onOpenAdmin }) => {
  const [mode, setMode] = useState('ask'); // 'ask' or 'guide'
  const [guideStep, setGuideStep] = useState(0);

  const guideSteps = [
    {
      title: "STEP 1: ACCESS THE LOADER",
      text: "CLICK THE [ ADMIN ] BUTTON IN THE TOP RIGHT CORNER OR SIMPLY DRAG ANY .HTML FILE DIRECTLY ONTO THIS WINDOW.",
      icon: "fas fa-tools"
    },
    {
      title: "STEP 2: AUTO PUT MODULES",
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
      onOpenAdmin();
      onClose();
    }
  };

  if (mode === 'ask') {
    return html`
      <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-black border-8 rgb-border max-w-xl w-full p-10 shadow-[0_0_100px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <i className="fas fa-question-circle text-9xl"></i>
          </div>
          
          <h2 className="text-4xl font-black rgb-text mb-6 uppercase tracking-tighter glitch">
            KNOWLEDGE CHECK
          </h2>
          
          <p className="text-2xl font-bold text-white mb-12 uppercase leading-tight">
            DO YOU KNOW HOW TO IMPORT GAMES INTO THIS TERMINAL?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick=${onClose}
              className="border-4 p-6 text-white font-black hover:bg-white hover:text-black transition-all uppercase tracking-widest rgb-border text-lg"
            >
              [ YES ]
            </button>
            <button 
              onClick=${handleNo}
              className="border-4 p-6 text-white font-black hover:rgb-bg hover:text-black transition-all uppercase tracking-widest rgb-border text-lg"
            >
              [ NO ]
            </button>
          </div>
          
          <p className="mt-8 text-[10px] font-mono text-white/30 uppercase text-center">
            SYSTEM VERSION 2.1.2 // MODULE INGESTION PROTOCOL
          </p>
        </div>
      </div>
    `;
  }

  const current = guideSteps[guideStep];

  return html`
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-black border-8 rgb-border max-w-xl w-full p-10 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 flex items-center justify-center rgb-border">
              <i className="${current.icon} rgb-text"></i>
            </div>
            <h2 className="text-2xl font-black rgb-text uppercase tracking-tighter">
              ${current.title}
            </h2>
          </div>
          <span className="text-white/40 font-mono text-xs font-black uppercase">
            PHASE ${guideStep + 1}/${guideSteps.length}
          </span>
        </div>

        <p className="text-xl font-bold text-white mb-12 uppercase leading-relaxed">
          ${current.text}
        </p>

        <div className="flex gap-4">
           <button 
            onClick=${handleNext}
            className="flex-1 border-4 p-5 text-white font-black hover:rgb-bg hover:text-black transition-all uppercase tracking-[0.2em] rgb-border text-xl"
          >
            ${guideStep === guideSteps.length - 1 ? '[ OPEN LOADER ]' : '[ NEXT PHASE ]'}
          </button>
        </div>

        <div className="mt-8 h-2 bg-white/10 w-full overflow-hidden">
           <div 
             className="h-full rgb-bg transition-all duration-500"
             style=${{ width: `${((guideStep + 1) / guideSteps.length) * 100}%` }}
           ></div>
        </div>
      </div>
    </div>
  `;
};

export default TutorialOverlay;
