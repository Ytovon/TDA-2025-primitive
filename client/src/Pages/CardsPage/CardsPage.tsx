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
              </div>
              <div className={styles.filtrationSection}>
                <h5>Název</h5>
              </div>
              <div className={styles.filtrationSection}>
                <h5>Datum poslední úpravy</h5>
                <option value="day">24 hodin</option>
                <option value="7days">7 dní</option>
                <option value="1month">1 měsíc</option>
                <option value="3months">3 měsíce</option>
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
