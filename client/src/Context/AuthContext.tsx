import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserModel } from "../Model/UserModel";
import { UserApiClient } from "../API/UserApi";
import { getAccessTokenAsync, getRefreshToken } from "../API/tokenstorage";

interface AuthContextType {
  user: UserModel | null;
  uuid: string | null;
  isAuthenticated: boolean;
  setGlobalUser: (userData: UserModel) => void;
  validate: (forceLogin: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [uuid, setUUID] = useState<string | null>(() =>
    localStorage.getItem("uuid")
  );
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  // Validace tokenu při startu app nebo volání validate
  const validate = async (forceLogin: boolean) => {
    const token = await getAccessTokenAsync();
    if (!token) {
      logout();
      return;
    }

    let response = await UserApiClient.verifyToken(token);
    if (!response.valid) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const newToken = await UserApiClient.refreshToken(refreshToken);
        if (newToken) {
          response = await UserApiClient.verifyToken(newToken);
        }
      }
    }

    if (response.valid) {
      setUUID(response.uuid);
      setAuthenticated(true);

      const userData = await UserApiClient.getUserByUUID(response.uuid || "");
      setUser(userData as UserModel);
    } else {
      logout();
    }
  };

  // Logout - smaže localStorage a resetuje stav
  const logout = () => {
    localStorage.removeItem("uuid");
    setUser(null);
    setUUID(null);
    setAuthenticated(false);
  };

  const setGlobalUser = (userData: User) => {
    setUser(userData);
  };

  // Validace tokenu při mountu provideru
  useEffect(() => {
    validate(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, uuid, isAuthenticated, validate, logout, setGlobalUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pro použití AuthContextu
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musí být použit uvnitř AuthProvider");
  }
  return context;
};
