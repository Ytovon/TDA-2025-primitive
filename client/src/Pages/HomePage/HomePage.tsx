import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Header from "../../Components/Header/Header";
import { Footer } from "../../Components/Footer/Footer";
import { Button } from "../../Components/Button/Button";
import { useDarkMode } from "../../DarkModeContext";
import {
  blueRiverDarkMode,
  blueRiverLightMode,
  homePageEntering,
  redRiverDarkMode,
  redRiverLightMode,
} from "../../assets/assets";
import { randomInt } from "crypto";

export default function HomePage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const defaultText = "Pojďte s námi ovládnout svět logiky";
  const defaultHeading = "Moudro dne";
  const randomInt: number = Math.floor(Math.random() * 15);

  const headerText = [
    {
      heading: defaultHeading,
      text: "Prošvihnete 100 % tahů, které neuděláte.",
    },
    {
      heading: "Život je jako piškvorky",
      text: "Nejde o to vyhrát každý tah, ale každou hru.",
    },
    {
      heading: "Piškvorky nás učí",
      text: "Že i malý tah může znamenat velký rozdíl.",
    },
    {
      heading: "Být či nebýt?",
      text: "Nah. Křížek nebo kolečko? Toť otázka!",
    },
    {
      heading: "Přišel jsem, viděl jsem",
      text: "Spojil jsem pět.",
    },
    {
      heading: "Blokovaná čtyřka",
      text: "Jediná věc, které se musíme bát.",
    },
    {
      heading: "Dejte mi svobodu",
      text: "Nebo výherní tah!",
    },
    {
      heading: "Je to malý krok pro člověka",
      text: "Ale velký skok pro piškvorky!",
    },
    {
      heading: "Cesta tisíce výher",
      text: "Začíná pouhým X.",
    },
    {
      heading: "Vítězství miluje přípravu",
      text: "A solidní diagonální strategii.",
    },
    {
      heading: "225 čtverečků...",
      text: "Nekonečných možností! Jsi připraven?",
    },
    {
      heading: "Více než hra",
      text: "Je to bitva myslí.",
    },
    {
      heading: defaultHeading,
      text: "Přemýšlej, přelsti, vyhraj!",
    },
    {
      heading: "Zlepši svou strategii",
      text: "zdemoluj svého soupeře!",
    },
    {
      heading: "Nehraj - dominuj!",
      text: defaultText,
    },
  ];

  return (
    <div>
      <Header />
      <div className={styles.body}>
        <div className={styles.homePageWrapper}>
          <section className={`${styles.homePageOpening} ${styles.section}`}>
            <div className={styles.openingText}>
              <h1 className={styles.openingTitle}>
                {headerText[randomInt].heading}
              </h1>
              <p className={styles.openingSubtitle}>
                {headerText[randomInt].text}{" "}
              </p>
              <div className={styles.openingBtns}>
                <Button
                  text="Lokální multiplayer"
                  color="white"
                  backgroundColor={true}
                  onClick={() => navigate("/game")}
                />

                <Button
                  text="Tréninkové úlohy"
                  color="#0070BB"
                  border={true}
                  onClick={() => navigate("/games")}
                />
              </div>
            </div>
            <div>
              <img className={styles.openingImg} src={homePageEntering} />
            </div>
          </section>

          <section className={`${styles.ourMissionSection} ${styles.section}`}>
            <h1 className={styles.ourMissionTitle}>Naše mise</h1>
            <div className={styles.ourMissionContainer}></div>
            <div className={styles.ourMissionContainer}>
              <p className={styles.ourMissionText}>
                Think Different Academy je nezisková organizace zaměřená na
                rozvoj <b>kritického</b> myšlení a <b>logických</b> dovedností.{" "}
                <br />
                <br /> Naším cílem je vytvořit prostor, kde hráči mohou rozvíjet
                své dovednosti <b>zábavnou</b> formou. <br />
                <br /> Přidejte se k nám a objevte <b>nový svět</b> logických
                her.
              </p>
            </div>
          </section>

          <section className={`${styles.offer} ${styles.section}`}>
            <div className={styles.offer_container}>
              <div>
                <img
                  className={styles.offer_img}
                  src={darkMode ? redRiverLightMode : redRiverDarkMode}
                />
              </div>
              <div className={styles.offer_box}>
                <p className={styles.offer_text}>
                  Přinášíme ti <b>moderní a kvalitní</b> digitalizovanou podobu
                  piškvorek, kterou si můžeš užít kdykoliv a kdekoliv. <br />
                  <br />
                  Zahraj si s kamarádem v režimu <b>lokálního multiplayeru</b>,
                  který věrně zachovává atmosféru klasické hry na papíře, a
                  zároveň nabízí pohodlí digitálního prostředí.
                </p>
                <Button
                  text="Jdu do toho"
                  backgroundColor={false}
                  color="white"
                  onClick={() => navigate("/game")}
                />
              </div>
            </div>

            <div className={styles.offer_container}>
              <div className={styles.offer_box}>
                <p className={styles.offer_text}>
                  Nabízíme také širokou škálu tréninkových úloh, které ti umožní
                  zdokonalit své <b>logické</b> myšlení a herní <b>strategii</b>
                  . <br />
                  <br />
                  Každá úloha je navržena tak, aby tě posouvala na vyšší úroveň,
                  ať už jsi <b>začátečník</b>, nebo <b>zkušený hráč</b>. <br />
                  <br />
                  Přijmi výzvu a posuň své dovednosti na <b>maximum!</b>
                </p>

                <Button
                  text="Chci trénovat"
                  backgroundColor={true}
                  color="white"
                  onClick={() => navigate("/games")}
                />
              </div>
              <div className={styles.offer_img2}>
                <img
                  className={`${styles.offer_img}`}
                  src={darkMode ? blueRiverLightMode : blueRiverDarkMode}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <div style={{ background: "var(--primary3)" }}>
        <Footer />
      </div>
    </div>
  );
}
