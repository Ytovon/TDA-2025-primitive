import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./database.js"; // Adjust path as needed

// Define the interface for the Game attributes
interface GameAttributes {
  uuid: string;
  name: string;
  difficulty: string;
  board: string[][]; // Update type to reflect JSON structure
  gameState: string;
  updatedAt?: Date; // Optional because it will be auto-managed by Sequelize
  createdAt?: Date; // Optional because it will be auto-managed by Sequelize (for soft deletes)
}

// Define a type for optional attributes (e.g., when creating a game)
interface GameCreationAttributes extends Optional<GameAttributes, "uuid"> {}

// Define the Game model using an interface
const Game = sequelize.define<Model<GameAttributes, GameCreationAttributes>>(
  "Game",
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
      type: DataTypes.JSON, // Use JSON instead of TEXT
      allowNull: false,
    },
    gameState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set on update
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Enable `createdAt`, `updatedAt`
  }
);

export { Game, GameAttributes, GameCreationAttributes };
