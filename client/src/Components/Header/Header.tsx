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
  arrowBlack,
  arrowWhite,
  chevronUpWhite,
  chevronUpBlack,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function Header() {
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [Registered, setRegistered] = useState(true);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [mobileUserDropdown, setmobileUserDropdown] = useState(false);

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev);
  };

  const handleMobileDropdown = () => {
    setMobileDropdown((prev) => !prev);
  };

  const handleMobileUserDropdown = () => {
    setmobileUserDropdown((prev) => !prev);
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
              src={darkMode ? darkModeLogo : lightModeLogo}
              alt="logo"
            />
          </Link>

          <div className={styles.links}>
            <div className={styles.dropdown}>
              <Link to="/game" className={`${styles.navLink} ${styles.link}`}>
                <p>Chci hrát</p>
                <img
                  className={styles.scrollableBtn}
                  src={darkMode ? chevronDownWhite : chevronDownBlack}
                  alt=""
                />
              </Link>
              <div className={styles.dropdownContent}>
                <img
                  className={styles.triangleDropdown}
                  src={darkMode ? triangleDropdownBlack : triangleDropdownWhite}
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
            <Link
              to="/leaderboard"
              className={`${styles.navLink} ${styles.link}`}
            >
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
                  src={darkMode ? triangleDropdownBlack : triangleDropdownWhite}
                  alt=""
                />
                <Link
                  to="/userPage/user1"
                  className={`${styles.navLink} ${styles.link}`}
                >
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
              src={darkMode ? barsWhite : barsBlack}
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
            <button
              onClick={handleMobileUserDropdown}
              className={`${styles.mobileLinkDropdownContainer}`}
            >
              <div className={styles.mobileUserContainer}>
                <img
                  className={styles.mobileUserImg}
                  src={userImg}
                  alt="user"
                />
                <div className={styles.mobileUser}>
                  <p
                    style={{ fontSize: "1.375rem" }}
                    className={styles.mobileUsername}
                  >
                    Jmeno
                  </p>
                  <div className={styles.mobileUserStats}>
                    <div className={styles.mobileUserStat}>
                      <p>560</p>
                      <img src={eloStar} alt="" />
                    </div>
                    <div className={styles.mobileUserStat}>
                      <p>4</p>
                      <img src={numberOfUser} alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <img
                style={{
                  display: mobileUserDropdown ? "block" : "none",
                }}
                className={styles.pointerToDropdown}
                src={darkMode ? arrowWhite : arrowBlack}
                alt=""
              />
              <div
                style={{
                  display: mobileUserDropdown ? "flex" : "none",
                }}
                className={styles.mobileLinkDropdown}
              >
                <Link
                  to="/userpage/user1"
                  className={`${styles.link} ${styles.mobileLink}`}
                >
                  Přehled
                </Link>
                <button
                  onClick={() => setRegistered(false)}
                  className={`${styles.link} ${styles.mobileLink}`}
                >
                  Odhlásit se
                </button>
              </div>
            </button>

            <div className={styles.mobileLinkDropdownContainer}>
              <button
                onClick={handleMobileDropdown}
                className={` ${styles.link} ${styles.mobileDropdownTitle}`}
              >
                <p className={` ${styles.link}`}>Hrajte piškvorky</p>
                <img
                  style={{ width: "18px" }}
                  src={
                    mobileDropdown
                      ? darkMode
                        ? chevronUpWhite
                        : chevronUpBlack
                      : darkMode
                      ? chevronDownWhite
                      : chevronDownBlack
                  }
                  alt=""
                />
              </button>

              <img
                style={{
                  display: mobileDropdown ? "block" : "none",
                }}
                className={styles.pointerToDropdown}
                src={darkMode ? arrowWhite : arrowBlack}
                alt=""
              />

              <div
                style={{
                  display: mobileDropdown ? "flex" : "none",
                }}
                className={styles.mobileLinkDropdown}
              >
                <Link
                  className={`${styles.link} ${styles.mobileLink}`}
                  to="/game"
                >
                  Hrát online
                </Link>
                <Link
                  className={`${styles.link} ${styles.mobileLink}`}
                  to="/game"
                >
                  Hrát sólo
                </Link>
              </div>
            </div>

            <Link
              to="/games"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Tréninkové úlohy
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Leaderboard
            </Link>
            <Link
              to="/login"
              style={{ display: Registered ? "none" : "block" }}
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} `}
            >
              Přihlásit se
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
