import React from "react";
import styles from "./Footer.module.css";
import { useDarkMode } from "../../Context/DarkModeContext";
import { footerLogoWhite, footerLogoBlack } from "../../assets/assets";

interface FooterProps {
  landingPageFooter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ landingPageFooter = true }) => {
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className={styles.footer}
      style={
        landingPageFooter ? { paddingTop: "150px" } : { paddingTop: "50px" }
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
        <img
          className={styles.footerLogo}
          src={darkMode ? footerLogoWhite : footerLogoBlack}
          alt="Think Different Academy"
        />
        <div className={styles.copyright}>
          <p className={styles.teamName}> Primitive++</p>
          <p>© {currentYear} Think different Academy </p>
        </div>
      </div>
    </footer>
  );
};
