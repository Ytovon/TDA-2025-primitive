import {
  chevronUpBlack,
  chevronUpWhite,
  xMarkBlack,
  xMarkWhite,
} from "../../assets/assets";
import Card from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import styles from "./CardsPage.module.css";
import { useDarkMode } from "../../DarkModeContext";

export default function CardsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <div>
      <Header />
      <body className={styles.body}>
        <div className={styles.cardsPageWrapper}>
          <div className={styles.cardsPageTitle}>
            <h1>Vítejte </h1>
            <p> v našem tréninkovém centru!</p>
          </div>

          <div className={styles.filtration}>
            <div className={styles.filtrationMenu}>
              <h4 className={styles.filtrationMenuTitle}>Filtrace</h4>
              <div className={styles.filtrationMenuBtns}>
                <img src={darkMode ? xMarkBlack : xMarkWhite} />
                <span className={styles.lineBtns}></span>
                <img src={darkMode ? chevronUpBlack : chevronUpWhite} />
              </div>
            </div>
            <div className={styles.filtrationSections}>
              <div className={styles.filtrationSection}>
                <h5>Obtížnosti</h5>
                <form action="">
                  <input type="button" value="Začátečník" />
                  <input type="button" value="Jednoduchá" />
                  <input type="button" value="Pokročilá" />
                  <input type="button" value="Těžká" />
                  <input type="button" value="Nejtěžší" />
                </form>
              </div>
              <div className={styles.filtrationSection}>
                <h5>Název</h5>
                <input type="text" placeholder="Zadejte název úlohy:" />
                <label htmlFor=""> Více názvů úloh oddělujte středníkem</label>
              </div>
              <div className={styles.filtrationSection}>
                <h5>Datum poslední úpravy</h5>
                <form action="">
                  <label>
                    <input type="radio" name="dates" /> 24 hodin
                  </label>
                  <label>
                    <input type="radio" name="dates" /> 7 dní
                  </label>
                  <label>
                    <input type="radio" name="dates" /> 1 měsíc
                  </label>
                  <label>
                    <input type="radio" name="dates" /> 3 měsíce
                  </label>
                </form>
              </div>
            </div>
          </div>

          <div>
            <Card name="Puzzle" type="Pokročilá" />
          </div>
        </div>
      </body>
    </div>
  );
}
