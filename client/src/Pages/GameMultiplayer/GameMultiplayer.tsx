import React, { useEffect, useState } from "react";
import styles from "./GameMultiplayer.module.css";
import { Button } from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";
import {
  symbolX,
  symbolO,
  winnerBlue,
  winnerRed,
  lightbulbWhite,
} from "../../assets/assets";
import { UserApiClient } from "../../API/UserApi";
import { User } from "../../Model/UserModel";
import { getUUID } from "../../API/tokenstorage";

export const GameMultiplayer = () => {
  interface Move {
    row: number;
    col: number;
  }

  interface CellClickMessage {
    type: string;
    gameId: string;
    move: Move;
  }
  const [Me, setMe] = useState<User | null>(null);
  const [Opponent, setOpponent] = useState<User | null>(null);

  const navigate = useNavigate();
  const {
    isConnected,
    sendMessage,
    gameID,
    multiplayerBoard,
    multiplayerWinner,
    status,
    opponnentUUID,
    mySymbol,
  } = useWebSocketMultiplayer();

  // if user is not connected, redirect to home page
  useEffect(() => {
    if (!isConnected) navigate("/");
  }, [isConnected]);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const opponent = await UserApiClient.getUserByUUID(opponnentUUID);
        const me = await UserApiClient.getUserByUUID(getUUID() as string);
        setOpponent(opponent as User);
        setMe(me as User);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (opponnentUUID) {
      fetchUsers();
    }
  }, [opponnentUUID]);

  const cellClick = (row: number, col: number): void => {
    if (multiplayerBoard[row][col] || multiplayerWinner) return;
    if (isConnected) {
      const message: CellClickMessage = {
        type: "move",
        gameId: gameID,
        move: { row, col },
      };
      sendMessage(message);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.gamePage}>
        <div className={styles.menuSide}>
          <h2 className={styles.menuTitle}>Online multiplayer</h2>

          <p className="status-text">{status}</p>

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
              {multiplayerBoard.map((row, rowIndex) =>
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

      {multiplayerWinner && (
        <div
          className={`${styles.winnerCardWrapper} ${styles.active}`}
          style={{ display: "flex" }}
        >
          <div className={styles.winnerCard}>
            <div>
              <h2 className={styles.winnerCardTitle}>
                {" "}
                {multiplayerWinner === mySymbol
                  ? `Gratulujeme!`
                  : `Snad to výjde příště...`}
              </h2>
              <p className={styles.winnerCardSubtitle}>
                {multiplayerWinner === mySymbol
                  ? `${Me?.username} vyhrál jste!`
                  : `${Opponent?.username} vyhrál...`}
              </p>

              <Button
                text="Zpět na domovskou stránku"
                color={multiplayerWinner === "red" ? "#E31837" : "#0070BB"}
                border={multiplayerWinner !== "red"}
                width="170px"
                height="45px"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>

            <img
              className={styles.winnerCardImg}
              src={multiplayerWinner === "red" ? winnerRed : winnerBlue}
              alt="winner"
            />
          </div>
        </div>
      )}
    </div>
  );
};
