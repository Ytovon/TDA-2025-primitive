import React, { useState, useEffect } from "react";
import styles from "./LoadingPage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import BlinkingEyesSVG from "../../Components/Animation/lightbulb";
// import { useWebSocket } from "../../Hooks/useWebSocket";
import { UserApiClient } from "../../API/UserApi";
import {
  getRefreshToken,
  getAccessTokenAsync,
  setAccessToken,
  clearTokens,
  clearUUID,
} from "../../API/tokenstorage"; // Your token storage functions
import { useWebSocketMultiplayer } from "../../Context/WebSocketContextMultiplayer";

export const LoadingPage = () => {
  const navigate = useNavigate();
  const { status, startConnection } = useWebSocketMultiplayer();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const refreshToken = getRefreshToken() ?? "";
        const accessTokenToCheck = (await getAccessTokenAsync()) ?? "";

        const isValid: any = await UserApiClient.verifyToken(
          accessTokenToCheck
        );

        console.log("Co je to isValid:", isValid);

        const isValidToCheck = isValid == false ? isValid : isValid.data.valid;

        if (isValidToCheck == false) {
          console.log("hell");

          await UserApiClient.refreshToken(refreshToken);

          const newAccessToken = (await getAccessTokenAsync()) ?? "";

          console.log(
            newAccessToken == accessTokenToCheck || accessTokenToCheck == null
          );

          // refresh was unsuccessful - clear tokens and navigate to login
          if (
            newAccessToken == accessTokenToCheck ||
            accessTokenToCheck == null
          ) {
            clearTokens();
            clearUUID();
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Access verification failed:", error);
      }
    };
    startConnection();
    verifyAccess();

    return () => {};
  }, [navigate]);

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
