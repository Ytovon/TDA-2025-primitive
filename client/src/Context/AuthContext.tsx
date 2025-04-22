import { createContext, useContext, useEffect, useState } from "react";
import { UserApiClient } from "../API/UserApi";
import { getAccessToken, getRefreshToken, setUUID } from "../API/tokenstorage";
import { User } from "../Model/UserModel";

interface AuthContextType {
  isAuthenticated: boolean | null;
  logout: () => void;
  login: () => void;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [user, setUser] = useState<User>(new User("", "", "", 0, 0, 0, 0)); // Initialize user state

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

    const fetchSpecificUserData = async () => {
      // wait here for half a second
      await new Promise((resolve) => setTimeout(resolve, 100));

      const uuid = localStorage.getItem("uuid");
      if (uuid) {
        const userData: User | string = await UserApiClient.getUserByUUID(uuid);
        setUser(userData as User);
      }
    };

    checkAuth();
    console.log("isAuthenticated", isAuthenticated);
    fetchSpecificUserData();
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
    <AuthContext.Provider value={{ isAuthenticated, logout, login, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
