import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { hasWon, calculateElo, isDraw } from "./MPLogic.js";
import BitmapGenerator from "./bitmapGenerator.js";
import { MatchmakingGame, User } from "./models.js";
import { parse } from "url";
import { GameClock } from "./gameClock.js";
import { Op } from "sequelize";

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
  board: string[][];
  currentPlayer: string;
  gameState?: string;
  lastActivity: number;
  isLobby: boolean; // New field to distinguish lobby games
}

// Store active games and matchmaking queue
const games: { [key: string]: Game } = {};
const matchmakingQueue: { ws: WebSocket; user: UserStats }[] = [];
const gameClocks: { [key: string]: GameClock } = {};

// Secret key for verifying tokens
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";

// Define the maximum allowed ELO difference for matching players
const MAX_ELO_DIFFERENCE = 10000; // Players can be matched if their ELO difference is within this range

function initializeWebSocket(server: any): void {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: WebSocket, req: Request) => {
    const urlParts = parse(req.url ?? "", true); // Parse the URL
    const token = urlParts.query.token as string | undefined;
    const gameId = urlParts.query.gameId as string | undefined;

    // Guest connection (no token, but has gameId)
    if (!token && gameId) {
      const game = games[gameId];

      // Check if the game exists and was created within the last 5 minutes
      if (game && Date.now() - game.lastActivity <= 300000) { // 5 minutes = 300,000 ms
        // Attach guest data to WebSocket connection
        (ws as any).user = {
          uuid: `guest-${Math.random().toString(36).substring(2, 8)}`, // Generate a random guest ID
          username: "Guest",
          elo: 400, // Default Elo for guests
          wins: 0,
          draws: 0,
          losses: 0,
        };

        console.log(`Guest connected to game ${gameId}`);

        // Add the guest to the game
        game.players.push(ws);
        game.gameState = "in-progress";
        game.lastActivity = Date.now();

        // Notify both players that the game has started
        game.players[0].send(JSON.stringify({ type: "start", player: "X" }));
        game.players[1].send(JSON.stringify({ type: "start", player: "O" }));

        ws.on("message", (message: any) => handleMessage(ws, message));
        ws.on("close", () => handleDisconnect(ws));
      } else {
        ws.close(4004, "Game not found or expired");
      }
      return;
    }

    // Registered user connection (requires token)
    if (!token) {
      ws.close(4001, "Unauthorized: Token or gameId required");
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

        // Check if the user is banned
        if (user.isBanned) {
          ws.close(4003, "Forbidden: User is banned");
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

function extractToken(req: http.IncomingMessage): string | null {
  try {
    // 1. Try token from header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    // 2. Try token from query string (for WebSockets)
    const urlParts = parse(req.url ?? "", true); // Parse URL
    return (urlParts.query.token as string) ?? null;
  } catch (err) {
    console.error("Error extracting token:", err);
    return null;
  }
}

// Generate a 6-digit numeric game ID
function generateNumericGameId(): string {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
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
        const newGameId = generateNumericGameId();
        const isLobby = data.isLobby ?? false; // Default to false if not provided
        games[newGameId] = {
          players: [ws],
          board: Array(15)
            .fill("")
            .map(() => Array(15).fill("")),
          currentPlayer: "X",
          gameState: "waiting",
          lastActivity: Date.now(),
          isLobby: isLobby, // Set the isLobby flag
        };
        ws.send(JSON.stringify({ type: "created", gameId: newGameId }));
        break;

        case "getHistory":
          try {
            const userUuid = (ws as any).user.uuid; // Extract user UUID from WebSocket connection
            const games = await MatchmakingGame.findAll({
              where: {
                [Op.or]: [{ playerX: userUuid }, { playerO: userUuid }],
              },
              order: [["endedAt", "DESC"]],
            });

            ws.send(
              JSON.stringify({
                type: "gameHistory",
                games,
              })
            );
          } catch (error) {
            console.error("Error fetching game history:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to fetch game history",
              })
            );
          }
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

      case "guestJoinLobby":
        const guestGameId = data.gameId;
        const guestGame = games[guestGameId];

        if (guestGame && guestGame.players.length === 1) {
          guestGame.players.push(ws);
          guestGame.gameState = "in-progress";
          guestGame.lastActivity = Date.now();
          guestGame.players[0].send(JSON.stringify({ type: "start", player: "X" }));
          guestGame.players[1].send(JSON.stringify({ type: "start", player: "O" }));
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

            const newGameId = generateNumericGameId();
            games[newGameId] = {
              players: [player1.ws, player2.ws],
              board: Array(15)
                .fill("")
                .map(() => Array(15).fill("")),
              currentPlayer: "X",
              lastActivity: Date.now(),
              isLobby: false, // Matchmaking games are not lobby games
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

          console.log("hraju!");

          // Check if the cell is already occupied
          if (newBoard[move.row][move.col] !== "") {
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

          // Stop the clock for the player who just moved
          if (!gameClocks[gameId]) {
            gameClocks[gameId] = new GameClock(
              8 * 60 * 1000,
              async (player) => {
                const winner = player === "X" ? "O" : "X";

                if (gameToUpdate.isLobby) {
                  // Simplified end message for lobby games
                  const gameData = {
                    type: "end",
                    winner: winner, // Only include the winner
                  };

                  // Notify players of the end of the game
                  gameToUpdate.players.forEach((playerWs) => {
                    playerWs.send(JSON.stringify(gameData));
                  });

                  delete games[gameId]; // Remove the game from the active games list
                  delete gameClocks[gameId]; // Remove the game clock
                } else {
                  // Existing logic for ranked games (Elo, UUIDs, etc.)
                  const loser = player;

                  // Find the winner and loser in the players array
                  const winnerWs = gameToUpdate.players[player === "X" ? 0 : 1];
                  const loserWs = gameToUpdate.players[player === "X" ? 1 : 0];

                  // Log player stats before calculation
                  console.log(
                    "Winner stats before update:",
                    (winnerWs as any).user
                  );
                  console.log(
                    "Loser stats before update:",
                    (loserWs as any).user
                  );

                  // Store old Elo ratings for calculating Elo change
                  const oldEloWinner = (winnerWs as any).user.elo;
                  const oldEloLoser = (loserWs as any).user.elo;

                  // Calculate new Elo ratings
                  const { newRA, newRB } = calculateElo(
                    {
                      elo: oldEloWinner,
                      wins: (winnerWs as any).user.wins,
                      draws: (winnerWs as any).user.draws,
                      losses: (winnerWs as any).user.losses,
                    },
                    {
                      elo: oldEloLoser,
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

                  // Prepare game history data
                  const gameData = {
                    type: "end",
                    winner,
                    loser,
                    playerX: (gameToUpdate.players[0] as any).user.uuid,
                    playerO: (gameToUpdate.players[1] as any).user.uuid,
                    eloChangeX: newRA - oldEloWinner, // Correct Elo change calculation
                    eloChangeO: newRB - oldEloLoser, // Correct Elo change calculation
                    board: gameToUpdate.board,
                    bitmap: BitmapGenerator.generateBitmap(gameToUpdate.board),
                    endedAt: new Date().toISOString(),
                  };

                    const winnerUUID = gameData.winner === "X" ? gameData.playerX : gameData.playerO;
                    const loserUUID = gameData.loser === "X" ? gameData.playerX : gameData.playerO;

                    const winnerExists = await User.findOne({ where: { uuid: winnerUUID } });
                    const loserExists = await User.findOne({ where: { uuid: loserUUID } });

                    if (!winnerExists || !loserExists) {
                      console.error("One or more UUIDs do not exist in the Users table:", {
                        playerX: gameData.playerX,
                        playerO: gameData.playerO,
                        winner: winnerUUID,
                        loser: loserUUID,
                      });
                      throw new Error("Invalid UUIDs: One or more players do not exist in the Users table.");
                    }

                    // Save correct data
                    await MatchmakingGame.create({
                      playerX: gameData.playerX,
                      playerO: gameData.playerO,
                      winner: winnerUUID,
                      loser: loserUUID,
                      eloChangeX: gameData.eloChangeX,
                      eloChangeO: gameData.eloChangeO,
                      board: gameData.board,
                      bitmap: gameData.bitmap,
                      endedAt: new Date(gameData.endedAt),
                    });


                  // Notify players of the end of the game
                  gameToUpdate.players.forEach((playerWs) => {
                    playerWs.send(JSON.stringify(gameData));
                  });

                  

                  delete games[gameId]; // Remove the game from the active games list
                  delete gameClocks[gameId]; // Remove the game clock
                }
              }
            );
          }
          gameClocks[gameId].stopClock();

          // Update the board and switch turns
          newBoard[move.row][move.col] = playerSymbol;
          gameToUpdate.board = newBoard;
          gameToUpdate.currentPlayer =
            gameToUpdate.currentPlayer === "X" ? "O" : "X";
          gameToUpdate.lastActivity = Date.now();

          // Get remaining time for the player who just moved
          const remainingTime = gameClocks[gameId].getTime(playerSymbol);

          // Start the clock for the next player
          gameClocks[gameId].startTurn(gameToUpdate.currentPlayer as "X" | "O");

          // Send updated move response with time left
          ws.send(
            JSON.stringify({
              type: "move",
              gameId,
              move,
              timeLeft: remainingTime,
            })
          );

          // Check if the current player has won
          if (hasWon(newBoard, playerSymbol)) {
            const winner = playerSymbol;
          
            if (gameToUpdate.isLobby) {
              // **Lobbies only return the winner symbol**
              const gameData = { type: "end", winner };
              gameToUpdate.players.forEach((playerWs) => {
                playerWs.send(JSON.stringify(gameData));
              });
              
            } else {
              // Existing logic for ranked games (Elo, UUIDs, etc.)
              const loser = playerSymbol === "X" ? "O" : "X";

              // Find the winner and loser in the players array
              const winnerWs = gameToUpdate.players[playerIndex];
              const loserWs = gameToUpdate.players[1 - playerIndex];

              // Log player stats before calculation
              console.log("Winner stats before update:", (winnerWs as any).user);
              console.log("Loser stats before update:", (loserWs as any).user);

              // Store old Elo ratings for calculating Elo change
              const oldEloWinner = (winnerWs as any).user.elo;
              const oldEloLoser = (loserWs as any).user.elo;

              // Calculate new Elo ratings
              const { newRA, newRB } = calculateElo(
                {
                  elo: oldEloWinner,
                  wins: (winnerWs as any).user.wins,
                  draws: (winnerWs as any).user.draws,
                  losses: (winnerWs as any).user.losses,
                },
                {
                  elo: oldEloLoser,
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

              // Prepare game history data
              const gameData = {
                type: "end",
                winner,
                loser,
                playerX: (gameToUpdate.players[0] as any).user.uuid,
                playerO: (gameToUpdate.players[1] as any).user.uuid,
                eloChangeX: newRA - oldEloWinner, // Correct Elo change calculation
                eloChangeO: newRB - oldEloLoser, // Correct Elo change calculation
                board: newBoard,
                bitmap: BitmapGenerator.generateBitmap(newBoard),
                endedAt: new Date().toISOString(),
              };

              const winnerUUID = gameData.winner === "X" ? gameData.playerX : gameData.playerO;
              const loserUUID = gameData.loser === "X" ? gameData.playerX : gameData.playerO;

              const winnerExists = await User.findOne({ where: { uuid: winnerUUID } });
              const loserExists = await User.findOne({ where: { uuid: loserUUID } });

              if (!winnerExists || !loserExists) {
                console.error("One or more UUIDs do not exist in the Users table:", {
                  playerX: gameData.playerX,
                  playerO: gameData.playerO,
                  winner: winnerUUID,
                  loser: loserUUID,
                });
                throw new Error("Invalid UUIDs: One or more players do not exist in the Users table.");
              }

              // Save correct data
              await MatchmakingGame.create({
                playerX: gameData.playerX,
                playerO: gameData.playerO,
                winner: winnerUUID,
                loser: loserUUID,
                eloChangeX: gameData.eloChangeX,
                eloChangeO: gameData.eloChangeO,
                board: gameData.board,
                bitmap: gameData.bitmap,
                endedAt: new Date(gameData.endedAt),
              });

              // Notify players of the end of the game
              gameToUpdate.players.forEach((playerWs) => {
                playerWs.send(JSON.stringify(gameData));
              });

              delete games[gameId]; // Remove the game from the active games list
              delete gameClocks[gameId]; // Remove the game clock
              return;
            }
          }

          // Check if the game is a draw
          if (isDraw(newBoard)) {
            if (gameToUpdate.isLobby) {
              // **Lobbies only return "draw"**
              const gameData = { type: "end", winner: null };
              gameToUpdate.players.forEach((playerWs) => {
                playerWs.send(JSON.stringify(gameData));
              });
            } else {
              // Existing logic for ranked games (Elo, UUIDs, etc.)
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

              // Store old Elo ratings for calculating Elo change
              const oldEloPlayerX = (gameToUpdate.players[0] as any).user.elo;
              const oldEloPlayerO = (gameToUpdate.players[1] as any).user.elo;

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

              // Prepare game history data
              const gameData = {
                type: "end",
                winner: null, // No winner in a draw
                loser: null,
                playerX: (gameToUpdate.players[0] as any).user.uuid,
                playerO: (gameToUpdate.players[1] as any).user.uuid,
                eloChangeX: newRA - oldEloPlayerX, // Correct Elo change calculation
                eloChangeO: newRB - oldEloPlayerO, // Correct Elo change calculation
                board: newBoard,
                bitmap: BitmapGenerator.generateBitmap(newBoard),
                endedAt: new Date().toISOString(),
              };

              const winnerUUID = gameData.winner === "X" ? gameData.playerX : gameData.playerO;
              const loserUUID = gameData.loser === "X" ? gameData.playerX : gameData.playerO;
              
              const winnerExists = await User.findOne({ where: { uuid: winnerUUID } });
              const loserExists = await User.findOne({ where: { uuid: loserUUID } });
              
              if (!winnerExists || !loserExists) {
                console.error("One or more UUIDs do not exist in the Users table:", {
                  playerX: gameData.playerX,
                  playerO: gameData.playerO,
                  winner: winnerUUID,
                  loser: loserUUID,
                });
                throw new Error("Invalid UUIDs: One or more players do not exist in the Users table.");
              }
              
              // Save correct data
              await MatchmakingGame.create({
                playerX: gameData.playerX,
                playerO: gameData.playerO,
                winner: winnerUUID,
                loser: loserUUID,
                eloChangeX: gameData.eloChangeX,
                eloChangeO: gameData.eloChangeO,
                board: gameData.board,
                bitmap: gameData.bitmap,
                endedAt: new Date(gameData.endedAt),
              });
              
               

              // Notify players of the draw
              gameToUpdate.players.forEach((playerWs) => {
                playerWs.send(JSON.stringify(gameData));
              });

              delete games[gameId]; // Remove the game from the active games list
              delete gameClocks[gameId]; // Remove the game clock
              return;
            }
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
      delete gameClocks[gameId]; // Remove the game clock
    }
  });
}

// Clean up abandoned games
function cleanupAbandonedGames(): void {
  const now = Date.now();
  Object.keys(games).forEach((gameId) => {
    const game = games[gameId];
    if (game.lastActivity && now - game.lastActivity > 300000) { // 5 minutes = 300,000 ms
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