import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./GameMultiplayer.module.css";
import { useDarkMode } from "../../Context/DarkModeContext";
import { Button } from "../../Components/Button/Button";
import { ApiClient } from "../../API/GameApi";
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";
import {
  symbolX,
  symbolO,
  arrowBlack,
  arrowWhite,
  winnerBlue,
  winnerRed,
  lightbulbWhite,
} from "../../assets/assets";

export const GameMultiplayer = ({ uuid = "" }) => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const {
    isConnected,
    sendMessage,
    gameID,
    multiplayerBoard,
    multiplayerWinner,
    status,
  } = useWebSocketMultiplayer();

  interface Move {
    row: number;
    col: number;
  }

  interface CellClickMessage {
    type: string;
    gameId: string;
    move: Move;
  }

  const [game, setGame] = useState({
    board: Array.from({ length: 15 }, () => Array(15).fill("")),
    initialBoard: Array.from({ length: 15 }, () => Array(15).fill("")),
    difficulty: "",
    gameState: "",
    name: "Hra s přítelem",
    uuid,
  });
  const [grid, setGrid] = useState(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [player, setPlayer] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      document.documentElement.classList.remove("winnerRed");
      const fetchedGame = await ApiClient.fetchSpecificGame(uuid);
      if (fetchedGame) {
        setGame(fetchedGame);
        setGrid(fetchedGame.board);
      }
    };
    fetchGame();
  }, [uuid]);

  useEffect(
    () =>
      setWinner(
        multiplayerWinner === "X"
          ? "red"
          : multiplayerWinner === "O"
          ? "blue"
          : multiplayerWinner
      ),
    [multiplayerWinner]
  );
  useEffect(() => {
    if (JSON.stringify(grid) !== JSON.stringify(multiplayerBoard)) {
      setGrid(multiplayerBoard);
    }
  }, [multiplayerBoard]);
  useEffect(
    () => setPlayer(grid.flat().filter((cell) => cell).length % 2 === 0),
    [grid]
  );

  const checkWin = (row: number, col: number, symbol: string): boolean => {
    const directions: [number, number][] = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    return directions.some(([dr, dc]) => {
      let count = 1,
        r: number,
        c: number;
      for (
        [r, c] = [row + dr, col + dc];
        grid[r]?.[c] === symbol;
        [r, c] = [r + dr, c + dc]
      )
        count++;
      for (
        [r, c] = [row - dr, col - dc];
        grid[r]?.[c] === symbol;
        [r, c] = [r - dr, c - dc]
      )
        count++;
      if (count >= 5) {
        console.log(`Winner detected: ${symbol === "X" ? "red" : "blue"}`);
        setWinner(symbol === "X" ? "red" : "blue");
        document.documentElement.classList.add("winnerRed");
        return true;
      }
      return false;
    });
  };

  const cellClick = (row: number, col: number): void => {
    if (grid[row][col] || winner) return;
    if (isConnected) {
      const message: CellClickMessage = {
        type: "move",
        gameId: gameID,
        move: { row, col },
      };
      return sendMessage(message);
    }
    setGrid((prev) => {
      const newGrid = prev.map((row) => [...row]);
      newGrid[row][col] = player ? "X" : "O";
      return newGrid;
    });
    checkWin(row, col, player ? "X" : "O") || setPlayer(!player);
  };

  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{game.name}</h2>

      <div className={styles.gamePage}>
        <div
          style={{
            boxShadow: player
              ? "var(--shadow-game-red)"
              : "var(--shadow-game-blue)",
          }}
          className={styles.menuSide}
        >
          <h2 className={styles.menuTitle}>Online multiplayer</h2>

          <div className={styles.menu}>
            <div className={styles.menuBackground}>
              <div className={styles.menuFlex}>
                <div>
                  <h3>Hráč1</h3>
                  <img className={styles.userImg} src={lightbulbWhite} alt="" />
                </div>
                <p>vs</p>
                <div>
                  <h3>Hráč2</h3>
                  <img className={styles.userImg} src={lightbulbWhite} alt="" />
                </div>
              </div>

              <div className={styles.menuFlex}>
                <p className={styles.eloCount}>400</p>
                <p>ELO</p>
                <p className={styles.eloCount}>400</p>
              </div>
            </div>

            <div
              className={`${styles.menuBackground} ${styles.menuFlex} ${styles.timer}`}
            >
              <p className={styles.time}>08:00</p>
              <p className={styles.timeText}>
                Zbývá <br />
                času
              </p>
              <p className={styles.time}>08:00</p>
            </div>
          </div>
        </div>

        <div className={styles.gameSide}>
          <div className={styles.gameWrapper}>
            <div className={styles.gameGrid}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={styles.cell}
                    onClick={() => cellClick(rowIndex, colIndex)}
                  >
                    {cell && (
                      <img
                        src={cell === "X" ? symbolX : symbolO}
                        alt={cell}
                        className={styles.symbol}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {winner && (
        <div
          className={`${styles.winnerCardWrapper} ${styles.active}`}
          style={{ display: "flex" }}
        >
          <div className={styles.winnerCard}>
            <div>
              <h2 className={styles.winnerCardTitle}>Gratulujeme</h2>
              <p className={styles.winnerCardSubtitle}>
                k výhře hráči v {winner === "red" ? "červeném" : "modrém"}
              </p>

              <Button
                text="Ukončit"
                color={winner === "red" ? "#E31837" : "#0070BB"}
                border={winner !== "red"}
                onClick={() => navigate(game.uuid ? "/Games" : "/")}
                width="170px"
                height="45px"
              />
            </div>

            <img
              className={styles.winnerCardImg}
              src={winner === "red" ? winnerRed : winnerBlue}
              alt="winner"
            />
          </div>
        </div>
      )}

      <p style={{ color: "white" }}>{status}</p>
    </div>
  );
};
