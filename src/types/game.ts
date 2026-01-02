export type Role = 'good-kitten' | 'confused-kitten' | 'spy-pup'

export type GamePhase = 'setup' | 'word-reveal' | 'players-ready' | 'result-check'

export interface SetupData {
  totalPlayers: number;
  spyPupCount: number;
  confusedKittenCount: number;
  wordPair: WordPair;
}

export interface Player {
  id: number;
  name: string;
  role: Role;
  word?: string
}

export interface WordPair {
  main: string;
  related: string
}

export interface GameState {
  players: Player[];
  phase: GamePhase;
  currentPlayerIndex: number;
  realWord: string;
  category?: string;
}

