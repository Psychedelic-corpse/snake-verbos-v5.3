// @ts-nocheck
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Moon, Sun, Home, Copy, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES & CONFIG
// ============================================================================

type ThemeMode = 'light' | 'dark';
type GamePhase = 'menu' | 'playing' | 'summary';

interface HistoryItem {
  pathIndex: number;
  tenseId: number;
  tenseLabel: string;
  verbName: string;
}

interface Player {
  id: number;
  name: string;
  currentPathIndex: number;
  history: HistoryItem[];
  theme: 'linda' | 'leus';
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  activePlayerIndex: number;
  gameMode: 'single' | 'dual';
  diceMove: number | null;
  diceTense: number | null;
  showDiceOverlay: boolean;
  theme: ThemeMode;
  turnPhase: 'ready' | 'rolling' | 'moving' | 'card' | 'animating';
  showSummary: boolean;
}

// Hardcoded Verb List (10x6 board = 60 tiles)
const VERB_LIST = [
  'SALIDA', 'Abrir', 'Salir', 'Desayunar', 'Volver', 'Preferir',
  'Llegar', 'Poder', 'Empezar', 'Ir',
  'Pedir', 'Llamarse', 'Probar', 'Jugar', 'Leer', 'Seguir',
  'Almorzar', 'Vestirse', 'Hacer', 'Poner',
  'Acostarse', 'Vivir', 'Hablar', 'Pensar', 'Levantarse', 'Tener',
  'Poder', 'Cerrar', 'Ser', 'Tomar',
  'Estar', 'Dormir', 'Entender', 'Mirar', 'Ver', 'Coger',
  'Acabar', 'Soler', 'Despertarse', 'Poner',
  'Venir', 'Oler', 'Saber', 'Querer', 'Valer', 'Suponer',
  'Creer', 'Tener', 'Traducir', 'Correr',
  'Conducir', 'Gastar', 'Irse', 'Pensar', 'Nadar', 'Parecer',
  'Bañarse', 'Pagar', 'Casarse', 'LLEGADA'
];

const TENSES: Record<string, string> = {
  '1': 'Presente',
  '2': 'Futuro (Perífrasis)',
  '3': 'P. Perfecto Compuesto',
  '4': 'Imperativo',
  '5': 'Futuro Simple',
  '6': 'Condicional',
  '7': 'Gerundio',
  '8': 'Pretérito Indefinido'
};

// ============================================================================
// UTILITIES
// ============================================================================

const getRandomTense = (): number => Math.floor(Math.random() * 8) + 1;

const getTenseLabel = (tenseId: number): string => TENSES[String(tenseId) as keyof typeof TENSES] || 'Presente';

const generateReportText = (players: Player[]): string => {
  const lines: string[] = ['Ahoj! Zahrajeme si hru Con-Jugando Verbos v5.5! 🎲🐍'];
  lines.push('');

  players.forEach((player) => {
    lines.push(`*${player.name}*:`);
    player.history.forEach((item) => {
      lines.push(`• ${item.verbName} (${item.tenseLabel})`);
    });
    lines.push('');
  });

  lines.push('Gratulujeme! 🎉');

  return lines.join('\n');
};

// ============================================================================
// COMPONENTS
// ============================================================================

