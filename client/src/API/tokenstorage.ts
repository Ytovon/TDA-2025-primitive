// Token Storage (localStorage example)
export const getAccessToken = () => localStorage.getItem("access_token");

export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const setAccessToken = (token: string) =>
  localStorage.setItem("access_token", token);

export const setRefreshToken = (token: string) =>
  localStorage.setItem("refresh_token", token);

// Clear both tokens (for logout or token expiration)
export const clearTokens = () => {
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("access_token");
};
