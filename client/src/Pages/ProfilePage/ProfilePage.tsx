import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { Link } from "react-router-dom";
import {
  historyRotateBlack,
  historyRotateWhite,
  lightbulbWhite,
  lightModeButton,
  moon,
  eloWhite,
  settingFullWhite,
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
import { UserModel } from "../../Model/UserModel";
import { UserApiClient } from "../../API/UserApi";
import { useDarkMode } from "../../Context/DarkModeContext";
import { Footer } from "../../Components/Footer/Footer";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { MatchmakingGame } from "../../Model/MatchmakingGameModel";
import BlinkingEyesSVG from "../../Components/Animation/lightbulb";

export const ProfilePage = () => {
  const { user, setGlobalUser } = useAuth();
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [note, setNote] = useState(user?.note || "");
  const noteMaxLength = 120;

  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [userHistory, setUserHistory] = useState<MatchmakingGame[] | null>(
    null
  );
  const [usersData, setUsersData] = useState<Record<string, UserModel>>({});

  const [modalImage, setModalImage] = useState<string>("");

  useEffect(() => {
    // Define async function inside useEffect
    const fetchData = async () => {
      if (!user?.uuid) return; // guard if user or uuid missing

      try {
        // Fetch game history
        const history = await UserApiClient.getGameHistoryByUUID(user.uuid);
        setUserHistory(history);

        // Extract unique UUIDs from the history (playerX and playerO)
        const uuids: string[] = [
          ...new Set([
            ...history.map((game) => game.playerX),
            ...history.map((game) => game.playerO),
          ]),
        ];

        // Fetch user data for the unique UUIDs
        const usersData: Record<string, UserModel> =
          await UserApiClient.getUsersByUUIDs(uuids);

        console.log(usersData["7ca29102-9fb5-463d-b380-cfef63e0533f"]);

        setUsersData(usersData);
      } catch (error: any) {
        console.error("Error loading user history or users data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!uuid) return;
    try {
      setGlobalUser({
        uuid: user?.uuid ?? "",
        username: user?.username ?? "",
        email: user?.email ?? "",
        password: user?.password ?? "",
        isAdmin: user?.isAdmin ?? false,
        elo: user?.elo ?? 0,
        wins: user?.wins ?? 0,
        draws: user?.draws ?? 0,
        losses: user?.losses ?? 0,
        lastLogin: user?.lastLogin ?? "",
        avatarColor: selectedColor ?? 1,
        note: user?.note ?? "",
      });

      await UserApiClient.updateUserByUUID(
        user?.uuid ?? "",
        user as Partial<UserModel>
      );

      setIsEditOpen(false);
    } catch (error) {
      setError("Nepodařilo se uložit změny.");
    }
  };

  const handleColorChange = async (colorIndex: number) => {
    setSelectedColor(colorIndex);
  };

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

  if (!user)
    return (
      <div className="loading">
        <p>Stránku pro Vás načítáme...</p>
        <BlinkingEyesSVG isRedPlayer={true} OnMove={true} />
      </div>
    );
  return (
    <div className={styles.ProfilePage}>
      <Header />

      {modalImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setModalImage("")}
        >
          <img
            src={modalImage}
            alt="Zvětšený obrázek"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }}
          />
        </div>
      )}

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
                  backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                }}
              >
                <img
                  style={{
                    backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                  }}
                  className={styles.userImg}
                  src={lightbulbWhite}
                  alt="profile Picture"
                />
              </div>
              <h1
                className={styles.username}
                style={{
                  backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                }}
              >
                {user.username}
              </h1>
              <p className={styles.joinDate}>
                Členem od{" "}
                <b>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("cs-CZ")
                    : "Neznámé datum"}
                </b>
              </p>
              <button
                onClick={() => setIsEditOpen(true)}
                className={styles.setting}
                style={{
                  backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
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
            <tr className={styles.gameHistoryHeading}>
              <td>Vítěz</td>
              <td>Poražený</td>
              <td>Datum</td>
              <td>Herní plocha</td>
            </tr>

            <tbody>
              {userHistory?.map((game, index) => (
                <tr key={index}>
                  <td>
                    {game.winner && usersData[game.winner] ? (
                      <Link to={`/profile/${usersData[game.winner].uuid}`}>
                        {usersData[game.winner].username}
                      </Link>
                    ) : (
                      <span>Remíza</span>
                    )}
                  </td>
                  <td>
                    {game.loser && usersData[game.loser] ? (
                      <Link to={`/profile/${usersData[game.loser].uuid}`}>
                        {usersData[game.loser].username}
                      </Link>
                    ) : (
                      <span>Remíza</span>
                    )}
                  </td>
                  <td>{new Date(game.endedAt).toLocaleString("cs-CZ")}</td>
                  <td>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        setModalImage(`data:image/png;base64,${game.bitmap}`);
                      }}
                    >
                      {" "}
                      Náhled
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
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
                style={{ backgroundColor: colorMap[selectedColor] }}
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
