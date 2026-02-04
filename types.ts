export type CharacterId = 'leus' | 'linda';
export type ThemeMode = 'light' | 'dark';
export type ViewMode = 'board' | 'dice_only';
export type GamePhase = 'menu' | 'playing' | 'summary';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  color: string;
  accentColor: string;
}

export interface HistoryItem {
  pathIndex: number;
  tenseId: number;
  tenseLabel: string;
}

export interface Player {
  id: number;
  characterId: CharacterId;
  currentPathIndex: number;
  history: HistoryItem[]; 
  name: string;
}

export interface GameConfig {
  config: {
    version: string;
    rows: number;
    cols: number;
    start_index: number;
    end_index: number;
  };
  leyenda_tiempos: Record<string, string>;
  tablero_data: string[];
}

export interface Cell {
  id: string;
  row: number;
  col: number;
  content: string;
  isStart: boolean;
  isEnd: boolean;
  pathIndex: number;
  position: [number, number, number];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  activePlayerIndex: number;
  diceMove: number | null;
  diceTense: number | null;
  viewMode: ViewMode;
  theme: ThemeMode;
  turnPhase: 'rolling' | 'moving' | 'card' | 'end'; 
  showDiceOverlay: boolean;
  previousStates: GameState[];
}