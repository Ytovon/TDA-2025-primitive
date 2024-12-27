import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  darkModeButton,
  lightModeLogo,
  darkModeLogo,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={styles.headerBackground}>
      <header className={styles.header}>
        <Link to="/">
          <img
            className={styles.logo}
            src={darkMode ? lightModeLogo : darkModeLogo}
            alt="logo"
          />
        </Link>

        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/">
            <p>O nás</p>
          </Link>
          <Link className={styles.navLink} to="/Games">
            <p>Tréninkové úlohy</p>
          </Link>
          <button onClick={toggleDarkMode}>
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
