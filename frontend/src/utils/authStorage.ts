const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export type UserRole = "admin" | "teacher" | "student" | "parent";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
};

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

export function getStoredUser(): AuthUser | null {
  const storedUser =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    clearAuthStorage();
    return null;
  }
}

export function saveAuthData(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
  rememberMe: boolean,
): void {
  clearAuthStorage();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  storage.setItem(USER_KEY, JSON.stringify(user));
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

export function saveUser(
  user: AuthUser,
  rememberMe: boolean,
): void {
  const storage = rememberMe ? localStorage : sessionStorage;

  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);

  storage.setItem(USER_KEY, JSON.stringify(user));
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

export function clearAuthStorage(): void {
  clearTokens();

  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}