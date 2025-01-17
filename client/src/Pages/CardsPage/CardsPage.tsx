import {
  chevronUpBlack,
  chevronUpWhite,
  chevronDownWhite,
  chevronDownBlack,
  xMarkBlack,
  xMarkWhite,
  resetBtnBlack,
  resetBtnWhite,
  xMarkGrey,
  loadingSpinnerGif,
  whitePlus,
  bluePlus,
  trashBin,
  symbolO,
  symbolX,
} from "../../assets/assets";
import { Card } from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import { Link } from "react-router-dom";
import styles from "./CardsPage.module.css";
import { useDarkMode } from "../../DarkModeContext";
import { useEffect, useState } from "react";
import { Footer } from "../../Components/Footer/Footer";
import XBackground from "../../Components/Animation/BackgroundSymbol";
import BackgroundSymbol from "../../Components/Animation/BackgroundSymbol";

export default function CardsPage() {
  type Game = {
    board: [];
    createdAt: string;
    difficulty: string;
    gameState: string;
    name: string;
    updatedAt: string;
    uuid: string;
    bitmap?: string;
    bitmapUrl?: string;
  };

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isFiltrationOpen, toggleIsFiltrationOpen] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>(""); // Název
  const [dateFilter, setDateFilter] = useState<string>(""); // Datum
  const [isLoading, setIsLoading] = useState(false);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]); // Filtrované hry

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
      updateAllBitmapUrls();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const updateAllBitmapUrls = () => {
    setGames((prevGames) =>
      prevGames.map((game) => ({
        ...game,
        bitmapUrl: `data:image/png;base64,${game.bitmap}`, // Combine the prefix with the bitmap code
      }))
    );
  };

  const handleDifficultyChange = (difficulty: string) => {
    setDifficultyFilter(
      (prevFilters) =>
        prevFilters.includes(difficulty)
          ? prevFilters.filter((item) => item !== difficulty) // Pokud už existuje, odstraň
          : [...prevFilters, difficulty] // Jinak přidej
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
  };

  const applyFilters = () => {
    let filtered = [...games];

    // Filtr podle obtížnosti
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter((game) =>
        difficultyFilter.includes(game.difficulty)
      );
    }

    // Filtr podle názvu
    if (nameFilter) {
      const names = nameFilter.split(";").map((n) => n.trim().toLowerCase());
      filtered = filtered.filter((game) =>
        names.some((name) => game.name.toLowerCase().includes(name))
      );
    }

    // Filtr podle data
    if (dateFilter) {
      const now = new Date();
      let filterDate: Date;

      if (dateFilter === "24 hodin") {
        filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (dateFilter === "7 dní") {
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "1 měsíc") {
        filterDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (dateFilter === "3 měsíce") {
        filterDate = new Date(now.setMonth(now.getMonth() - 3));
      }

      filtered = filtered.filter((game) => {
        const gameDate = new Date(game.updatedAt);
        return gameDate >= filterDate;
      });
    }

    setFilteredGames(filtered);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, games.length * 10 + 300);
  }, [difficultyFilter, nameFilter, dateFilter]);

  useEffect(() => {
    setTimeout(() => {
      applyFilters();
    }, games.length * 10 + 300);
  }, [difficultyFilter, nameFilter, dateFilter, games]);

  const resetFilters = () => {
    setDifficultyFilter([]);
    setNameFilter("");
    setDateFilter("");
  };

  return (
    <div>
      <Header />

      {/* Symbols Floating in back */}
      <BackgroundSymbol
        isXmark={false}
        startTop={400}
        width={100}
        left={10}
        height={140}
      />
      <BackgroundSymbol
        isXmark={true}
        startTop={750}
        left={80}
        width={200}
        height={240}
      />

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
                <img
                  style={
                    difficultyFilter.length === 0 &&
                    nameFilter === "" &&
                    dateFilter === ""
                      ? { display: "none" }
                      : { display: "flex" }
                  }
                  src={darkMode ? xMarkBlack : xMarkWhite}
                  onClick={resetFilters}
                />
                <span className={styles.lineBtns}></span>
                <img
                  className={
                    isFiltrationOpen
                      ? styles.filtrationChevronUp
                      : styles.filtrationChevronDown
                  }
                  onClick={openFiltration}
                  src={darkMode ? chevronUpBlack : chevronUpWhite}
                />
              </div>
            </div>
            <div
              className={`${
                isFiltrationOpen
                  ? styles.filterMenuOpened
                  : styles.filterMenuClosed
              } ${styles.filtrationSections}`}
            >
              <div className={styles.filtrationSection}>
                <img
                  style={
                    difficultyFilter.length !== 0
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                  src={xMarkGrey}
                  onClick={() => setDifficultyFilter([])}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>Obtížnosti</h5>
                <form className={styles.difficultyBtns} action="">
                  {[
                    "Začátečník",
                    "Jednoduchá",
                    "Pokročilá",
                    "Těžká",
                    "Nejtěžší",
                  ].map((difficulty, index) => (
                    <input
                      key={index}
                      style={
                        difficultyFilter.includes(difficulty)
                          ? {
                              transform: "scale(1.1)",
                              transition: "transform 0.2s ease",
                            }
                          : {}
                      }
                      className={`${styles.difficultyBtn} ${
                        styles[`difficultyColor${index + 1}`]
                      }`}
                      type="button"
                      value={difficulty}
                      onClick={() => handleDifficultyChange(difficulty)}
                    />
                  ))}
                </form>
              </div>
              <div className={styles.filtrationSection}>
                <img
                  style={
                    nameFilter !== ""
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                  src={xMarkGrey}
                  onClick={() => setNameFilter("")}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>Název</h5>
                <input
                  className={styles.filtrationSectionName}
                  type="text"
                  placeholder="Zadejte název úlohy:"
                  value={nameFilter}
                  onChange={handleNameChange}
                />
              </div>
              <div className={`${styles.filtrationSection}`}>
                <img
                  style={
                    dateFilter !== ""
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                  src={xMarkGrey}
                  onClick={() => setDateFilter("")}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>
                  Datum poslední úpravy
                </h5>
                <form className={styles.filtrationSectionDate} action="">
                  {["24 hodin", "7 dní", "1 měsíc", "3 měsíce"].map(
                    (label, index) => (
                      <label key={index}>
                        <input
                          style={{
                            gridArea: ["first", "second", "third", "fourth"][
                              index
                            ],
                          }}
                          type="radio"
                          name="dates"
                          checked={dateFilter === label}
                          onChange={() => handleDateChange(label)}
                        />{" "}
                        {label}
                      </label>
                    )
                  )}
                </form>
              </div>
            </div>
          </div>
          <Link to="/EditorPage">
            <button>
              <img
                className={styles.addGameBtn}
                src={darkMode ? whitePlus : bluePlus}
                alt=""
              />
            </button>
          </Link>

          <img
            style={isLoading ? { display: "block" } : { display: "none" }}
            className={styles.loadingSpinner}
            src={loadingSpinnerGif}
            alt=""
          />
          <div
            style={isLoading ? { display: "none" } : { display: "flex" }}
            className={styles.cards}
          >
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Card
                  key={game.uuid} // Always use a unique `key` when mapping
                  name={game.name}
                  type={game.difficulty}
                  uuid={game.uuid}
                  bitmapUrl={game.bitmapUrl}
                />
              ))
            ) : nameFilter === "" &&
              difficultyFilter.length === 0 &&
              dateFilter === "" ? (
              <p className={styles.filtrationMessage}>
                Zatím neexistuje žádná úloha.
              </p>
            ) : (
              <p className={styles.filtrationMessage}>
                Nenašli jsme žádné položky odpovídající vašemu filtru
              </p>
            )}
          </div>
        </div>
      </body>
      <Footer landingPageFooter={false} />
    </div>
  );
}
