import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  image?: string;
  color?: string;
  border?: string;
  backgroundColor?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isVisible?: boolean;
}

// Definice komponenty Button
export const Button: React.FC<ButtonProps> = ({
  text,
  image,
  color,
  border,
  backgroundColor,
  onClick,
  isDisabled,
  isVisible = true,
}) => {
  return (
    <button
      disabled={isDisabled}
      className={styles.button}
      onClick={onClick}
      style={{
        backgroundColor: backgroundColor,
        border: border,
        display: isVisible ? "" : "none",
      }}
    >
      {image && <img className={styles.image} src={image} />}
      <p className={styles.text} style={{ color: color }}>
        {text}
      </p>
    </button>
  );
};
