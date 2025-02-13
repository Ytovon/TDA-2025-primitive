import { Game } from "../Model/GameModel";

export class ApiClient {
  static url = "http://localhost:5000/api/v1/games/";

  static async createGame(game: Game, grid: string[][]): Promise<void> {
    try {
      const newGame = {
        name: game.name,
        difficulty: game.difficulty,
        gameState: game.gameState,
        board: grid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }

  static async fetchAllGames(): Promise<Game[] | undefined> {
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data as Game[];
    } catch (error) {
      console.error("Error fetching data:", error);
      return undefined;
    }
  }

  static async fetchSpecificGame(uuid: string): Promise<Game | undefined> {
    try {
      // pokud je uuid prázdné, spustí se normální hra
      if (uuid === "") {
        return;
      }

      const response = await fetch(`${this.url}${uuid}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.board);

      return data as Game;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  static async updateGame(
    uuid: string,
    grid: string[][],
    game: Game
  ): Promise<any> {
    try {
      const editGameData = {
        board: grid,
        difficulty: game.difficulty,
        name: game.name,
      };

      const response = await fetch(`${this.url}${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editGameData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error in updateGame:", error);
    }
  }

  static async deleteGame(uuid: string): Promise<void> {
    try {
      const response = await fetch(`${this.url}${uuid}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }

  // Add PUT, DELETE, etc. as needed
}
