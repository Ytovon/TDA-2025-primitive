import express from "express";
import { getAllGames, getGameById, createGame, updateGame, deleteGame, } from "./controllers.js";
const router = express.Router();
// CRUD endpoints
router.get("/", (req, res) => getAllGames(req, res)); // Get all games
router.get("/:uuid", (req, res) => getGameById(req, res)); // Get a single game by UUID
router.post("/", (req, res) => createGame(req, res)); // Create a new game
router.put("/:uuid", (req, res) => updateGame(req, res)); // Update a game
router.delete("/:uuid", (req, res) => deleteGame(req, res)); // Delete a game
export { router };
//# sourceMappingURL=routes.js.map