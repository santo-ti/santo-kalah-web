export type Player = 'Player1' | 'Player2';

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type GameMode = 'PvP' | 'PvAI';

export interface MoveHistoryEntry {
  player: Player;
  pitIndex: number;
  stonesMoved: number;
  boardState: {
    pits: number[];
    currentPlayer: Player;
    message: string;
  };
  specialEvent?: { type: 'capture'; count: number } | { type: 'extra_turn' };
}

export interface GameState {
  pits: number[];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null | 'draw';
  message: string;
  gameMode: GameMode | null;
  difficulty: Difficulty | null;
  history: MoveHistoryEntry[];
  lastCapture: { from: number; opposite: number; kalah: number } | null;
}
