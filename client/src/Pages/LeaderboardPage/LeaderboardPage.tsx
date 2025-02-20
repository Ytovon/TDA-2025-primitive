import React from "react";
import styles from "./LeaderboardPage.module.css";
import Header from "../../Components/Header/Header";

export const LeaderboardPage = () => {
  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.leaderboardWrapper}>
        <h1 className={styles.leaderboardTitle}>Žebříček</h1>
      </div>
    </div>
  );
};
