import decodeJWT from "jwt-decode";

/**
 * determine if a user is authenticated or not
 * @returns boolean
 */
export const isAuthenticated = () => {
  const token = getAuthToken();

  if (token) {
    const decodedToken: { exp: number } = decodeJWT(token);
    const { exp } = decodedToken;
    const currentTime = Date.now() / 1000;

    if (exp < currentTime) {
      clearVault();
      return false;
    }

    return true;
  }

  return false;
};

/**
 * set auth token
 * @param token
 * @type {string}
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

/**
 * get auth token from storage
 * @returns {string | null}
 */
export const getAuthToken = () => {
  let token = localStorage.getItem("token");
  return token || null;
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

/**
 * clear auth storage
 * @returns { null}
 */
export const clearVault = () => {
  //clear the localStorage,
  localStorage.removeItem("token");
  localStorage.clear();
};
