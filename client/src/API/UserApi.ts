import { userApiInstance } from "../API/AxiosIntance"; // Import your shared Axios instance
import { UserModel } from "../Model/UserModel.js";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  clearUUID,
} from "../API/tokenstorage"; // Your token storage functions

export class UserApiClient {
  // Register new user
  static async registerUser(
    user: Pick<UserModel, "username" | "email" | "password">
  ): Promise<{ status: number; message: string }> {
    try {
      const response = await userApiInstance.post(`/register`, user);
      return {
        status: response.status,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error registering new user:", error);
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  // Login user
  static async loginUser(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<
    { user: UserModel; accessToken: string; refreshToken: string } | string
  > {
    try {
      const response = await userApiInstance.post(`/login`, credentials);
      const { user, accessToken, refreshToken } = response.data;

      // Store the tokens (You can adjust this based on your storage logic)
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.error("Error logging in user:", error);
      return error.response?.data?.message || error.message;
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await userApiInstance.post(`/refresh-token`, {
        token: refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
      }

      return newAccessToken;
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      return error.response?.data?.message || error.message;
    }
  }

  static async verifyToken(token: string): Promise<boolean> {
    try {
      return await userApiInstance.post(`/verify-token`, { token });
    } catch (error: any) {
      console.error("Error verifying token:", error);
      return false;
    }
  }

  // Logout user
  static async logoutUser(): Promise<string> {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await userApiInstance.post(`/logout`, {
          token: refreshToken,
        });
      }

      // Clear tokens from storage
      clearTokens();
      clearUUID();

      return "Logged out successfully";
    } catch (error: any) {
      console.error("Error logging out user:", error);
      return error.response?.data?.message || error.message;
    }
  }
  // Get user by UUID
  static async getUserByUUID(uuid: string): Promise<UserModel | string> {
    try {
      const response = await userApiInstance.get(`/${uuid}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user by UUID:", error);
      return error.response?.data?.message || error.message;
    }
  }

  // Get all users
  static async getAllUsers(): Promise<UserModel[] | string> {
    try {
      const response = await userApiInstance.get("");
      console.log("API response:", response.data); // Přidej výpis do konzole
      return response.data;
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      return error.response?.data?.message || error.message;
    }
  }

  static async updateUserBanStatus(uuid: string, isBanned: boolean) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/ban/${uuid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBanned }),
        }
      );

      if (!response.ok) throw new Error("Chyba při aktualizaci banu");
    } catch (error) {
      console.error("Nepodařilo se změnit stav banu:", error);
    }
  }

  static async updateUserElo(uuid: string, newElo: number): Promise<void> {
    return fetch(`http://localhost:5000/api/users/elo/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elo: newElo }),
    }).then((res) => {
      if (!res.ok) throw new Error("Chyba při aktualizaci ELO");
      return res.json();
    });
  }

  static async updateUser(uuid: string, data: Partial<UserModel>) {
    const response = await fetch(`http://localhost:5000/api/users/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok
      ? response.json()
      : Promise.reject("Chyba při aktualizaci");
  }
}
