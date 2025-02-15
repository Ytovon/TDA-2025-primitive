import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserApiClient } from "../../API/UserApi";
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
import {
  getAccessToken,
  clearTokens,
  getRefreshToken,
} from "../../API/tokenstorage"; // Your token storage functions
import { User, UserModel } from "../../Model/UserModel";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [Registered, setRegistered] = useState(false);
  const [user, setUser] = useState<User>(new User("", "", "", 0, 0, 0, 0));

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev);
  };

  // Check if the user is registered on startup
  useEffect(() => {
    const verifyUserToken = async () => {
      const token = getAccessToken();
      if (token && token !== "") {
        let isValid: any = await UserApiClient.verifyToken(token);
        if (!isValid) {
          // Try to refresh the token if the current token is not valid
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const newAccessToken = await UserApiClient.refreshToken(
              refreshToken
            );
            if (newAccessToken) {
              isValid = await UserApiClient.verifyToken(newAccessToken);
            }
          }
        }
        const valid = isValid.data.valid;
        const uuid = isValid.data.uuid;

        setRegistered(valid);

        if (valid && uuid) {
          localStorage.setItem("uuid", uuid);
        }
      }
    };

    const fetchSpecificUserData = async () => {
      // wait here for half a second
      await new Promise((resolve) => setTimeout(resolve, 100));

      const uuid = localStorage.getItem("uuid");
      if (uuid) {
        const userData: UserModel | string = await UserApiClient.getUserByUUID(
          uuid
        );
        setUser(userData as User);
      }
    };

    verifyUserToken();
    fetchSpecificUserData();
  }, []);

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
              <Link to="/game" className={styles.navLink}>
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
            <Link to="/" className={styles.navLink}>
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
              <h3 className={styles.username}>{user.username}</h3>
              <div className={styles.userStats}>
                <div className={styles.userStat}>
                  <p>{user.elo}</p>
                  <img src={eloStar} alt="" />
                </div>
                <div className={styles.userStat}>
                  <p>{user.wins}</p>
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
                <Link to="/" className={styles.navLink}>
                  Přehled
                </Link>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setRegistered(false);
                    clearTokens();
                  }}
                  className={styles.navLink}
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
      <div
        style={{ display: menuIsOpen ? "flex" : "none" }}
        className={styles.mobileMenu}
      >
        <Link
          to="/game"
          onClick={() => setMenuIsOpen(false)}
          className={styles.mobileMenuLink}
        >
          Hrajte online
        </Link>
        <Link
          to="/games"
          onClick={() => setMenuIsOpen(false)}
          className={styles.mobileMenuLink}
        >
          Tréninkové úlohy
        </Link>
        <Link
          to="/"
          onClick={() => setMenuIsOpen(false)}
          className={styles.mobileMenuLink}
        >
          Leaderboard
        </Link>
        <Link
          to="/login"
          onClick={() => setMenuIsOpen(false)}
          className={styles.mobileMenuLink}
        >
          Přihlásit se
        </Link>
      </div>
    </header>
  );
}
