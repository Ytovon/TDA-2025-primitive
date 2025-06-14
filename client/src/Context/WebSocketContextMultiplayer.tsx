import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { getAccessTokenAsync } from "../API/tokenstorage";
import { useAuth } from "./AuthContext";
import { UserApiClient } from "../API/UserApi";
import { UserModel } from "../Model/UserModel";

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  status: string;
  sendMessage: (message: any) => void;
  gameID: string;
  multiplayerBoard: string[][];
  multiplayerWinner: string | null;
  opponnentUUID: string | null;
  startConnection: () => void;
  waitingForMatch: boolean;
  timer: number;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProviderMultiplayer: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("...");
  const [gameID, setGameID] = useState("");
  const [multiplayerBoard, setMultiplayerBoard] = useState<string[][]>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const { user, setGlobalUser } = useAuth();
  const [multiplayerWinner, setWinner] = useState<string | null>(null);
  const [opponnentUUID, setOpponnentUUID] = useState<string | null>(null);

  const [waitingForMatch, setWaitingForMatch] = useState(false);
  const waitingRef = useRef(false);

  const [timer, setTimer] = useState<number>(0);

  // Synchronizuj waitingRef s waitingForMatch stavem
  useEffect(() => {
    console.log("waitingForMatch changed to:", waitingForMatch);
  }, [waitingForMatch]);

  // Synchronizuj socketRef s socket stavem
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  // Časovač pro čekání na soupeře
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (waitingForMatch) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [waitingForMatch]);

  const startConnection = useCallback(async () => {
    // Pokud už je websocket otevřený nebo čekáme na match, nedělej nic
    if (
      (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) ||
      waitingRef.current
    ) {
      console.log(
        "Already connected or waiting for match, skipping startConnection"
      );
      return;
    }

    const token = await getAccessTokenAsync();
    const ws = new WebSocket(`ws://localhost:5000/ws?token=${token}`);

    // Okamžitě nastav socket a ref
    setSocket(ws);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      setWaitingForMatch(true); // Toto synchronizuje i waitingRef

      setTimeout(() => {
        ws.send(JSON.stringify({ type: "matchmaking" }));
      }, 1000);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.type) {
        case "matched":
          setStatus("Soupeř nalezen!");
          setGameID(data.gameId);
          setOpponnentUUID(data.opponnentUUID);

          setTimeout(() => {
            setWaitingForMatch(false); // Zruší čekání, synchronizuje waitingRef
          }, 3000);
          break;

        case "update":
          setStatus(data.message);
          setMultiplayerBoard(data.board);
          break;

        case "end":
          setStatus(data.message);
          setWinner(data.winner);
          const userToUpdate: UserModel | string =
            await UserApiClient.getUserByUUID(user?.uuid || "");
          if (userToUpdate instanceof Object) setGlobalUser(userToUpdate);
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
      setSocket(null);
      socketRef.current = null;
      setWaitingForMatch(false); // Synchronizuje waitingRef
    };
  }, [setGlobalUser, user?.uuid]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
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
        opponnentUUID,
        startConnection,
        waitingForMatch,
        timer,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketMultiplayer = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
