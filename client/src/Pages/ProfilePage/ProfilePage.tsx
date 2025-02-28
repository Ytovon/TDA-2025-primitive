import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import {
  historyRotateBlack,
  historyRotateWhite,
  lightbulbBlue,
  lightbulbWhite,
  lightModeButton,
  modraZarovkaO,
  moon,
  moonAdaptive,
  eloWhite,
  eloRed,
  settingFullWhite,
  settingsButton,
  statsGames,
  statsTrophy,
  statsTrophyWhite,
  userInfoBrush,
  userInfoBrushWhite,
  userInfoErb,
  userInfoErbWhite,
  handshakeWhite,
  handshakeBlack,
} from "../../assets/assets";
import { useDarkMode } from "../../Context/DarkModeContext";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../../Components/Footer/Footer";
import { useParams } from "react-router-dom";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";

export const ProfilePage = () => {
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [user, setUser] = useState<UserModel | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("var(--color1)");
  const [note, setNote] = useState(user?.note || "");
  const noteMaxLength = 120;

  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user?.avatarColor) {
      setSelectedColor(colorMap[user.avatarColor] || "var(--color1)");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!uuid) return;
    try {
      setUser((prev) => (prev ? { ...prev, note } : null)); // Aktualizace stavu uživatele
      setIsEditOpen(false);
    } catch (error) {
      setError("Nepodařilo se uložit změny.");
    }
  };

  const handleColorChange = async (colorIndex: number) => {
    setSelectedColor(colorMap[colorIndex]);
  };

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

  if (error) return <p>⚠️ Chyba: {error}</p>;
  if (!user) return <p>⏳ Načítání...</p>;
  return (
    <div className={styles.ProfilePage}>
      <Header />

      <div
        style={{ filter: isEditOpen ? "opacity(0.2)" : "opacity(1)" }}
        className={styles.container}
      >
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>
              <div className={styles.userImgContainer}>
                <img
                  style={{
                    backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                  }}
                  className={styles.userImg}
                  src={lightbulbWhite}
                  alt="profile Picture"
                />
              </div>
              <h1 className={styles.username}>{user.username}</h1>
              <p className={styles.joinDate}>
                Členem od{" "}
                <b>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Neznámé datum"}
                </b>
              </p>
              <button
                onClick={() => setIsEditOpen(true)}
                className={styles.setting}
              >
                <p className={styles.settingText}>Upravit</p>
                <img
                  className={styles.settingBtn}
                  src={settingFullWhite}
                  alt="setting"
                />
              </button>
            </div>

            <div className={styles.noteContainer}>
              <h3 className={styles.noteTitle}>Poznámka</h3>
              <textarea
                disabled
                className={styles.note}
                value={note}
                onChange={(e) => {
                  if (e.target.value.length <= 120) {
                    setNote(e.target.value);
                  }
                }}
                placeholder="Vložte poznámku..."
              />
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
              <h1 className={styles.statsTitle}>{Math.round(user.elo)}</h1>
              <img className={styles.statsImg} src={eloWhite} />
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <img className={styles.statImg} src={statsGames} />
                <p>
                  Hry:{" "}
                  <span className={styles.redBold}>
                    {user.losses + user.wins + user.draws}
                  </span>
                </p>
              </div>
              <div className={styles.stat}>
                <img
                  className={styles.statImg}
                  src={darkMode ? statsTrophyWhite : statsTrophy}
                />
                <p>
                  Výhry: <span className={styles.redBold}>{user.wins}</span>
                </p>
              </div>
              <div className={styles.stat}>
                <img
                  className={styles.statImg}
                  src={darkMode ? handshakeWhite : handshakeBlack}
                  alt=""
                />
                <p>
                  Remíza: <span className={styles.redBold}>{user.draws}</span>
                </p>
              </div>

              <div className={styles.stat}>
                <img
                  style={{ rotate: "180deg" }}
                  className={styles.statImg}
                  src={darkMode ? statsTrophyWhite : statsTrophy}
                />
                <p>
                  Prohry: <span className={styles.redBold}>{user.losses}</span>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  WR:{" "}
                  <span className={styles.redBold}>
                    {user.wins + user.draws + user.losses > 0
                      ? Math.round(
                          (user.wins / (user.wins + user.draws + user.losses)) *
                            100
                        ) || 0
                      : 0}
                    %
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.gameHistory}>
          <div className={styles.gameHistoryTitle}>
            <h2>Historie her</h2>
            <img
              className={styles.gameHistoryImg}
              src={darkMode ? historyRotateWhite : historyRotateBlack}
            />
          </div>
          <table className={styles.gameHistoryTable}>
            <tr>
              <td>Hráči</td>
              <td>Výsledek</td>
              <td>Doba trvání</td>
              <td>Datum</td>
            </tr>
          </table>
        </div>
      </div>

      <div
        style={{
          display: isEditOpen ? "flex" : "none",
          border: darkMode ? "none" : "2px solid black",
        }}
        className={styles.edit}
      >
        <div className={styles.editLeft}>
          <div>
            <h2 className={styles.editTitle}>Úpravy</h2>
            <div></div>
            <div className={styles.editSelects}>
              <button
                style={{
                  backgroundColor: editMode
                    ? "var(---color-background-light)"
                    : "var(--color-background-secondary)",
                }}
                onClick={() => setEditMode(false)}
                className={styles.editSelect}
              >
                <h3>Osobní informace</h3>
                <img src={darkMode ? userInfoErbWhite : userInfoErb} alt="" />
              </button>

              <button
                style={{
                  backgroundColor: editMode
                    ? "var(--color-background-secondary)"
                    : "var(---color-background-light)",
                }}
                onClick={() => setEditMode(true)}
                className={styles.editSelect}
              >
                <h3>Přizpůsobení</h3>
                <img
                  src={darkMode ? userInfoBrushWhite : userInfoBrush}
                  alt=""
                />
              </button>
            </div>
          </div>
          <div className={styles.saveChanges}>
            <Button
              onClick={() => {
                handleSaveChanges();
                setIsEditOpen(false);
              }}
              text="Uložit změny"
              backgroundColor
              color="white"
              width="130px"
            />
          </div>
        </div>
        <div
          style={{ display: editMode ? "none" : "block" }}
          className={styles.editRight}
        >
          <div className={styles.editInputContainer}>
            <div className={styles.editInputTitle1}>
              <h4 className={styles.editInputTitle}>Poznámka</h4>
              <p className={styles.characterLeft}>
                <p className={styles.characterLeft}>
                  Zbývá {noteMaxLength - note.length} znaků
                </p>
              </p>
            </div>
            <textarea
              style={{ height: "50px" }}
              className={styles.note}
              value={note}
              onChange={(e) => {
                if (e.target.value.length <= noteMaxLength) {
                  setNote(e.target.value);
                }
              }}
              placeholder="Vložte poznámku..."
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Uživatelské jméno</h4>
            <input
              className={styles.editInput}
              type="text"
              placeholder="Uživatelské jméno"
              value={user.username}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Email</h4>
            <input
              className={styles.editInput}
              type="email"
              placeholder="example@email.com"
              value={user.email}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Heslo</h4>
            <input
              className={styles.editInput}
              type="password"
              value={"nevimk"}
            />
          </div>
          <div className={styles.saveChangesResponsive}>
            <Button
              onClick={() => {
                handleSaveChanges();
                setIsEditOpen(false);
              }}
              text="Uložit změny"
              backgroundColor
              color="white"
              width="130px"
            />
          </div>
        </div>
        <div
          style={{ display: editMode ? "block" : "none" }}
          className={styles.editRight}
        >
          <div
            style={{
              paddingBottom: "25px",
              borderBottom: "1px solid rgb(184, 184, 184)",
            }}
            className={styles.editRightSection}
          >
            <h3 className={styles.editRightTitle}>Avatar</h3>
            <div
              className={styles.changeColorPreview}
              style={{ backgroundColor: "#00000000" }}
            >
              <img
                style={{ backgroundColor: selectedColor }}
                className={styles.userImgEdit}
                src={lightbulbWhite}
                alt=""
              />

              <div className={styles.changeColorContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    style={{ backgroundColor: colorMap[index] }}
                    className={styles.changeColor}
                    onClick={() => handleColorChange(index)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: "20px" }}
            className={styles.editRightSection}
          >
            <h3 className={styles.editRightTitle}>Zobrazovací řežim</h3>
            <div className={styles.changeDarkmodeContainer}>
              <button
                onClick={disableDarkMode}
                style={{ backgroundColor: "white" }}
                className={styles.changeDarkMode}
              >
                <img
                  className={styles.changeDarkmodeImg}
                  src={lightModeButton}
                  alt=""
                />
                <p>Světlý</p>
              </button>
              <button
                onClick={enableDarkMode}
                style={{ backgroundColor: "black", color: "white" }}
                className={styles.changeDarkMode}
              >
                <img
                  style={{
                    width: "13px",
                  }}
                  className={styles.changeDarkmodeImg}
                  src={moon}
                  alt=""
                />
                <p>Tmavý</p>
              </button>
            </div>
            <div className={styles.saveChangesResponsive}>
              <Button
                onClick={() => {
                  handleSaveChanges();
                  setIsEditOpen(false);
                }}
                text="Uložit změny"
                backgroundColor
                color="white"
                width="130px"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer landingPageFooter={false} />
    </div>
  );
};
