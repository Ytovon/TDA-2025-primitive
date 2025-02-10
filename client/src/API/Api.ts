export class ApiClient {
  static async createGame(game: any, grid: any): Promise<string | void> {
    try {
      const newGame = {
        name: game.name,
        difficulty: game.difficulty,
        gameState: game.gameState,
        board: grid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/v1/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.game.uuid;
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }

  static async fetchSpecificGame(
    uuid: string,
    setGame: (game: any) => void,
    setInitialBoard: (board: any) => void,
    setGrid: (grid: any) => void
  ) {
    try {
      // pokud je uuid prázdné, spustí se normální hra
      if (uuid === "") {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setGame({
        createdAt: data.createdAt,
        difficulty: data.difficulty,
        gameState: data.gameState,
        name: data.name,
        updatedAt: data.updatedAt,
        uuid: uuid,
      });

      setInitialBoard(data.board);
      setGrid(data.board);

      console.log(data.board);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  static async sendGameData(uuid: string, grid: any, game: any): Promise<any> {
    try {
      const editGameData = {
        board: grid,
        difficulty: game.difficulty,
        name: game.name,
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editGameData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error in sendGameData:", error);
    }
  }

  static async updateGame(
    uuid: string,
    setGame: (game: any) => void,
    setGrid: (grid: any) => void,
    setHasSymbol?: (value: boolean) => void
  ) {
    try {
      if (uuid === "") return;

      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setGame({
        createdAt: data.createdAt,
        difficulty: data.difficulty,
        gameState: data.gameState,
        name: data.name,
        updatedAt: data.updatedAt,
        uuid: uuid,
        bitmap: data.bitmap,
      });

      if (setHasSymbol) {
        setHasSymbol(true);
      }

      setGrid(data.board);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  static async deleteGame(uuid: string): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }

  // Add PUT, DELETE, etc. as needed
}
