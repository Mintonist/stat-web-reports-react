const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const LOCAL_ID = 'user-local-id';

export function setTokens({ experiesIn = 3600, refreshToken, idToken, localId }) {
  const expiresDate = new Date().getTime() + experiesIn * 1000;
  localStorage.setItem(TOKEN_KEY, idToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate.toString());
  localStorage.setItem(LOCAL_ID, localId);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(LOCAL_ID);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getUserId() {
  return localStorage.getItem(LOCAL_ID);
}

export function getExpiresDate() {
  return Number(localStorage.getItem(EXPIRES_KEY));
}

const localStorageService = { setTokens, clearTokens, getAccessToken, getRefreshToken, getExpiresDate, getUserId };

export default localStorageService;
