import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../API/tokenstorage";
import { json } from "stream/consumers";

const WEBSOCKET_URL = `ws://localhost:5000/ws?token=${getAccessToken()}`;

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  status: string;
  sendMessage: (message: any) => void;
  gameID: string;
  multiplayerBoard: string[][];
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
  const [status, setStatus] = useState("Čekám na uživatele");
  const [gameID, setGameID] = useState("");
  const [multiplayerBoard, setMultiplayerBoard] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    setSocket(ws);

    ws.onopen = async () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);

      setTimeout(() => {
        ws.send(JSON.stringify({ type: "matchmaking" }));
      }, 1000); // Small delay (100ms)
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "matched") {
        setStatus("Matched! Game ID: " + data.gameId);
        setGameID(data.gameId);
        navigate(`/game`); // Use navigate to redirect to the matched game
      } else if (data.type === "waiting") {
        setStatus(data.message);
      } else if (data.type === "error") {
      } else if (data.type === "update") {
        setStatus(data.message);

        console.log(data.board);

        setMultiplayerBoard(data.board);
      } else if (data.type === "error") {
        setStatus("Error: " + data.message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
      console.log(message);
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
