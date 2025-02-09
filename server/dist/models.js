import { DataTypes, Model } from 'sequelize';
import { sequelize } from './database';
// Define the Game model
class Game extends Model {
    uuid;
    name;
    difficulty;
    board;
    gameState;
    bitmap;
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
        type: DataTypes.JSON, // Store the board as a JSON array
        allowNull: false,
        defaultValue: () => Array(15).fill(null).map(() => Array(15).fill(null)), // Ensures unique rows
    },
    gameState: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ongoing',
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
    tableName: 'Games',
    timestamps: true, // `createdAt` and `updatedAt` are automatically handled
});
// Define the User model
class User extends Model {
    uuid;
    username;
    email;
    password;
    elo;
    wins;
    draws;
    losses;
    refreshToken;
    createdAt;
    updatedAt;
}
User.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Ensure valid email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    elo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 400,
    },
    wins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    draws: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    losses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'Users',
    timestamps: true, // `createdAt` and `updatedAt` are automatically handled
});
export { Game, User };
//# sourceMappingURL=models.js.map