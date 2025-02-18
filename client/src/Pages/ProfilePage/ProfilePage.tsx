import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import {
  lightbulbBlue,
  modraZarovkaO,
  profilePageRedImg,
  settingsButton,
  statsGames,
  statsTrophy,
  zarovkaFigma,
} from "../../assets/assets";

export const ProfilePage = () => {
  return (
    <div className={styles.ProfilePage}>
      <Header />

      <div className={styles.container}>
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
                src={settingsButton}
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
                Hry: <span>16</span>
              </p>
            </div>
            <div className={styles.stat}>
              <img className={styles.statImg} src={statsTrophy} />
              <p>
                Výhry: <span>2</span>
              </p>
            </div>
            <div className={styles.stat}>
              <img className={styles.statImg} src={statsTrophy} />
              <p>
                Prohry: <span>14</span>
              </p>
            </div>
            <div className={styles.stat}>
              <p>
                WR: <span>14%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
