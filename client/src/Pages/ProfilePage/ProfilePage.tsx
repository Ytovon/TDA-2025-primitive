import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import {
  historyRotateBlack,
  lightbulbBlue,
  modraZarovkaO,
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

export const ProfilePage = () => {
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
          <h2 className={styles.editTitle}>Úpravy</h2>
          <div className={styles.editSelects}>
            <div className={styles.editSelect}>
              <h3>Osobní informace</h3>
              <img src={userInfoErb} alt="" />
            </div>

            <div className={styles.editSelect}>
              <h3>Přizpůsobení</h3>
              <img src={userInfoBrush} alt="" />
            </div>
          </div>

          <Button text="Uložit změny" backgroundColor color="white" />
        </div>
        <div className={styles.editRight}>
          <div>
            <h3>Avatar</h3>
            <div
              className={styles.userImgContainer}
              style={{ backgroundColor: "#00000000" }}
            >
              <img className={styles.userImg} src={lightbulbBlue} alt="" />

              <div>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
              </div>
            </div>
          </div>
          <div>
            <h3>Zobrazovací řežim</h3>
            <div>
              <button>
                <p>Světlý</p>
                <img src="" alt="" />
              </button>
              <button>
                <p>Tmavý</p>
                <img src="" alt="" />
              </button>
              <button>
                <p>Adaptivní</p>
                <img src="" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
