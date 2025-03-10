import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { hasWon, calculateElo, isDraw } from "./MPLogic.js";
import BitmapGenerator from "./bitmapGenerator.js";
import { User } from "./models.js";
import { parse } from "url";
import { GameClock } from "./gameClock.js";
// Store active games and matchmaking queue
const games = {};
const matchmakingQueue = [];
const gameClocks = {};
// Secret key for verifying tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
// Define the maximum allowed ELO difference for matching players
const MAX_ELO_DIFFERENCE = 100; // Players can be matched if their ELO difference is within this range
function initializeWebSocket(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", async (ws, req) => {
        const token = extractToken(req);
        if (!token) {
            ws.close(4001, "Unauthorized: Token required");
            return;
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                ws.close(4001, "Unauthorized: Invalid token");
                return;
            }
            // Fetch the user's stats from the database
            try {
                const user = await User.findOne({
                    where: { uuid: decoded.uuid },
                });
                if (!user) {
                    ws.close(4001, "Unauthorized: User not found");
                    return;
                }
                // Attach user data to WebSocket connection with default values
                ws.user = {
                    uuid: user.uuid,
                    username: user.username,
                    elo: user.elo ?? 400,
                    wins: user.wins ?? 0,
                    draws: user.draws ?? 0,
                    losses: user.losses ?? 0,
                };
                console.log(`User ${ws.user.username} connected with stats:`, ws.user);
                ws.on("message", (message) => handleMessage(ws, message));
                ws.on("close", () => handleDisconnect(ws));
            }
            catch (err) {
                console.error("Error fetching user stats:", err);
                ws.close(500, "Internal server error");
            }
        });
    });
    console.log("WebSocket server initialized");
    // Clean up abandoned games every hour
    setInterval(cleanupAbandonedGames, 3600000); // 1 hour
}
function extractToken(req) {
    try {
        // 1. Zkusit token z hlavičky
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.split(" ")[1];
        }
        // 2. Zkusit token z query stringu (pro WebSockety)
        const urlParts = parse(req.url ?? "", true); // Rozparsovat URL
        return urlParts.query.token ?? null;
    }
    catch (err) {
        console.error("Error extracting token:", err);
        return null;
    }
}
// Handle messages
async function handleMessage(ws, message) {
    try {
        const data = JSON.parse(message.toString());
        const { type, gameId, move } = data;
        switch (type) {
            case "create":
                const newGameId = generateGameId();
                games[newGameId] = {
                    players: [ws],
                    board: Array(15)
                        .fill("")
                        .map(() => Array(15).fill("")),
                    currentPlayer: "X",
                    gameState: "waiting",
                    lastActivity: Date.now(),
                };
                ws.send(JSON.stringify({ type: "created", gameId: newGameId }));
                break;
            case "joinLobby":
                const game = games[gameId];
                if (game && game.players.length === 1) {
                    game.players.push(ws);
                    game.gameState = "in-progress";
                    game.lastActivity = Date.now();
                    game.players[0].send(JSON.stringify({ type: "start", player: "X" }));
                    game.players[1].send(JSON.stringify({ type: "start", player: "O" }));
                }
                else {
                    ws.send(JSON.stringify({ type: "error", message: "Game not found or full" }));
                }
                break;
            case "matchmaking":
                matchmakingQueue.push({ ws, user: ws.user });
                if (matchmakingQueue.length >= 2) {
                    matchmakingQueue.sort((a, b) => a.user.elo - b.user.elo);
                    const player1 = matchmakingQueue[0];
                    const player2 = matchmakingQueue[1];
                    // Check if the ELO difference is within the allowed threshold
                    if (Math.abs(player1.user.elo - player2.user.elo) <= MAX_ELO_DIFFERENCE) {
                        matchmakingQueue.shift();
                        matchmakingQueue.shift();
                        const newGameId = generateGameId();
                        games[newGameId] = {
                            players: [player1.ws, player2.ws],
                            board: Array(15)
                                .fill("")
                                .map(() => Array(15).fill("")),
                            currentPlayer: "X",
                            lastActivity: Date.now(),
                        };
                        player1.ws.send(JSON.stringify({
                            type: "matched",
                            gameId: newGameId,
                            player: "X",
                        }));
                        player2.ws.send(JSON.stringify({
                            type: "matched",
                            gameId: newGameId,
                            player: "O",
                        }));
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: "waiting",
                            message: "Waiting for an opponent with a closer ELO...",
                        }));
                    }
                }
                else {
                    ws.send(JSON.stringify({
                        type: "waiting",
                        message: "Waiting for an opponent...",
                    }));
                }
                break;
            case "move":
                const gameToUpdate = games[gameId];
                if (gameToUpdate && gameToUpdate.players.includes(ws)) {
                    const newBoard = JSON.parse(JSON.stringify(gameToUpdate.board));
                    console.log("hraju!");
                    // Check if the cell is already occupied
                    if (newBoard[move.row][move.col] !== "") {
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Cell already occupied",
                        }));
                        return;
                    }
                    // Determine the player symbol (X or O)
                    const playerIndex = gameToUpdate.players.indexOf(ws); // 0 for X, 1 for O
                    const playerSymbol = playerIndex === 0 ? "X" : "O";
                    // Ensure it's the player's turn
                    if (playerSymbol !== gameToUpdate.currentPlayer) {
                        ws.send(JSON.stringify({ type: "error", message: "Not your turn" }));
                        return;
                    }
                    // Stop the clock for the player who just moved
                    if (!gameClocks[gameId]) {
                        gameClocks[gameId] = new GameClock(8 * 60 * 1000, async (player) => {
                            const winner = player === "X" ? "O" : "X";
                            const loser = player;
                            // Find the winner and loser in the players array
                            const winnerWs = gameToUpdate.players[player === "X" ? 0 : 1];
                            const loserWs = gameToUpdate.players[player === "X" ? 1 : 0];
                            // Log player stats before calculation
                            console.log("Winner stats before update:", winnerWs.user);
                            console.log("Loser stats before update:", loserWs.user);
                            // Store old Elo ratings for calculating Elo change
                            const oldEloWinner = winnerWs.user.elo;
                            const oldEloLoser = loserWs.user.elo;
                            // Calculate new Elo ratings
                            const { newRA, newRB } = calculateElo({
                                elo: oldEloWinner,
                                wins: winnerWs.user.wins,
                                draws: winnerWs.user.draws,
                                losses: winnerWs.user.losses,
                            }, {
                                elo: oldEloLoser,
                                wins: loserWs.user.wins,
                                draws: loserWs.user.draws,
                                losses: loserWs.user.losses,
                            }, "win");
                            // Update winner and loser stats
                            winnerWs.user.elo = newRA;
                            winnerWs.user.wins =
                                (winnerWs.user.wins || 0) + 1;
                            loserWs.user.elo = newRB;
                            loserWs.user.losses =
                                (loserWs.user.losses || 0) + 1;
                            // Log updated stats
                            console.log("Winner stats after update:", {
                                elo: winnerWs.user.elo,
                                wins: winnerWs.user.wins,
                            });
                            console.log("Loser stats after update:", {
                                elo: loserWs.user.elo,
                                losses: loserWs.user.losses,
                            });
                            // Save updated stats to the database
                            await User.update({
                                elo: winnerWs.user.elo,
                                wins: winnerWs.user.wins,
                            }, { where: { uuid: winnerWs.user.uuid } }).then(() => {
                                console.log(`Updated winner stats: elo=${winnerWs.user.elo}, wins=${winnerWs.user.wins}`);
                            });
                            await User.update({
                                elo: loserWs.user.elo,
                                losses: loserWs.user.losses,
                            }, { where: { uuid: loserWs.user.uuid } }).then(() => {
                                console.log(`Updated loser stats: elo=${loserWs.user.elo}, losses=${loserWs.user.losses}`);
                            });
                            // Prepare game history data
                            const gameData = {
                                type: "end",
                                winner,
                                loser,
                                playerX: gameToUpdate.players[0].user.uuid,
                                playerO: gameToUpdate.players[1].user.uuid,
                                eloChangeX: newRA - oldEloWinner, // Correct Elo change calculation
                                eloChangeO: newRB - oldEloLoser, // Correct Elo change calculation
                                board: gameToUpdate.board,
                                bitmap: BitmapGenerator.generateBitmap(gameToUpdate.board),
                                endedAt: new Date().toISOString(),
                            };
                            // Notify players of the end of the game
                            gameToUpdate.players.forEach((playerWs) => {
                                playerWs.send(JSON.stringify(gameData));
                            });
                            delete games[gameId]; // Remove the game from the active games list
                            delete gameClocks[gameId]; // Remove the game clock
                        });
                    }
                    gameClocks[gameId].stopClock();
                    // Update the board and switch turns
                    newBoard[move.row][move.col] = playerSymbol;
                    gameToUpdate.board = newBoard;
                    gameToUpdate.currentPlayer = gameToUpdate.currentPlayer === "X" ? "O" : "X";
                    gameToUpdate.lastActivity = Date.now();
                    // Get remaining time for the player who just moved
                    const remainingTime = gameClocks[gameId].getTime(playerSymbol);
                    // Start the clock for the next player
                    gameClocks[gameId].startTurn(gameToUpdate.currentPlayer);
                    // Send updated move response with time left
                    ws.send(JSON.stringify({
                        type: "move",
                        gameId,
                        move,
                        timeLeft: remainingTime,
                    }));
                    // Check if the current player has won
                    if (hasWon(newBoard, playerSymbol)) {
                        const winner = playerSymbol;
                        const loser = playerSymbol === "X" ? "O" : "X";
                        // Find the winner and loser in the players array
                        const winnerWs = gameToUpdate.players[playerIndex];
                        const loserWs = gameToUpdate.players[1 - playerIndex];
                        // Log player stats before calculation
                        console.log("Winner stats before update:", winnerWs.user);
                        console.log("Loser stats before update:", loserWs.user);
                        // Store old Elo ratings for calculating Elo change
                        const oldEloWinner = winnerWs.user.elo;
                        const oldEloLoser = loserWs.user.elo;
                        // Calculate new Elo ratings
                        const { newRA, newRB } = calculateElo({
                            elo: oldEloWinner,
                            wins: winnerWs.user.wins,
                            draws: winnerWs.user.draws,
                            losses: winnerWs.user.losses,
                        }, {
                            elo: oldEloLoser,
                            wins: loserWs.user.wins,
                            draws: loserWs.user.draws,
                            losses: loserWs.user.losses,
                        }, "win");
                        // Update winner and loser stats
                        winnerWs.user.elo = newRA;
                        winnerWs.user.wins =
                            (winnerWs.user.wins || 0) + 1;
                        loserWs.user.elo = newRB;
                        loserWs.user.losses =
                            (loserWs.user.losses || 0) + 1;
                        // Log updated stats
                        console.log("Winner stats after update:", {
                            elo: winnerWs.user.elo,
                            wins: winnerWs.user.wins,
                        });
                        console.log("Loser stats after update:", {
                            elo: loserWs.user.elo,
                            losses: loserWs.user.losses,
                        });
                        // Save updated stats to the database
                        await User.update({
                            elo: winnerWs.user.elo,
                            wins: winnerWs.user.wins,
                        }, { where: { uuid: winnerWs.user.uuid } }).then(() => {
                            console.log(`Updated winner stats: elo=${winnerWs.user.elo}, wins=${winnerWs.user.wins}`);
                        });
                        await User.update({
                            elo: loserWs.user.elo,
                            losses: loserWs.user.losses,
                        }, { where: { uuid: loserWs.user.uuid } }).then(() => {
                            console.log(`Updated loser stats: elo=${loserWs.user.elo}, losses=${loserWs.user.losses}`);
                        });
                        // Prepare game history data
                        const gameData = {
                            type: "end",
                            winner,
                            loser,
                            playerX: gameToUpdate.players[0].user.uuid,
                            playerO: gameToUpdate.players[1].user.uuid,
                            eloChangeX: newRA - oldEloWinner, // Correct Elo change calculation
                            eloChangeO: newRB - oldEloLoser, // Correct Elo change calculation
                            board: newBoard,
                            bitmap: BitmapGenerator.generateBitmap(newBoard),
                            endedAt: new Date().toISOString(),
                        };
                        // Notify players of the end of the game
                        gameToUpdate.players.forEach((playerWs) => {
                            playerWs.send(JSON.stringify(gameData));
                        });
                        delete games[gameId]; // Remove the game from the active games list
                        delete gameClocks[gameId]; // Remove the game clock
                        return;
                    }
                    // Check if the game is a draw
                    if (isDraw(newBoard)) {
                        console.log("je to remiza");
                        const { newRA, newRB } = calculateElo({
                            elo: gameToUpdate.players[0].user.elo,
                            wins: gameToUpdate.players[0].user.wins,
                            draws: gameToUpdate.players[0].user.draws,
                            losses: gameToUpdate.players[0].user.losses,
                        }, {
                            elo: gameToUpdate.players[1].user.elo,
                            wins: gameToUpdate.players[1].user.wins,
                            draws: gameToUpdate.players[1].user.draws,
                            losses: gameToUpdate.players[1].user.losses,
                        }, "draw");
                        // Store old Elo ratings for calculating Elo change
                        const oldEloPlayerX = gameToUpdate.players[0].user.elo;
                        const oldEloPlayerO = gameToUpdate.players[1].user.elo;
                        // Update both players' stats
                        gameToUpdate.players[0].user.elo = newRA;
                        gameToUpdate.players[0].user.draws =
                            (gameToUpdate.players[0].user.draws || 0) + 1;
                        gameToUpdate.players[1].user.elo = newRB;
                        gameToUpdate.players[1].user.draws =
                            (gameToUpdate.players[1].user.draws || 0) + 1;
                        // Save updated stats to the database
                        await User.update({
                            elo: gameToUpdate.players[0].user.elo,
                            draws: gameToUpdate.players[0].user.draws,
                        }, { where: { uuid: gameToUpdate.players[0].user.uuid } });
                        await User.update({
                            elo: gameToUpdate.players[1].user.elo,
                            draws: gameToUpdate.players[1].user.draws,
                        }, { where: { uuid: gameToUpdate.players[1].user.uuid } });
                        // Prepare game history data
                        const gameData = {
                            type: "end",
                            winner: null, // No winner in a draw
                            loser: null,
                            playerX: gameToUpdate.players[0].user.uuid,
                            playerO: gameToUpdate.players[1].user.uuid,
                            eloChangeX: newRA - oldEloPlayerX, // Correct Elo change calculation
                            eloChangeO: newRB - oldEloPlayerO, // Correct Elo change calculation
                            board: newBoard,
                            bitmap: BitmapGenerator.generateBitmap(newBoard),
                            endedAt: new Date().toISOString(),
                        };
                        // Notify players of the draw
                        gameToUpdate.players.forEach((playerWs) => {
                            playerWs.send(JSON.stringify(gameData));
                        });
                        delete games[gameId]; // Remove the game from the active games list
                        delete gameClocks[gameId]; // Remove the game clock
                        return;
                    }
                    // If no one has won and the game is not a draw, send the updated board to both players
                    const bitmap = BitmapGenerator.generateBitmap(newBoard);
                    gameToUpdate.players.forEach((playerWs) => {
                        playerWs.send(JSON.stringify({
                            type: "update",
                            board: newBoard,
                            currentPlayer: gameToUpdate.currentPlayer,
                            bitmap: bitmap,
                        }));
                    });
                }
                break;
            default:
                console.log("Unknown message type:", type);
                ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
        }
    }
    catch (err) {
        console.error("Error handling message:", err);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
}
// Handle disconnection
function handleDisconnect(ws) {
    console.log("Client disconnected");
    const index = matchmakingQueue.findIndex((player) => player.ws === ws);
    if (index !== -1) {
        matchmakingQueue.splice(index, 1);
    }
    Object.keys(games).forEach((gameId) => {
        const game = games[gameId];
        if (game.players.includes(ws)) {
            game.players.forEach((playerWs) => {
                if (playerWs !== ws && playerWs.readyState === WebSocket.OPEN) {
                    playerWs.send(JSON.stringify({ type: "end", winner: "disconnect" }));
                }
            });
            delete games[gameId];
            delete gameClocks[gameId]; // Remove the game clock
        }
    });
}
// Generate unique game ID
function generateGameId() {
    return Math.random().toString(36).substring(2, 8);
}
// Clean up abandoned games
function cleanupAbandonedGames() {
    const now = Date.now();
    Object.keys(games).forEach((gameId) => {
        const game = games[gameId];
        if (game.lastActivity && now - game.lastActivity > 3600000) {
            // 1 hour
            console.log(`Cleaning up abandoned game: ${gameId}`);
            game.players.forEach((playerWs) => {
                if (playerWs.readyState === WebSocket.OPEN) {
                    playerWs.send(JSON.stringify({ type: "end", winner: "abandoned" }));
                }
            });
            delete games[gameId];
            delete gameClocks[gameId]; // Remove the game clock
        }
    });
}
export default initializeWebSocket;
//# sourceMappingURL=websocket.js.map