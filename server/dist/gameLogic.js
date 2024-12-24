// Utility to determine the game state
const getGameState = (board) => {
  const debugInfo = {}; // Collect debugging information here

  // Validate board dimensions
  if (!Array.isArray(board) || board.length !== 15 || board.some(row => row.length !== 15)) {
    debugInfo.error = "Invalid board dimensions.";
    return { statusCode: 422, error: "Invalid board size.", debugInfo };
  }

  // Validate symbols
  const validSymbols = ["X", "O", ""];
  if (!board.flat().every(cell => validSymbols.includes(cell))) {
    debugInfo.error = "Invalid symbols on the board.";
    return { statusCode: 422, error: "Invalid symbols.", debugInfo };
  }

  // Validate turn order
  const xCount = countSymbols(board, "X");
  const oCount = countSymbols(board, "O");

  debugInfo.xCount = xCount;
  debugInfo.oCount = oCount;

  if (xCount < oCount || xCount > oCount + 1) {
    debugInfo.error = "Invalid turn sequence.";
    return { statusCode: 422, error: "Wrong starting player or invalid turn sequence.", debugInfo };
  }

  let roundsPlayed = Math.floor((xCount + oCount) / 2);
  debugInfo.roundsPlayed = roundsPlayed;

  // Check for winning conditions
  const xWinningMove = hasWinningMove(board, "X");
  const oWinningMove = hasWinningMove(board, "O");
  debugInfo.xWinningMove = xWinningMove;
  debugInfo.oWinningMove = oWinningMove;

  if (xWinningMove || oWinningMove) {
    return { gameState: "endgame", debugInfo };
  }

  // Classify based on the number of rounds
  if (roundsPlayed < 6) {
    return { gameState: "opening", debugInfo };
  }
  return { gameState: "midgame", debugInfo };
};

// Count occurrences of a symbol
const countSymbols = (board, symbol) => {
  return board.flat().filter(cell => cell === symbol).length;
};

const hasWinningMove = (board, player) => {
  const directions = [
    { row: 0, col: 1 },  // Horizontal
    { row: 1, col: 0 },  // Vertical
    { row: 1, col: 1 },  // Diagonal (top-left to bottom-right)
    { row: 1, col: -1 }  // Diagonal (top-right to bottom-left)
  ];

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (board[row][col] === player) {
        for (const { row: dRow, col: dCol } of directions) {
          if (checkEndgameCondition(board, player, row, col, dRow, dCol)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const checkEndgameCondition = (board, player, startRow, startCol, dRow, dCol) => {
  let count = 0;

  for (let i = 0; i < 5; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;

    if (row < 0 || row >= 15 || col < 0 || col >= 15) break;

    if (board[row][col] === player) {
      count++;
    } else if (board[row][col] !== "") {
      return false;
    }
  }

  const beforeRow = startRow - dRow;
  const beforeCol = startCol - dCol;
  const afterRow = startRow + 5 * dRow;
  const afterCol = startCol + 5 * dCol;

  const beforeOpen =
    beforeRow >= 0 &&
    beforeRow < 15 &&
    beforeCol >= 0 &&
    beforeCol < 15 &&
    board[beforeRow][beforeCol] === "";

  const afterOpen =
    afterRow >= 0 &&
    afterRow < 15 &&
    afterCol >= 0 &&
    afterCol < 15 &&
    board[afterRow][afterCol] === "";

  return count === 4 && (beforeOpen || afterOpen);
};

module.exports = { getGameState };
