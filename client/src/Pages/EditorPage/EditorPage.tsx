import React, { useState, useEffect } from "react";
import styles from "./EditorPage.module.css";
import {
  arrowBlack,
  arrowWhite,
  blueBulb,
  check,
  redCancel,
  chevronDownBlack,
  chevronDownWhite,
  chevronUpBlack,
  chevronUpWhite,
  darkModeButton,
  lightModeButton,
  redBulb,
  trashBin,
  symbolX,
  symbolO,
} from "../../assets/assets";
import { Button } from "../../Components/Button/Button";
import { useDarkMode } from "../../DarkModeContext";
import { Link } from "react-router-dom";

interface EditorPageProps {
  uuid?: string;
}

export const EditorPage: React.FC<EditorPageProps> = ({ uuid = "" }) => {
  type Game = {
    createdAt: string;
    difficulty: string;
    gameState: string;
    name: string;
    updatedAt: string;
    uuid: string;
  };

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [player, setPlayer] = useState<boolean>(true);
  const [hasSymbol, setHasSymbol] = useState<boolean>();
  const [nameInputStyle, setNameInputStyle] = useState({ border: "none" });
  const [isThereWinner, setIsThereWinner] = useState<boolean>(false);
  const [goodNumberOfSymbols, setGoodNumberOfSymbols] =
    useState<boolean>(false);
  const [xCount, setXCount] = useState(0);
  const [oCount, setOCount] = useState(0);
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [game, setGame] = useState<Game>({
    createdAt: "",
    difficulty: "",
    gameState: "",
    name: "",
    updatedAt: "",
    uuid,
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const uuid: string | undefined = url.pathname.split("/").pop(); // Poslední část cesty

    fetchSpecificGame(typeof uuid == "string" ? uuid : "");
  }, []);

  async function fetchSpecificGame(uuid: string) {
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

      setHasSymbol(true);
      setGrid(data.board);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function postData(uuid: string, data: any) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`,
        {
          method: "PUT", // Typ požadavku
          headers: {
            "Content-Type": "application/json", // Formát dat (tady JSON)
          },
          body: JSON.stringify(data), // Data, která odesíláme
        }
      );

      // Čekáme na odpověď a převádíme ji na JSON
      const responseData = await response.json();

      return responseData; // Vrátíme odpověď serveru
    } catch (error) {
      console.error("Error:", error); // Chytíme chyby při odesílání nebo zpracování odpovědi
    }
  }

  async function sendData() {
    try {
      const editGameData = {
        board: grid,
        difficulty: game.difficulty,
        gameState: game.gameState,
        name: game.name,
        uuid: game.uuid,
        createdAt: game.createdAt,
      };
      const responseData = await postData(game.uuid, editGameData);
      console.log(responseData); // Zpracování odpovědi
    } catch (error) {
      console.error("Error in sendData:", error);
    }
  }

  async function deleteGame(uuid: string) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/Games/${uuid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Game deleted successfully");
      clearGame(); // Vyčistí mřížku po smazání hry
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }

  const getDifficultyValue = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "začátečník":
      case "easy":
        return "Začátečník";
      case "jednoduchá":
        return "Jednoduchá";
      case "pokročilá":
      case "medium":
        return "Pokročilá";
      case "těžká":
      case "hard":
        return "Těžká";
      case "nejtěžší":
        return "Nejtěžší";
      default:
        return "";
    }
  };

  // Inicializace hodnoty z API při načtení komponenty
  useEffect(() => {
    setGame({ ...game, difficulty: getDifficultyValue(game.difficulty) });
  }, [game.difficulty]);

  const difficultyCHange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGame({ ...game, difficulty: event.target.value });
  };

  const handleNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGame({ ...game, name: event.target.value });
  };

  const changePlayerOnRed = () => {
    setPlayer(false);
  };

  const changePlayerOnBlue = () => {
    setPlayer(true);
  };

  useEffect(() => {
    let xCount = 0;
    let oCount = 0;

    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell === "X") {
          xCount++;
        } else if (cell === "O") {
          oCount++;
        }

        if (xCount - 1 === oCount || xCount === oCount) {
          setGoodNumberOfSymbols(true);
        } else {
          setGoodNumberOfSymbols(false);
        }
      });
    });

    setXCount(xCount);
    setOCount(oCount);
  }, [grid]);

  const checkWinner = (grid: string[][]) => {
    const directions = [
      { row: 0, col: 1 }, // Vodorovně
      { row: 1, col: 0 }, // Svisle
      { row: 1, col: 1 }, // Diagonálně (zleva dolů doprava)
      { row: 1, col: -1 }, // Diagonálně (zprava dolů doleva)
    ];

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const symbol = grid[row][col];
        if (symbol === "") continue;

        for (const { row: dRow, col: dCol } of directions) {
          let count = 1;

          for (let step = 1; step < 5; step++) {
            const newRow = row + step * dRow;
            const newCol = col + step * dCol;

            if (
              newRow >= 0 &&
              newRow < 15 &&
              newCol >= 0 &&
              newCol < 15 &&
              grid[newRow][newCol] === symbol
            ) {
              count++;
            } else {
              break;
            }

            if (count >= 5) {
              return symbol; // Vrátí vítězný symbol ("X" nebo "O")
            }
          }
        }
      }
    }

    return null; // Žádný vítěz
  };

  const cellClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const currentCell = prevGrid[row][col];
      const newGrid = [...prevGrid];
      newGrid[row] = [...prevGrid[row]]; // Vytvoří kopii řádku.

      if (currentCell !== "") {
        // Pokud buňka již obsahuje symbol, smaže ho.
        newGrid[row][col] = "";
      } else {
        // Pokud je buňka prázdná, nastaví symbol podle aktuálního hráče.
        const symbol = player ? "X" : "O";
        newGrid[row][col] = symbol;
      }

      setHasSymbol(newGrid.some((row) => row.some((cell) => cell !== "")));

      if (checkWinner(newGrid)) {
        setIsThereWinner(true); // Aktualizace stavu pro zobrazení zprávy o vítězství
      } else {
        setIsThereWinner(false);
      }

      return newGrid;
    });
  };

  const nameIsMissing = () => {
    if (game.name.trim() === "") {
      setNameInputStyle({ border: "1px solid red" });
    } else {
      setNameInputStyle({ border: "none" });
    }
  };

  const clearGame = () => {
    setGrid(Array.from({ length: 15 }, () => Array(15).fill("")));
    setHasSymbol(false);
  };

  return (
    <div className={styles.body}>
      <div className={styles.editorPageMenu}>
        <Link to="/Games">
          <img
            className={styles.arrow}
            src={darkMode ? arrowBlack : arrowWhite}
          />
        </Link>
        <button onClick={toggleDarkMode}>
          <img
            className={styles.darkModeBtn}
            src={darkMode ? darkModeButton : lightModeButton}
          />
        </button>
      </div>

      <div
        style={isThereWinner ? { display: "flex" } : { display: "none" }}
        className={styles.errorWin}
      >
        <img
          style={{ backgroundColor: "white" }}
          className={styles.circleBtn}
          src={redCancel}
        />
        <p className={styles.errorWinText}>Úloha nesmí být již vyřešena</p>
      </div>

      <h2 className={styles.editorPageTitle}>Editační stránka</h2>

      <div className={styles.editWrapper}>
        <div className={styles.leftSide}>
          <div>
            <h3 className={styles.leftSideTitle}>Všeobecné nastavení</h3>
            <div className={styles.editorPageInputs}>
              <input
                style={nameInputStyle}
                className={styles.editorPageInput}
                type="text"
                placeholder="Zadejte název hry"
                value={game.name}
                onChange={handleNameInputChange}
              />

              <select
                className={styles.editorPageSelect}
                name="difficulty"
                id=""
                value={game.difficulty}
                onChange={difficultyCHange}
              >
                <option value="none" selected>
                  Vyberte obtížnost
                </option>
                <option className={styles.difficulty} value="Začátečník">
                  Začátečník
                </option>
                <option className={styles.difficulty} value="Jednoduchá">
                  Jednoduchá
                </option>
                <option className={styles.difficulty} value="Pokročilá">
                  Pokročilá
                </option>
                <option className={styles.difficulty} value="Těžká">
                  Těžká
                </option>
                <option className={styles.difficulty} value="Nejtěžší">
                  Nejtěžší
                </option>
              </select>
            </div>
          </div>

          <div className={styles.selectSymbol}>
            <div className={styles.editacePlochyTitle}>
              <h3 className={styles.leftSideTitle}>Editace plochy</h3>
              <p className={styles.info}>?</p>
            </div>

            <div className={styles.selectSymbolImg}>
              <button
                style={player ? { opacity: "1" } : { opacity: "0.3" }}
                onClick={changePlayerOnBlue}
              >
                <p
                  style={{ color: "#E31837" }}
                  className={styles.numberAboveImg}
                >
                  {xCount}
                </p>
                <img src={redBulb} />
              </button>
              <span>
                <img
                  style={
                    goodNumberOfSymbols
                      ? { backgroundColor: "#009e47d0" }
                      : { backgroundColor: "#e318365d" }
                  }
                  className={styles.circleBtn}
                  src={goodNumberOfSymbols ? check : redCancel}
                />
              </span>
              <button
                style={
                  player
                    ? { opacity: "0.4", filter: "brightness(1)" }
                    : { opacity: "1", filter: "brightness(1.25)" }
                }
                onClick={changePlayerOnRed}
              >
                <p
                  style={{ color: "#0070BB" }}
                  className={styles.numberAboveImg}
                >
                  {oCount}
                </p>
                <img src={blueBulb} />
              </button>
            </div>
          </div>

          <div className={styles.leftSideBtns}>
            <Button
              text="Uložit úlohu"
              image={check}
              color="white"
              backgroundColor="#0070BB"
              onClick={() =>
                game.name !== ""
                  ? (sendData(), setNameInputStyle({ border: "none" }))
                  : nameIsMissing()
              }
              isDisabled={
                isThereWinner ? false : goodNumberOfSymbols ? false : true
              }
            />
            <Link style={{ textDecoration: "none" }} to="/Games">
              <Button
                text="Vymazat úlohu"
                image={trashBin}
                color="#E31837"
                border="2px solid #E31837"
                onClick={() => deleteGame(game.uuid)}
              />
            </Link>
          </div>
        </div>

        <div className={styles.rightSide}>
          <button
            style={hasSymbol ? { display: "block" } : { display: "none" }}
            onClick={clearGame}
            className={styles.clearGame}
          >
            Vyčistit plochu
          </button>
          <div className={styles.gameGrid}>
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  className={styles.cell}
                  onClick={() => cellClick(rowIndex, colIndex)}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {cell === "X" && (
                    <img src={symbolX} alt="X" className={styles.symbol} />
                  )}
                  {cell === "O" && (
                    <img src={symbolO} alt="O" className={styles.symbol} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
