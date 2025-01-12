import React, { useState, useEffect } from "react";
import styles from "./BackgroundSymbol.module.css";

interface BackgroundSymbolProps {
  isXmark: boolean;
  height: number;
  width: number;
  startTop: number;
  left: number;
}

const BackgroundSymbol: React.FC<BackgroundSymbolProps> = ({
  isXmark,
  height,
  width,
  startTop,
  left,
}) => {
  const [topPosition, setTopPosition] = useState(startTop);
  const [lastScrollY, setLastScrollY] = useState(startTop);
  const [maxScroll, setMaxScroll] = useState(0); // Store max scroll
  const [scrollAmount, setScrollAmount] = useState(2); // value

  // Calculate maxScroll on initialization
  useEffect(() => {
    setScrollAmount((width / 100) * 1);

    const calculatedMaxScroll = document.documentElement.scrollHeight;
    setMaxScroll(calculatedMaxScroll);
  }, []);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Only adjust if the current scroll is less than maxScroll
    if (currentScrollY < maxScroll) {
      let newTopPosition = topPosition;

      if (currentScrollY > lastScrollY) {
        // Scrolling down, increase topPosition by 2 units
        newTopPosition += scrollAmount;
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, decrease topPosition by 2 units
        newTopPosition -= scrollAmount;
      }
      setTopPosition(newTopPosition);
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, maxScroll]); // Adding maxScroll as a dependency ensures it works after the initialization

  return (
    <div
      className={styles.XBackground}
      style={{ top: `${topPosition}px`, left: `${left}vw` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={isXmark ? "0 0 384 504" : "0 0 28.9 28.9"}
      >
        {isXmark ? (
          <path
            strokeWidth="25"
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          />
        ) : (
          <path d="M0,14.15c0,7.86,6.29,14.15,14.15,14.15s14.15-6.29,14.15-14.15S22.02,0,14.15,0C6.42,0,0,6.29,0,14.15ZM14.29,7.34c3.8,0,6.82,3.01,6.82,6.82s-3.01,6.82-6.82,6.82-6.82-3.01-6.82-6.82c-.13-3.8,3.01-6.82,6.82-6.82Z" />
        )}
      </svg>
    </div>
  );
};

export default BackgroundSymbol;
