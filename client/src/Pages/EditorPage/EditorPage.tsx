import React from "react";
import styles from "./EditorPage.module.css";
import { arrowBlack, arrowWhite } from "../../assets/assets";
import { useDarkMode } from "../../DarkModeContext";
import { Link } from "react-router-dom";

export default function EditorPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <header>
        <Link to="/"></Link>
        <img src={darkMode ? arrowBlack : arrowWhite} />
      </header>
    </div>
  );
}
