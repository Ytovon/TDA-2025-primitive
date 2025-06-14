import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserSlash,
  faCalendar,
  faLayerGroup,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
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

export const ProfilePage = () => {
  const emptyUser: UserModel = {
    username: "",
    email: "",
    password: "",
    elo: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    isAdmin: false,
  };

  const { user, setGlobalUser } = useAuth();
  const [userToDisplay, setUserToDisplay] = useState<UserModel>(emptyUser);
  const { uuid } = useParams<{ uuid: string }>(); // Získání UUID z URL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const noteMaxLength = 120;

  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [userHistory, setUserHistory] = useState<MatchmakingGame[] | null>(
    null
  );
  const [usersData, setUsersData] = useState<Record<string, UserModel>>({});
  const [modalImage, setModalImage] = useState<string>("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!uuid) return;

      try {
        const userToDisplay =
          uuid !== user?.uuid ? await UserApiClient.getUserByUUID(uuid) : user;

        // Zajisti, že userToDisplay je objekt, ne string
        if (typeof userToDisplay !== "string" && userToDisplay?.uuid) {
          setUserToDisplay(userToDisplay);

          const history = await UserApiClient.getGameHistoryByUUID(
            userToDisplay.uuid
          );
          setUserHistory(history);

          const uniqueUUIDs = [
            ...new Set([
              ...history.map((game) => game.playerX),
              ...history.map((game) => game.playerO),
            ]),
          ];

          const usersData = await UserApiClient.getUsersByUUIDs(uniqueUUIDs);
          setUsersData(usersData);
        }
      } catch (error: any) {
        console.error("Error loading user or game data:", error);
      }
    };
    fetchAllData();
  }, [user, uuid]);

  const handleSaveChanges = async () => {
    if (!uuid) return;
    try {
      setGlobalUser({
        ...(userToDisplay ?? {}),
        updatedAt: new Date(),
      });

      await UserApiClient.updateUserByUUID(
        userToDisplay?.uuid ?? "",
        userToDisplay as Partial<UserModel>
      );

      setIsEditOpen(false);
    } catch (error) {
      setError("Nepodařilo se uložit změny.");
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
                  backgroundColor: colorMap[userToDisplay?.AvatarColor ?? 1], // Pokud není AvatarColor, použije se 1
                }}
              >
                <img
                  style={{
                    backgroundColor: colorMap[userToDisplay?.AvatarColor ?? 1], // Pokud není AvatarColor, použije se 1
                  }}
                  className={styles.userImg}
                  src={lightbulbWhite}
                  alt="profile Picture"
                />
              </div>
              <h1
                className={styles.username}
                style={{
                  backgroundColor: colorMap[userToDisplay?.AvatarColor ?? 1], // Pokud není AvatarColor, použije se 1
                }}
              >
                {userToDisplay.username}
              </h1>
              <p className={styles.joinDate}>
                Členem od{" "}
                <b>
                  {userToDisplay?.createdAt
                    ? new Date(userToDisplay.createdAt).toLocaleDateString(
                        "cs-CZ"
                      )
                    : "Neznámé datum"}
                </b>
              </p>
              {user && uuid === (user.uuid ?? "") ? (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className={styles.setting}
                  style={{
                    backgroundColor: colorMap[userToDisplay?.AvatarColor ?? 1], // Pokud není AvatarColor, použije se 1
                  }}
                >
                  <p className={styles.settingText}>Upravit</p>
                  <img
                    className={styles.settingBtn}
                    src={settingFullWhite}
                    alt="setting"
                  />
                </button>
              ) : (
                <button className={styles.setting}></button>
              )}
            </div>

            <div className={styles.noteContainer}>
              <h3 className={styles.noteTitle}>Poznámka</h3>
              <textarea
                disabled
                className={styles.note}
                value={userToDisplay.note}
                placeholder="Vložte poznámku..."
              />
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
              <h1 className={styles.statsTitle}>
                {Math.floor(userToDisplay.elo)}
              </h1>
              <img className={styles.statsImg} src={eloWhite} />
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <img className={styles.statImg} src={statsGames} />
                <p>
                  Hry:{" "}
                  <span className={styles.redBold}>
                    {userToDisplay.losses +
                      userToDisplay.wins +
                      userToDisplay.draws}
                  </span>
                </p>
              </div>
              <div className={styles.stat}>
                <img
                  className={styles.statImg}
                  src={darkMode ? statsTrophyWhite : statsTrophy}
                />
                <p>
                  Výhry:{" "}
                  <span className={styles.redBold}>{userToDisplay.wins}</span>
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
                  <span className={styles.redBold}>{userToDisplay.draws}</span>
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
                  <span className={styles.redBold}>{userToDisplay.losses}</span>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  WR:{" "}
                  <span className={styles.redBold}>
                    {userToDisplay.wins +
                      userToDisplay.draws +
                      userToDisplay.losses >
                    0
                      ? Math.round(
                          (userToDisplay.wins /
                            (userToDisplay.wins +
                              userToDisplay.draws +
                              userToDisplay.losses)) *
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
            <thead className={styles.gameHistoryHeading}>
              <tr>
                <th>
                  <FontAwesomeIcon icon={faUser} /> Vítěz
                </th>
                <th>
                  <FontAwesomeIcon icon={faUserSlash} /> Poražený
                </th>
                <th>
                  <FontAwesomeIcon icon={faCalendar} /> Datum
                </th>
                <th>
                  <FontAwesomeIcon icon={faLayerGroup} /> Herní plocha
                </th>
              </tr>
            </thead>

            <tbody>
              {userHistory?.map((game, index) => (
                <tr key={index}>
                  <td>
                    {game.winner && usersData[game.winner] ? (
                      <Link to={`/profile/${usersData[game.winner].uuid}`}>
                        {usersData[game.winner].username}
                      </Link>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {game.loser && usersData[game.loser] ? (
                      <Link to={`/profile/${usersData[game.loser].uuid}`}>
                        {usersData[game.loser].username}
                      </Link>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {new Date(game.endedAt).toLocaleString("cs-CZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalImage(`data:image/png;base64,${game.bitmap}`);
                    }}
                  >
                    <a href="">
                      {" "}
                      <FontAwesomeIcon icon={faEye} />
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
              onClick={async () => await handleSaveChanges()}
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
                  Zbývá {noteMaxLength - (userToDisplay.note?.length ?? 0)}{" "}
                  znaků
                </p>
              </p>
            </div>
            <textarea
              style={{ height: "50px" }}
              className={styles.note}
              value={userToDisplay.note}
              onChange={(e) => {
                if (e.target.value.length <= noteMaxLength) {
                  setUserToDisplay({
                    ...userToDisplay,
                    note: e.target.value,
                  });
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
              value={userToDisplay.username}
            />
          </div>

          <div className={styles.editInputContainer}>
            <h4 className={styles.editInputTitle}>Email</h4>
            <input
              className={styles.editInput}
              type="email"
              placeholder="example@email.com"
              value={userToDisplay.email}
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
                style={{
                  backgroundColor: colorMap[userToDisplay.AvatarColor ?? 1],
                }}
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
                    onClick={() =>
                      setUserToDisplay({ ...userToDisplay, AvatarColor: index })
                    }
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
          </div>
        </div>
      </div>

      <Footer landingPageFooter={false} />
    </div>
  );
};
