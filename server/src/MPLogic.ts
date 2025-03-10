// Utility to determine if a player has won
const hasWon = (board: (string | null)[][], player: string): boolean => {
  const directions = [
    { row: 0, col: 1 }, // Horizontal
    { row: 1, col: 0 }, // Vertical
    { row: 1, col: 1 }, // Diagonal (top-left to bottom-right)
    { row: 1, col: -1 }, // Diagonal (top-right to bottom-left)
  ];

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (board[row][col] === player) {
        for (const { row: dRow, col: dCol } of directions) {
          let count = 0;
          for (let i = 0; i < 5; i++) {
            const r = row + i * dRow;
            const c = col + i * dCol;
            if (
              r >= 0 &&
              r < 15 &&
              c >= 0 &&
              c < 15 &&
              board[r][c] === player
            ) {
              count++;
            } else {
              break;
            }
          }
          if (count === 5) {
            console.log(`Player ${player} has won at (${row}, ${col})`);
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Utility to calculate new Elo ratings using the Think Different Elo Formula
interface Player {
  elo: number;
  wins: number;
  draws: number;
  losses: number;
}

const calculateElo = (
  playerA: Player,
  playerB: Player,
  result: "win" | "lose" | "draw"
): { newRA: number; newRB: number } => {
  const K = 40; // Fixed K-factor
  const alpha = 0.5; // Adjustment factor

  // Ensure Elo ratings have default values only if null or undefined
  const RA = playerA.elo ?? 400;
  const RB = playerB.elo ?? 400;
  const WA = playerA.wins ?? 0;
  const DA = playerA.draws ?? 0;
  const LA = playerA.losses ?? 0;
  const WB = playerB.wins ?? 0;
  const DB = playerB.draws ?? 0;
  const LB = playerB.losses ?? 0;

  console.log(`Player A: RA=${RA}, WA=${WA}, DA=${DA}, LA=${LA}`);
  console.log(`Player B: RB=${RB}, WB=${WB}, DB=${DB}, LB=${LB}`);

  // Calculate expected scores
  const EA = 1 / (1 + Math.pow(10, (RB - RA) / 400));
  const EB = 1 / (1 + Math.pow(10, (RA - RB) / 400));

  // Determine actual scores based on the result
  let SA, SB;
  if (result === "win") {
    SA = 1; // Player A wins
    SB = 0;
  } else if (result === "lose") {
    SA = 0; // Player B wins
    SB = 1;
  } else {
    SA = 0.5; // Draw
    SB = 0.5;
  }

  // **Fix Division by Zero**: Ensure denominator is at least 1
  const totalGamesA = WA + DA + LA || 1;
  const totalGamesB = WB + DB + LB || 1;
  
  const ratioA = (WA + DA) / totalGamesA;
  const ratioB = (WB + DB) / totalGamesB;

  // Apply Think Different Elo Formula
  const deltaA = K * (SA - EA) * (1 + alpha * (0.5 - ratioA));
  const deltaB = K * (SB - EB) * (1 + alpha * (0.5 - ratioB));

  // Update ratings
  let newRA = RA + deltaA;
  let newRB = RB + deltaB;

  // **Final NaN Check**: If calculation still fails, keep previous values
  if (isNaN(newRA) || isNaN(newRB)) {
    console.error("Elo calculation failed, resetting to previous values.");
    newRA = RA;
    newRB = RB;
  }

  console.log(`New Elo Ratings: newRA=${newRA}, newRB=${newRB}`);

  return { newRA, newRB };
};

// Utility to check if the game is a draw
const isDraw = (board: (string | null)[][]): boolean => {
  return board.flat().every((cell) => cell !== ""); // All cells are occupied
};

export { hasWon, calculateElo, isDraw };
