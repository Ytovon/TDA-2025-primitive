import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import Header from "../../Components/Header/Header";
import { profilePageRedImg, settingsButton } from "../../assets/assets";

export const ProfilePage = () => {
  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.profilePageContainer}>
        <div className={styles.profile}>
          <div className={styles.profileMenu}>
            <img src="" alt="" />
            <h3 className={styles.profileTitle}>Jmeno</h3>
            <div className={styles.profileSettings}>
              <p>upravit</p>
              <img
                className={styles.profileMenuImg}
                src={settingsButton}
                alt="settings"
              />
            </div>
          </div>
          <div>
            <h5>Poznámka</h5>
            <input type="text" />
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statsMenu}>
            <h2 className={styles.statsTitle}>420</h2>
            <img
              className={styles.statsImg}
              src={profilePageRedImg}
              alt="trophy"
            />
          </div>
          <div>
            <div>
              <img src="" alt="" />
              <p>Hry</p>
              <p>16</p>
            </div>
            <div>
              <img src="" alt="" />
              <p>Výhry:</p>
              <p>2</p>
            </div>
            <div>
              <img src="" alt="" />
              <p>Prohry:</p>
              <p>14</p>
            </div>
            <div>
              <p>WR:</p>
              <p>14%</p>
            </div>
          </div>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};
