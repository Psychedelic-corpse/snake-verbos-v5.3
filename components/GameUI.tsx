import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1, Users, Sun, Moon, ArrowLeft, Home, Power, Send, User, PlayCircle, Eye, EyeOff } from 'lucide-react';
import { GameState, CharacterId, ViewMode, Player } from '../types';
import { CHARACTERS } from '../data/gameConfig';
import { QRCodeSVG } from 'qrcode.react';

// --- 1. MAIN MENU ---
interface MainMenuProps {
    onStart: (count: 1 | 2) => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, theme, onThemeToggle }) => {
    const [players, setPlayers] = useState<1 | 2>(2);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-slate-900 to-rose-950 opacity-60 z-0"></div>
            
            <div className="relative z-10 w-full max-w-sm space-y-8 text-center">
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-2"
                >
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">
                        Conjugando Verbos
                    </h1>
                    <p className="text-slate-400 text-sm tracking-widest uppercase">v5.2 Final Release</p>
                </motion.div>

                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl space-y-6 shadow-2xl">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-3 tracking-wider">Modo de Juego</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setPlayers(1)}
                                className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2 ${players === 1 ? 'bg-cyan-900/50 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800 border-transparent text-slate-500 hover:bg-slate-700'}`}
                            >
                                <User size={24} />
                                <span className="text-xs font-bold">1 Jugador</span>
                            </button>
                            <button 
                                onClick={() => setPlayers(2)}
                                className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2 ${players === 2 ? 'bg-rose-900/50 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(251,113,133,0.3)]' : 'bg-slate-800 border-transparent text-slate-500 hover:bg-slate-700'}`}
                            >
                                <Users size={24} />
                                <span className="text-xs font-bold">2 Jugadores</span>
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => onStart(players)}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-rose-600 rounded-xl font-bold text-lg text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <PlayCircle size={24} /> COMENZAR
                    </button>
                </div>

                <button onClick={onThemeToggle} className="text-slate-500 flex items-center justify-center gap-2 text-xs font-medium hover:text-white transition-colors uppercase tracking-wide">
                    {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />} 
                    {theme === 'light' ? 'Modo Noche' : 'Modo Día'}
                </button>
            </div>
        </div>
    );
};

