import { DataTypes } from "sequelize";
import { sequelize } from "./database.js"; // Adjust path as needed
// Define the Game model using an interface
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
        type: DataTypes.TEXT,
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
}, {
    timestamps: true, // Enable `createdAt`, `updatedAt`
});
export { Game };
//# sourceMappingURL=models.js.map