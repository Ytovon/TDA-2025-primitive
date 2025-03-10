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
    // Determine the current player
    const currentPlayer = xCount === oCount ? "X" : "O";
    debugInfo.currentPlayer = currentPlayer;
    // Check for winning conditions for the current player
    const currentWinningMove = hasWinningMove(board, currentPlayer);
    debugInfo.currentWinningMove = currentWinningMove;
    if (currentWinningMove) {
        // If a player can win within one move, classify as "endgame" regardless of the number of rounds
        debugInfo.condition = "Winning move detected for current player";
        return { gameState: "endgame", debugInfo };
    }
    // Check for midgame scenarios: Four blocked by wall or opponent's symbol
    const fourBlocked = hasBlockedFour(board, currentPlayer) ||
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
// Count occurrences of a symbol
const countSymbols = (board, symbol) => {
    return board.flat().filter(cell => cell === symbol).length;
};
// Check if the player has a winning move
const hasWinningMove = (board, player) => {
    const directions = [
        { row: 0, col: 1 }, // Horizontal
        { row: 1, col: 0 }, // Vertical
        { row: 1, col: 1 }, // Diagonal (top-left to bottom-right)
        { row: 1, col: -1 } // Diagonal (top-right to bottom-left)
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
const hasBlockedFour = (board, player) => {
    const directions = [
        { row: 0, col: 1 }, // Horizontal
        { row: 1, col: 0 }, // Vertical
        { row: 1, col: 1 }, // Diagonal (top-left to bottom-right)
        { row: 1, col: -1 } // Diagonal (top-right to bottom-left)
    ];
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            if (board[row][col] === player) {
                for (const { row: dRow, col: dCol } of directions) {
                    if (checkBlockedFourCondition(board, player, row, col, dRow, dCol)) {
                        console.log(`Blocked four detected for ${player} at (${row}, ${col})`);
                        return true;
                    }
                }
            }
        }
    }
    return false;
};
// Check for opponent's blocked four
const hasOpponentBlockedFour = (board, player) => {
    const opponent = player === "X" ? "O" : "X";
    return hasBlockedFour(board, opponent);
};
// Check if a "four is blocked" in the current direction
const checkBlockedFourCondition = (board, player, startRow, startCol, dRow, dCol) => {
    let count = 0;
    let blockedBy = null;
    for (let i = 0; i < 4; i++) {
        const row = startRow + i * dRow;
        const col = startCol + i * dCol;
        if (row < 0 || row >= 15 || col < 0 || col >= 15) {
            blockedBy = "wall";
            break;
        }
        if (board[row][col] === player) {
            count++;
        }
        else if (board[row][col] !== "") {
            blockedBy = "opponent";
            break;
        }
    }
    return count === 4 && blockedBy !== null;
};
// Check endgame conditions
const checkEndgameCondition = (board, player, startRow, startCol, dRow, dCol) => {
    let count = 0;
    let gapFound = false;
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * dRow;
        const col = startCol + i * dCol;
        if (row < 0 || row >= 15 || col < 0 || col >= 15)
            break;
        if (board[row][col] === player) {
            count++;
        }
        else if (board[row][col] === "" && !gapFound) {
            gapFound = true; // Allow one gap
        }
        else {
            break;
        }
    }
    return count === 4 && gapFound;
};
export { getGameState };
//# sourceMappingURL=gameLogic.js.map