// --- 2. DICE OVERLAY (FULL SCREEN) ---
export const DiceOverlay: React.FC<{ move: number | null, tense: number | null, tenseLabel: string }> = ({ move, tense, tenseLabel }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
        >
             <motion.div 
                animate={{ scale: [0.5, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-12"
             >
                 <div className="text-9xl font-black text-white mb-2 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">{move}</div>
                 <div className="text-sm text-slate-400 uppercase tracking-[0.3em] font-bold">Casillas</div>
             </motion.div>

             <div className="w-16 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-12 rounded-full"></div>

             <motion.div 
                animate={{ y: [30, 0], opacity: [0, 1] }}
                transition={{ delay: 0.2, type: "spring" }}
             >
                 <div className="text-7xl font-bold text-emerald-400 mb-4">{tense}</div>
                 <div className="text-3xl text-white font-serif italic max-w-xs mx-auto leading-tight">{tenseLabel}</div>
             </motion.div>
        </motion.div>
    );
};

// --- 3. CONJUGATION CARD ---
interface CardProps {
    verb: string;
    tenseLabel: string;
    playerColor: string;
    onClose: () => void;
}

export const ConjugationCard: React.FC<CardProps> = ({ verb, tenseLabel, playerColor, onClose }) => {
    return (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl flex flex-col gap-8 border-t border-slate-200 dark:border-slate-700 sm:border-t-0"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tiempo Verbal</p>
                        <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">{tenseLabel}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-xl" style={{ backgroundColor: playerColor }}>
                        !
                    </div>
                </div>

                <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-sm text-slate-500 mb-2">Conjugue el verbo:</p>
                    <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{verb}</h2>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all text-lg"
                >
                    Hecho (Siguiente Turno)
                </button>
            </motion.div>
        </div>
    );
};

// --- 4. CONTROLS HUD ---
interface ControlsProps {
    gameState: GameState;
    onRoll: () => void;
    onUndo: () => void;
    onToMenu: () => void;
    onFinish: () => void;
    onThemeToggle: () => void;
    onViewToggle: () => void;
}

export const GameHUD: React.FC<ControlsProps> = ({ gameState, onRoll, onUndo, onToMenu, onFinish, onThemeToggle, onViewToggle }) => {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const charDef = CHARACTERS.find(c => c.id === activePlayer.characterId)!;

    return (
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-4 z-30">
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-auto">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 pl-4 pr-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: charDef.color }}>
                        {activePlayer.name[0]}
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Turno Actual</p>
                        <span className="font-bold text-slate-800 dark:text-white text-lg">{activePlayer.name}</span>
                     </div>
                </div>

                <button onClick={onToMenu} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-400 hover:text-rose-500 transition-colors pointer-events-auto border border-slate-200 dark:border-slate-700">
                    <Home size={22} />
                </button>
            </div>

            {/* Floating Action Button for View Mode */}
            <div className="absolute right-4 bottom-32 pointer-events-auto">
                <button 
                    onClick={onViewToggle} 
                    className="w-14 h-14 bg-slate-800 rounded-full shadow-xl border border-slate-600 flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-slate-700"
                >
                    {gameState.viewMode === 'board' ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
            </div>

            {/* Bottom Controls */}
            {gameState.turnPhase === 'rolling' && (
                <div className="pointer-events-auto flex flex-col gap-3 max-w-md mx-auto w-full mb-6">
                    <div className="flex gap-2 justify-center">
                        <button onClick={onUndo} disabled={gameState.previousStates.length === 0} className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-2 disabled:opacity-50 shadow-md border border-slate-200 dark:border-slate-700">
                            <ArrowLeft size={16} /> Retroceder
                        </button>
                        <button onClick={onFinish} className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-2 shadow-md border border-slate-200 dark:border-slate-700">
                            <Power size={16} /> Terminar
                        </button>
                    </div>

                    <button 
                        onClick={onRoll}
                        className="w-full py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] text-white font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:scale-[1.02]"
                        style={{ background: `linear-gradient(135deg, ${charDef.color}, ${charDef.accentColor})` }}
                    >
                        <Dice1 className="animate-bounce" size={28} /> 
                        <span className="drop-shadow-sm">TIRAR DADOS</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// --- 5. SUMMARY / WHATSAPP ---
export const SummaryScreen: React.FC<{ players: Player[], snakePath: any[], onMenu: () => void }> = ({ players, snakePath, onMenu }) => {
    
    // Strict WhatsApp Reporting Logic
    const generateWhatsAppLink = () => {
        const phone = "420602959050";
        
        let message = "Ahoj! Zde je souhrn hry (Hola! Aquí el resumen):\n\n";

        players.forEach(p => {
            const label = p.id === 1 ? "Linda" : "Leus";
            message += `*${label} (Hráč ${p.id}):*\n`;
            
            // Skip "Inicio" (index 0)
            const validHistory = p.history.slice(1);
            
            if (validHistory.length === 0) {
                message += "- (Žádný pohyb / Sin movimientos)\n";
            } else {
                validHistory.forEach(h => {
                     const verb = snakePath[h.pathIndex]?.content || "Unknown";
                     if (verb !== 'SALIDA' && verb !== 'LLEGADA') {
                        message += `- ${verb} (${h.tenseLabel})\n`;
                     }
                });
            }
            message += "\n";
        });

        message += "Gratulujeme k dokončení! (¡Felicidades por terminar!)";
        
        // Encode the ENTIRE message string to ensure proper handling of line breaks and special chars
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    };

    const link = generateWhatsAppLink();

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white overflow-y-auto">
            <h2 className="text-3xl font-black text-emerald-400 mb-2">¡Resumen Final!</h2>
            <p className="text-slate-400 mb-8">Sesión completada.</p>

            <a 
                href={link} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 mb-8 shadow-lg hover:bg-[#128C7E] w-full max-w-sm justify-center transition-colors"
            >
                <Send size={20} /> Odeslat učiteli (WhatsApp)
            </a>

            <div className="bg-white p-4 rounded-xl mb-8 shadow-xl">
                <QRCodeSVG value={link} size={160} />
            </div>

            <button onClick={onMenu} className="text-slate-400 hover:text-white underline flex items-center gap-2 transition-colors">
                <Home size={16} /> Volver al Menú Principal
            </button>
        </div>
    );
};