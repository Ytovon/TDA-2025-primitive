// src/api/gameApi.ts
export async function createGame(game: any, grid: any): Promise<string | void> {
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

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.game.uuid;
  } catch (error) {
    console.error("Error creating new game:", error);
  }
}

export async function fetchSpecificGame(uuid: string): Promise<any> {
  try {
    if (!uuid) return;
    const response = await fetch(`http://localhost:5000/api/v1/Games/${uuid}`);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching game:", error);
  }
}

export async function sendGameData(
  uuid: string,
  grid: any,
  game: any
): Promise<any> {
  try {
    const editGameData = {
      board: grid,
      difficulty: game.difficulty,
      name: game.name,
    };

    const response = await fetch(`http://localhost:5000/api/v1/Games/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGameData),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error in sendGameData:", error);
  }
}

export async function updateGame(
  uuid: string,
  editGameData: any
): Promise<any> {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/Games/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGameData),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating game:", error);
  }
}

export async function deleteGame(uuid: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/Games/${uuid}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    console.log("Game deleted successfully");
  } catch (error) {
    console.error("Error deleting game:", error);
  }
}
