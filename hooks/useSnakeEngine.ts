import { useState, useEffect, useMemo, useCallback } from 'react';
import { GAME_CONFIG, CHARACTERS } from '../data/gameConfig';
import { Cell, GameState, Player, CharacterId, ViewMode, ThemeMode } from '../types';

const STORAGE_KEY = 'snake_verbos_v5.2_state';

export const useSnakeEngine = () => {
  // --- 1. Map Logic ---
  const snakePath = useMemo(() => {
    const path: Cell[] = [];
    const { rows, cols } = GAME_CONFIG.config;
    const data = GAME_CONFIG.tablero_data;
    const SPACING = 2.5;

    for (let i = 0; i < data.length; i++) {
      const row = Math.floor(i / cols);
      const colRaw = i % cols;
      // Row 0 is R->L, so Even rows start from Right (cols-1) to Left (0)
      // Row 1 is L->R, so Odd rows start from Left (0) to Right (cols-1)
      const col = row % 2 === 0 ? (cols - 1) - colRaw : colRaw;
      
      const posX = (col - cols/2) * SPACING;
      const posZ = (row - rows/2) * SPACING;

      path.push({
        id: `cell-${i}`,
        row,
        col,
        content: data[i],
        isStart: i === 0,
        isEnd: i === data.length - 1,
        pathIndex: i,
        position: [posX, 0, posZ]
      });
    }
    return path;
  }, []);

  // --- 2. Initial State Definitions ---
  
  // Factory for fresh player state
  const createInitialPlayers = (count: 1 | 2): Player[] => {
    const p1: Player = { 
        id: 1, 
        characterId: 'linda', 
        currentPathIndex: 0, 
        history: [{ pathIndex: 0, tenseId: 0, tenseLabel: 'Inicio' }], 
        name: "Linda" 
    };
    if (count === 1) return [p1];
    
    return [
      p1,
      { 
        id: 2, 
        characterId: 'leus', 
        currentPathIndex: 0, 
        history: [{ pathIndex: 0, tenseId: 0, tenseLabel: 'Inicio' }], 
        name: "Leus" 
      }
    ];
  };

  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    players: createInitialPlayers(2), // Default placeholder
    activePlayerIndex: 0,
    diceMove: null,
    diceTense: null,
    viewMode: 'board',
    theme: 'light',
    turnPhase: 'rolling',
    showDiceOverlay: false,
    previousStates: []
  });

  // --- 3. Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if(parsed.players) {
           const phase = parsed.phase || 'menu';
           setGameState({ ...parsed, phase, previousStates: [] });
        }
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = { ...gameState, previousStates: [] };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
        console.warn("Storage quota exceeded", e);
    }

    if (gameState.theme === 'dark') {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#eef2ff';
    }
  }, [gameState]);

  // --- 4. Game Actions ---

  const startGame = (playerCount: 1 | 2) => {
      setGameState({
          phase: 'playing',
          players: createInitialPlayers(playerCount),
          activePlayerIndex: 0,
          diceMove: null,
          diceTense: null,
          viewMode: 'board',
          theme: gameState.theme, // Preserve theme
          turnPhase: 'rolling',
          showDiceOverlay: false,
          previousStates: []
      });
  };

  const goToMenu = () => {
      // Hard Reset: Clean everything except visual preferences (theme/viewMode)
      setGameState(prev => ({
          phase: 'menu',
          players: createInitialPlayers(2), 
          activePlayerIndex: 0,
          diceMove: null,
          diceTense: null,
          turnPhase: 'rolling',
          showDiceOverlay: false,
          previousStates: [],
          theme: prev.theme,
          viewMode: prev.viewMode
      }));
  };

  const toggleTheme = () => {
    setGameState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const toggleView = () => {
    setGameState(prev => ({ ...prev, viewMode: prev.viewMode === 'board' ? 'dice_only' : 'board' }));
  };

  const saveUndoState = (state: GameState) => {
    const historyLimit = 5;
    const snapshot = { ...state, previousStates: [] };
    const newHistory = [snapshot, ...state.previousStates].slice(0, historyLimit);
    return newHistory;
  };

  const getTenseLabel = (diceValue: number | null) => {
    if (!diceValue) return "-";
    return GAME_CONFIG.leyenda_tiempos[diceValue.toString()] || "Desconocido";
  };

  // --- SMART DICE LOGIC ---
  const rollDice = useCallback(() => {
    if (gameState.phase !== 'playing') return;

    setGameState(prev => ({
      ...prev,
      previousStates: saveUndoState(prev),
      showDiceOverlay: true 
    }));

    // Calculate results immediately but show later
    setTimeout(() => {
      setGameState(prev => {
        const move = Math.floor(Math.random() * 6) + 1;
        
        // --- SMART TENSE LOGIC START ---
        const currentPlayer = prev.players[prev.activePlayerIndex];
        let targetIndex = currentPlayer.currentPathIndex + move;
        if (targetIndex >= snakePath.length) targetIndex = snakePath.length - 1;

        // 1. Identify tenses already used on this specific tile by ANY player (Global History Check)
        const usedTensesOnTarget = new Set<number>();
        prev.players.forEach(p => {
            p.history.forEach(h => {
                // If a player has visited this tile (and it wasn't the start 0), record the tense
                if (h.pathIndex === targetIndex && h.tenseId > 0) {
                    usedTensesOnTarget.add(h.tenseId);
                }
            });
        });

        // 2. Roll Tense with Reroll Logic (Max 3 attempts to find unused)
        let tense = Math.floor(Math.random() * 8) + 1;
        let attempts = 0;
        
        // Loop: If the generated tense is already used on this tile, try again.
        // Limit to 3 attempts to prevent infinite loops (unlikely but safe).
        while (usedTensesOnTarget.has(tense) && attempts < 3) {
            tense = Math.floor(Math.random() * 8) + 1;
            attempts++;
            // Debug: console.log(`Smart Reroll: Tile ${targetIndex} avoided tense ${tense} (Attempt ${attempts})`);
        }
        // --- SMART TENSE LOGIC END ---

        return {
          ...prev,
          diceMove: move,
          diceTense: tense,
          turnPhase: 'moving',
        };
      });

      // Animation delay for move
      setTimeout(() => {
        setGameState(prev => {
           if (!prev.diceMove || !prev.diceTense) return prev;
           
           const currentPlayer = prev.players[prev.activePlayerIndex];
           let newIndex = currentPlayer.currentPathIndex + prev.diceMove;
           if (newIndex >= snakePath.length) newIndex = snakePath.length - 1;
           
           const tenseLabel = GAME_CONFIG.leyenda_tiempos[prev.diceTense.toString()] || "N/A";

           const updatedPlayers = [...prev.players];
           updatedPlayers[prev.activePlayerIndex] = {
             ...currentPlayer,
             currentPathIndex: newIndex,
             // Store the Tense ID and Label
             history: [...currentPlayer.history, { 
                 pathIndex: newIndex, 
                 tenseId: prev.diceTense, 
                 tenseLabel: tenseLabel 
             }]
           };

           const isFinished = newIndex === snakePath.length - 1;
           const nextPhase = isFinished ? 'summary' : 'playing';

           return {
             ...prev,
             phase: nextPhase,
             players: updatedPlayers,
             showDiceOverlay: false,
             turnPhase: isFinished ? 'end' : 'card' 
           };
        });
      }, 2000); 
    }, 100);

  }, [gameState.phase, gameState.activePlayerIndex, snakePath]);

  const closeCardAndEndTurn = () => {
    setGameState(prev => {
      const nextPlayerIdx = (prev.activePlayerIndex + 1) % prev.players.length;
      return {
        ...prev,
        activePlayerIndex: nextPlayerIdx,
        turnPhase: 'rolling',
        diceMove: null,
        diceTense: null
      };
    });
  };

  const undoLastMove = () => {
    setGameState(prev => {
      if (prev.previousStates.length === 0) return prev;
      const [lastState, ...remaining] = prev.previousStates;
      return { ...lastState, previousStates: remaining };
    });
  };

  const forceFinish = () => {
    setGameState(prev => ({ ...prev, phase: 'summary' }));
  };

  return {
    snakePath,
    gameState,
    actions: {
      startGame,
      goToMenu,
      toggleTheme,
      toggleView,
      rollDice,
      closeCardAndEndTurn,
      undoLastMove,
      forceFinish,
      getTenseLabel
    }
  };
};