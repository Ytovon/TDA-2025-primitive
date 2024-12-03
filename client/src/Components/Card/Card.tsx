import styles from "./Card.module.css";
import { nahledPiskvorek, settingsButton } from "../../assets/assets";
import { Link } from "react-router-dom";

function Card(props: { name: string; type: string }) {
  let typeStyle: React.CSSProperties = {};

  if (props.type === "Začátečník") {
    typeStyle = { color: "#0070BB" };
  }

  if (props.type === "Jednoduchá") {
    typeStyle = { color: "#395A9A" };
  }

  if (props.type === "Pokročilá") {
    typeStyle = { color: "#724479" };
  }

  if (props.type === "Těžká") {
    typeStyle = { color: "#AB2E58" };
  }

  if (props.type === "Nejtěžší") {
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
        <img className={styles.cardUpdate} src={settingsButton} alt="" />
      </div>

      <h2 className={styles.cardTitle}>{props.name}</h2>
      <p className={styles.cardType} style={typeStyle}>
        {props.type}
      </p>
      <Link className={styles.cardStart} to="/Game/uuid">
        <p>Spustit úlohu</p>
      </Link>
    </div>
  );
}

Card.defaultProps = {
  name: "Piškvorky",
  type: "Začátečník",
};

export default Card;
