import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  image?: string;
  color?: string;
  border?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

// Definice komponenty Button
export const Button: React.FC<ButtonProps> = ({
  text,
  image,
  color,
  border,
  backgroundColor,
  onClick,
}) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{ backgroundColor: backgroundColor, border: border }}
    >
      {image && <img className={styles.image} src={image} />}
      <p className={styles.text} style={{ color: color }}>
        {text}
      </p>
    </button>
  );
};
