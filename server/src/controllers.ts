import { Game, GameAttributes } from "./models.js";
import { Model } from "sequelize"; // Import Model from Sequelize

// 1. Get all games
const getAllGames = async (req: any, res: any) => {
  try {
    const games = await Game.findAll();
    res.json(games);
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
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch game", error });
  }
};

const createGame = async (req: Request, res: Response) => {
  const { name, difficulty, board, gameState } = req.body;

  try {
    // Validate that `board` is an array
    if (!Array.isArray(board)) {
      return res.status(400).json({ message: "`board` must be an array." });
    }

    // Additional validation (e.g., board dimensions)
    if (board.some((row) => !Array.isArray(row) || row.length !== 15)) {
      return res.status(400).json({
        message: "`board` must be a 2D array with 15 elements in each row.",
      });
    }

    // Create the game
    const game = await Game.create({ name, difficulty, board, gameState });
    res.status(201).json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "Failed to create game", error });
  }
};

// 4. Update a game by UUID
const updateGame = async (req: any, res: any) => {
  const { uuid } = req.params;
  const { name, difficulty, board, gameState } = req.body;

  try {
    // Find the game by primary key (UUID)
    const game = await Game.findByPk(uuid);

    if (!game) return res.status(404).json({ message: "Game not found" });

    // Type assertion to ensure TypeScript understands the type of `game`
    const updatedGame = game as Model<GameAttributes> & GameAttributes; // More explicit typing

    // Update the game attributes
    await updatedGame.update({
      name: name || updatedGame.name,
      difficulty: difficulty || updatedGame.difficulty,
      board: board ? board : updatedGame.board,
      gameState: gameState || updatedGame.gameState,
      updatedAt: new Date(),
    });

    // Send the updated game back in the response
    res.json(updatedGame); // Return the updated instance
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
