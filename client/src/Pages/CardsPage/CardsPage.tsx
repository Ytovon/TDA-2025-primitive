import {
  chevronUpBlack,
  chevronUpWhite,
  chevronDownWhite,
  chevronDownBlack,
  xMarkBlack,
  xMarkWhite,
} from "../../assets/assets";
import { Card } from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import styles from "./CardsPage.module.css";
import { useDarkMode } from "../../DarkModeContext";
import { useEffect, useState } from "react";

export default function CardsPage() {
  type Game = {
    board: [];
    createdAt: string;
    difficulty: string;
    gameState: string;
    name: string;
    updatedAt: string;
    uuid: string;
  };

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isFiltrationOpen, toggleIsFiltrationOpen] = useState(true);
  const [games, setGames] = useState<Game[]>([]);

  const openFiltration = () => {
    toggleIsFiltrationOpen(!isFiltrationOpen);
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  async function fetchAllGames() {
    try {
      const response = await fetch("http://localhost:5000/api/v1/games");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGames(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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
            <div
              style={
                isFiltrationOpen
                  ? {
                      borderBottom: "",
                    }
                  : { borderBottom: "none" }
              }
              className={styles.filtrationMenu}
            >
              <h4 className={styles.filtrationMenuTitle}>Filtrace</h4>
              <div className={styles.filtrationMenuBtns}>
                <img src={darkMode ? xMarkBlack : xMarkWhite} />
                <span className={styles.lineBtns}></span>
                <img
                  onClick={openFiltration}
                  src={
                    isFiltrationOpen
                      ? darkMode
                        ? chevronUpBlack
                        : chevronUpWhite
                      : darkMode
                      ? chevronDownBlack
                      : chevronDownWhite
                  }
                />
              </div>
            </div>
            <div
              style={
                isFiltrationOpen ? { display: "flex" } : { display: "none" }
              }
              className={styles.filtrationSections}
            >
              <div className={styles.filtrationSection}>
                <h5 className={styles.filtrationSectionTitle}>Obtížnosti</h5>
                <form className={styles.difficultyBtns} action="">
                  <input
                    className={`${styles.difficultyBtn} ${styles.difficultyColor1}`}
                    type="button"
                    value="Začátečník"
                  />
                  <input
                    className={`${styles.difficultyBtn} ${styles.difficultyColor2}`}
                    type="button"
                    value="Jednoduchá"
                  />
                  <input
                    className={`${styles.difficultyBtn} ${styles.difficultyColor3}`}
                    type="button"
                    value="Pokročilá"
                  />
                  <input
                    className={`${styles.difficultyBtn} ${styles.difficultyColor4}`}
                    type="button"
                    value="Těžká"
                  />
                  <input
                    className={`${styles.difficultyBtn} ${styles.difficultyColor5}`}
                    type="button"
                    value="Nejtěžší"
                  />
                </form>
              </div>
              <div className={styles.filtrationSection}>
                <h5 className={styles.filtrationSectionTitle}>Název</h5>
                <input type="text" placeholder="Zadejte název úlohy:" />
                <br />
                <label htmlFor=""> Více názvů úloh oddělujte středníkem</label>
              </div>
              <div className={styles.filtrationSection}>
                <h5 className={styles.filtrationSectionTitle}>
                  Datum poslední úpravy
                </h5>
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

          <div className={styles.cards}>
            {games.map((game) => (
              <Card name={game.name} type={game.difficulty} uuid={game.uuid} />
            ))}
          </div>
        </div>
      </body>
    </div>
  );
}
