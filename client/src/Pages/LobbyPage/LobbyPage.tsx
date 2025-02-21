import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { create } from "domain";
import { arrowWhite } from "../../assets/assets";
import { useDarkMode } from "../../Context/DarkModeContext";

export const LobbyPage = () => {
  const { darkMode } = useDarkMode();
  const [createLobby, setCreateLobby] = useState(false);
  const [useLink, setUseLink] = useState(false);
  const [code, setCode] = useState<string>("");

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  return (
    <div>
      <Header />

      <div style={{ marginTop: "100px", color: "var(--color-text-primary)" }}>
        <h1>Hra s přítelem</h1>
        <p>Na co čekáš? Pojď si zahrát!</p>

        <div
          style={{
            display: createLobby ? "none" : "block",
            visibility: useLink ? "hidden" : "visible",
          }}
        >
          <Button
            onClick={() => setCreateLobby(true)}
            text="Vytvořit lobby"
            backgroundColor={false}
            color="white"
          />
          <Button
            onClick={() => setUseLink(true)}
            text="Připojit se přes kód"
            backgroundColor
            color="white"
          />
        </div>

        <div style={{ display: createLobby ? "block" : "none" }}>
          <button onClick={() => setCreateLobby(false)}>
            <img
              style={{
                width: "25px",
                cursor: "pointer",
              }}
              src={darkMode ? arrowWhite : arrowWhite}
              alt=""
            />
          </button>
          <Button
            text="Kopírovat: 793-329"
            backgroundColor={false}
            color="white"
          />
          <Button text="Kopírovat: 444-542" backgroundColor color="white" />
        </div>

        <div style={{ display: useLink ? "block" : "none" }}>
          <button onClick={() => setUseLink(false)}>
            <img
              style={{
                width: "25px",
                cursor: "pointer",
              }}
              src={darkMode ? arrowWhite : arrowWhite}
              alt=""
            />
          </button>
          <input
            type="text"
            name=""
            placeholder="Vložit kód"
            value={code}
            onChange={handleCodeChange}
          />
          <Button
            text="Potvrdit"
            color="var(--color-text-primary)"
            backgroundColor
          />
        </div>
      </div>
    </div>
  );
};
