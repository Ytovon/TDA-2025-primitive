import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../API/tokenstorage";

const WEBSOCKET_URL = `ws://localhost:5000/ws?token=${getAccessToken()}`;

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  status: string;
  sendMessage: (message: any) => void;
  gameID: string;
  multiplayerBoard: string[][];
  multiplayerWinner: string | null;
  startConnection: () => void; // NEW FUNCTION
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: React.ReactNode;
  navigate: Function; // Accept navigate as prop
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  navigate,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("...");
  const [gameID, setGameID] = useState("");
  const [multiplayerBoard, setMultiplayerBoard] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [multiplayerWinner, setWinner] = useState<string | null>(null);

  // Function to start WebSocket connection (only called when needed)
  const startConnection = () => {
    if (socket) return; // Prevent re-initializing if already connected

    const ws = new WebSocket(WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);

      setTimeout(() => {
        ws.send(JSON.stringify({ type: "matchmaking" }));
      }, 1000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.type) {
        case "matched":
          setStatus("Match! Game ID: " + data.gameId);
          setGameID(data.gameId);
          navigate("/game");
          break;
        case "update":
          setStatus(data.message);
          setMultiplayerBoard(data.board);
          break;
        case "end":
          setStatus(data.message);
          setWinner(data.winner);
          break;
        default:
          setStatus(data.message);
          break;
      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsConnected(false);
      setSocket(null); // Reset socket on close
    };
  };

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
      console.log("Sent:", message);
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        status,
        sendMessage,
        gameID,
        multiplayerBoard,
        multiplayerWinner,
        startConnection, // Expose the function
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
