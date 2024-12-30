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
} from "../../assets/assets";
import { Card } from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import { Link, useNavigate } from "react-router-dom";
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
  const [difficultyFilter, setDifficultyFilter] = useState<string>(""); // Obtížnost
  const [nameFilter, setNameFilter] = useState<string>(""); // Název
  const [dateFilter, setDateFilter] = useState<string>(""); // Datum
  const [isLoading, setIsLoading] = useState(false);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]); // Filtrované hry

  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

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

  async function createGame() {
    try {
      const newGame = {
        name: "",
        difficulty: "Začátečník",
        gameState: "",
        board: Array.from({ length: 15 }, () => Array(15).fill("")),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/v1/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.game.uuid; // Vrátíme UUID nově vytvořené hry
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }

  const handleCreateGame = async () => {
    const newGameUuid = await createGame(); // Vytvoření hry a získání UUID

    console.log(newGameUuid);

    if (newGameUuid) {
      navigate(`/EditorPage/${newGameUuid}`); // Přesměrování na EditorPage
    }
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
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
    if (difficultyFilter) {
      filtered = filtered.filter(
        (game) => game.difficulty === difficultyFilter
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
      applyFilters();
      setIsLoading(false);
    }, games.length * 200);
  }, [difficultyFilter, nameFilter, dateFilter, games]);

  const resetFilters = () => {
    setDifficultyFilter("");
    setNameFilter("");
    setDateFilter("");
  };

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
                <img
                  src={darkMode ? xMarkBlack : xMarkWhite}
                  onClick={resetFilters}
                />
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
                <img
                  src={xMarkGrey}
                  onClick={() => setDifficultyFilter("")}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>Obtížnosti</h5>
                <form className={styles.difficultyBtns} action="">
                  <input
                    style={
                      difficultyFilter === "Začátečník"
                        ? {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s ease",
                          }
                        : {}
                    }
                    className={`${styles.difficultyBtn} ${styles.difficultyColor1}`}
                    type="button"
                    value="Začátečník"
                    onClick={() => handleDifficultyChange("Začátečník")}
                  />
                  <input
                    style={
                      difficultyFilter === "Jednoduchá"
                        ? {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s ease",
                          }
                        : {}
                    }
                    className={`${styles.difficultyBtn} ${styles.difficultyColor2}`}
                    type="button"
                    value="Jednoduchá"
                    onClick={() => handleDifficultyChange("Jednoduchá")}
                  />
                  <input
                    style={
                      difficultyFilter === "Pokročilá"
                        ? {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s ease",
                          }
                        : {}
                    }
                    className={`${styles.difficultyBtn} ${styles.difficultyColor3}`}
                    type="button"
                    value="Pokročilá"
                    onClick={() => handleDifficultyChange("Pokročilá")}
                  />
                  <input
                    style={
                      difficultyFilter === "Těžká"
                        ? {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s ease",
                          }
                        : {}
                    }
                    className={`${styles.difficultyBtn} ${styles.difficultyColor4}`}
                    type="button"
                    value="Těžká"
                    onClick={() => handleDifficultyChange("Těžká")}
                  />
                  <input
                    style={
                      difficultyFilter === "Nejtěžší"
                        ? {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s ease",
                          }
                        : {}
                    }
                    className={`${styles.difficultyBtn} ${styles.difficultyColor5}`}
                    type="button"
                    value="Nejtěžší"
                    onClick={() => handleDifficultyChange("Nejtěžší")}
                  />
                </form>
              </div>
              <div className={styles.filtrationSection}>
                <img
                  src={xMarkGrey}
                  onClick={() => setNameFilter("")}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>Název</h5>
                <input
                  type="text"
                  placeholder="Zadejte název úlohy:"
                  value={nameFilter}
                  onChange={handleNameChange}
                />
              </div>
              <div className={styles.filtrationSection}>
                <img
                  src={xMarkGrey}
                  onClick={() => setDateFilter("")}
                  className={styles.resetFiltrationSection}
                />
                <h5 className={styles.filtrationSectionTitle}>
                  Datum poslední úpravy
                </h5>
                <form action="">
                  <label>
                    <input
                      type="radio"
                      name="dates"
                      checked={dateFilter === "24 hodin"}
                      onChange={() => handleDateChange("24 hodin")}
                    />{" "}
                    24 hodin
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dates"
                      checked={dateFilter === "7 dní"}
                      onChange={() => handleDateChange("7 dní")}
                    />{" "}
                    7 dní
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dates"
                      checked={dateFilter === "1 měsíc"}
                      onChange={() => handleDateChange("1 měsíc")}
                    />{" "}
                    1 měsíc
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dates"
                      checked={dateFilter === "3 měsíce"}
                      onChange={() => handleDateChange("3 měsíce")}
                    />{" "}
                    3 měsíce
                  </label>
                </form>
              </div>
            </div>
          </div>
          <button onClick={handleCreateGame} className={styles.addGameBtn}>
            Vytvořit novou hru
          </button>

          <img
            style={isLoading ? { display: "block" } : { display: "none" }}
            className={styles.loadingSpinner}
            src={loadingSpinnerGif}
            alt=""
          />
          <div
            style={isLoading ? { display: "none" } : { display: "grid" }}
            className={styles.cards}
          >
            {filteredGames.map((game) => (
              <Card name={game.name} type={game.difficulty} uuid={game.uuid} />
            ))}
          </div>
        </div>
      </body>
    </div>
  );
}
