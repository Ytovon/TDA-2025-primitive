import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../API/tokenstorage";

const WEBSOCKET_URL = `ws://localhost:5000/ws?token=${getAccessToken()}`;

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  status: string;
  sendMessage: (message: any) => void;
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

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "matchmaking" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "matched") {
        setStatus("Matched! Game ID: " + data.gameId);
        navigate(`/game`); // Use navigate to redirect to the matched game
      } else if (data.type === "waiting") {
        setStatus(data.message);
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

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [navigate]); // `navigate` is included as a dependency for useEffect

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, status, sendMessage }}
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
