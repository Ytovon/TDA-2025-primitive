import React, { useState } from "react";
import styles from "./FallingSymbols.module.css";
import { symbolX, symbolO } from "../../assets/assets";

interface FallingSymbolsProps {
  img: string;
  speed?: number;
  position?: number;
  rotation?: number;
}

export const FallingSymbols: React.FC<FallingSymbolsProps> = ({
  img,
  speed = 4,
  position = 0,
  rotation = 0,
}) => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <img
          className={styles.image}
          src={img}
          alt=""
          style={
            {
              animationDuration: `${speed}s`,
              left: `${position}%`,
              "--rotation": `${rotation}deg`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};
