const express = require("express");
const {getAllGames, getGameById, createGame, updateGame, deleteGame} = require("./controllers");
const { get } = require("http");

const router = express.Router();

//CRUD endpoints
router.get("/", getAllGames);// Get all games
router.get("/:uuid", getGameById);// Get a single game by UUID
router.post("/", createGame);// Create a new game
router.put("/:uuid", updateGame);// Update a game
router.delete("/:uuid", deleteGame); // Delete a game

module.exports = router;