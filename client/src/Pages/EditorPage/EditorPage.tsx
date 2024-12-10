import React, { useState } from "react";
import styles from "./EditorPage.module.css";
import {
  arrowBlack,
  arrowWhite,
  blueBulb,
  chevronDownBlack,
  chevronDownWhite,
  chevronUpBlack,
  chevronUpWhite,
  darkModeButton,
  redBulb,
} from "../../assets/assets";
import { useDarkMode } from "../../DarkModeContext";
import { Link } from "react-router-dom";

export default function EditorPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [player, changePlayer] = useState(true);

  const changePlayerOnRed = () => {
    changePlayer(false);
  };

  const changePlayerOnBlue = () => {
    changePlayer(true);
  };

  return (
    <div className={styles.body}>
      <div className={styles.editorPageMenu}>
        <Link to="/">
          <img
            className={styles.arrow}
            src={darkMode ? arrowBlack : arrowWhite}
          />
        </Link>
        <button onClick={toggleDarkMode}>
          <img className={styles.darkModeBtn} src={darkModeButton} />
        </button>
      </div>
      <h2 className={styles.editorPageTitle}>Editační stránka</h2>

      <div className={styles.leftSide}>
        <h3 className={styles.leftSideTitle}>Všeobecné nastavení</h3>
        <input className={styles.leftSideName} type="text" />

        <select className={styles.difficultyChoose} name="difficulty" id="">
          <option value="none" disabled selected>
            Vyberte obtížnost
          </option>
          <option className={styles.difficulty} value="Začátečník">
            Začátečník
          </option>
          <option className={styles.difficulty} value="Jednoduchá">
            Jednoduchá
          </option>
          <option className={styles.difficulty} value="Pokročilá">
            Pokročilá
          </option>
          <option className={styles.difficulty} value="Těžká">
            Těžká
          </option>
          <option className={styles.difficulty} value="Nejtěžší">
            Nejtěžší
          </option>
        </select>

        <div className={styles.selectSymbol}>
          <button onClick={changePlayerOnBlue}>
            <img
              style={player ? { opacity: "1" } : { opacity: "0.5" }}
              src={blueBulb}
            />
          </button>
          <button onClick={changePlayerOnRed}>
            <img
              style={player ? { opacity: "0.5" } : { opacity: "1" }}
              src={redBulb}
            />
          </button>
        </div>

        <div>
          <button>Uložit úlohu</button>
          <button>Vymazat úlohu</button>
        </div>
      </div>
    </div>
  );
}
