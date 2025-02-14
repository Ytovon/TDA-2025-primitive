import { userApiInstance } from "../API/AxiosIntance"; // Import your shared Axios instance
import { UserModel } from "../Model/UserModel.js";

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
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.error("Error logging in user:", error);
      return error.response?.data?.message || error.message;
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<string | void> {
    try {
      const response = await userApiInstance.post(`/refresh-token`, {
        token: refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);

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
  static async logoutUser(): Promise<string | void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await userApiInstance.post(`/logout`, {
          token: refreshToken,
        });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return "Logged out successfully";
    } catch (error: any) {
      console.error("Error logging out user:", error);
      return error.response?.data?.message || error.message;
    }
  }
}
