const { DataTypes } = require("sequelize");
const sequelize = require("./database");

// Define the Game model
const Game = sequelize.define("Game", {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  board: {
    type: DataTypes.TEXT, // Store the board as a JSON string
    allowNull: false,
    defaultValue: JSON.stringify(Array(15).fill(Array(15).fill(null))),
  },
  gameState: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "ongoing",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Game;