const RulesModal: React.FC<{
  onClose: () => void;
  theme: ThemeMode;
}> = ({ onClose, theme }) => {
  const isDark = theme === 'dark';

  return (
    // @ts-ignore - Framer Motion className prop
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* @ts-ignore - Framer Motion className & onClick props */}
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e: any) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl p-8 ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Title */}
        <h2 className={`text-4xl font-black mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
          📖 Guía del Juego
        </h2>

        {/* Content Sections */}
        <div className={`space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          {/* Section 1: Objetivo */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <h3 className="text-2xl font-bold mb-3 text-cyan-500">🎯 Objetivo</h3>
            <p className="text-lg leading-relaxed">
              Llega a la casilla <strong>"LLEGADA"</strong> (casilla 60) conjugando correctamente los verbos españoles. 
              Eres Linda (Petróleo/Cyan) o Leus (Rosa/Pink) - ¡cada jugador tiene su propio camino en el tablero!
            </p>
          </div>

          {/* Section 2: Turnos */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <h3 className="text-2xl font-bold mb-3 text-rose-500">🎲 Cómo Jugar</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <strong>Lanza el Dado:</strong> Presiona "🎲 Lanzar Dado" para generar un número aleatorio (1-6).
              </li>
              <li>
                <strong>Movimiento:</strong> Avanzas esa cantidad de casillas por el tablero serpiente.
              </li>
              <li>
                <strong>Tiempo Verbal:</strong> Se selecciona automáticamente un tiempo verbal (Presente, Futuro, Pretérito, etc.) de 8 opciones.
              </li>
              <li>
                <strong>Conjugación:</strong> Confirma la conjugación correcta del verbo en el tiempo indicado.
              </li>
            </ul>
          </div>

          {/* Section 3: Smart Learning */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <h3 className="text-2xl font-bold mb-3 text-yellow-500">🧠 Aprendizaje Inteligente</h3>
            <p className="text-lg leading-relaxed mb-3">
              <strong>¡Aquí es donde la magia ocurre!</strong> Si aterrizas en:
            </p>
            <ul className="space-y-2 text-lg pl-4 border-l-4 border-yellow-400">
              <li>
                <strong>Una casilla ya usada:</strong> El juego automáticamente te asigna un <strong>nuevo tiempo verbal</strong> para que practiques más formas de conjugación.
              </li>
              <li>
                <strong>La misma casilla que otro jugador (colisión):</strong> Se genera un tiempo diferente para ambos - ¡más aprendizaje!
              </li>
            </ul>
            <p className="text-lg leading-relaxed mt-3">
              Esto garantiza que practiques múltiples tiempos verbales y evites repetir lo mismo.
            </p>
          </div>

          {/* Section 4: Reporte */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <h3 className="text-2xl font-bold mb-3 text-green-500">📲 Reporte al Maestro</h3>
            <p className="text-lg leading-relaxed">
              Al completar el juego, verás un botón <strong>"Generar Reporte"</strong> que abre un modal con un resumen 
              de todos los verbos y tiempos que practicaste. ¡Puedes compartirlo o copiarlo fácilmente!
            </p>
          </div>

          {/* Pro Tips */}
          <div className={`p-4 rounded-lg border-2 ${isDark ? 'bg-slate-700 border-cyan-500' : 'bg-cyan-50 border-cyan-300'}`}>
            <h3 className="text-2xl font-bold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-lg">
              <li>✨ Usa el botón de tema (🌙/☀️) para cambiar entre Modo Claro y Oscuro.</li>
              <li>↩️ Presiona el botón de deshacer para revertir tu último movimiento.</li>
              <li>🏠 El botón "Ir al Menú Principal" reinicia el juego en cualquier momento.</li>
              <li>🐍 El tablero es una serpiente: fila 1 va derecha→izquierda, fila 2 izquierda→derecha, ¡y así alternando!</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
        >
          ✓ Entendido / Cerrar
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const ReportModal: React.FC<{
  reportText: string;
  onClose: () => void;
  theme: ThemeMode;
}> = ({ reportText, onClose, theme }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const isDark = theme === 'dark';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: reportText,
          title: 'Conjugando Verbos Reporte'
        });
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Error al copiar el texto');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e: any) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl p-8 flex flex-col ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}>
        {/* Header */}
        <h2 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          📋 Resumen de la Partida
        </h2>

        {/* Report Content (Scrollable) */}
        <div
          className={`flex-1 overflow-y-auto p-4 rounded-lg mb-6 font-mono text-sm whitespace-pre-wrap ${
            isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-900'
          }`}
        >
          {reportText}
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {copyStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-500 text-white rounded-lg font-bold text-center">
              ✓ ¡Texto copiado!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 flex-col">
          {/* iOS/Share Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Share2 size={24} />
            📤 Compartir / Guardar Nota (iOS)
          </motion.button>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="w-full px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Copy size={24} />
            📋 Copiar Texto (Android/Linda)
          </motion.button>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-400 text-slate-900 font-bold text-lg rounded-lg hover:bg-slate-500 transition-all">
            ← Volver
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MainMenu: React.FC<{
  onStart: (mode: 'single' | 'dual') => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}> = ({ onStart, theme, onThemeToggle }) => {
  const [showRules, setShowRules] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-screen flex flex-col items-center justify-center gap-8 transition-colors ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50 to-cyan-50'}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className={`text-6xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          🐍 Con-Jugando Verbos
        </h1>
        <p className={`text-2xl font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
          v5.5
        </p>
      </div>

      {/* Game Mode Buttons */}
      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart('single')}
          className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transition-all">
          1 Jugador
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart('dual')}
          className="px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transition-all">
          2 Jugadores
        </motion.button>
      </div>

      {/* Rules Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowRules(true)}
        className={`px-6 py-3 font-bold text-lg rounded-lg shadow-lg transition-all ${
          isDark
            ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
            : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
        }`}>
        📖 Cómo Jugar
      </motion.button>

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={onThemeToggle}
        className={`p-3 rounded-full transition-colors ${isDark ? 'bg-slate-700 text-yellow-300' : 'bg-slate-200 text-slate-700'}`}>
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </motion.button>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && <RulesModal onClose={() => setShowRules(false)} theme={theme} />}
      </AnimatePresence>
    </div>
  );
};

const GameBoard: React.FC<{
  players: Player[];
  activePlayerIndex: number;
  gameMode: 'single' | 'dual';
  theme: ThemeMode;
  onRoll: () => void;
  onUndo: () => void;
  onMenuClick: () => void;
  onThemeToggle: () => void;
}> = ({ players, activePlayerIndex, gameMode, theme, onRoll, onUndo, onMenuClick, onThemeToggle }) => {
  const isDark = theme === 'dark';
  const activePlayer = players[activePlayerIndex];
  const isLindasTurn = activePlayer.theme === 'linda';

  const bgColor = isLindasTurn
    ? isDark
      ? 'bg-cyan-950'
      : 'bg-cyan-100'
    : isDark
    ? 'bg-rose-950'
    : 'bg-rose-100';

  const borderColor = isLindasTurn ? 'border-cyan-500' : 'border-rose-500';

  // Render board grid
  const renderBoard = () => {
    const rows: React.ReactNode[] = [];
    for (let row = 0; row < 6; row++) {
      const cols: React.ReactNode[] = [];
      const isRightToLeft = row % 2 === 0;

      for (let col = 0; col < 10; col++) {
        const displayCol = isRightToLeft ? 9 - col : col;
        const pathIndex = row * 10 + displayCol;
        const verb = VERB_LIST[pathIndex];

        const playersOnTile = players.filter((p) => p.currentPathIndex === pathIndex);
        const p1 = playersOnTile.find((p) => p.theme === 'linda');
        const p2 = playersOnTile.find((p) => p.theme === 'leus');

        cols.push(
          <div
            key={`${row}-${col}`}
            className={`
              h-20 border-2 flex flex-col items-center justify-center text-sm font-bold text-center p-1
              ${borderColor} rounded transition-all
              ${p1 && p2
                ? 'bg-purple-400'
                : p1
                ? 'bg-cyan-300'
                : p2
                ? 'bg-rose-300'
                : isDark
                ? 'bg-slate-700'
                : 'bg-white'
              }
            `}
          >
            <div className={isDark ? 'text-white' : 'text-slate-900'}>{verb}</div>
            <div className="flex gap-1 mt-1">
              {p1 && <div className="w-3 h-3 rounded-full bg-cyan-600"></div>}
              {p2 && <div className="w-3 h-3 rounded-full bg-rose-600"></div>}
            </div>
          </div>
        );
      }

      rows.push(
        <div key={`row-${row}`} className={`flex ${isRightToLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          {cols}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={`w-full h-screen flex flex-col gap-4 p-4 transition-colors ${isDark ? 'bg-slate-900' : 'bg-indigo-50'}`}>
      {/* Top Bar */}
      <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${borderColor} ${bgColor}`}>
        <div className={isLindasTurn ? 'text-cyan-50' : 'text-white'}>
          <h2 className="text-2xl font-black">{activePlayer.name}</h2>
          <p className="text-sm">Posición: {activePlayer.currentPathIndex + 1}/60</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className={`p-2 rounded transition-colors ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUndo}
            className={`p-2 rounded transition-colors ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
            <RotateCcw size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className={`p-2 rounded transition-colors ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
            <Home size={20} />
          </motion.button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 grid grid-cols-10 gap-1 p-4 border-4 border-slate-400 rounded-lg overflow-auto bg-slate-800">
        {renderBoard()}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRoll}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
          🎲 Lanzar Dado
        </motion.button>
      </div>
    </div>
  );
};

