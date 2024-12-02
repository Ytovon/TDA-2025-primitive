import Card from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <body>
      <Header />

      <div>
        <h1>Vítejte </h1>
        <p>v našem tréninkovém centru!</p>
      </div>

      <div className={styles.filtration}>
        <div className={styles.filtrationMenu}>
          <h4>Filtrace</h4>
          <div className={styles.filtrationMenuBtns}>
            <p>křížek</p>
            <p>šipka hore</p>
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
        <Card />
      </div>
    </body>
  );
}
