import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./GameLobby.module.css";
import {
  symbolX,
  symbolO,
  arrowBlack,
  arrowWhite,
  resetBtnBlack,
  resetBtnWhite,
  winnerBlue,
  winnerRed,
} from "../../assets/assets";
import BlinkingEyesSVG from "../../Components/Animation/lightbulb";
import { useDarkMode } from "../../Context/DarkModeContext";
import { Button } from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../../API/GameApi";
import { Game } from "../../Model/GameModel";
import { useWebSocketLobby } from "../../Context/WebSocketContextLobby";

interface GamePageProps {
  uuid?: string;
}

// if winner == null, then its draw... handle that correctly

export const GameLobby: React.FC<GamePageProps> = ({ uuid = "" }) => {
  const navigate = useNavigate();
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [player, setPlayer] = useState(true); // true = hráč X, false = hráč O
  const [winner, setWinner] = useState<string | null>("");

  const {
    isConnected,
    sendMessage,
    gameID,
    multiplayerBoard,
    multiplayerWinner,
    status,
  } = useWebSocketLobby();

  const [game, setGame] = useState<Game>({
    board: [],
    initialBoard: [],
    createdAt: "",
    difficulty: "",
    gameState: "",
    name: isConnected ? "Online multiplayer" : "Lokální multiplayer",
    updatedAt: "",
    uuid,
  });

  const [refresh, setRefresh] = useState(0);

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [initialBoard, setInitialBoard] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );

  useEffect(() => {
    const fetchGame = async () => {
      // Odebere třídu "winnerRed" z HTML elementu při načtení stránky
      document.documentElement.classList.remove("winnerRed");

      const url = new URL(window.location.href);
      const uuid: string | undefined = url.pathname.split("/").pop(); // Poslední část cesty

      const fetchedGame: Game | undefined = await ApiClient.fetchSpecificGame(
        typeof uuid == "string" ? uuid : ""
      );

      if (fetchedGame !== undefined) {
        setGame(fetchedGame);
        setGrid(fetchedGame.board);
        setInitialBoard(fetchedGame.board);
      }
    };
    fetchGame();
  }, []);

  // handles multiplayer winner
  useEffect(() => {
    setWinner((prevWinner) => {
      const newWinner =
        multiplayerWinner === "X"
          ? "red"
          : multiplayerWinner === "O"
          ? "blue"
          : multiplayerWinner;
      console.log("Setting Winner:", newWinner);
      return newWinner;
    });
  }, [multiplayerWinner]);

  useEffect(() => {
    setRefresh((prev) => prev + 1);
  }, [winner]);

  // change in board when multiplayerBoard changes... when opponent makes a move
  useEffect(() => {
    setGrid((prevGrid) => {
      return JSON.stringify(prevGrid) !== JSON.stringify(multiplayerBoard)
        ? multiplayerBoard
        : prevGrid;
    });
  }, [multiplayerBoard]);

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
    // multiplayer
    if (isConnected) {
      sendMessage({
        type: "move",
        gameId: gameID,
        move: { row: row, col: col },
      });
    }
    // basic game
    else {
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
    }
  };

  const resetGame = () => {
    setPlayer(true);
    setGrid(initialBoard);
    setWinner(null);
    document.documentElement.classList.remove("winnerRed");
  };

  return (
    <body className={styles.body}>
      <div className={styles.gamePage}>
        <div className={styles.gameMenu}>
          <button>
            <Link to={game.uuid !== "" ? "/Games" : "/"}>
              <img
                className={styles.arrow}
                src={darkMode ? arrowWhite : arrowBlack}
                alt=""
              />
            </Link>
          </button>

          <button onClick={resetGame}>
            <img
              className={styles.resetGame}
              src={darkMode ? resetBtnWhite : resetBtnBlack}
              alt=""
            />
          </button>
        </div>

        <div key={refresh} className={styles.gameWrapper}>
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
            <div
              className={styles.playerWrapper}
              style={{ opacity: player ? 1 : 0.4 }}
            >
              <BlinkingEyesSVG isRedPlayer={true} OnMove={player} />
            </div>

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
            <div
              className={styles.playerWrapper}
              style={{ opacity: player ? 0.4 : 1 }}
            >
              <BlinkingEyesSVG isRedPlayer={false} OnMove={!player} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${styles.winnerCardWrapper} ${
          winner != "" ? styles.active : ""
        }`}
      >
        <div className={styles.winnerCard}>
          <div className={styles.winnerCardTextImg}>
            <div className={styles.winnerCardText}>
              <h2 className={styles.winnerCardTitle}>Gratulujeme</h2>
              <p className={styles.winnerCardSubtitle}>
                k výhře{" "}
                {winner == "red" ? "hráči v červeném" : "hráči v modrém"}
              </p>
            </div>
            <img
              className={styles.winnerCardImg}
              src={winner == "red" ? winnerRed : winnerBlue}
            />
          </div>

          <div className={styles.winnerCardBtns}>
            <Button
              text="Odveta"
              color="white"
              backgroundColor={winner === "red" ? false : true}
              onClick={() => resetGame()}
            />

            <Button
              text="Ukončit"
              color={winner == "red" ? "#E31837" : "#0070BB"}
              border={winner == "red" ? false : true}
              onClick={() => navigate(game.uuid !== "" ? "/Games" : "/")}
            />
          </div>
        </div>
      </div>
      <div>
        <p style={{ color: "white" }}>{status != "" ? status : ""}</p>
      </div>
    </body>
  );
};
