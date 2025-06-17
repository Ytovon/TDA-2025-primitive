import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameMultiplayer.module.css";
import { Button } from "../../Components/Button/Button";
import { ApiClient } from "../../API/GameApi";
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";
import {
  symbolX,
  symbolO,
  winnerBlue,
  winnerRed,
  lightbulbWhite,
} from "../../assets/assets";
import { UserModel } from "../../Model/UserModel";
import { useAuth } from "../../Context/AuthContext";
import { UserApiClient } from "../../API/UserApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import {
  faCircleExclamation,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const GameMultiplayer = ({ uuid = "" }) => {
  const navigate = useNavigate();
  const {
    isConnected,
    sendMessage,
    gameID,
    multiplayerBoard,
    multiplayerWinner,
    opponnentUUID,
    status,
    setIsConnected,
  } = useWebSocketMultiplayer();

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

  const [timeX, setTimeX] = useState(8 * 60); // 8 minut v sekundách
  const [timeO, setTimeO] = useState(8 * 60);
  const [isMinimized, setIsMinimized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    name: "Online multiplayer",
    uuid,
  });
  const [grid, setGrid] = useState(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [player, setPlayer] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const { user } = useAuth();
  const [opponent, setOpponent] = useState<UserModel | string>("");

  useEffect(() => {
    setIsConnected(false);
  }, [useLocation()]);

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

  useEffect(() => {
    const fetchOpponent = async () => {
      const fetchedOpponent: UserModel | string =
        await UserApiClient.getUserByUUID(opponnentUUID || "");

      setOpponent(fetchedOpponent);
    };
    fetchOpponent();
  }, [opponnentUUID]);

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

  // Start nebo restart timeru podle aktivního hráče
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (player) {
        setTimeX((t) => (t > 0 ? t - 1 : 0));
      } else {
        setTimeO((t) => (t > 0 ? t - 1 : 0));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [player]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
      <div
        className={`${styles.gamePage} ${isMinimized ? styles.minimized : ""}`}
      >
        <button
          className={styles.toggleButtonHidden}
          onClick={() => setIsMinimized((prev) => !prev)}
        >
          {" "}
          <FontAwesomeIcon
            icon={isMinimized ? faChevronRight : faChevronLeft}
          />
        </button>
        {/* MENU SIDE */}
        <div
          className={`${styles.menuSide} ${
            isMinimized ? styles.minimized : ""
          }`}
        >
          <button
            className={styles.toggleButton}
            onClick={() => setIsMinimized((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={isMinimized ? faChevronRight : faChevronLeft}
            />
          </button>

          {!isMinimized && (
            <div className={styles.sideContent}>
              <h2 className={styles.title}>{game.name}</h2>
              <div className={styles.menu}>
                <div className={styles.menuBackground}>
                  <div className={styles.menuUsernames}>
                    <h3>{user?.username || "..."}</h3>
                    <h3>
                      {typeof opponent === "object" && "username" in opponent
                        ? opponent.username
                        : "..."}
                    </h3>
                  </div>
                  <div className={styles.menuFlex}>
                    <div>
                      <img
                        className={styles.userImg}
                        src={lightbulbWhite}
                        style={{
                          backgroundColor: colorMap[user?.AvatarColor ?? 1],
                        }}
                        alt=""
                      />
                    </div>
                    <p>vs</p>
                    <div>
                      <img
                        className={styles.userImg}
                        style={{
                          backgroundColor: colorMap[user?.AvatarColor ?? 1],
                        }}
                        src={lightbulbWhite}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className={styles.menuFlex}>
                    <p className={styles.eloCount}>
                      {Math.floor(user?.elo || 0) || "..."}
                    </p>
                    <p>ELO</p>
                    <p className={styles.eloCount}>
                      {typeof opponent === "object" && "username" in opponent
                        ? Math.floor(opponent.elo)
                        : "..."}
                    </p>
                  </div>
                </div>

                <div
                  className={`${styles.menuBackground} ${styles.menuFlex} ${styles.timer}`}
                >
                  <p className={styles.time}>{formatTime(timeX)}</p>
                  <p className={styles.timeText}>
                    Zbývá <br />
                    času
                  </p>
                  <p className={styles.time}>{formatTime(timeO)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GAME SIDE */}
        <div className={styles.gameSide}>
          <div
            className={styles.message}
            style={
              status != "" && status != undefined
                ? { opacity: 1, display: "flex" }
                : {}
            }
          >
            <FontAwesomeIcon icon={faCircleExclamation} />
            <p>{status}</p>
          </div>

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
    </div>
  );
};
