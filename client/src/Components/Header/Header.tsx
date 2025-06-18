import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import { Link, useNavigate } from "react-router-dom";
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
  arrowBlack,
  arrowWhite,
  chevronUpWhite,
  chevronUpBlack,
  lightbulbWhite,
} from "../../assets/assets";
import styles from "./Header.module.css";
import { useDarkMode } from "../../Context/DarkModeContext";
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";
import { useAuth } from "../../Context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export type HeaderHandle = {
  StartGameSearch: () => void;
};

type HeaderProps = {
  displayFull?: boolean;
};

const Header = forwardRef<HeaderHandle, HeaderProps>(
  ({ displayFull = true }, ref) => {
    const { user, logout, isAuthenticated, validate } = useAuth();
    const { status, startConnection, timer, waitingForMatch, isConnected } =
      useWebSocketMultiplayer();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(false);
    const [mobileUserDropdown, setmobileUserDropdown] = useState(false);

    const StartGameSearch = () => {
      validate();
      if (isAuthenticated === true) {
        startConnection();
      } else {
        navigate("/login");
      }
    };

    useImperativeHandle(ref, () => ({
      StartGameSearch,
    }));

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

    useEffect(() => {
      const timeout = setTimeout(() => {
        console.log("isConnected in timeout:", isConnected);
        console.log("waitingForMatch in timeout:", waitingForMatch);
        if (!waitingForMatch && isConnected) {
          navigate("/freeplay");
        }
      }, 3000);

      return () => clearTimeout(timeout); // bezpečné čištění
    }, [waitingForMatch, isConnected]);

    const colorMap: Record<number, string> = {
      1: "var(--color1)",
      2: "var(--color2)",
      3: "var(--color3)",
      4: "var(--color4)",
      5: "var(--color5)",
    };

    if (!displayFull) {
      return (
        <>
          <div
            style={
              waitingForMatch
                ? { display: "flex", top: 0 }
                : { display: "none" }
            }
            className={styles.timerContainer}
          >
            <p className={styles.status}>{status}</p>
            <div className={styles.timer}>
              <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </div>
          </div>
        </>
      );
    }

    // displayFull je true, normální render celého headeru
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
              <p
                className={`${styles.navLink} ${styles.link}`}
                onClick={StartGameSearch}
              >
                Hrát online
              </p>

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
              <div className={styles.userContainer}>
                <p className={styles.username}>{user?.username || "..."}</p>
                <div className={styles.userStats}>
                  <div className={styles.userStat}>
                    <p>{Math.floor(user?.elo || 0)}</p>
                    <img style={{ width: "19px" }} src={eloRed} alt="" />
                  </div>
                </div>
              </div>
              <div className={styles.dropdown}>
                <div className={styles.userImgContainer}>
                  <Link to={`/profile/${user?.uuid}`}>
                    <img
                      style={{
                        backgroundColor: colorMap[user?.AvatarColor ?? 1],
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
                    src={
                      darkMode ? triangleDropdownBlack : triangleDropdownWhite
                    }
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

        <div
          style={waitingForMatch ? { display: "flex" } : { display: "none" }}
          className={styles.timerContainer}
        >
          <p className={styles.status}>{status}</p>
          <div className={styles.timer}>
            <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
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
                        backgroundColor: colorMap[user?.AvatarColor ?? 1],
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
                      {user?.username}
                    </p>
                    <div className={styles.mobileUserStats}>
                      <div className={styles.mobileUserStat}>
                        <p>{user?.elo}</p>
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
                  className={styles.dropdownContentMobile}
                >
                  <Link
                    onClick={toggleMenu}
                    to={`/profile/${user?.uuid}`}
                    className={`${styles.mobileLink} ${styles.link}`}
                  >
                    Přehled
                  </Link>

                  <Link
                    onClick={toggleMenu}
                    style={{ display: user?.isAdmin ? "block" : "none" }}
                    to="/users"
                    className={`${styles.mobileLink} ${styles.link}`}
                  >
                    Seznam hráčů
                  </Link>

                  <p
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className={`${styles.mobileLink} ${styles.link}`}
                  >
                    Odhlásit se
                  </p>
                </div>
              </button>

              <Link
                onClick={toggleMenu}
                to="/games"
                className={`${styles.mobileLink} ${styles.link}`}
              >
                Tréninkové úlohy
              </Link>

              <Link
                onClick={toggleMenu}
                to="/leaderboard"
                className={`${styles.mobileLink} ${styles.link}`}
              >
                Leaderboard
              </Link>

              <button
                onClick={() => {
                  StartGameSearch();
                  toggleMenu();
                }}
                className={`${styles.mobileLink} ${styles.link}`}
              >
                Hrát online
              </button>

              <Link
                onClick={toggleMenu}
                to="/login"
                className={styles.mobileLoginLink}
                style={{ display: isAuthenticated ? "none" : "block" }}
              >
                Přihlásit se
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

export default Header;
