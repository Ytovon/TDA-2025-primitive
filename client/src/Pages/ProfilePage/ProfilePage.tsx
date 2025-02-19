import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import {
  historyRotateBlack,
  lightbulbBlue,
  lightbulbWhite,
  lightModeButton,
  modraZarovkaO,
  moon,
  moonAdaptive,
  profilePageRedImg,
  settingFullWhite,
  settingsButton,
  statsGames,
  statsTrophy,
  userInfoBrush,
  userInfoErb,
  zarovkaFigma,
} from "../../assets/assets";
import { userInfo } from "node:os";
import { useDarkMode } from "../../DarkModeContext";
import { Link, useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#91bedc");
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className={styles.ProfilePage}>
      <Header />

      <div className={styles.container}>
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>
              <div className={styles.userImgContainer}>
                <img
                  className={styles.userImg}
                  src={lightbulbBlue}
                  alt="profile Picture"
                />
              </div>
              <h1 className={styles.username}>Username</h1>
              <p className={styles.joinDate}>
                Členem od <b>16. 02. 2025</b>
              </p>
              <div className={styles.setting}>
                <p>Upravit</p>
                <img
                  className={styles.settingBtn}
                  src={settingFullWhite}
                  alt="setting"
                />
              </div>
            </div>

            <div className={styles.noteContainer}>
              <h3 className={styles.noteTitle}>Poznámka</h3>
              <input
                value={"Jsem average borec co nemá život."}
                className={styles.note}
                type="text"
                disabled
              />
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
              <h1 className={styles.statsTitle}>420</h1>
              <img className={styles.statsImg} src={profilePageRedImg} />
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <img className={styles.statImg} src={statsGames} />
                <p>
                  Hry: <span className={styles.redBold}>16</span>
                </p>
              </div>
              <div className={styles.stat}>
                <img className={styles.statImg} src={statsTrophy} />
                <p>
                  Výhry: <span className={styles.redBold}>2</span>
                </p>
              </div>
              <div className={styles.stat}>
                <img
                  style={{ rotate: "180deg" }}
                  className={styles.statImg}
                  src={statsTrophy}
                />
                <p>
                  Prohry: <span className={styles.redBold}>14</span>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  WR: <span className={styles.redBold}>14%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.gameHistory}>
          <div className={styles.gameHistoryTitle}>
            <h2>Historie her</h2>
            <img className={styles.gameHistoryImg} src={historyRotateBlack} />
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

      <div className={styles.edit}>
        <div className={styles.editLeft}>
          <div>
            <h2 className={styles.editTitle}>Úpravy</h2>
            <div className={styles.editSelects}>
              <button
                onClick={() => setEditMode(false)}
                className={styles.editSelect}
              >
                <h3>Osobní informace</h3>
                <img src={userInfoErb} alt="" />
              </button>

              <button
                onClick={() => setEditMode(true)}
                className={styles.editSelect}
              >
                <h3>Přizpůsobení</h3>
                <img src={userInfoBrush} alt="" />
              </button>
            </div>
          </div>

          <Button text="Uložit změny" backgroundColor color="white" />
        </div>
        <div
          style={{ display: editMode ? "none" : "block" }}
          className={styles.editRight}
        >
          <div>
            <h5>Poznámka</h5>
            <input type="text" />
          </div>

          <div>
            <h5>Uživatelské jméno</h5>
            <input type="text" />
          </div>

          <div>
            <h5>Email</h5>
            <input type="text" />
          </div>

          <div>
            <h5>Heslo</h5>
            <input type="text" />
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
                <button
                  style={{ backgroundColor: "var(--secondary1)" }}
                  className={styles.changeColor}
                  onClick={() => handleColorChange("var(--secondary1)")}
                ></button>
                <button
                  style={{ backgroundColor: "var(--secondary2)" }}
                  className={styles.changeColor}
                  onClick={() => handleColorChange("var(--secondary2)")}
                ></button>
                <button
                  style={{ backgroundColor: "var(--secondary3)" }}
                  className={styles.changeColor}
                  onClick={() => handleColorChange("var(--secondary3)")}
                ></button>
                <button
                  style={{ backgroundColor: "var(--secondary4)" }}
                  className={styles.changeColor}
                  onClick={() => handleColorChange("var(--secondary4)")}
                ></button>
                <button
                  style={{ backgroundColor: "var(--secondary5)" }}
                  className={styles.changeColor}
                  onClick={() => handleColorChange("var(--secondary5)")}
                ></button>
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
              <button
                style={{ backgroundColor: "#395A9A", color: "white" }}
                className={styles.changeDarkMode}
              >
                <img
                  className={styles.changeDarkmodeImg}
                  src={moonAdaptive}
                  alt=""
                />
                <p>Adaptivní</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
