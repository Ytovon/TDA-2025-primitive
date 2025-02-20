import React, { useState, useEffect } from "react";
import styles from "./EditorPage.module.css";
import {
  arrowBlack,
  arrowWhite,
  blueBulb,
  check,
  redCancel,
  darkModeButton,
  lightModeButton,
  redBulb,
  trashBin,
  symbolX,
  symbolO,
  whitePlus,
} from "../../assets/assets";
import { ApiClient } from "../../API/Api";
import { Button } from "../../Components/Button/Button";
import { useDarkMode } from "../../DarkModeContext";
import { Link, useNavigate } from "react-router-dom";

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
    bitmap: string;
  };

  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [player, setPlayer] = useState<boolean>(true);
  const [hasSymbol, setHasSymbol] = useState<boolean>(false);
  const [nameInputStyle, setNameInputStyle] = useState({});
  const [diffInputStyle, setDiffInputStyle] = useState({});
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
    bitmap: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const uuid = new URL(window.location.href).pathname.split("/").pop();
    if (uuid) ApiClient.updateGame(uuid, setGame, setGrid);
  }, []);

  useEffect(() => {
    setGame((prevGame) => ({
      ...prevGame,
      difficulty: getDifficultyValue(prevGame.difficulty),
    }));
  }, [game.difficulty]);

  useEffect(() => {
    let xCount = 0,
      oCount = 0;
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell === "X") xCount++;
        if (cell === "O") oCount++;
      })
    );
    setXCount(xCount);
    setOCount(oCount);
    setGoodNumberOfSymbols(xCount - 1 === oCount || xCount === oCount);
  }, [grid]);

  const getDifficultyValue = (difficulty: string): string => {
    const difficulties: { [key: string]: string } = {
      začátečník: "Začátečník",
      easy: "Začátečník",
      jednoduchá: "Jednoduchá",
      pokročilá: "Pokročilá",
      medium: "Pokročilá",
      těžká: "Těžká",
      hard: "Těžká",
      nejtěžší: "Nejtěžší",
    };
    return difficulties[difficulty.toLowerCase()] || "";
  };

  const handleCreateGame = async () => {
    const newGameUuid = await ApiClient.createGame(game, grid);
    if (newGameUuid) {
      await ApiClient.updateGame(newGameUuid, setGame, setGrid, setHasSymbol);
      navigate("/games");
    }
  };

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
      const newGrid = prevGrid.map((r, i) => (i === row ? [...r] : r));
      newGrid[row][col] = newGrid[row][col] === "" ? (player ? "X" : "O") : "";
      setHasSymbol(newGrid.some((row) => row.some((cell) => cell !== "")));
      setIsThereWinner(!!checkWinner(newGrid));
      return newGrid;
    });
  };

  const handleButtonClick = (method: string) => {
    const isValid = game.name !== "" && game.difficulty !== "";
    setNameInputStyle({ border: game.name === "" ? "1px solid red" : "none" });
    setDiffInputStyle({
      border: game.difficulty === "" ? "1px solid red" : "none",
    });

    if (isValid) {
      if (method === "create") handleCreateGame();
      if (method === "send") {
        ApiClient.sendGameData(game.uuid, grid, game);
        navigate("/games");
      }
    }
  };

  const clearGame = () => {
    setGrid(Array.from({ length: 15 }, () => Array(15).fill("")));
    setHasSymbol(false);
  };

  return (
    <div className={styles.body}>
      <Link to="/Games">
        <img
          className={styles.arrow}
          src={darkMode ? arrowWhite : arrowBlack}
        />
      </Link>

      {isThereWinner && (
        <div className={styles.errorWin}>
          <img className={styles.circleBtn} src={redCancel} />
          <p className={styles.errorWinText}>Úloha nesmí být již vyřešena</p>
        </div>
      )}

      <h2 className={styles.editorPageTitle}>Editační stránka</h2>

      <div className={styles.editWrapper}>
        <div className={styles.leftSide}>
          <div className={styles.editArea1}>
            <h3 className={styles.leftSideTitle}>Všeobecné nastavení</h3>
            <div className={styles.editorPageInputs}>
              <input
                style={nameInputStyle}
                className={styles.editorPageInput}
                type="text"
                placeholder="Zadejte název hry"
                value={game.name}
                onChange={(e) => setGame({ ...game, name: e.target.value })}
              />
              <select
                style={diffInputStyle}
                className={styles.editorPageSelect}
                value={game.difficulty}
                onChange={(e) =>
                  setGame({ ...game, difficulty: e.target.value })
                }
              >
                <option value="">Vyberte obtížnost</option>
                {[
                  "Začátečník",
                  "Jednoduchá",
                  "Pokročilá",
                  "Těžká",
                  "Nejtěžší",
                ].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.editArea2}>
            <h3 className={styles.leftSideTitle}>Editace plochy</h3>
            <div className={styles.selectSymbolImg}>
              <button
                style={{
                  opacity: player ? 1 : 0.3,
                  border: "none",
                  backgroundColor: "var(--color-background-primary",
                }}
                onClick={() => setPlayer(true)}
              >
                <p className={styles.numberAboveImg}>{xCount}</p>
                <img src={redBulb} />
              </button>
              <span>
                <img
                  className={styles.circleBtn}
                  src={goodNumberOfSymbols ? check : redCancel}
                  style={{
                    backgroundColor: goodNumberOfSymbols
                      ? "#009e47d0"
                      : "#e318365d",
                  }}
                />
              </span>
              <button
                style={{
                  opacity: player ? 0.4 : 1,
                  border: "none",
                  backgroundColor: "var(--color-background-primary",
                }}
                onClick={() => setPlayer(false)}
              >
                <p className={styles.numberAboveImg}>{oCount}</p>
                <img src={blueBulb} />
              </button>
            </div>
          </div>

          <div className={styles.leftSideBtns}>
            {game.uuid === "" ? (
              <Button
                text="Vytvořit hru"
                image={whitePlus}
                color="white"
                backgroundColor={true}
                onClick={() => handleButtonClick("create")}
                isDisabled={!goodNumberOfSymbols || isThereWinner}
              />
            ) : (
              <Button
                text="Uložit úlohu"
                image={check}
                color="white"
                backgroundColor={true}
                onClick={() => handleButtonClick("send")}
                isDisabled={!goodNumberOfSymbols || isThereWinner}
              />
            )}
            <Link to="/Games" style={{ textDecoration: "none" }}>
              <Button
                text="Vymazat úlohu"
                image={trashBin}
                color="#E31837"
                border={false}
                onClick={() => ApiClient.deleteGame(game.uuid)}
              />
            </Link>
          </div>
        </div>

        <div className={styles.rightSide}>
          {hasSymbol && (
            <button onClick={clearGame} className={styles.clearGame}>
              Vyčistit plochu
            </button>
          )}
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
