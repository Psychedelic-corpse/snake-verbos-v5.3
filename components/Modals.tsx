import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X, Share2 } from 'lucide-react';
import { Cell, GameState } from '../types';

interface ShadowModalProps {
  isOpen: boolean;
  targetContent: string;
  onDecide: (jump: boolean) => void;
}

export const ShadowModal: React.FC<ShadowModalProps> = ({ isOpen, targetContent, onDecide }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">¡Casilla Ocupada!</h3>
                <p className="text-slate-400">
                  Ya has usado el verbo <span className="text-indigo-400 font-bold">{targetContent}</span>.
                </p>
                <p className="text-sm text-slate-500 mt-2">¿Quieres saltar al siguiente disponible?</p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <button 
                  onClick={() => onDecide(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 font-semibold flex justify-center items-center gap-2 hover:bg-slate-600"
                >
                  <X className="w-4 h-4" /> No
                </button>
                <button 
                  onClick={() => onDecide(true)}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold flex justify-center items-center gap-2 hover:bg-indigo-500"
                >
                  <Check className="w-4 h-4" /> Sí, Saltar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface GameOverModalProps {
  isOpen: boolean;
  history: number[];
  snakePath: Cell[];
  onReset: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, history, snakePath, onReset }) => {
  if (!isOpen) return null;

  // Generate Summary Data
  const visitedVerbs = history.map(idx => snakePath[idx]?.content).filter(Boolean);
  const summaryText = `He completado el Snake de Verbos v3.1!\nVerbos practicados: ${visitedVerbs.length}\n${visitedVerbs.join(', ')}`;

  return (
    <div className="fixed inset-0 bg-slate-900 z-[70] flex flex-col overflow-y-auto">
      <div className="p-6 max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center gap-6">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            ¡Felicidades!
          </h2>
          <p className="text-slate-400">Has llegado a la meta.</p>
        </motion.div>

        <div className="bg-white p-4 rounded-xl shadow-xl">
           <QRCodeSVG value={summaryText} size={200} />
        </div>

        <div className="text-center max-w-xs">
          <p className="text-sm text-slate-500 mb-4">Escanea para guardar tu progreso</p>
          <div className="bg-slate-800 rounded-lg p-4 text-left max-h-40 overflow-y-auto border border-slate-700">
            <h4 className="text-xs font-bold text-indigo-400 mb-2 uppercase">Historial ({visitedVerbs.length})</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {visitedVerbs.join(' → ')}
            </p>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 bg-indigo-600 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-900/50 mt-auto mb-8"
        >
          Jugar de Nuevo
        </button>
      </div>
    </div>
  );
};