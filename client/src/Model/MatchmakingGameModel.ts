export interface MatchmakingGame {
  playerX: string;
  playerO: string;
  winner?: string | null;
  loser?: string | null;
  eloChangeX: number;
  eloChangeO: number;
  board: string[][];
  bitmap?: string | null;
  endedAt: string; // ISO string (e.g. from Date.toISOString())
}
