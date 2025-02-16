import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { hasWon, calculateElo, isDraw } from "./MPLogic.js";
import BitmapGenerator from "./bitmapGenerator.js";
import { User } from "./models.js";

interface UserStats {
  uuid: string;
  username: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
}

interface Game {
  players: WebSocket[];
  board: (string | null)[][];
  currentPlayer: string;
  gameState?: string;
  lastActivity: number;
}

// Store active games and matchmaking queue
const games: { [key: string]: Game } = {};
const matchmakingQueue: { ws: WebSocket; user: UserStats }[] = [];

// Secret key for verifying tokens
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";

// Define the maximum allowed ELO difference for matching players
const MAX_ELO_DIFFERENCE = 100; // Players can be matched if their ELO difference is within this range

function initializeWebSocket(server: any): void {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: WebSocket, req: Request) => {
    const token = extractToken(req);

    if (!token) {
      ws.close(4001, "Unauthorized: Token required");
      return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        ws.close(4001, "Unauthorized: Invalid token");
        return;
      }

      // Fetch the user's stats from the database
      try {
        const user = await User.findOne({
          where: { uuid: (decoded as any).uuid },
        });
        if (!user) {
          ws.close(4001, "Unauthorized: User not found");
          return;
        }

        // Attach user data to WebSocket connection with default values
        (ws as any).user = {
          uuid: user.uuid,
          username: user.username,
          elo: user.elo ?? 400,
          wins: user.wins ?? 0,
          draws: user.draws ?? 0,
          losses: user.losses ?? 0,
        };

        console.log(
          `User ${(ws as any).user.username} connected with stats:`,
          (ws as any).user
        );

        ws.on("message", (message: any) => handleMessage(ws, message));
        ws.on("close", () => handleDisconnect(ws));
      } catch (err) {
        console.error("Error fetching user stats:", err);
        ws.close(500, "Internal server error");
      }
    });
  });

  console.log("WebSocket server initialized");

  // Clean up abandoned games every hour
  setInterval(cleanupAbandonedGames, 3600000); // 1 hour
}

// Extract JWT from query string or headers
function extractToken(req: http.IncomingMessage): string | null {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    return authHeader.split(" ")[1];
  } catch (err) {
    console.error("Error extracting token:", err);
    return null;
  }
}

