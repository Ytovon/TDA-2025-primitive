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
  arrowBlack,
  arrowWhite,
  chevronUpWhite,
  chevronUpBlack,
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
  const { darkMode, enableDarkMode, disableDarkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [Registered, setRegistered] = useState(false);
  const [user, setUser] = useState<User>(new User("", "", "", 0, 0, 0, 0));
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [mobileUserDropdown, setmobileUserDropdown] = useState(false);

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
                <Link
                  to="/loading"
                  className={`${styles.navLink} ${styles.link}`}
                >
                  Hrát online
                </Link>
                <Link to="/game" className={`${styles.navLink} ${styles.link}`}>
                  Hrát sólo
                </Link>
                <Link
                  to="/lobby"
                  className={`${styles.navLink} ${styles.link}`}
                >
                  Hrát s přítelem
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
                  <p>{Math.floor(user.elo)}</p>
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
                  src={darkMode ? triangleDropdownBlack : triangleDropdownWhite}
                  alt=""
                />
                <p>
                  <Link
                    to="/ProfilePage/user1"
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
