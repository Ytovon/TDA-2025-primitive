import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  darkModeButton,
  lightModeLogo,
  darkModeLogo,
  lightModeButton,
  barsBlack,
  barsWhite,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

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
          <div className={styles.fullNav}>
            <Link className={styles.navLink} to="/">
              <p>O nás</p>
            </Link>
            <Link className={styles.navLink} to="/Games">
              <p>Tréninkové úlohy</p>
            </Link>
            <button onClick={toggleDarkMode}>
              <img
                style={
                  darkMode
                    ? { transition: "0.5s ease-in-out" }
                    : { transition: "0.75s ease-in-out" }
                }
                className={styles.darkModeBtn}
                src={darkMode ? darkModeButton : lightModeButton}
              />
            </button>
            <p className={styles.playBtnContainer}>
              <Link className={styles.playBtn} to="/Game">
                Chci hrát!
              </Link>
            </p>
          </div>

          <button onClick={toggleMenu}>
            <img
              className={styles.openNav}
              src={darkMode ? barsBlack : barsWhite}
            />
          </button>
        </nav>
      </header>
      <div
        className={styles.menu}
        style={menuIsOpen ? { display: "flex" } : { display: "none" }}
      >
        <Link className={styles.navLink} to="/">
          <p>O nás</p>
        </Link>
        <Link className={styles.navLink} to="/Games">
          <p>Tréninkové úlohy</p>
        </Link>
        <button onClick={toggleDarkMode}>
          <img
            style={
              darkMode
                ? { transition: "0.5s ease-in-out" }
                : { transition: "0.75s ease-in-out" }
            }
            className={`${styles.darkModeBtn} ${styles.menuDarkModeBtn}`}
            src={darkMode ? darkModeButton : lightModeButton}
          />
        </button>
        <p className={styles.playBtnContainer}>
          <Link className={styles.playBtn} to="/Game">
            Chci hrát!
          </Link>
        </p>
      </div>
    </div>
  );
}
