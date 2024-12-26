import { Game } from "./models.js";
import { getGameState } from "./gameLogic.js"; // Import game state algorithm

// 1. Get all games
const getAllGames = async (req: any, res: any) => {
  try {
    const games = await Game.findAll();
    res.json(games); // No need to parse the board; it's already JSON
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch games", error });
  }
};

// 2. Get a game by UUID
const getGameById = async (req: any, res: any) => {
  const { uuid } = req.params;
  try {
    const game = await Game.findByPk(uuid);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game); // No need to parse the board; it's already JSON
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch game", error });
  }
};

// 3. Create a new game
const createGame = async (req: any, res: any) => {
  const { name, difficulty, board, gameState } = req.body;
  try {
    if (!name || !difficulty || !board) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: name, difficulty, or board.",
      });
    }

    const result = getGameState(board);

    if (result.statusCode === 422) {
      return res.status(422).json({
        status: "error",
        message: result.error,
        debugInfo: result.debugInfo,
      });
    }

    const newGame = await Game.create({
      name,
      difficulty,
      board: board || Array(15).fill(Array(15).fill("")),
      gameState: gameState || "ongoing",
    });

    res.status(201).json({
      status: "success",
      message: "Game created successfully.",
      game: newGame,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// 4. Update a game by UUID
const updateGame = async (req: any, res: any) => {
  const { uuid } = req.params;
  const { name, difficulty, board, gameState } = req.body;

  try {
    const game = await Game.findByPk(uuid);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Ensure the board exists before updating it
    let boardTmp = board ? board : game.get("board");

    const result = board && getGameState(board);

    if (result.statusCode === 422) {
      return res.status(422).json({
        status: "error",
        message: result.error,
        debugInfo: result.debugInfo,
      });
    }

    // Update the game attributes
    await game.update({
      name: name || game.get("name"),
      difficulty: difficulty || game.get("difficulty"),
      board: boardTmp,
      gameState: gameState || game.get("gameState"),
      updatedAt: new Date(),
    });

    // Create a response object and parse the board field back into an object if necessary
    res.json({
      status: "success",
      message: "Game updated successfully.",
      game,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update game", error });
  }
};

// 5. Delete a game by UUID
const deleteGame = async (req: any, res: any) => {
  const { uuid } = req.params;
  try {
    const game = await Game.findByPk(uuid);
    if (!game) return res.status(404).json({ message: "Game not found" });

    await game.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete game", error });
  }
};

export { getAllGames, getGameById, createGame, updateGame, deleteGame };
