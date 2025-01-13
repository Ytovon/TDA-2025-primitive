import express, { Request, Response } from "express";
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "./controllers.js";

const router = express.Router();

// CRUD endpoints
router.get("/", (req: Request, res: Response) => getAllGames(req, res)); // Get all games
router.get("/:uuid", (req: Request, res: Response) => getGameById(req, res)); // Get a single game by UUID
router.post("/", (req: Request, res: Response) => createGame(req, res)); // Create a new game
router.put("/:uuid", (req: Request, res: Response) => updateGame(req, res)); // Update a game
router.delete("/:uuid", (req: Request, res: Response) => deleteGame(req, res)); // Delete a game

export { router };