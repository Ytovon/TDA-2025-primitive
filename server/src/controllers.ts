const Game = require("./models");

// 1. Get all games
const getAllGames = async (req:any, res:any) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch games", error });
    }
};

// 2. Get a game by UUID
const getGameById = async (req:any, res:any) => {
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
const createGame = async (req:any, res:any) => {
    const { name, difficulty, board, gameState } = req.body;
    try {
        const newGame = await Game.create({
            name,
            difficulty,
            board: JSON.stringify(board || Array(15).fill(Array(15).fill(null))),
            gameState: gameState || "ongoing",
        });
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: "Failed to create game", error });
    }
};

// 4. Update a game by UUID
const updateGame = async (req:any, res:any) => {
    const { uuid } = req.params;
    const { name, difficulty, board, gameState } = req.body;
    try {
        const game = await Game.findByPk(uuid);
        if (!game) return res.status(404).json({ message: "Game not found" });

        await game.update({
            name: name || game.name,
            difficulty: difficulty || game.difficulty,
            board: board ? JSON.stringify(board) : game.board,
            gameState: gameState || game.gameState,
            updatedAt: new Date(),
        });

        res.json(game);
    } catch (error) {
        res.status(500).json({ message: "Failed to update game", error });
    }
};

// 5. Delete a game by UUID
const deleteGame = async (req:any, res:any) => {
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

module.exports = { getAllGames, getGameById, createGame, updateGame, deleteGame };

export { getAllGames, getGameById, createGame, updateGame, deleteGame };
