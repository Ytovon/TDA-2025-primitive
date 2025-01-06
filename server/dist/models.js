import { DataTypes, Model } from "sequelize";
import { sequelize } from "./database.js"; // Adjust path as needed
// Define the Game model using an interface
class Game extends Model {
    uuid;
    name;
    difficulty;
    board; // Store the board as a JSON string
    gameState;
    bitmap; // Optional because it can be null
    // timestamps
    createdAt;
    updatedAt;
}
Game.init({
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
        type: DataTypes.JSON, // Store the board as a JSON string
        allowNull: false,
        defaultValue: JSON.stringify(Array(15).fill(Array(15).fill(null))),
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
}, {
    sequelize,
    tableName: "Games",
    timestamps: true, // Enable `createdAt`, `updatedAt`
});
export { Game };
//# sourceMappingURL=models.js.map