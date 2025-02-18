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
    timestamps: true, // `createdAt` and `updatedAt` are automatically handled
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
  resetPasswordToken?: string;  // <-- Add this
  resetPasswordExpires?: Date;  // <-- Add this
  createdAt?: Date;
  updatedAt?: Date;
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
    resetPasswordToken: {  // <-- Add this field
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {  // <-- Add this field
      type: DataTypes.DATE,
      allowNull: true,
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
export { Game, User, UserCreationAttributes };