import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./GamePage.module.css";
import {
  symbolX,
  symbolO,
  arrowBlack,
  arrowWhite,
  resetBtnBlack,
  resetBtnWhite,
  winnerBlue,
  winnerRed,
  modraZarovkaO,
  darkModeButton,
  lightModeButton,
} from "../../assets/assets";
import BlinkingEyesSVG from "../../Components/Animation/lightbulb";
import { useDarkMode } from "../../DarkModeContext";
import { FallingSymbols } from "../../Components/Animation/FallingSymbols";

interface GamePageProps {
  uuid?: string;
}

export const GamePage: React.FC<GamePageProps> = ({ uuid = "" }) => {
  type Game = {
    createdAt: string;
    difficulty: string;
    gameState: string;
    name: string;
    updatedAt: string;
    uuid: string;
  };

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [player, setPlayer] = useState(true); // true = hráč X, false = hráč O
  const [winner, setWinner] = useState<string | null>(null);
  const [game, setGame] = useState<Game>({
    createdAt: "",
    difficulty: "",
    gameState: "",
    name: "Lokální multiplayer",
    updatedAt: "",
    uuid,
  });
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [initialBoard, setInitialBoard] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );

  useEffect(() => {
    // Odebere třídu "winnerRed" z HTML elementu při načtení stránky
    document.documentElement.classList.remove("winnerRed");

    const url = new URL(window.location.href);
    const uuid: string | undefined = url.pathname.split("/").pop(); // Poslední část cesty

    fetchSpecificGame(typeof uuid == "string" ? uuid : "");
  }, []);

  useEffect(() => {
    let xCount = 0;
    let oCount = 0;

    // Projde každou buňku v gridu a spočítá počet X a O
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell === "X") {
          xCount++;
        } else if (cell === "O") {
          oCount++;
        }
      });
    });

    // Nastaví, který hráč má hrát na základě počtu X a O
    if (xCount === oCount) {
      setPlayer(true); // Hráč X na tahu
    } else {
      setPlayer(false); // Hráč O na tahu
    }
  }, [grid]);

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

      setInitialBoard(data.board);
      setGrid(data.board);

      console.log(data.board);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Funkce pro kontrolu výhry
  const checkWin = (row: number, col: number, symbol: string) => {
    const directions = [
      { dr: 0, dc: 1 }, // Vodorovně
      { dr: 1, dc: 0 }, // Svisle
      { dr: 1, dc: 1 }, // Diagonálně (zleva dolů)
      { dr: 1, dc: -1 }, // Diagonálně (zprava dolů)
    ];

    for (const { dr, dc } of directions) {
      let count = 1;

      // Kontrola v jednom směru
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 15 && c >= 0 && c < 15 && grid[r][c] === symbol) {
        count++;
        r += dr;
        c += dc;
      }

      // Kontrola v opačném směru
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < 15 && c >= 0 && c < 15 && grid[r][c] === symbol) {
        count++;
        r -= dr;
        c -= dc;
      }

      // Pokud je spojeno pět symbolů, vrátí vítězství
      if (count >= 5) {
        if (symbol === "X") setWinner("red");
        if (symbol === "O") setWinner("blue");
        if (symbol === "X") {
          document.documentElement.classList.add("winnerRed");
        }
        return true;
      }
    }

    return false;
  };

  let typeStyle: React.CSSProperties = {};

  //TODO !!!
  if (game.difficulty.toLowerCase() === "začátečník") {
    typeStyle = { color: "#0070BB" };
  } else if (game.difficulty.toLowerCase() === "jednoduchá") {
    typeStyle = { color: "#395A9A" };
  } else if (game.difficulty.toLowerCase() === "pokročilá") {
    typeStyle = { color: "#724479" };
  } else if (game.difficulty.toLowerCase() === "těžká") {
    typeStyle = { color: "#AB2E58" };
  } else if (game.difficulty.toLowerCase() === "nejtěžší") {
    typeStyle = { color: "#E31837" };
  }

  // Funkce pro kliknutí na buňku
  const cellClick = (row: number, col: number) => {
    if (grid[row][col] !== "" || winner) return;

    const symbol = player ? "X" : "O";

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row] = [...prevGrid[row]]; // Vytvoří kopii řádku.
      newGrid[row][col] = symbol; // Nastaví symbol podle hráče.
      return newGrid;
    });

    if (checkWin(row, col, symbol)) {
      console.log(`${symbol} wins!`);
      return;
    }

    setPlayer(!player);
  };

  const resetGame = () => {
    setPlayer(true);
    setGrid(initialBoard);
    setWinner(null);
    document.documentElement.classList.remove("winnerRed");
  };

  return (
    <body className={styles.body}>
      <FallingSymbols
        speed={7}
        position={68}
        rotation={45}
        img={player ? symbolX : symbolO}
      />

      <FallingSymbols
        speed={5}
        position={18}
        rotation={-57}
        img={player ? symbolX : symbolO}
      />
      <div className={styles.gamePage}>
        <div className={styles.gameMenu}>
          <button>
            <Link to={game.uuid !== "" ? "/Games" : "/"}>
              <img
                className={styles.arrow}
                src={darkMode ? arrowBlack : arrowWhite}
                alt=""
              />
            </Link>
          </button>

          <div className={styles.gameBtns}>
            <button onClick={resetGame}>
              <img
                className={styles.resetBtn}
                src={darkMode ? resetBtnBlack : resetBtnWhite}
                alt=""
              />
            </button>
            <button onClick={toggleDarkMode}>
              <img
                style={
                  darkMode
                    ? { width: "20px", padding: "7px" }
                    : { width: "22px", padding: "6px" }
                }
                className={styles.darkModeBtn}
                src={darkMode ? darkModeButton : lightModeButton}
              />
            </button>
          </div>
        </div>

        <div className={styles.gameWrapper}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{game.name}</h2>
            <span
              style={
                game.difficulty !== "" ? { display: "" } : { display: "none" }
              }
              className={styles.line}
            ></span>
            <h2 style={typeStyle} className={styles.title}>
              {game.difficulty}
            </h2>
          </div>

          <h2 className={styles.gameState}>{game.gameState}</h2>

          <div className={styles.game}>
            <BlinkingEyesSVG isRedPlayer={true} OnMove={player} />

            <div className={styles.gameGrid}>
              {Array.isArray(grid) &&
                grid.map((row, rowIndex) =>
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
            <BlinkingEyesSVG isRedPlayer={false} OnMove={!player} />
          </div>
        </div>
      </div>

      <div
        className={`${styles.winnerCardWrapper} ${winner ? styles.active : ""}`}
      >
        <div className={styles.winnerCard}>
          <div className={styles.winnerCardTextImg}>
            <div className={styles.winnerCardText}>
              <h2 className={styles.winnerCardTitle}>Gratulujeme</h2>
              <p className={styles.winnerCardSubtitle}>
                k výhře{" "}
                {winner === "red" ? "hráči v červeném" : "hráči v modrém"}
              </p>
            </div>
            <img
              className={styles.winnerCardImg}
              src={winner === "red" ? winnerRed : winnerBlue}
            />
          </div>

          <div className={styles.winnerCardBtns}>
            <p className={styles.winnerCardBtn} onClick={resetGame}>
              odveta
            </p>
            <Link
              className={styles.winnerCardBtn}
              to={game.uuid !== "" ? "/Games" : "/"}
            >
              Ukončit
            </Link>
          </div>
        </div>
      </div>
    </body>
  );
};
