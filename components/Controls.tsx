import React from 'react';
import { motion } from 'framer-motion';
import { Dices, RotateCcw, Eye, MonitorPlay, Trophy } from 'lucide-react';
import { GameState } from '../types';

interface ControlsProps {
  gameState: GameState;
  onRoll: () => void;
  onReset: () => void;
  onToggleView: () => void;
  tenseLabel: string;
}

export const Controls: React.FC<ControlsProps> = ({ gameState, onRoll, onReset, onToggleView, tenseLabel }) => {
  
  // Determine dice rotation for CSS 3D effect
  // This is a simplified mapping. Real physics dice would need 3D state.
  const getDiceRotation = (val: number | null) => {
    switch(val) {
        case 1: return 'rotateY(0deg)';
        case 2: return 'rotateY(-90deg)';
        case 3: return 'rotateY(180deg)';
        case 4: return 'rotateY(90deg)';
        case 5: return 'rotateX(-90deg)';
        case 6: return 'rotateX(90deg)';
        default: return 'rotateX(45deg) rotateY(45deg)'; // Spinning state
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-50 p-4 pb-8 flex flex-col justify-end h-screen">
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
         <button onClick={onToggleView} className="p-2 bg-slate-800/80 rounded-full text-white backdrop-blur border border-slate-600">
            {gameState.viewMode === 'board' ? <MonitorPlay size={20} /> : <Eye size={20} />}
         </button>
         <button onClick={onReset} className="p-2 bg-slate-800/80 rounded-full text-red-400 backdrop-blur border border-slate-600">
            <RotateCcw size={20} />
         </button>
      </div>

      {/* Main HUD */}
      <div className="w-full max-w-md mx-auto pointer-events-auto space-y-4">
        
        {/* Status Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl">
           <div className="flex items-center justify-between">
              
              {/* D6 Visual */}
              <div className="scene-3d w-16 h-16">
                  <div className="cube" style={{ transform: getDiceRotation(gameState.diceMove) }}>
                      <div className="cube__face face-front bg-indigo-600">1</div>
                      <div className="cube__face face-back bg-indigo-600">6</div>
                      <div className="cube__face face-right bg-indigo-600">4</div>
                      <div className="cube__face face-left bg-indigo-600">3</div>
                      <div className="cube__face face-top bg-indigo-600">5</div>
                      <div className="cube__face face-bottom bg-indigo-600">2</div>
                  </div>
              </div>

              {/* Tense Info */}
              <div className="flex-1 px-4 text-center">
                  <div className="text-[10px] uppercase text-slate-400 tracking-wider mb-1">D8 Tiempo Verbal</div>
                  <motion.div 
                     key={tenseLabel}
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="text-lg font-bold text-emerald-400 leading-tight"
                  >
                     {tenseLabel}
                  </motion.div>
                  <div className="text-xs text-slate-500 mt-1">Valor: {gameState.diceTense ?? '-'}</div>
              </div>

           </div>
        </div>

        {/* Action Button */}
        {gameState.phase === 'summary' ? (
           <button className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 animate-bounce">
              <Trophy /> ¡Aventura Completada!
           </button>
        ) : (
           <button 
             onClick={onRoll}
             className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 active:from-indigo-700 active:to-purple-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 transition-transform active:scale-95"
           >
             <Dices className="w-6 h-6" /> LANZAR DADOS 3D
           </button>
        )}
      </div>
    </div>
  );
};