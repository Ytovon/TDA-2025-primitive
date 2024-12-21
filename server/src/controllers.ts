import { Game, GameAttributes } from "./models.js";
import { Model } from "sequelize"; // Import Model from Sequelize

// 1. Get all games
const getAllGames = async (req: any, res: any) => {
  try {
    const games = await Game.findAll();

    // Parse the 'board' attribute for each game before returning it
    const parsedGames = games.map((game: any) => {
      if (game.board) {
        game.board = JSON.parse(game.board); // Parse the board string into a JavaScript object
      }
      return game;
    });

    res.json(parsedGames);
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

    // Parse the 'board' attribute before returning it
    const board = game.get("board"); // Use .get() to access attributes
    if (typeof board === "string") {
      game.set("board", JSON.parse(board)); // Parse the board string into a JavaScript object
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch game", error });
  }
};

// 3. Create a new game
const createGame = async (req: any, res: any) => {
  const { name, difficulty, board, gameState } = req.body;
  try {
    const newGame = await Game.create({
      name,
      difficulty,
      board: JSON.stringify(board || Array(15).fill(Array(15).fill(""))),
      gameState: gameState || "ongoing",
    });

    // Parse the board back to a JSON object
    const parsedBoard = JSON.parse(newGame.get("board") as string);

    // Add the parsed board to the response or modify the object if needed
    const responseGame = {
      ...newGame.toJSON(), // Convert Sequelize object to plain JSON
      board: parsedBoard,
    };

    res.status(201).json(responseGame);
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
    // Find the game by primary key (UUID)
    const game = await Game.findByPk(uuid);

    if (!game) return res.status(404).json({ message: "Game not found" });

    // Ensure the board is parsed correctly before updating
    const parsedBoard = board ? JSON.stringify(board) : game.get("board"); // Ensure board is stored as a string in the DB

    // Update the game attributes
    await game.update({
      name: name || game.get("name"),
      difficulty: difficulty || game.get("difficulty"),
      board: parsedBoard as string,
      gameState: gameState || game.get("gameState"),
      updatedAt: new Date(),
    });

    // Create a response object and parse the board field back into an object if necessary
    const responseGame = {
      ...game.toJSON(), // Convert Sequelize model to plain JSON object
      board: JSON.parse(game.get("board") as string), // Parse the board string back into an object
    };

    // Send the updated game back in the response
    res.json(responseGame);
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
