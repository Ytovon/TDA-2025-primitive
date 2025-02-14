import React, { useContext, createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { DarkModeProvider } from "./DarkModeContext";
import CardsPage from "./Pages/CardsPage/CardsPage";
import { GamePage } from "./Pages/GamePage/GamePage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import HomePage from "./Pages/HomePage/HomePage";
import { EditorPage } from "./Pages/EditorPage/EditorPage";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { UserPage } from "./Pages/UserPage/UserPage";
import { Leaderboard } from "./Pages/LeaderboardPage/Leaderboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/Games",
    element: <CardsPage />,
  },
  {
    path: "/Game",
    element: <GamePage />,
  },
  {
    path: "/Game/:uuid",
    element: <GamePage />,
  },
  {
    path: "/EditorPage",
    element: <EditorPage />,
  },
  {
    path: "/EditorPage/:uuid",
    element: <EditorPage />,
  },
  {
    path: "/Login",
    element: <LoginPage />,
  },
  {
    path: "/UserPage/:uuid",
    element: <UserPage />,
  },
  {
    path: "/Leaderboard",
    element: <Leaderboard />,
  },
]);

root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
