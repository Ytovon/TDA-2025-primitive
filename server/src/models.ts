import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./database.js"; // Adjust path as needed

// Define the interface for the Game attributes
interface GameAttributes {
  uuid: string;
  name: string;
  difficulty: string;
  board: string[][]; // Store the board as a JSON array
  gameState: string;
  bitmap?: string; // Optional because it can be null
  createdAt?: Date; // Optional because it will be auto-managed by Sequelize
  updatedAt?: Date; // Optional because it will be auto-managed by Sequelize
}

// Define a type for optional attributes (e.g., when creating a game)
interface GameCreationAttributes extends Optional<GameAttributes, "uuid"> {}

// Define the Game model using an interface
class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public uuid!: string;
  public name!: string;
  public difficulty!: string;
  public board!: string[][]; // Store the board as a JSON array
  public gameState!: string;
  public bitmap?: string; // Optional because it can be null

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
      type: DataTypes.JSON, // Store the board as a JSON array
      allowNull: false,
      defaultValue: () => Array(15).fill(Array(15).fill(null)), // Default to a 15x15 empty board
    },
    gameState: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ongoing",
    },
    bitmap: {
      type: DataTypes.TEXT, // Store the bitmap as a string
      allowNull: true, // Initially nullable
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Games",
    timestamps: true, // Enable `createdAt`, `updatedAt`
  }
);

export { Game, GameAttributes, GameCreationAttributes };