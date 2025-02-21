import React from "react";
import styles from "./LeaderboardPage.module.css";
import Header from "../../Components/Header/Header";
import { lightbulbWhite, eloRed } from "../../assets/assets";

export const LeaderboardPage = () => {
  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.leaderboardPageWrapper}>
        <h1 className={styles.leaderboardTitle}>Žebříček</h1>
        <p className={styles.leaderboardText}>Probojuj se na vrchol!</p>
      </div>

      <table className={styles.leaderboardWrapper}>
        <tr>
          <td>
            <img src={lightbulbWhite} />
          </td>
          <td>YotWOn</td>
          <td>
            <div className={styles.tableElo}>
              <p>750</p>
              <img src={eloRed} alt="" />
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
