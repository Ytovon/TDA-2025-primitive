import React, { useState } from "react";
import styles from "./EditorPage.module.css";
import {
  arrowBlack,
  arrowWhite,
  blueBulb,
  check,
  chevronDownBlack,
  chevronDownWhite,
  chevronUpBlack,
  chevronUpWhite,
  darkModeButton,
  redBulb,
  trashBin,
} from "../../assets/assets";
import { Button } from "../../Components/Button/Button";
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
        <Link to="/Games">
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
        <div>
          <h3 className={styles.leftSideTitle}>Všeobecné nastavení</h3>
          <div className={styles.editorPageInputs}>
            <input
              className={styles.editorPageInput}
              type="text"
              placeholder="Zadejte název hry"
            />

            <select className={styles.editorPageSelect} name="difficulty" id="">
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
          </div>
        </div>

        <div className={styles.selectSymbol}>
          <div className={styles.editacePlochyTitle}>
            <h3 className={styles.leftSideTitle}>Editace plochy</h3>
            <p className={styles.info}>?</p>
          </div>

          <div className={styles.selectSymbolImg}>
            <button
              style={player ? { opacity: "1" } : { opacity: "0.6" }}
              onClick={changePlayerOnBlue}
            >
              <p style={{ color: "#0070BB" }} className={styles.numberAboveImg}>
                6
              </p>
              <img src={blueBulb} />
            </button>
            <button
              style={player ? { opacity: "0.4" } : { opacity: "1" }}
              onClick={changePlayerOnRed}
            >
              <p style={{ color: "#E31837" }} className={styles.numberAboveImg}>
                6
              </p>
              <img src={redBulb} />
            </button>
          </div>
        </div>

        <div className={styles.leftSideBtns}>
          <Button
            text="Uložit úlohu"
            image={check}
            color="white"
            backgroundColor="#0070BB"
          />
          <Button
            text="Vymazat úlohu"
            image={trashBin}
            color="#E31837"
            border="2px solid #E31837"
          />
        </div>
      </div>

      <div></div>
    </div>
  );
}
