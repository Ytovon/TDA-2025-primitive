import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './database.js';

// Define the attributes for the Game model
interface GameAttributes {
  uuid: string;
  name: string;
  difficulty: string;
  board: string[][];
  gameState: string;
  bitmap?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes for the Game model
interface GameCreationAttributes extends Optional<GameAttributes, 'uuid' | 'bitmap' | 'createdAt' | 'updatedAt'> {}

// Define the Game model
class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public uuid!: string;
  public name!: string;
  public difficulty!: string;
  public board!: string[][];
  public gameState!: string;
  public bitmap?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
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
  },
  {
    sequelize,
    tableName: 'Games',
    timestamps: true, // createdAt and updatedAt are automatically handled
  }
);

// Define the attributes for the User model
interface UserAttributes {
  uuid: string;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isAdmin?: boolean;
  isBanned?: boolean; // Add isBanned property
  note?: string; // Add note property
  AvatarColor?: number; // Add AvatarColor property
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'uuid' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  get uuid(): string {
    return this.getDataValue('uuid');
  }
  get username(): string {
    return this.getDataValue('username');
  }
  get email(): string {
    return this.getDataValue('email');
  }
  get password(): string | undefined {
    return this.getDataValue('password');
  }
  get googleId(): string | undefined {
    return this.getDataValue('googleId');
  }
  get elo(): number {
    return this.getDataValue('elo');
  }
  get wins(): number {
    return this.getDataValue('wins');
  }
  get draws(): number {
    return this.getDataValue('draws');
  }
  get losses(): number {
    return this.getDataValue('losses');
  }
  get refreshToken(): string | undefined {
    return this.getDataValue('refreshToken');
  }
  get createdAt(): Date | undefined {
    return this.getDataValue('createdAt');
  }
  get updatedAt(): Date | undefined {
    return this.getDataValue('updatedAt');
  }
  get isAdmin(): boolean | undefined {
    return this.getDataValue('isAdmin');
  }
  get isBanned(): boolean | undefined {
    return this.getDataValue('isBanned');
  }
  get note(): string | undefined {
    return this.getDataValue('note');
  }
  get AvatarColor(): number | undefined {
    return this.getDataValue('AvatarColor');
  }
}

User.init(
  {
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
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    AvatarColor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: { attributes: { include: ["password"] } },
    },
  }
);

// Define Matchmaking Game attributes
interface MatchmakingGameAttributes {
  playerX: string;
  playerO: string;
  winner?: string | null;
  loser?: string | null;
  eloChangeX: number;
  eloChangeO: number;
  board: string[][];
  bitmap?: string | null;  // Allow null in addition to undefined
  endedAt: Date;
}

// Define creation attributes
interface MatchmakingGameCreationAttributes extends Optional<MatchmakingGameAttributes, 'winner' | 'loser' | 'bitmap'> {}

// Define the MatchmakingGame model
class MatchmakingGame extends Model<MatchmakingGameAttributes, MatchmakingGameCreationAttributes> 
  implements MatchmakingGameAttributes {
  public playerX!: string;
  public playerO!: string;
  public winner!: string | null;
  public loser!: string | null;
  public eloChangeX!: number;
  public eloChangeO!: number;
  public board!: string[][];
  public bitmap!: string | null;
  public endedAt!: Date;
}

MatchmakingGame.init(
  {
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
  },
  {
    sequelize,
    tableName: "MatchmakingGames",
    timestamps: false, // We only store endedAt
  }
);

// Define relationships
User.hasMany(MatchmakingGame, { foreignKey: "playerX", as: "gamesAsX" });
User.hasMany(MatchmakingGame, { foreignKey: "playerO", as: "gamesAsO" });
User.hasMany(MatchmakingGame, { foreignKey: "winner", as: "gamesWon" });
User.hasMany(MatchmakingGame, { foreignKey: "loser", as: "gamesLost" });

MatchmakingGame.belongsTo(User, { foreignKey: "playerX", as: "playerXData" });
MatchmakingGame.belongsTo(User, { foreignKey: "playerO", as: "playerOData" });
MatchmakingGame.belongsTo(User, { foreignKey: "winner", as: "winnerData" });
MatchmakingGame.belongsTo(User, { foreignKey: "loser", as: "loserData" });

export { Game, User, MatchmakingGame, UserCreationAttributes };