const DiceAnimation: React.FC<{
  diceMove: number | null;
  diceTense: number | null;
  onComplete: () => void;
}> = ({ diceMove, diceTense, onComplete }) => {
  const tenseLabel = diceTense ? getTenseLabel(diceTense) : 'Tense';

  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-8 text-center shadow-2xl">
        <div className="text-7xl font-black text-yellow-500 mb-4">🎲</div>
        <div className="text-5xl font-black text-slate-900 mb-2">{diceMove}</div>
        <div className="text-2xl font-bold text-slate-600">{tenseLabel}</div>
      </motion.div>
    </motion.div>
  );
};

const ConjugationCard: React.FC<{
  verb: string;
  tenseLabel: string;
  playerTheme: 'linda' | 'leus';
  onConfirm: () => void;
}> = ({ verb, tenseLabel, playerTheme, onConfirm }) => {
  const isLinda = playerTheme === 'linda';
  const bgGradient = isLinda ? 'from-cyan-600 to-cyan-700' : 'from-rose-500 to-rose-600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className={`bg-gradient-to-br ${bgGradient} p-8 rounded-2xl text-white shadow-2xl max-w-md text-center`}>
        <h2 className="text-3xl font-black mb-4">Conjugar Verbo</h2>
        <div className="bg-white/20 p-6 rounded-lg mb-4">
          <div className="text-5xl font-black mb-2">{verb}</div>
          <div className="text-xl font-bold">{tenseLabel}</div>
        </div>
        <p className="text-lg mb-6 opacity-90">Escribe la conjugación correcta para avanzar</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="w-full px-6 py-3 bg-white text-slate-900 font-bold text-lg rounded-lg hover:bg-slate-100 transition-colors">
          Confirmar
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const SummaryScreen: React.FC<{
  players: Player[];
  onMenuClick: () => void;
  theme: ThemeMode;
}> = ({ players, onMenuClick, theme }) => {
  const [showReport, setShowReport] = useState(false);
  const isDark = theme === 'dark';
  const reportText = generateReportText(players);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className={`w-full h-screen flex flex-col items-center justify-center gap-6 p-6 transition-colors ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-indigo-50 to-cyan-50'}`}>
      <div className="text-8xl animate-bounce mb-4">🎉</div>
      <h1 className={`text-4xl font-black text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
        ¡Juego Completado!
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {players.map((player, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`
              p-6 rounded-lg border-2
              ${player.theme === 'linda'
                ? isDark
                  ? 'bg-cyan-950 border-cyan-500'
                  : 'bg-cyan-100 border-cyan-600'
                : isDark
                ? 'bg-rose-950 border-rose-500'
                : 'bg-rose-100 border-rose-600'
              }
            `}>
            <h3 className={`text-2xl font-bold mb-3 ${player.theme === 'linda' ? 'text-cyan-50' : 'text-rose-50'}`}>
              {player.name}
            </h3>
            <div className={`space-y-2 ${player.theme === 'linda' ? 'text-cyan-50' : 'text-rose-50'}`}>
              {player.history.map((item, i) => (
                <div key={i} className="text-sm">
                  • {item.verbName} ({item.tenseLabel})
                </div>
              ))}
            </div>
            <div className="mt-4 text-lg font-bold opacity-75">
              Total: {player.history.length} verbos
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 flex-col w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReport(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
          📄 Generar Reporte
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
          <Home size={20} />
          Ir al Menú Principal
        </motion.button>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <ReportModal
            reportText={reportText}
            onClose={() => setShowReport(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Page() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    players: [],
    activePlayerIndex: 0,
    gameMode: 'single',
    diceMove: null,
    diceTense: null,
    showDiceOverlay: false,
    theme: 'light',
    turnPhase: 'ready',
    showSummary: false
  });

  // ==================== HANDLERS ====================

  const handleStartGame = useCallback((mode: 'single' | 'dual') => {
    const newPlayers: Player[] = [
      {
        id: 1,
        name: 'Linda',
        currentPathIndex: 0,
        history: [],
        theme: 'linda'
      }
    ];

    if (mode === 'dual') {
      newPlayers.push({
        id: 2,
        name: 'Leus',
        currentPathIndex: 0,
        history: [],
        theme: 'leus'
      });
    }

    setGameState((prev) => ({
      ...prev,
      phase: 'playing',
      players: newPlayers,
      gameMode: mode,
      activePlayerIndex: 0,
      turnPhase: 'ready'
    }));
  }, []);

  const handleRollDice = useCallback(() => {
    const move = Math.floor(Math.random() * 6) + 1;
    const tense = getRandomTense();

    setGameState((prev) => ({
      ...prev,
      diceMove: move,
      diceTense: tense,
      showDiceOverlay: true,
      turnPhase: 'rolling'
    }));
  }, []);

  const handleDiceAnimationComplete = useCallback(() => {
    setGameState((prev) => {
      const currentPlayer = prev.players[prev.activePlayerIndex];
      let newPathIndex = currentPlayer.currentPathIndex + prev.diceMove!;

      // Boundary check
      if (newPathIndex >= 59) {
        newPathIndex = 59; // End at LLEGADA
      }

      // Smart Collision: If P2 lands on same tile as P1, reroll tense
      const newPlayers = [...prev.players];
      newPlayers[prev.activePlayerIndex] = {
        ...currentPlayer,
        currentPathIndex: newPathIndex
      };

      const otherPlayerIndex = prev.gameMode === 'dual' ? 1 - prev.activePlayerIndex : -1;
      let actualTense = prev.diceTense!;

      if (otherPlayerIndex >= 0 && newPlayers[otherPlayerIndex].currentPathIndex === newPathIndex) {
        // Collision! Reroll tense
        actualTense = getRandomTense();
      }

      return {
        ...prev,
        showDiceOverlay: false,
        turnPhase: 'moving',
        players: newPlayers,
        diceTense: actualTense,
        diceMove: 0
      };
    });
  }, []);

  const handleCardConfirm = useCallback(() => {
    setGameState((prev) => {
      const currentPlayer = prev.players[prev.activePlayerIndex];
      const verb = VERB_LIST[currentPlayer.currentPathIndex];

      // Add to history
      const newPlayers = [...prev.players];
      newPlayers[prev.activePlayerIndex] = {
        ...currentPlayer,
        history: [
          ...currentPlayer.history,
          {
            pathIndex: currentPlayer.currentPathIndex,
            tenseId: prev.diceTense!,
            tenseLabel: getTenseLabel(prev.diceTense!),
            verbName: verb
          }
        ]
      };

      // Check win condition
      const isAtEnd = currentPlayer.currentPathIndex >= 59;
      if (isAtEnd) {
        return {
          ...prev,
          players: newPlayers,
          phase: 'summary',
          showSummary: true
        };
      }

      // Switch player
      const nextPlayerIndex = prev.gameMode === 'dual' ? 1 - prev.activePlayerIndex : 0;

      return {
        ...prev,
        players: newPlayers,
        activePlayerIndex: nextPlayerIndex,
        turnPhase: 'ready',
        diceMove: null,
        diceTense: null
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setGameState((prev) => {
      if (prev.players[prev.activePlayerIndex].history.length === 0) return prev;

      const newPlayers = [...prev.players];
      const currentPlayer = newPlayers[prev.activePlayerIndex];
      const lastHistory = currentPlayer.history[currentPlayer.history.length - 1];

      newPlayers[prev.activePlayerIndex] = {
        ...currentPlayer,
        currentPathIndex: lastHistory.pathIndex,
        history: currentPlayer.history.slice(0, -1)
      };

      return {
        ...prev,
        players: newPlayers,
        turnPhase: 'ready',
        diceMove: null,
        diceTense: null
      };
    });
  }, []);

  const handleGoToMenu = useCallback(() => {
    setGameState({
      phase: 'menu',
      players: [],
      activePlayerIndex: 0,
      gameMode: 'single',
      diceMove: null,
      diceTense: null,
      showDiceOverlay: false,
      theme: gameState.theme,
      turnPhase: 'ready',
      showSummary: false
    });
  }, [gameState.theme]);

  const handleThemeToggle = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  // ==================== RENDER ====================

  return (
    <div>
      {/* Menu Phase */}
      {gameState.phase === 'menu' && (
        <MainMenu
          onStart={handleStartGame}
          theme={gameState.theme}
          onThemeToggle={handleThemeToggle}
        />
      )}

      {/* Playing Phase */}
      {gameState.phase === 'playing' && (
        <>
          <GameBoard
            players={gameState.players}
            activePlayerIndex={gameState.activePlayerIndex}
            gameMode={gameState.gameMode}
            theme={gameState.theme}
            onRoll={handleRollDice}
            onUndo={handleUndo}
            onMenuClick={handleGoToMenu}
            onThemeToggle={handleThemeToggle}
          />

          {/* Dice Animation Overlay */}
          <AnimatePresence>
            {gameState.showDiceOverlay && (
              <DiceAnimation
                diceMove={gameState.diceMove}
                diceTense={gameState.diceTense}
                onComplete={handleDiceAnimationComplete}
              />
            )}
          </AnimatePresence>

          {/* Conjugation Card */}
          <AnimatePresence>
            {gameState.turnPhase === 'moving' && (
              <ConjugationCard
                verb={VERB_LIST[gameState.players[gameState.activePlayerIndex].currentPathIndex]}
                tenseLabel={getTenseLabel(gameState.diceTense!)}
                playerTheme={gameState.players[gameState.activePlayerIndex].theme}
                onConfirm={handleCardConfirm}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Summary Phase */}
      {gameState.phase === 'summary' && (
        <SummaryScreen
          players={gameState.players}
          onMenuClick={handleGoToMenu}
          theme={gameState.theme}
        />
      )}
    </div>
  );
}

