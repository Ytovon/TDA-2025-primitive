import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  lightModeLogo,
  darkModeLogo,
  barsBlack,
  barsWhite,
  chevronDownBlack,
  chevronDownWhite,
  triangleDropdownBlack,
  triangleDropdownWhite,
  eloRed,
  userImg,
  arrowBlack,
  arrowWhite,
  chevronUpWhite,
  chevronUpBlack,
  lightbulbWhite,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../Context/DarkModeContext";
import {
  getAccessTokenAsync,
  clearTokens,
  getRefreshToken,
  setUUID,
} from "../../API/tokenstorage"; // Your token storage functions

export default function Header() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [mobileUserDropdown, setmobileUserDropdown] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("var(--color1)");

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev);
  };

  // Check if the user is registered on startup
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

  useEffect(() => {
    if (user?.avatarColor) {
      setSelectedColor(colorMap[user.avatarColor] || "var(--color1)");
    }
  }, [user]);

  const colorMap: Record<number, string> = {
    1: "var(--color1)",
    2: "var(--color2)",
    3: "var(--color3)",
    4: "var(--color4)",
    5: "var(--color5)",
  };

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
              <Link
                to="/loading"
                className={`${styles.navLink} ${styles.link}`}
              >
                Hrát online
              </Link>
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
            style={{ display: isAuthenticated ? "none" : "block" }}
            to="/login"
            className={styles.authLink}
          >
            Přihlásit se
          </Link>

          <div
            style={{ display: isAuthenticated ? "flex" : "none" }}
            className={styles.user}
          >
            <div
              className={styles.userContainer}
              onClick={() => {
                navigate(`/profile/${user?.uuid}`);
              }}
            >
              <p className={styles.username}>{user.username}</p>
              <div className={styles.userStats}>
                <div className={styles.userStat}>
                  <p>{Math.round(user.elo)}</p>
                  <img style={{ width: "19px" }} src={eloRed} alt="" />
                </div>
              </div>
            </div>
            <div className={styles.dropdown}>
              <div className={styles.userImgContainer}>
                <Link to={`/profile/${user?.uuid}`}>
                  <img
                    style={{
                      backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                    }}
                    className={styles.userImg}
                    src={lightbulbWhite}
                    alt="profile Picture"
                  />
                </Link>
              </div>

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
                    to={`/profile/${user?.uuid}`}
                    className={`${styles.navLink} ${styles.link}`}
                  >
                    Přehled
                  </Link>
                  <Link
                    style={{ display: user?.isAdmin ? "block" : "none" }}
                    to="/users"
                    className={`${styles.navLink} ${styles.link}`}
                  >
                    Seznam hráčů
                  </Link>

                  <p
                    style={{ cursor: "pointer" }}
                    className={`${styles.navLink} ${styles.link}`}
                    onClick={() => {
                      logout();
                      clearTokens();
                      navigate("/");
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
              <div
                style={{ display: isAuthenticated ? "flex" : "none" }}
                className={styles.mobileUserContainer}
              >
                <div className={styles.userImgContainer}>
                  <img
                    style={{
                      backgroundColor: colorMap[user?.avatarColor ?? 1], // Pokud není avatarColor, použije se 1
                    }}
                    className={styles.userImg}
                    src={lightbulbWhite}
                    alt="profile Picture"
                  />
                </div>
                <div className={styles.mobileUser}>
                  <p
                    style={{ fontSize: "1.375rem" }}
                    className={styles.mobileUsername}
                  >
                    {user.username}
                  </p>
                  <div className={styles.mobileUserStats}>
                    <div className={styles.mobileUserStat}>
                      <p>{Math.round(user.elo)}</p>
                      <img src={eloRed} alt="" />
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
                  to={user.uuid ? `/profile/${user.uuid}` : "#"}
                  className={`${styles.link} ${styles.mobileLink}`}
                >
                  Přehled
                </Link>

                <Link
                  to={"/users"}
                  className={`${styles.link} ${styles.mobileLink}`}
                >
                  Seznam hráčů
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
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
                  to="/loading"
                >
                  Hrát online
                </Link>
                <Link
                  className={`${styles.link} ${styles.mobileLink}`}
                  to="/lobbyGame"
                >
                  Hrát s přítelem
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
              style={{ display: isAuthenticated ? "none" : "block" }}
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
