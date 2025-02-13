import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  lightModeLogo,
  darkModeLogo,
  barsBlack,
  barsWhite,
  chevronDownBlack,
  chevronDownWhite,
  triangleDropdownBlack,
  triangleDropdownWhite,
  eloStar,
  numberOfUser,
  userImg,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [Registered, setRegistered] = useState(true);

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
          <Link to="/" onClick={() => setMenuIsOpen(false)}>
            <img
              className={styles.logo}
              src={darkMode ? lightModeLogo : darkModeLogo}
              alt="logo"
            />
          </Link>

          <div className={styles.links}>
            <div className={styles.dropdown}>
              <Link to="/game" className={`${styles.navLink} ${styles.link}`}>
                <p>Chci hrát</p>
                <img
                  className={styles.scrollableBtn}
                  src={darkMode ? chevronDownBlack : chevronDownWhite}
                  alt=""
                />
              </Link>
              <div className={styles.dropdownContent}>
                <img
                  className={styles.triangleDropdown}
                  src={darkMode ? triangleDropdownWhite : triangleDropdownBlack}
                  alt=""
                />
                <Link to="/game" className={`${styles.navLink} ${styles.link}`}>
                  Hrát online
                </Link>
                <Link to="/game" className={`${styles.navLink} ${styles.link}`}>
                  Hrát sólo
                </Link>
              </div>
            </div>
            <Link to="/games" className={`${styles.navLink} ${styles.link}`}>
              Tréninkové úlohy
            </Link>
            <Link to="/" className={`${styles.navLink} ${styles.link}`}>
              Leaderboard
            </Link>
          </div>

          <Link
            style={{ display: Registered ? "none" : "block" }}
            to="/login"
            className={styles.authLink}
          >
            Přihlásit se
          </Link>

          <div
            style={{ display: Registered ? "flex" : "none" }}
            className={styles.user}
          >
            <div className={styles.userContainer}>
              <p className={styles.username}>Jmeno</p>
              <div className={styles.userStats}>
                <div className={styles.userStat}>
                  <p>560</p>
                  <img src={eloStar} alt="" />
                </div>
                <div className={styles.userStat}>
                  <p>4</p>
                  <img src={numberOfUser} alt="" />
                </div>
              </div>
            </div>
            <div className={styles.dropdown}>
              <img className={styles.userImg} src={userImg} alt="user" />

              <div
                className={`${styles.dropdownContent} ${styles.dropdownContent2}`}
              >
                <img
                  className={styles.triangleDropdown}
                  src={darkMode ? triangleDropdownWhite : triangleDropdownBlack}
                  alt=""
                />
                <Link to="/" className={`${styles.navLink} ${styles.link}`}>
                  Přehled
                </Link>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => setRegistered(false)}
                  className={`${styles.navLink} ${styles.link}`}
                >
                  Odhlásit se
                </p>
              </div>
            </div>
          </div>

          <button className={styles.openMobileMenuBtn} onClick={toggleMenu}>
            <img
              className={styles.openMobileMenu}
              src={darkMode ? barsBlack : barsWhite}
              alt=""
            />
          </button>
        </div>
      </div>
      <div className={styles.mobileMenuWrapper}>
        <div
          className={`${styles.mobileMenu} ${menuIsOpen ? styles.open : ""}`}
        >
          <div className={styles.mobileMenuContent}>
            <Link
              to="/game"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Hrajte online
            </Link>
            <Link
              to="/games"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Tréninkové úlohy
            </Link>
            <Link
              to="/"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Leaderboard
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Přihlásit se
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
