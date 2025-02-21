import styles from "./Card.module.css";
import { settingsButton } from "../../assets/assets";
import { Link } from "react-router-dom";
import { inspect } from "util";

interface CardProps {
  type?: string;
  name?: string;
  uuid?: string;
  bitmapUrl?: string;
}

export const Card: React.FC<CardProps> = ({
  name = "piškvorky",
  type = "Začátečník",
  uuid = "",
  bitmapUrl = "",
}) => {
  let typeStyle: React.CSSProperties = {};

  //TODO !!!
  if (type.toLowerCase() === "začátečník") {
    typeStyle = { color: "#0070BB" };
  } else if (type.toLowerCase() === "jednoduchá") {
    typeStyle = { color: "#395A9A" };
  } else if (type.toLowerCase() === "pokročilá") {
    typeStyle = { color: "#724479" };
  } else if (type.toLowerCase() === "těžká") {
    typeStyle = { color: "#AB2E58" };
  } else if (type.toLowerCase() === "nejtěžší") {
    typeStyle = { color: "#E31837" };
  }

  return (
    <div className={styles.card}>
      <div className="">
        <img className={styles.cardImage} src={bitmapUrl} alt="Piškvorky" />
        <Link to={`/EditorPage/${uuid}`}>
          <img className={styles.cardUpdate} src={settingsButton} />
        </Link>
      </div>

      <h2 className={styles.cardTitle}>{name}</h2>
      <p className={styles.cardType} style={typeStyle}>
        {type}
      </p>
      <Link className={styles.cardStart} to={`/Game/${uuid}`}>
        <p>Spustit úlohu</p>
      </Link>
    </div>
  );
};
