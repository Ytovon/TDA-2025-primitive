import { createContext, useContext, useEffect, useState } from "react";
import { UserApiClient } from "../API/UserApi";
import { getAccessToken, getRefreshToken, setUUID } from "../API/tokenstorage";

interface AuthContextType {
  isAuthenticated: boolean | null;
  logout: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token && token !== "" && token !== undefined) {
        let isValid: any = await UserApiClient.verifyToken(token);

        if (!isValid) {
          // Try to refresh the token if the current token is not valid
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const newAccessToken = await UserApiClient.refreshToken(
              refreshToken
            );
            if (newAccessToken) {
              isValid = await UserApiClient.verifyToken(newAccessToken);
            }
          }
        }
        if (isValid && isValid.data) {
          const valid = isValid.data.valid;
          const uuid = isValid.data.uuid;

          setIsAuthenticated(valid);

          if (valid && uuid) {
            setUUID(uuid);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Logout function
  const login = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
