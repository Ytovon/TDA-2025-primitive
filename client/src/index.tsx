import React, { ReactNode } from "react";
import InterceptorSetup from "./interceptorSetup"; // Import the new component
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { DarkModeProvider } from "./Context/DarkModeContext";
import { WebSocketProvider } from "./Context/WebSocketContext";
import CardsPage from "./Pages/CardsPage/CardsPage";
import { GamePage } from "./Pages/GamePage/GamePage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import HomePage from "./Pages/HomePage/HomePage";
import { EditorPage } from "./Pages/EditorPage/EditorPage";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { LeaderboardPage } from "./Pages/LeaderboardPage/LeaderboardPage";
import { LoadingPage } from "./Pages/LoadingPage/LoadingPage";
import { useNavigate } from "react-router-dom";
import { ProfilePage } from "./Pages/ProfilePage/ProfilePage";
import { LobbyPage } from "./Pages/LobbyPage/LobbyPage";
import { PlayerListPage } from "./Pages/PlayerListPage/PlayerListPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

interface WebSocketWrapperProps {
  children: ReactNode; // Typing 'children' properly as ReactNode
}

const WebSocketWrapper: React.FC<WebSocketWrapperProps> = ({ children }) => {
  const navigate = useNavigate(); // Get navigate hook here
  return <WebSocketProvider navigate={navigate}>{children}</WebSocketProvider>;
};

root.render(
  // <React.StrictMode>
  <DarkModeProvider>
    <Router>
      <InterceptorSetup />{" "}
      {/* Add the InterceptorSetup component inside Router */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Games" element={<CardsPage />} />
        <Route
          path="/freeplay"
          element={
            <WebSocketWrapper>
              <GamePage />
            </WebSocketWrapper>
          }
        />
        <Route path="/freeplay/:uuid" element={<GamePage />} />
        <Route path="/EditorPage" element={<EditorPage />} />
        <Route path="/EditorPage/:uuid" element={<EditorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Profile/:uuid" element={<ProfilePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/players" element={<PlayerListPage />} />
        <Route
          path="/loading"
          element={
            <WebSocketWrapper>
              <LoadingPage />{" "}
            </WebSocketWrapper>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </DarkModeProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
