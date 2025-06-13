import React, { useState, useEffect } from "react";
import styles from "./LoadingPage.module.css";
import Header from "../../Components/Header/Header";
import BlinkingEyesSVG from "../../Components/Animation/lightbulb";
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";
import { useAuth } from "../../Context/AuthContext";

export const LoadingPage = () => {
  const { status, startConnection } = useWebSocketMultiplayer();
  const { validate, isAuthenticated } = useAuth();

  useEffect(() => {
    validate();
    if (isAuthenticated === true) {
      startConnection();
    }
  }, []);

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <p className={styles.status}>{status}</p>
        <BlinkingEyesSVG isRedPlayer={true} OnMove={true} />
      </div>
    </div>
  );
};
