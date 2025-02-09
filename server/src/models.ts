import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './database';

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
    timestamps: true, // `createdAt` and `updatedAt` are automatically handled
  }
);

// Define the attributes for the User model
interface UserAttributes {
  uuid: string;
  username: string;
  email: string;
  password: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'uuid' | 'createdAt' | 'updatedAt'> {}

// Define the User model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public uuid!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public elo!: number;
  public wins!: number;
  public draws!: number;
  public losses!: number;
  public refreshToken?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
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
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true, // `createdAt` and `updatedAt` are automatically handled
  }
);

export { Game, User };