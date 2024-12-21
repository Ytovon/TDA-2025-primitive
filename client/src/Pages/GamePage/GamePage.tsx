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
  cervenaZarovkaX,
  modraZarovkaO,
  darkModeButton,
} from "../../assets/assets";
import boardData from "../../test.json";
import { useDarkMode } from "../../DarkModeContext";

interface GamePageProps {
  uuid?: string;
}

export const GamePage: React.FC<GamePageProps> = ({ uuid = "" }) => {
  useEffect(() => {
    // Odebere třídu "winnerRed" z HTML elementu při načtení stránky
    document.documentElement.classList.remove("winnerRed");
  }, []);

  const { darkMode, toggleDarkMode } = useDarkMode();

  // Vytvoří pole / hru
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  //Pokud to je úloha, použije grid z Json
  useEffect(() => {
    if (uuid !== "") {
      setGrid(boardData);
      if (name !== "") {
        setGameName(name);
      }
    }
  }, []);

  let gameType = "Jednoduchá";
  let name = "Puzzle";
  const [gameName, setGameName] = useState("Lokální multiplayer");

  const [player, setPlayer] = useState(true); // true = hráč X, false = hráč O
  const [winner, setWinner] = useState<string | null>(null);

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
    setGrid(Array.from({ length: 15 }, () => Array(15).fill("")));
    if (uuid !== "") {
      setGrid(boardData);
    }
    setWinner(null);
    document.documentElement.classList.remove("winnerRed");
  };

  return (
    <body className={styles.body}>
      <div className={styles.gamePage}>
        <div className={styles.gameMenu}>
          <button>
            <Link to="/">
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
              <img className={styles.darkModeBtn} src={darkModeButton} />
            </button>
          </div>
        </div>

        <div className={styles.gameWrapper}>
          <h2 className={styles.title}>
            {uuid !== "" ? gameName + " | " + gameType : gameName}
          </h2>

          <div className={styles.game}>
            <img className={styles.imgNextToGame} src={cervenaZarovkaX} />
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
            <img className={styles.imgNextToGame} src={modraZarovkaO} />
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
            <Link className={styles.winnerCardBtn} to="/">
              Ukončit
            </Link>
          </div>
        </div>
      </div>
    </body>
  );
};
