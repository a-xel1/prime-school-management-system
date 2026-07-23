const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getRefreshToken(): string | null {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ??
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean,
): void {
  clearTokens();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function saveAccessToken(accessToken: string): void {
  const refreshTokenIsLocal =
    localStorage.getItem(REFRESH_TOKEN_KEY) !== null;

  const refreshTokenIsSession =
    sessionStorage.getItem(REFRESH_TOKEN_KEY) !== null;

  if (refreshTokenIsLocal) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  if (refreshTokenIsSession) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}