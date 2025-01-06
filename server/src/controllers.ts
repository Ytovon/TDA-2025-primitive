import { Request, Response } from "express";
import { Game } from "./models";
import { getGameState } from "./gameLogic";
import BitmapGenerator from "./bitmapGenerator"; // Import the bitmap generator utility

// 1. Get all games
const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch games", error });
    }
};

// 2. Get a game by UUID
const getGameById = async (req: Request, res: Response) => {
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
const createGame = async (req: Request, res: Response) => {
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

        // Ensure gameState is a string
        const gameState = result.gameState ?? 'ongoing';

        // Generate the bitmap for the board
        const bitmap = BitmapGenerator.generateBitmap(processedBoard);

        // Create a new game object
        const newGame = await Game.create({
            name,
            difficulty,
            board: JSON.stringify(processedBoard),
            gameState,
            bitmap, // Save the Base64-encoded bitmap
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
const updateGame = async (req: Request, res: Response) => {
    const { uuid } = req.params;
    const { name, difficulty, board } = req.body;

    try {
        const game = await Game.findByPk(uuid);
        if (!game) return res.status(404).json({ message: "Game not found" });

        const processedBoard = board ? JSON.stringify(board) : game.board;
        const result = board ? getGameState(JSON.parse(processedBoard)) : { gameState: game.gameState };

        if (result.statusCode === 422) {
            return res.status(422).json({
                status: "error",
                message: result.error,
                debugInfo: result.debugInfo,
            });
        }

        // Ensure gameState is a string
        const gameState = result.gameState ?? 'ongoing';

        // Generate the bitmap for the updated board
        const bitmap = board ? BitmapGenerator.generateBitmap(JSON.parse(processedBoard)) : game.bitmap;

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
            status: "success",
            message: "Game updated successfully.",
            game,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update game", error });
    }
};

// 5. Delete a game by UUID
const deleteGame = async (req: Request, res: Response) => {
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