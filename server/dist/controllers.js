const Game = require("./models");
const { getGameState } = require("../src/gameLogic"); // Import game state algorithm

// 1. Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch games", error });
  }
};

// 2. Get a game by UUID
const getGameById = async (req, res) => {
  const { uuid } = req.params;
  try {
    const game = await Game.findByPk(uuid);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch game", error });
  }
};

// 3. Create a new game
const createGame = async (req, res) => {
  const { name, difficulty, board } = req.body;

  try {
    if (!name || !difficulty || !board) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: name, difficulty, or board.",
      });
    }

    const processedBoard = Array.isArray(board) ? board : JSON.parse(board);
    const result = getGameState(processedBoard);

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
      board: JSON.stringify(processedBoard),
      gameState: result.gameState,
    });

    res.status(201).json({
      status: "success",
      message: "Game created successfully.",
      game: newGame,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create game", error });
  }
};

// 4. Update a game by UUID
const updateGame = async (req, res) => {
  const { uuid } = req.params;
  const { name, difficulty, board } = req.body; // Removed gameState from input; we'll calculate it dynamically
  try {
    const game = await Game.findByPk(uuid);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const processedBoard = board ? JSON.stringify(board) : game.board;
    const result = board
      ? getGameState(JSON.parse(processedBoard))
      : { gameState: game.gameState };

    if (result.statusCode === 422) {
      return res.status(422).json({
        status: "error",
        message: result.error,
        debugInfo: result.debugInfo,
      });
    }

    await game.update({
      name: name || game.name,
      difficulty: difficulty || game.difficulty,
      board: processedBoard,
      gameState: result.gameState, // Use recalculated or existing game state
      updatedAt: new Date(),
    });

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
const deleteGame = async (req, res) => {
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

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
