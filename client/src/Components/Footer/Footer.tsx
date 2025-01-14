import React from "react";
import styles from "./Footer.module.css";

interface FooterProps {
  landingPageFooter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ landingPageFooter = true }) => {
  const currentYear = new Date().getFullYear();

  const className = landingPageFooter ? "" : "smallFooter";

  return (
    <footer
      className={styles.footer}
      style={
        landingPageFooter ? { paddingTop: "100px" } : { paddingTop: "50px" }
      }
    >
      <div
        className={`${styles.footerTop} ${
          landingPageFooter ? styles.bigFooter : styles.smallFooter
        }`}
      >
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
};
