import React, { useEffect, useState } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  image?: string;
  color?: string;
  border?: boolean;
  backgroundColor?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
  isVisible?: boolean;
  width?: string;
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
  width,
}) => {
  const [buttonColor, setButtonColor] = useState<React.CSSProperties>({
    backgroundColor: "00000000",
  });
  const [buttonBorder, setButtonBorder] = useState<React.CSSProperties>({
    border: "00000000",
  });

  useEffect(() => {
    if (backgroundColor) {
      setButtonColor({ backgroundColor: "#0070BB" });
    } else if (backgroundColor == false) {
      setButtonColor({ backgroundColor: "#E31837" });
    } else {
      setButtonColor({ backgroundColor: "#00000000" });
    }

    if (border) {
      setButtonBorder({ border: "3px solid #0070BB" });
    } else if (border == false) {
      setButtonBorder({ border: "3px solid #E31837" });
    } else {
      setButtonBorder({ border: "#00000000" });
    }
  }, [backgroundColor, border]);

  return (
    <button
      disabled={isDisabled}
      className={styles.button}
      onClick={onClick}
      style={{
        ...buttonColor,
        ...buttonBorder,
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
