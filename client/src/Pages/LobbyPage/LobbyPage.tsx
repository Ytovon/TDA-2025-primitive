import React, { useState } from "react";
import styles from "./LobbyPage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { create } from "domain";
import {
  arrowBlack,
  arrowWhite,
  lightbulbBlueLike,
  lightbulbRed,
  lightbulbRedLike,
  modraZarovkaO,
} from "../../assets/assets";
import { useDarkMode } from "../../Context/DarkModeContext";

export const LobbyPage = () => {
  const { darkMode } = useDarkMode();
  const [menu, setMenu] = useState(true);
  const [copyPage, setCopyPage] = useState(false);
  const [insertPage, setInsertPage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [insertedCode, setInsertedCode] = useState(""); // Stav pro uložený kód

  const code = "394-340";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Zpráva zmizí po 2 sekundách
      })
      .catch((err) => console.error("Chyba při kopírování: ", err));
  };

  const handleConfirm = () => {
    console.log("Uložený kód:", insertedCode);
    // Tady můžeš provést další akce, například odeslání na server
  };

  return (
    <div>
      <Header />

      <button
        onClick={() => {
          setMenu(true);
          setCopyPage(false);
          setInsertPage(false);
        }}
      >
        <img
          style={{ display: menu ? "none" : "block" }}
          className={styles.arrow}
          src={darkMode ? arrowWhite : arrowBlack}
          alt=""
        />
      </button>

      <div className={styles.lobbyWrapper}>
        <div className={styles.menu}>
          <h1 className={styles.menuTitle}>Hra s přítelem</h1>
          <p
            style={{ display: menu ? "block" : "none" }}
            className={styles.menuText}
          >
            Na co čekáš? Pojď si zahrát!
          </p>
          <p
            style={{ display: copyPage ? "block" : "none" }}
            className={styles.menuText}
          >
            Pošlete odkaz svému ne/<b>příteli</b>
          </p>
          <p
            style={{ display: insertPage ? "block" : "none" }}
            className={styles.menuText}
          >
            Nemáš odkaz? <span className={styles.redBold}>Založ lobby!</span>
          </p>

          <div
            style={{ display: menu ? "flex" : "none" }}
            className={styles.buttons}
          >
            <Button
              text="Vytvořit lobby"
              backgroundColor={false}
              color="white"
              width="320px"
              height="42px"
              onClick={() => {
                setCopyPage(true);
                setMenu(false);
                setInsertPage(false);
              }}
            />
            <Button
              text="Připojit se před kód"
              backgroundColor
              color="white"
              width="320px"
              height="42px"
              onClick={() => {
                setInsertPage(true);
                setMenu(false);
                setCopyPage(false);
              }}
            />
          </div>

          <div
            style={{ display: copyPage ? "flex" : "none" }}
            className={styles.buttons}
          >
            <Button
              text={`Zkopírovat: ${code}`}
              backgroundColor={false}
              color="white"
              width="320px"
              height="42px"
              onClick={handleCopy}
            />
            {copied && (
              <p style={{ color: "var(--color1)", marginTop: "10px" }}>
                Zkopírováno!
              </p>
            )}
          </div>

          <div
            style={{ display: insertPage ? "flex" : "none" }}
            className={styles.buttons}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                className={styles.insertCodeInput}
                type="text"
                placeholder="Vložit kód"
                value={insertedCode}
                onChange={(e) => setInsertedCode(e.target.value)}
              />
              <Button
                text="Potvrdit"
                color="var(--color-text-primary)"
                width="100px"
                height="42px"
                onClick={handleConfirm}
              />
            </div>
          </div>
        </div>

        <img
          style={{ display: menu ? "block" : "none" }}
          className={styles.lobbyImg}
          src={modraZarovkaO}
          alt=""
        />

        <img
          style={{ display: copyPage ? "block" : "none" }}
          className={styles.lobbyImg}
          src={lightbulbRedLike}
          alt=""
        />

        <img
          style={{ display: insertPage ? "block" : "none" }}
          className={styles.lobbyImg}
          src={lightbulbBlueLike}
          alt=""
        />
      </div>
    </div>
  );
};
