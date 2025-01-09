import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={`${styles.block1} ${styles.block}`} />
        <div className={`${styles.block2} ${styles.block}`} />
        <div className={`${styles.block3} ${styles.block}`} />
        <div className={`${styles.block4} ${styles.block}`} />
        <div className={`${styles.block5} ${styles.block}`} />
      </div>
      <div className={styles.footerBottom}>
        <h2 className={styles.mainText}>Think different</h2>
        <p className={styles.teamName}>Primitive ++</p>
      </div>
    </footer>
  );
}
