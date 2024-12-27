// Utility to determine the game state
const getGameState = (board) => {
    const debugInfo = {}; // Collect debugging information here
    // Validate board dimensions
    if (!Array.isArray(board) ||
        board.length !== 15 ||
        board.some((row) => row.length !== 15)) {
        debugInfo.error = "Invalid board dimensions.";
        return { statusCode: 422, error: "Invalid board size.", debugInfo };
    }
    // Validate symbols
    const validSymbols = ["X", "O", ""];
    if (!board.flat().every((cell) => validSymbols.includes(cell))) {
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
        return {
            statusCode: 422,
            error: "Wrong starting player or invalid turn sequence.",
            debugInfo,
        };
    }
    // Determine the current player
    const currentPlayer = xCount === oCount ? "X" : "O";
    debugInfo.currentPlayer = currentPlayer;
    // Check for winning conditions only for the current player
    const currentWinningMove = hasWinningMove(board, currentPlayer);
    debugInfo.currentWinningMove = currentWinningMove;
    if (currentWinningMove) {
        // If a player can win within one move, classify as "endgame" regardless of the number of rounds
        debugInfo.condition = "Winning move detected for current player";
        return { gameState: "endgame", debugInfo };
    }
    // Classify based on the number of rounds
    const roundsPlayed = Math.floor((xCount + oCount) / 2);
    debugInfo.roundsPlayed = roundsPlayed;
    if (roundsPlayed < 6) {
        debugInfo.condition = "Less than 6 rounds played";
        return { gameState: "opening", debugInfo };
    }
    debugInfo.condition = "Default midgame classification";
    return { gameState: "midgame", debugInfo };
};
// Count occurrences of a symbol
const countSymbols = (board, symbol) => {
    return board.flat().filter((cell) => cell === symbol).length;
};
const hasWinningMove = (board, player) => {
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
                    console.log(`Checking direction for player ${player} at (${row}, ${col}) in direction (${dRow}, ${dCol})`);
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
const checkEndgameCondition = (board, player, startRow, startCol, dRow, dCol) => {
    let count = 0;
    let gapFound = false;
    // Traverse forward to check for consecutive symbols or gaps
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * dRow;
        const col = startCol + i * dCol;
        if (row < 0 || row >= 15 || col < 0 || col >= 15)
            break;
        if (board[row][col] === player) {
            count++;
        }
        else if (board[row][col] === "" && !gapFound) {
            gapFound = true; // Allow only one gap in the sequence
        }
        else {
            break; // Stop if there's an opponent symbol or more than one gap
        }
    }
    // If the sequence isn’t exactly 4 with one potential move, return false
    if (count !== 4 || gapFound === false) {
        return false;
    }
    // Check open ends for actual winning move possibility
    const beforeRow = startRow - dRow;
    const beforeCol = startCol - dCol;
    const afterRow = startRow + 5 * dRow;
    const afterCol = startCol + 5 * dCol;
    const beforeValid = beforeRow >= 0 &&
        beforeRow < 15 &&
        beforeCol >= 0 &&
        beforeCol < 15 &&
        board[beforeRow][beforeCol] === "";
    const afterValid = afterRow >= 0 &&
        afterRow < 15 &&
        afterCol >= 0 &&
        afterCol < 15 &&
        board[afterRow][afterCol] === "";
    console.log(`Player: ${player}, Count: ${count}, GapFound: ${gapFound}, BeforeValid: ${beforeValid}, AfterValid: ${afterValid}`);
    // Ensure at least one open end
    return beforeValid || afterValid;
};
export { getGameState };
//# sourceMappingURL=gameLogic.js.map