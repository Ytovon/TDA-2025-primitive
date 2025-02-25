export interface UserModel {
  uuid?: string;
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
  isAdmin: boolean;
  isBanned?: boolean;
}

export class User implements UserModel {
  uuid?: string;
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
  isAdmin: boolean;
  isBanned?: boolean;

  constructor(
    username: string,
    email: string,
    password: string,
    elo: number = 400,
    wins: number = 0,
    draws: number = 0,
    losses: number = 0,
    isAdmin: boolean = false,
    refreshToken?: string,
    createdAt?: Date,
    updatedAt?: Date,
    isBanned?: boolean
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.elo = elo;
    this.wins = wins;
    this.draws = draws;
    this.losses = losses;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isAdmin = isAdmin;
    this.isBanned = isBanned;
  }
}
