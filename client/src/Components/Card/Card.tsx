import styles from "./Card.module.css";
import { nahledPiskvorek, settingsButton } from "../../assets/assets";
import { Link } from "react-router-dom";
import { inspect } from "util";

interface CardProps {
  type?: string;
  name?: string;
}

export const Card: React.FC<CardProps> = ({
  type = "piškvorky",
  name = "Začátečník",
}) => {
  let typeStyle: React.CSSProperties = {};

  if (type === "Začátečník") {
    typeStyle = { color: "#0070BB" };
  }

  if (type === "Jednoduchá") {
    typeStyle = { color: "#395A9A" };
  }

  if (type === "Pokročilá") {
    typeStyle = { color: "#724479" };
  }

  if (type === "Těžká") {
    typeStyle = { color: "#AB2E58" };
  }

  if (type === "Nejtěžší") {
    typeStyle = { color: "#E31837" };
  }

  return (
    <div className={styles.card}>
      <div className="">
        <img
          className={styles.cardImage}
          src={nahledPiskvorek}
          alt="Piškvorky"
        />
        <Link to="/EditorPage">
          <img className={styles.cardUpdate} src={settingsButton} />
        </Link>
      </div>

      <h2 className={styles.cardTitle}>{name}</h2>
      <p className={styles.cardType} style={typeStyle}>
        {type}
      </p>
      <Link className={styles.cardStart} to="/Game/uuid">
        <p>Spustit úlohu</p>
      </Link>
    </div>
  );
};
