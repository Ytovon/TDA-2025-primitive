import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  lightModeLogo,
  darkModeLogo,
  barsBlack,
  barsWhite,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [Registered, setRegistered] = useState(false);

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1050 && menuIsOpen) {
        setMenuIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuIsOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img
          className={styles.logo}
          src={darkMode ? lightModeLogo : darkModeLogo}
          alt="logo"
        />

        <div className={styles.links}>
          <Link to="/game" className={styles.navLink}>
            Hrát
          </Link>
          <Link to="/games" className={styles.navLink}>
            Tréninkové úlohy
          </Link>
          <p className={styles.navLink}>Leaderboard</p>
        </div>

        <div className={styles.links}>
          <Link to="/register" className={styles.authLink}>
            Přihlásit se
          </Link>
        </div>
      </div>

      {menuIsOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/play-online" className={styles.navLink}>
            Hrajte online
          </Link>
          <Link to="/training-tasks" className={styles.navLink}>
            Tréninkové úlohy
          </Link>
          <Link to="/login" className={styles.authLink}>
            Přihlásit se
          </Link>
          <Link to="/register" className={styles.authLink}>
            Zaregistrovat se
          </Link>
        </div>
      )}
    </header>
  );
}
