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
    get isAdmin() {
        return this.getDataValue('isAdmin');
    }
    get isBanned() {
        return this.getDataValue('isBanned');
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
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Only one user should be manually set to true
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
// Define the MatchmakingGame model
class MatchmakingGame extends Model {
    playerX;
    playerO;
    winner;
    loser;
    eloChangeX;
    eloChangeO;
    board;
    bitmap;
    endedAt;
}
MatchmakingGame.init({
    playerX: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "Users", key: "uuid" },
    },
    playerO: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "Users", key: "uuid" },
    },
    endedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
    },
    winner: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Users", key: "uuid" },
    },
    loser: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Users", key: "uuid" },
    },
    eloChangeX: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    eloChangeO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    board: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    bitmap: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable if not generated
    },
}, {
    sequelize,
    tableName: "MatchmakingGames",
    timestamps: false, // We only store `endedAt`
});
// Define relationships
User.hasMany(MatchmakingGame, { foreignKey: "playerX", as: "gamesAsX" });
User.hasMany(MatchmakingGame, { foreignKey: "playerO", as: "gamesAsO" });
User.hasMany(MatchmakingGame, { foreignKey: "winner", as: "gamesWon" });
User.hasMany(MatchmakingGame, { foreignKey: "loser", as: "gamesLost" });
MatchmakingGame.belongsTo(User, { foreignKey: "playerX", as: "playerXData" });
MatchmakingGame.belongsTo(User, { foreignKey: "playerO", as: "playerOData" });
MatchmakingGame.belongsTo(User, { foreignKey: "winner", as: "winnerData" });
MatchmakingGame.belongsTo(User, { foreignKey: "loser", as: "loserData" });
export { Game, User, MatchmakingGame };
//# sourceMappingURL=models.js.map