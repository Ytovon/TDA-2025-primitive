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
import { Footer } from "../../Components/Footer/Footer";

export const UserPage = () => {
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [user, setUser] = useState<UserModel | null>(null);
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [selectedColor, setSelectedColor] = useState("#91bedc");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uuid) return;

      try {
        const userData = await UserApiClient.getUserByUUID(uuid);
        if (typeof userData === "string") {
          setError(userData); // Pokud API vrátí chybovou zprávu
        } else {
          setUser(userData); // Nastavení získaného uživatele do stavu
        }
      } catch (err) {
        setError("Nepodařilo se načíst uživatele.");
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
            <div className={styles.userImgContainer}>
              <img
                style={{ backgroundColor: selectedColor }}
                className={styles.userImg}
                src={lightbulbWhite}
                alt="profile Picture"
              />
            </div>
            {user && <h1 className={styles.username}>{user.username}</h1>}
            <p className={styles.joinDate}>
              Členem od <b>16. O2. 2025</b>
            </p>
            <div className={styles.setting}></div>
          </div>

          <div className={styles.noteContainer}>
            <h3 className={styles.noteTitle}>Poznámka</h3>
            <textarea
              className={styles.note}
              disabled
              placeholder="Někde tu zapomněl na poznámku."
            />
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsHeader}>
            {user && (
              <>
                <h1 className={styles.statsTitle}>{user.elo}</h1>
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
