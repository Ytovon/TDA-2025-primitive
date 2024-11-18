import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./GamePage.module.css";
import symbolX from "../../assets/images/X_cervene.png";
import symbolO from "../../assets/images/O_modre.png";
import arrowBlack from "../../assets/images/arrow-left-solid-black.svg";
import arrowWhite from "../../assets/images/arrow-left-solid-white.svg";
import darkModeButton from "../../assets/images/Primary.svg";

export default function GamePage() {
  const [darkMode, setColorMode] = useState(false);

  const changePageColor = () => {
    setColorMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(null))
  );

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
        if (symbol === "X") setWinner("První hráč");
        if (symbol === "O") setWinner("Druhý hráč");
        return true;
      }
    }

    return false;
  };

  // Funkce pro kliknutí na buňku
  const cellClick = (row: number, col: number) => {
    if (grid[row][col] !== null || winner) return;

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
    if (player) {
      document.documentElement.classList.add("secondPlayer");
    } else {
      document.documentElement.classList.remove("secondPlayer");
    }
  };

  const resetGame = () => {
    setPlayer(true);
    setGrid(Array.from({ length: 15 }, () => Array(15).fill(null)));
    setWinner(null);
    document.documentElement.classList.remove("secondPlayer");
  };

  return (
    <div className={styles.gamePage}>
      <div className={styles.gameMenu}>
        <button>
          <Link to="/">
            <img className={styles.arrow} src={arrowBlack} alt="" />
          </Link>
        </button>
        <button onClick={changePageColor}>
          <img className={styles.darkModeBtn} src={darkModeButton} />
        </button>
      </div>

      <div>
        <h2 className={styles.title}>Lokální multiplayer</h2>

        <div className={styles.game}>
          <button onClick={resetGame}>Reset</button>

          {winner && (
            <div className={styles.winnerMessage}>{winner} vyhrál!</div>
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
}
