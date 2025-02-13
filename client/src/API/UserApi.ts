import { UserModel } from "../Model/UserModel.js";

export class UserApiClient {
  static url: string = "http://localhost:5000/api/users";

  static async registerUser(
    user: Pick<UserModel, "username" | "email" | "password">
  ): Promise<{ status: number; message: string }> {
    try {
      const response = await fetch(`${this.url}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      return {
        status: response.status,
        message: data.message,
      };
    } catch (error: any) {
      console.error("Error registering new user:", error);
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  static async loginUser(credentials: {
    usernameOrEmail: string;
    password: string;
  }): Promise<
    { user: UserModel; accessToken: string; refreshToken: string } | string
  > {
    try {
      const response = await fetch(`${this.url}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error: any) {
      console.error("Error logging in user:", error);
      return error.message;
    }
  }

  static async refreshToken(token: string): Promise<string | void> {
    try {
      const response = await fetch(`${this.url}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.accessToken;
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      return error.message;
    }
  }

  static async logoutUser(token: string): Promise<string | void> {
    try {
      const response = await fetch(`${this.url}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return "Logged out successfully";
    } catch (error: any) {
      console.error("Error logging out user:", error);
      return error.message;
    }
  }
}
