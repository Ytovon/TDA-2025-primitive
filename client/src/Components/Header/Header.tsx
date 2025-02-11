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
      <div className={styles.headerContent}>
        <div className={styles.headerContainer}>
          <Link to="/">
            <img
              className={styles.logo}
              src={darkMode ? lightModeLogo : darkModeLogo}
              alt="logo"
            />
          </Link>

          <div className={styles.links}>
            <div className={styles.dropdown}>
              <Link to="/game" className={styles.navLink}>
                Chci hrát
              </Link>
              <div className={styles.dropdownContent}>
                <Link to="/game" className={styles.navLink}>
                  Hrát online
                </Link>
                <Link to="/game" className={styles.navLink}>
                  Hrát sólo
                </Link>
              </div>
            </div>
            <Link to="/games" className={styles.navLink}>
              Tréninkové úlohy
            </Link>
            <p className={styles.navLink}>Leaderboard</p>
          </div>

          <div className={styles.links}>
            <Link to="/login" className={styles.authLink}>
              Přihlásit se
            </Link>
          </div>

          <button onClick={toggleMenu}>
            <img
              className={styles.openMobileMenu}
              src={darkMode ? barsBlack : barsWhite}
              alt=""
            />
          </button>
        </div>
      </div>
      <div
        style={{ display: menuIsOpen ? "flex" : "none" }}
        className={styles.mobileMenu}
      >
        <Link to="/game" className={styles.navLink}>
          Hrajte online
        </Link>
        <Link to="/games" className={styles.navLink}>
          Tréninkové úlohy
        </Link>
        <Link to="/" className={styles.navLink}>
          Leaderboard
        </Link>
        <Link to="/login" className={styles.navLink}>
          Přihlásit se
        </Link>
      </div>
    </header>
  );
}
