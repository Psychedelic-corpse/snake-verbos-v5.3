import React from 'react';
    import { motion } from 'framer-motion';
    import { Cell, GameState } from '../types';
    import { Flag, CheckCircle2 } from 'lucide-react';
    
    interface GameBoardProps {
      snakePath: Cell[];
      gameState: GameState;
    }
    
    export const GameBoard: React.FC<GameBoardProps> = ({ snakePath, gameState }) => {
      // Map linear snakePath to visual grid.
      // Game Config is 10 cols, 6 rows.
      // We generate a 60-item array where index 0 is (Row 0, Col 0).
      
      const visualGrid = Array.from({ length: 60 }, (_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        return snakePath.find(c => c.row === row && c.col === col) as Cell;
      });

      const activePlayer = gameState.players[gameState.activePlayerIndex];
    
      return (
        <div className="w-full max-w-2xl mx-auto aspect-[10/6] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="grid grid-cols-10 grid-rows-6 h-full w-full">
            {visualGrid.map((cell) => {
              if (!cell) return <div key={Math.random()} className="bg-slate-900" />;

              const isActive = activePlayer.currentPathIndex === cell.pathIndex;
              const isVisited = activePlayer.history.some(h => h.pathIndex === cell.pathIndex);
              const isStart = cell.pathIndex === 0;
              const isEnd = cell.pathIndex === snakePath.length - 1;
    
              // Color logic
              let bgClass = (cell.row % 2 !== 0) ? 'bg-indigo-900/30' : 'bg-slate-800'; // Stripes
              if (isStart) bgClass = 'bg-emerald-600/20';
              if (isEnd) bgClass = 'bg-amber-600/20';
    
              return (
                <div 
                  key={cell.id} 
                  className={`relative flex items-center justify-center p-0.5 text-[0.55rem] sm:text-[0.65rem] text-center border-[0.5px] border-slate-700/50 leading-tight select-none ${bgClass}`}
                >
                  {/* Content */}
                  <span className={`z-10 ${isVisited && !isActive ? 'text-slate-500 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                    {cell.content}
                  </span>
    
                  {/* Start/End Markers */}
                  {isStart && <div className="absolute top-0 right-0 text-[0.5rem] text-emerald-400 p-0.5 font-bold">INICIO</div>}
                  {isEnd && <Flag className="absolute bottom-0 right-0 w-3 h-3 text-amber-500 opacity-50" />}
    
                  {/* Visited Marker (Subtle) */}
                  {isVisited && !isActive && !isStart && !isEnd && (
                    <CheckCircle2 className="absolute top-0.5 left-0.5 w-2 h-2 text-emerald-500/40" />
                  )}
    
                  {/* Player Token */}
                  {isActive && (
                    <motion.div
                      layoutId="player-token"
                      className="absolute inset-0 m-0.5 bg-indigo-500 rounded-md shadow-[0_0_15px_rgba(99,102,241,0.6)] z-20 flex items-center justify-center border-2 border-white/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                       <span className="font-bold text-white drop-shadow-md text-[0.6rem] break-all px-0.5">
                         {cell.content}
                       </span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };