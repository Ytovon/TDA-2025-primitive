import { DataTypes, Model } from 'sequelize';
import { sequelize } from './database.js';
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
class User extends Model {
    get uuid() {
        return this.getDataValue('uuid');
    }
    get username() {
        return this.getDataValue('username');
    }
    get email() {
        return this.getDataValue('email');
    }
    get password() {
        return this.getDataValue('password');
    }
    get googleId() {
        return this.getDataValue('googleId');
    }
    get elo() {
        return this.getDataValue('elo');
    }
    get wins() {
        return this.getDataValue('wins');
    }
    get draws() {
        return this.getDataValue('draws');
    }
    get losses() {
        return this.getDataValue('losses');
    }
    get refreshToken() {
        return this.getDataValue('refreshToken');
    }
    get createdAt() {
        return this.getDataValue('createdAt');
    }
    get updatedAt() {
        return this.getDataValue('updatedAt');
    }
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
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
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
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: "Users",
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ["password"] },
    },
    scopes: {
        withPassword: { attributes: { include: ["password"] } },
    },
});
export { Game, User };
//# sourceMappingURL=models.js.map