import { Game } from "./models.js";
import { getGameState } from "./gameLogic.js";
import BitmapGenerator from "./bitmapGenerator.js"; // Import the bitmap generator utility
// 1. Get all games
const getAllGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch games", error });
    }
};
// 2. Get a game by UUID
const getGameById = async (req, res) => {
    const { uuid } = req.params;
    try {
        const game = await Game.findByPk(uuid);
        if (!game) {
            res.status(404).json({ message: "Game not found" });
            return;
        }
        res.json(game);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch game", error });
    }
};
// 3. Create a new game
const createGame = async (req, res) => {
    const { name, difficulty, board } = req.body;
    try {
        if (!name || !difficulty || !board) {
            res.status(400).json({
                status: "error",
                message: "Missing required fields: name, difficulty, or board.",
            });
            return;
        }
        const processedBoard = Array.isArray(board) ? board : JSON.parse(board);
        const result = getGameState(processedBoard);
        if (result.statusCode === 422) {
            res.status(422).json({
                status: "error",
                message: result.error,
                debugInfo: result.debugInfo,
            });
            return;
        }
        // Ensure gameState is a string
        const gameState = result.gameState ?? "ongoing";
        // Generate the bitmap for the board
        const bitmap = BitmapGenerator.generateBitmap(processedBoard);
        // Create a new game object
        const newGame = await Game.create({
            name,
            difficulty,
            board: board || Array(15).fill(Array(15).fill("")),
            gameState: result.gameState || gameState,
            bitmap, // Save the Base64-encoded bitmap
        });
        res.status(201).json({
            newGame,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create game", error });
    }
};
// 4. Update a game by UUID
const updateGame = async (req, res) => {
    const { uuid } = req.params;
    const { name, difficulty, board } = req.body;
    try {
        const game = await Game.findByPk(uuid);
        if (!game) {
            res.status(404).json({ message: "Game not found" });
            return;
        }
        const processedBoard = board ? board : game.board;
        const result = board
            ? getGameState(processedBoard)
            : { gameState: game.gameState };
        if (result.statusCode === 422) {
            res.status(422).json({
                status: "error",
                message: result.error,
                debugInfo: result.debugInfo,
            });
            return;
        }
        // Ensure gameState is a string
        const gameState = result.gameState ?? "unknown";
        // Generate the bitmap for the updated board
        const bitmap = board
            ? BitmapGenerator.generateBitmap(processedBoard)
            : game.bitmap;
        // Update the game object
        await game.update({
            name: name ?? game.name,
            difficulty: difficulty ?? game.difficulty,
            board: processedBoard,
            gameState, // Use recalculated or existing game state
            bitmap, // Save the updated Base64-encoded bitmap
            updatedAt: new Date(),
        });
        res.json({
            game,
        });
        res.status(201).json(game);
        // // Create a response object and parse the board field back into an object if necessary
        // res.json({
        //   status: "success",
        //   message: "Game updated successfully.",
        //   game: game,
        // });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update game", error });
    }
};
// 5. Delete a game by UUID
const deleteGame = async (req, res) => {
    const { uuid } = req.params;
    try {
        const game = await Game.findByPk(uuid);
        if (!game) {
            res.status(404).json({ message: "Game not found" });
            return;
        }
        await game.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete game", error });
    }
};
export { getAllGames, getGameById, createGame, updateGame, deleteGame };
//# sourceMappingURL=controllers.js.map