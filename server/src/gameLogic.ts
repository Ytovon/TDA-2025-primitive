interface GameStateResponse {
  statusCode?: number;
  error?: string;
  debugInfo?: DebugInfo;
  gameState?: string;
}

interface DebugInfo {
  error?: string;
  xCount?: number;
  oCount?: number;
  roundsPlayed?: number;
  currentPlayer?: string;
  currentWinningMove?: boolean;
  fourBlocked?: boolean; // Tracks blocked four scenarios
  condition?: string;
}

// Utility to determine the game state
const getGameState = (board: string[][]): GameStateResponse => {
  const debugInfo: DebugInfo = {}; // Collect debugging information here

  // Validate board dimensions
  if (!isValidBoard(board)) {
    debugInfo.error = "Invalid board dimensions.";
    return { statusCode: 422, error: "Invalid board size.", debugInfo };
  }

  // Validate symbols
  if (!isValidSymbols(board)) {
    debugInfo.error = "Invalid symbols on the board.";
    return { statusCode: 422, error: "Invalid symbols.", debugInfo };
  }

  // Validate turn order
  const xCount = countSymbols(board, "X");
  const oCount = countSymbols(board, "O");

  debugInfo.xCount = xCount;
  debugInfo.oCount = oCount;

  if (!isValidTurnOrder(xCount, oCount)) {
    debugInfo.error = "Invalid turn sequence.";
    return {
      statusCode: 422,
      error: "Wrong starting player or invalid turn sequence.",
      debugInfo,
    };
  }

  // Determine the current player
  const currentPlayer = xCount === oCount ? "X" : "O";
  debugInfo.currentPlayer = currentPlayer;

  // Check for winning conditions for the current player
  const currentWinningMove = hasWinningMove(board, currentPlayer);
  debugInfo.currentWinningMove = currentWinningMove;

  if (currentWinningMove) {
    debugInfo.condition = "Winning move detected for current player";
    return { gameState: "endgame", debugInfo };
  }

  // Check for midgame scenarios: Four blocked by wall or opponent's symbol
  const fourBlocked =
    hasBlockedFour(board, currentPlayer) ||
    hasOpponentBlockedFour(board, currentPlayer);
  debugInfo.fourBlocked = fourBlocked;

  // Classify based on the number of rounds
  const roundsPlayed = xCount + oCount;
  debugInfo.roundsPlayed = roundsPlayed;

  if (roundsPlayed < 7 && !fourBlocked) {
    debugInfo.condition = "Less than 6 rounds played";
    return { gameState: "opening", debugInfo };
  }

  if (fourBlocked) {
    debugInfo.condition = "Four blocked scenario detected";
    return { gameState: "midgame", debugInfo };
  }

  debugInfo.condition = "Default midgame classification";
  return { gameState: "midgame", debugInfo };
};

// Validate board dimensions
const isValidBoard = (board: string[][]): boolean => {
  return Array.isArray(board) && board.length === 15 && board.every(row => row.length === 15);
};

// Validate symbols on the board
const isValidSymbols = (board: string[][]): boolean => {
  const validSymbols = ["X", "O", ""];
  return board.flat().every(cell => validSymbols.includes(cell));
};

// Validate turn order
const isValidTurnOrder = (xCount: number, oCount: number): boolean => {
  return !(xCount < oCount || xCount > oCount + 1);
};

// Count occurrences of a symbol
const countSymbols = (board: string[][], symbol: string): number => {
  return board.flat().filter(cell => cell === symbol).length;
};

// Check if the player has a winning move
const hasWinningMove = (board: string[][], player: string): boolean => {
  const directions = [
    { row: 0, col: 1 }, // Horizontal
    { row: 1, col: 0 }, // Vertical
    { row: 1, col: 1 }, // Diagonal (top-left to bottom-right)
    { row: 1, col: -1 }, // Diagonal (top-right to bottom-left)
  ];

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (board[row][col] === player || board[row][col] === "") {
        for (const { row: dRow, col: dCol } of directions) {
          if (checkEndgameCondition(board, player, row, col, dRow, dCol)) {
            console.log(`Winning move found for ${player} at (${row}, ${col})`);
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Check for a "four blocked by wall or opponent's symbol"
const hasBlockedFour = (board: string[][], player: string): boolean => {
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
          if (checkBlockedFourCondition(board, player, row, col, dRow, dCol)) {
            console.log(
              `Blocked four detected for ${player} at (${row}, ${col})`
            );
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Check for opponent's blocked four
const hasOpponentBlockedFour = (board: string[][], player: string): boolean => {
  const opponent = player === "X" ? "O" : "X";
  return hasBlockedFour(board, opponent);
};

// Check if a "four is blocked" in the current direction
const checkBlockedFourCondition = (
  board: string[][],
  player: string,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number
): boolean => {
  let count = 0;
  let blockedBy: string | null = null;

  for (let i = 0; i < 4; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;

    if (row < 0 || row >= 15 || col < 0 || col >= 15) {
      blockedBy = "wall";
      break;
    }

    if (board[row][col] === player) {
      count++;
    } else if (board[row][col] !== "") {
      blockedBy = "opponent";
      break;
    }
  }

  return count === 4 && blockedBy !== null;
};

// Check endgame conditions
const checkEndgameCondition = (
  board: string[][],
  player: string,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number
): boolean => {
  let count = 0;
  let gapFound = false;

  for (let i = 0; i < 5; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;

    if (row < 0 || row >= 15 || col < 0 || col >= 15) break;

    if (board[row][col] === player) {
      count++;
    } else if (board[row][col] === "" && !gapFound) {
      gapFound = true; // Allow one gap
    } else {
      break;
    }
  }

  return count === 4 && gapFound;
};

export { getGameState };
