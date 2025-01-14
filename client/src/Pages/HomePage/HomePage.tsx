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

export default function HomePage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <Header />
      <div className={styles.body}>
        <div className={styles.homePageWrapper}>
          <section className={`${styles.homePageOpening} ${styles.section}`}>
            <div className={styles.openingText}>
              <h1 className={styles.openingTitle}>Být či nebýt?</h1>
              <p className={styles.openingSubtitle}>
                Nah. Radši s námi pojď ovládnout svět logiky.
              </p>
              <div className={styles.openingBtns}>
                <Button
                  text="Lokální multiplayer"
                  color="white"
                  backgroundColor="#0070BB"
                  onClick={() => navigate("/game")}
                />

                <Button
                  text="Tréninkové úlohy"
                  color="#0070BB"
                  border="3px solid #0070BB"
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
                  backgroundColor="#0070BB"
                  color="white"
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
                  backgroundColor="#E31837"
                  color="white"
                />
              </div>
              <div>
                <img
                  className={styles.offer_img}
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