// Handle messages
async function handleMessage(
  ws: WebSocket,
  message: WebSocket.RawData
): Promise<void> {
  try {
    const data = JSON.parse(message.toString());
    const { type, gameId, move } = data;

    switch (type) {
      case "create":
        const newGameId = generateGameId();
        games[newGameId] = {
          players: [ws],
          board: Array(15)
            .fill(null)
            .map(() => Array(15).fill(null)),
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
        } else {
          ws.send(
            JSON.stringify({ type: "error", message: "Game not found or full" })
          );
        }
        break;

      case "matchmaking":
        matchmakingQueue.push({ ws, user: (ws as any).user });

        if (matchmakingQueue.length >= 2) {
          matchmakingQueue.sort((a, b) => a.user.elo - b.user.elo);

          const player1 = matchmakingQueue[0];
          const player2 = matchmakingQueue[1];

          // Check if the ELO difference is within the allowed threshold
          if (
            Math.abs(player1.user.elo - player2.user.elo) <= MAX_ELO_DIFFERENCE
          ) {
            matchmakingQueue.shift();
            matchmakingQueue.shift();

            const newGameId = generateGameId();
            games[newGameId] = {
              players: [player1.ws, player2.ws],
              board: Array(15)
                .fill(null)
                .map(() => Array(15).fill(null)),
              currentPlayer: "X",
              lastActivity: Date.now(),
            };

            player1.ws.send(
              JSON.stringify({
                type: "matched",
                gameId: newGameId,
                player: "X",
              })
            );
            player2.ws.send(
              JSON.stringify({
                type: "matched",
                gameId: newGameId,
                player: "O",
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                type: "waiting",
                message: "Waiting for an opponent with a closer ELO...",
              })
            );
          }
        } else {
          ws.send(
            JSON.stringify({
              type: "waiting",
              message: "Waiting for an opponent...",
            })
          );
        }
        break;

      case "move":
        const gameToUpdate = games[gameId];
        if (gameToUpdate && gameToUpdate.players.includes(ws)) {
          const newBoard = JSON.parse(JSON.stringify(gameToUpdate.board));

          // Check if the cell is already occupied
          if (newBoard[move.row][move.col] !== null) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Cell already occupied",
              })
            );
            return;
          }

          // Determine the player symbol (X or O)
          const playerIndex = gameToUpdate.players.indexOf(ws); // 0 for X, 1 for O
          const playerSymbol = playerIndex === 0 ? "X" : "O";

          // Ensure it's the player's turn
          if (playerSymbol !== gameToUpdate.currentPlayer) {
            ws.send(
              JSON.stringify({ type: "error", message: "Not your turn" })
            );
            return;
          }

          // Update the board and switch turns
          newBoard[move.row][move.col] = playerSymbol;
          gameToUpdate.board = newBoard;
          gameToUpdate.currentPlayer =
            gameToUpdate.currentPlayer === "X" ? "O" : "X";
          gameToUpdate.lastActivity = Date.now();

          // Check if the current player has won
          if (hasWon(newBoard, playerSymbol)) {
            const winner = playerSymbol;
            const loser = playerSymbol === "X" ? "O" : "X";

            // Find the winner and loser in the players array
            const winnerWs = gameToUpdate.players[playerIndex];
            const loserWs = gameToUpdate.players[1 - playerIndex];

            // Log player stats before calculation
            console.log("Winner stats before update:", (winnerWs as any).user);
            console.log("Loser stats before update:", (loserWs as any).user);

            // Calculate new Elo ratings
            const { newRA, newRB } = calculateElo(
              {
                elo: (winnerWs as any).user.elo,
                wins: (winnerWs as any).user.wins,
                draws: (winnerWs as any).user.draws,
                losses: (winnerWs as any).user.losses,
              },
              {
                elo: (loserWs as any).user.elo,
                wins: (loserWs as any).user.wins,
                draws: (loserWs as any).user.draws,
                losses: (loserWs as any).user.losses,
              },
              "win"
            );

            // Update winner and loser stats
            (winnerWs as any).user.elo = newRA;
            (winnerWs as any).user.wins =
              ((winnerWs as any).user.wins || 0) + 1;
            (loserWs as any).user.elo = newRB;
            (loserWs as any).user.losses =
              ((loserWs as any).user.losses || 0) + 1;

            // Log updated stats
            console.log("Winner stats after update:", {
              elo: (winnerWs as any).user.elo,
              wins: (winnerWs as any).user.wins,
            });
            console.log("Loser stats after update:", {
              elo: (loserWs as any).user.elo,
              losses: (loserWs as any).user.losses,
            });

            // Save updated stats to the database
            await User.update(
              {
                elo: (winnerWs as any).user.elo,
                wins: (winnerWs as any).user.wins,
              },
              { where: { uuid: (winnerWs as any).user.uuid } }
            ).then(() => {
              console.log(
                `Updated winner stats: elo=${
                  (winnerWs as any).user.elo
                }, wins=${(winnerWs as any).user.wins}`
              );
            });

            await User.update(
              {
                elo: (loserWs as any).user.elo,
                losses: (loserWs as any).user.losses,
              },
              { where: { uuid: (loserWs as any).user.uuid } }
            ).then(() => {
              console.log(
                `Updated loser stats: elo=${
                  (loserWs as any).user.elo
                }, losses=${(loserWs as any).user.losses}`
              );
            });

            // Notify players of the end of the game
            gameToUpdate.players.forEach((playerWs) => {
              playerWs.send(
                JSON.stringify({
                  type: "end",
                  winner,
                  board: newBoard,
                  bitmap: BitmapGenerator.generateBitmap(newBoard),
                })
              );
            });
            delete games[gameId]; // Remove the game from the active games list
            return;
          }

          // Check if the game is a draw
          if (isDraw(newBoard)) {
            const { newRA, newRB } = calculateElo(
              {
                elo: (gameToUpdate.players[0] as any).user.elo,
                wins: (gameToUpdate.players[0] as any).user.wins,
                draws: (gameToUpdate.players[0] as any).user.draws,
                losses: (gameToUpdate.players[0] as any).user.losses,
              },
              {
                elo: (gameToUpdate.players[1] as any).user.elo,
                wins: (gameToUpdate.players[1] as any).user.wins,
                draws: (gameToUpdate.players[1] as any).user.draws,
                losses: (gameToUpdate.players[1] as any).user.losses,
              },
              "draw"
            );

            // Update both players' stats
            (gameToUpdate.players[0] as any).user.elo = newRA;
            (gameToUpdate.players[0] as any).user.draws =
              ((gameToUpdate.players[0] as any).user.draws || 0) + 1;
            (gameToUpdate.players[1] as any).user.elo = newRB;
            (gameToUpdate.players[1] as any).user.draws =
              ((gameToUpdate.players[1] as any).user.draws || 0) + 1;

            // Save updated stats to the database
            await User.update(
              {
                elo: (gameToUpdate.players[0] as any).user.elo,
                draws: (gameToUpdate.players[0] as any).user.draws,
              },
              { where: { uuid: (gameToUpdate.players[0] as any).user.uuid } }
            );
            await User.update(
              {
                elo: (gameToUpdate.players[1] as any).user.elo,
                draws: (gameToUpdate.players[1] as any).user.draws,
              },
              { where: { uuid: (gameToUpdate.players[1] as any).user.uuid } }
            );

            // Notify players of the draw
            gameToUpdate.players.forEach((playerWs) => {
              playerWs.send(
                JSON.stringify({
                  type: "end",
                  winner: null, // No winner in a draw
                  board: newBoard,
                  bitmap: BitmapGenerator.generateBitmap(newBoard),
                })
              );
            });
            delete games[gameId]; // Remove the game from the active games list
            return;
          }

          // If no one has won and the game is not a draw, send the updated board to both players
          const bitmap = BitmapGenerator.generateBitmap(newBoard);
          gameToUpdate.players.forEach((playerWs) => {
            playerWs.send(
              JSON.stringify({
                type: "update",
                board: newBoard,
                currentPlayer: gameToUpdate.currentPlayer,
                bitmap: bitmap,
              })
            );
          });
        }
        break;

      default:
        console.log("Unknown message type:", type);
        ws.send(
          JSON.stringify({ type: "error", message: "Unknown message type" })
        );
    }
  } catch (err) {
    console.error("Error handling message:", err);
    ws.send(
      JSON.stringify({ type: "error", message: "Invalid message format" })
    );
  }
}

// Handle disconnection
function handleDisconnect(ws: WebSocket): void {
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
    }
  });
}

// Generate unique game ID
function generateGameId(): string {
  return Math.random().toString(36).substring(2, 8);
}

// Clean up abandoned games
function cleanupAbandonedGames(): void {
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
    }
  });
}

export default initializeWebSocket;
