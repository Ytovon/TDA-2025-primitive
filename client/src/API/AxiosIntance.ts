import axios from "axios";
import {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "./tokenstorage";

// Create Axios instances for users and games
export const userApiInstance = axios.create({
  baseURL: "http://localhost:5000/api/users/",
  timeout: 10000,
});

export const gameApiInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/games/",
  timeout: 10000,
});

// Function to set Authorization header
const setAuthHeader = (instance: any, token: string | null) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
};

// Attach access token on startup
const token = getAccessToken();
if (token) {
  setAuthHeader(userApiInstance, token);
  setAuthHeader(gameApiInstance, token);
}

// Refresh token function
const refreshAccessToken = async (navigate: any) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      "http://localhost:5000/api/users/refresh-token",
      { refresh_token: refreshToken }
    );

    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Update authorization headers with the new token
    setAuthHeader(userApiInstance, access_token);
    setAuthHeader(gameApiInstance, access_token);

    return access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    clearTokens(); // Clear invalid tokens
    navigate("/login");
    return null;
  }
};

// Response interceptor for handling 401 errors (token expiration)
const responseInterceptor = (navigate: any) => async (error: any) => {
  const originalRequest = error.config;

  if (
    (error.response?.status === 401 || error.response?.status === 4001) &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true; // Avoid infinite loops

    const newToken = await refreshAccessToken(navigate);
    if (newToken) {
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return axios(originalRequest); // Retry request with new token
    }
  }
  return Promise.reject(error);
};

// Function to setup interceptors
export const setupInterceptors = (navigate: any) => {
  userApiInstance.interceptors.response.use(
    (res: any) => res,
    responseInterceptor(navigate)
  );
  gameApiInstance.interceptors.response.use(
    (res: any) => res,
    responseInterceptor(navigate)
  );
};
