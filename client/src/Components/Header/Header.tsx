import React, { useState } from "react";
import { Link } from "react-router-dom";
import lightModeLogo from "../../assets/images/Think-different-Academy_LOGO_oficialni_1.png";
import darkModeLogo from "../../assets/images/Think-different-Academy_LOGO_oficialni_1_dark-mode.png";
import darkModeButton from "../../assets/images/Primary.svg";
import styles from "./Header.module.css";

export default function Header() {
  const [darkMode, setColorMode] = useState(true);

  const changePageColor = () => {
    setColorMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  return (
    <div className={styles.headerBackground}>
      <header className={styles.header}>
        <img
          className={styles.logo}
          src={darkMode ? lightModeLogo : darkModeLogo}
          alt="logo"
        />

        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/">
            <p>O nás</p>
          </Link>
          <Link className={styles.navLink} to="/">
            <p>Tréninkové úlohy</p>
          </Link>
          <button onClick={changePageColor}>
            <img className={styles.darkModeBtn} src={darkModeButton} />
          </button>
          <p>
            <Link className={styles.playBtn} to="/Game">
              Chci hrát!
            </Link>
          </p>
        </nav>
      </header>
    </div>
  );
}
