export const getAccessTokenAsync = async (): Promise<string | null> => {
  return new Promise<string | null>((resolve) => {
    // Nejdřív načteme token
    const token = localStorage.getItem("access_token");
    console.log("Načtený access token:", token);

    // Počkej 500 ms a pak teprve vrať token
    setTimeout(() => {
      resolve(token);
    }, 700);
  });
};

export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const setAccessToken = (token: string) =>
  localStorage.setItem("access_token", token);

export const setRefreshToken = (token: string) =>
  localStorage.setItem("refresh_token", token);

export const setUUID = (uuid: string) => localStorage.setItem("uuid", uuid);
export const getUUID = (uuid: string) => localStorage.getItem("uuid");

// Clear both tokens (for logout or token expiration)
export const clearTokens = () => {
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("access_token");
};

export const clearUUID = () => localStorage.removeItem("uuid");
