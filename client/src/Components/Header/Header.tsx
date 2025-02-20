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
import { useDarkMode } from "../../Context/DarkModeContext";
import {
  getAccessToken,
  clearTokens,
  getRefreshToken,
  setUUID,
  clearUUID,
  getUUID,
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
      if (token && token !== "" && token !== undefined) {
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
        if (isValid && isValid.data) {
          const valid = isValid.data.valid;
          const uuid = isValid.data.uuid;

          setRegistered(valid);

          if (valid && uuid) {
            setUUID(uuid);
          }
        } else {
          setRegistered(false);
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
                <Link
                  to="/loading"
                  className={`${styles.navLink} ${styles.link}`}
                >
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
              <p className={styles.username}>{user.username}</p>
              <div className={styles.userStats}>
                <div className={styles.userStat}>
                  <p>{user.elo}</p>
                  <img src={eloStar} alt="" />
                </div>
                <div className={styles.userStat}>
                  <p>0</p>
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
                <p>
                  <Link
                    to="/userPage/user1"
                    className={`${styles.navLink} ${styles.link}`}
                  >
                    Přehled
                  </Link>
                  <p
                    style={{ cursor: "pointer" }}
                    className={`${styles.navLink} ${styles.link}`}
                    onClick={() => {
                      setRegistered(false);
                      clearTokens();
                    }}
                  >
                    Odhlásit se
                  </p>
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
              to="/leaderboard"
              onClick={() => setMenuIsOpen(false)}
              className={`${styles.mobileMenuLink} ${styles.link}`}
            >
              Leaderboard
            </Link>
            <Link
              to="/login"
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
