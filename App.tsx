import React, { Suspense } from 'react';
import { useSnakeEngine } from './hooks/useSnakeEngine';
import { World3D } from './components/World3D';
import { DiceOverlay, ConjugationCard, GameHUD, SummaryScreen, MainMenu } from './components/GameUI';
import { AnimatePresence } from 'framer-motion';
import { CHARACTERS } from './data/gameConfig';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { snakePath, gameState, actions } = useSnakeEngine();

  // 1. Menu Phase
  if (gameState.phase === 'menu') {
      return <MainMenu onStart={actions.startGame} theme={gameState.theme} onThemeToggle={actions.toggleTheme} />;
  }

  // 2. Summary Phase
  if (gameState.phase === 'summary') {
    return <SummaryScreen players={gameState.players} snakePath={snakePath} onMenu={actions.goToMenu} />;
  }

  // 3. Playing Phase
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const charDef = CHARACTERS.find(c => c.id === activePlayer.characterId)!;
  const targetContent = snakePath[activePlayer.currentPathIndex].content;

  return (
    <div className={`relative w-full h-screen overflow-hidden ${gameState.theme === 'dark' ? 'bg-slate-900' : 'bg-indigo-50'}`}>
      
      {/* 3D World (Only visible in 'board' mode) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${gameState.viewMode === 'board' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>}>
          <World3D 
              snakePath={snakePath} 
              players={gameState.players} 
              activePlayerIndex={gameState.activePlayerIndex}
              theme={gameState.theme}
          />
        </Suspense>
      </div>

      {/* Dice Only Mode Background */}
      {gameState.viewMode === 'dice_only' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 z-0">
             <div className="text-center opacity-20">
                 <div className="text-9xl font-black text-slate-900 dark:text-white">🎲</div>
                 <p className="text-4xl font-bold text-slate-900 dark:text-white mt-4">MODO DADOS</p>
             </div>
          </div>
      )}

      {/* HUD & Controls */}
      <GameHUD 
         gameState={gameState} 
         onRoll={actions.rollDice}
         onUndo={actions.undoLastMove}
         onToMenu={actions.goToMenu}
         onFinish={actions.forceFinish}
         onThemeToggle={actions.toggleTheme}
         onViewToggle={actions.toggleView}
      />

      {/* Full Screen Dice Animation Overlay */}
      <AnimatePresence>
         {gameState.showDiceOverlay && (
             <DiceOverlay 
                move={gameState.diceMove} 
                tense={gameState.diceTense} 
                tenseLabel={actions.getTenseLabel(gameState.diceTense)} 
             />
         )}
      </AnimatePresence>

      {/* Conjugation Card Interaction (After move) */}
      <AnimatePresence>
        {gameState.turnPhase === 'card' && (
            <ConjugationCard 
               verb={targetContent}
               tenseLabel={actions.getTenseLabel(gameState.diceTense)}
               playerColor={charDef.color}
               onClose={actions.closeCardAndEndTurn}
            />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;