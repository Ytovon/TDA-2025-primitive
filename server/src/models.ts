import { DataTypes, Sequelize } from "sequelize"; // Import DataTypes and Sequelize
import { sequelize } from "./database"; // Your Sequelize instance

let a = DataTypes.String;

const Game = sequelize.define("Game", {
  uuid: {
    type: DataTypes.UUID, // Directly use DataTypes.UUID
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
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gameState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { Game };
