import { userApiInstance } from "../API/AxiosIntance"; // Import your shared Axios instance
import { UserModel } from "../Model/UserModel.js";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  clearUUID,
} from "../API/tokenstorage"; // Your token storage functions

import { MatchmakingGame } from "../Model/MatchmakingGameModel";

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

  static async verifyToken(
    token: string
  ): Promise<{ valid: boolean; uuid: string | null }> {
    try {
      const response = await userApiInstance.post(`/verify-token`, { token });
      return {
        valid: response.data.valid,
        uuid: response.data.uuid || null,
      };
    } catch (error: any) {
      console.error("Error verifying token:", error);
      return { valid: false, uuid: null };
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

  static async getUsersByUUIDs(
    uuids: string[]
  ): Promise<Record<string, UserModel>> {
    if (uuids.length === 0) {
      throw new Error("At least one UUID must be provided.");
    }

    try {
      const response = await userApiInstance.post(`/batch/`, {
        uuids: uuids,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching users by UUIDs:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch users by UUIDs."
      );
    }
  }

  // Update user by UUID
  static async updateUserByUUID(
    uuid: string,
    userData: Partial<UserModel>
  ): Promise<UserModel | string> {
    try {
      const response = await userApiInstance.put(`/${uuid}`, userData);
      return response.data;
    } catch (error: any) {
      console.error("Error updating user by UUID:", error);
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

  static async getGameHistoryByUUID(uuid: string): Promise<MatchmakingGame[]> {
    if (!uuid) throw new Error("UUID is required.");

    try {
      const response = await userApiInstance.get<MatchmakingGame[]>(
        `${uuid}/history`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch game history."
      );
    }
  }

  static async updateUserBanStatus(uuid: string, isBanned: boolean) {
    try {
      console.log(
        "Volám updateUserBanStatus s tokenem:",
        userApiInstance.defaults.headers["Authorization"]
      );

      const response = await userApiInstance.post(`/ban/${uuid}`, { isBanned });

      console.log("User ban update");

      if (!response.status.toString().startsWith("2")) {
        throw new Error("Chyba při aktualizaci banu");
      }
    } catch (error) {
      console.error("Nepodařilo se změnit stav banu:", error);
    }
  }
}
