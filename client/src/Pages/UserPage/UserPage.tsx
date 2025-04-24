import React, { useState, useEffect } from "react";
import styles from "./UserPage.module.css";
import Header from "../../Components/Header/Header";
import {
  lightbulbWhite,
  eloWhite,
  statsGames,
  statsTrophy,
  statsTrophyWhite,
  handshakeBlack,
  handshakeWhite,
} from "../../assets/assets";
import { useParams } from "react-router-dom";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";
import { useDarkMode } from "../../Context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { getUUID } from "../../API/tokenstorage";

export const UserPage = () => {
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [user, setUser] = useState<UserModel | null>(null);
  const { darkMode } = useDarkMode();

  const navigate = useNavigate();

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

  useEffect(() => {
    if (uuid == getUUID()) {
      navigate("/Profile/" + uuid);
      return;
    }
    const fetchUser = async () => {
      if (!uuid) return;

      try {
        const userData: UserModel | string = await UserApiClient.getUserByUUID(
          uuid
        );
        typeof userData !== "string" && setUser(userData);
      } catch (err) {
        console.error("Nepodařilo se načíst uživatele.", err);
      }
    };

    fetchUser();
  }, [uuid]);

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.userInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.userInfoHeader}>
            <div
              className={styles.userImgContainer}
              style={{ backgroundColor: colorMap[user?.AvatarColor ?? 1] }}
            >
              <img
                style={{ backgroundColor: colorMap[user?.AvatarColor ?? 1] }}
                className={styles.userImg}
                src={lightbulbWhite}
                alt="profile Picture"
              />
            </div>
            {user && (
              <h1
                className={styles.username}
                style={{ backgroundColor: colorMap[user?.AvatarColor ?? 1] }}
              >
                {user.username}{" "}
              </h1>
            )}
            <p className={styles.joinDate}>
              Členem od{" "}
              <b>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Neznámé datum"}
              </b>
            </p>
            <div
              className={styles.setting}
              style={{ backgroundColor: colorMap[user?.AvatarColor ?? 1] }}
            ></div>
          </div>

          <div className={styles.noteContainer}>
            <h3 className={styles.noteTitle}>Poznámka</h3>
            <textarea
              className={styles.note}
              disabled
              placeholder="Někomu tu chybí poznámka..."
              value={user?.note ? user.note : ""}
            />
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsHeader}>
            {user && (
              <>
                <h1 className={styles.statsTitle}>{Math.round(user.elo)}</h1>
                <img className={styles.statsImg} src={eloWhite} />
              </>
            )}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <img className={styles.statImg} src={statsGames} />
              <p>
                Hry:{" "}
                <span className={styles.redBold}>
                  {user ? user.losses + user.wins + user.draws : 0}
                </span>
              </p>
            </div>
            <div className={styles.stat}>
              <img
                className={styles.statImg}
                src={darkMode ? statsTrophyWhite : statsTrophy}
              />
              <p>
                Výhry: <span className={styles.redBold}>{user?.wins}</span>
              </p>
            </div>
            <div className={styles.stat}>
              <img
                className={styles.statImg}
                src={darkMode ? handshakeWhite : handshakeBlack}
                alt=""
              />
              <p>
                Remíza:{" "}
                <span className={styles.redBold}>{user ? user.draws : 0}</span>
              </p>
            </div>

            <div className={styles.stat}>
              <img
                style={{ rotate: "180deg" }}
                className={styles.statImg}
                src={darkMode ? statsTrophyWhite : statsTrophy}
              />
              <p>
                Prohry:{" "}
                <span className={styles.redBold}>{user ? user.losses : 0}</span>
              </p>
            </div>
            <div className={styles.stat}>
              <p>
                WR: <span className={styles.redBold}>0%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
