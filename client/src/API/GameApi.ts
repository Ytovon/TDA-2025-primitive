import { gameApiInstance } from "../API/AxiosIntance"; // Use shared Axios instance
import { Game } from "../Model/GameModel";

export class ApiClient {
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

      const response = await gameApiInstance.post("", newGame);
      console.log(response.data);
    } catch (error: any) {
      console.error("Error creating new game:", error.response?.data || error);
    }
  }

  static async fetchAllGames(): Promise<Game[] | undefined> {
    try {
      const response = await gameApiInstance.get("");
      return response.data as Game[];
    } catch (error: any) {
      console.error("Error fetching data:", error.response?.data || error);
      return undefined;
    }
  }

  static async fetchSpecificGame(uuid: string): Promise<Game | undefined> {
    try {
      if (!uuid) return;
      const response = await gameApiInstance.get(uuid);
      console.log(response.data.board);
      return response.data as Game;
    } catch (error: any) {
      console.error("Error fetching data:", error.response?.data || error);
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

      const response = await gameApiInstance.put(uuid, editGameData);
      return response.data;
    } catch (error: any) {
      console.error("Error in updateGame:", error.response?.data || error);
    }
  }

  static async deleteGame(uuid: string): Promise<void> {
    try {
      await gameApiInstance.delete(uuid);
      console.log("Game deleted successfully");
    } catch (error: any) {
      console.error("Error deleting game:", error.response?.data || error);
    }
  }
}
