import { DataTypes, Model } from "sequelize";
import { sequelize } from "./database.ts"; // Import Sequelize instance

class Game extends Model {}

Game.init(
  {
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
      type: DataTypes.TEXT, // Store board as JSON string
      allowNull: false,
    },
    gameState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Game",
  }
);

export { Game }; // Export the Game model
