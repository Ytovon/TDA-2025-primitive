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
import { Footer } from "../../Components/Footer/Footer";
import { useParams } from "react-router-dom";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";

export const ProfilePage = () => {
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [user, setUser] = useState<UserModel | null>();
  const [tmpUser, setTmpUser] = useState<UserModel | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const noteMaxLength = 120;

  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();

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

  const handleSaveChanges = async () => {
    if (!uuid) return;
    try {
      await UserApiClient.updateUserByUUID(user?.uuid ?? "", {
        username: tmpUser?.username ?? "",
        email: tmpUser?.email ?? "",
        password: tmpUser?.password ?? "",
        AvatarColor: tmpUser?.AvatarColor ?? 1,
        note: tmpUser?.note ?? "",
      });

      setUser(tmpUser);
      setIsEditOpen(false);
    } catch (error) {
      setError("Nepodařilo se uložit změny.");
    }
  };

  const openEditMode = () => {
    setIsEditOpen(true);
    setTmpUser(user ?? null);
  };

  const handlePasswordChange = async (newPassword: string) => {
    setTmpUser((prev) => (prev ? { ...prev, password: newPassword } : null)); // Aktualizace stavu uživatele
  };
  const handleEmailChange = async (newEmail: string) => {
    setTmpUser((prev) => (prev ? { ...prev, email: newEmail } : null)); // Aktualizace stavu uživatele
  };
  const handleUsernameChange = async (newUsername: string) => {
    setTmpUser((prev) => (prev ? { ...prev, username: newUsername } : null)); // Aktualizace stavu uživatele
  };
  const handleColorChange = async (colorIndex: number) => {
    setTmpUser((prev) => (prev ? { ...prev, AvatarColor: colorIndex } : null)); // Aktualizace stavu uživatele
  };

  const handleNoteUpdate = async (note: string) => {
    if (tmpUser) {
      console.log("Updating note in tmpUser:", note);
      setTmpUser({ ...tmpUser, note });
    }
  };

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

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
              <div
                className={styles.userImgContainer}
                style={{
                  backgroundColor: colorMap[user?.AvatarColor ?? 1],
                }}
              >
                <img
                  style={{
                    backgroundColor: colorMap[user?.AvatarColor ?? 1],
                  }}
                  className={styles.userImg}
                  src={lightbulbWhite}
                  alt="profile Picture"
                />
              </div>
              <h1
                className={styles.username}
                style={{
                  backgroundColor: colorMap[user?.AvatarColor ?? 1],
                }}
              >
                {user?.username}
              </h1>
              <p className={styles.joinDate}>
                Členem od{" "}
                <b>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Neznámé datum"}
                </b>
              </p>
              <button
                onClick={() => openEditMode()}
                className={styles.setting}
                style={{
                  backgroundColor: colorMap[user?.AvatarColor ?? 1],
                }}
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
                value={user?.note}
                placeholder="Text poznámky..."
              />
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
              <h1 className={styles.statsTitle}>
                {user?.elo ? Math.round(user?.elo) : ""}
              </h1>
              <img className={styles.statsImg} src={eloWhite} />
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <img className={styles.statImg} src={statsGames} />
                <p>
                  Hry:{" "}
                  <span className={styles.redBold}>
                    {(user?.losses ?? 0) +
                      (user?.wins ?? 0) +
                      (user?.draws ?? 0)}
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
                  Remíza: <span className={styles.redBold}>{user?.draws}</span>
                </p>
              </div>

              <div className={styles.stat}>
                <img
                  style={{ rotate: "180deg" }}
                  className={styles.statImg}
                  src={darkMode ? statsTrophyWhite : statsTrophy}
                />
                <p>
                  Prohry: <span className={styles.redBold}>{user?.losses}</span>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  WR:{" "}
                  <span className={styles.redBold}>
                    {(user?.losses ?? 0) +
                      (user?.wins ?? 0) +
                      (user?.draws ?? 0) >
                    0
                      ? Math.round(
                          ((user?.wins ?? 0) /
                            ((user?.losses ?? 0) +
                              (user?.wins ?? 0) +
                              (user?.draws ?? 0))) *
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
                  Zbývá {noteMaxLength - (user?.note ?? "").length} znaků
                </p>
              </p>
            </div>
            <textarea
              style={{ height: "50px" }}
              className={styles.note}
              value={tmpUser?.note}
              placeholder="Vložte poznámku..."
              onChange={(e) => {
                handleNoteUpdate(e.target.value);
              }}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Uživatelské jméno</h4>
            <input
              className={styles.editInput}
              type="text"
              placeholder="Uživatelské jméno"
              value={tmpUser?.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Email</h4>
            <input
              className={styles.editInput}
              type="email"
              placeholder="example@email.com"
              value={user?.email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Heslo</h4>
            <input
              className={styles.editInput}
              type="password"
              onChange={(e) => handlePasswordChange(e.target.value)}
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
                style={{ backgroundColor: colorMap[tmpUser?.AvatarColor ?? 1] }}
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
