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

  constructor(
    username: string,
    email: string,
    password: string,
    elo: number = 400,
    wins: number = 0,
    draws: number = 0,
    losses: number = 0,
    refreshToken?: string,
    createdAt?: Date,
    updatedAt?: Date
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
  }
}
