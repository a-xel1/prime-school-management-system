import api from "../api/axios";
import {
  getAccessToken,
  getRefreshToken,
} from "../utils/authStorage";

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type RegisteredUser = {
  id: number;
  username: string;
  email: string;
};

export async function requestPasswordReset(
  email: string,
): Promise<string> {
  const response = await api.post<{ detail: string }>(
    "/api/auth/password-reset/",
    {
      email: email.trim(),
    },
  );

  return response.data.detail;
}

export async function confirmPasswordReset(
  uid: string,
  token: string,
  newPassword: string,
  newPasswordConfirm: string,
): Promise<string> {
  const response = await api.post<{ detail: string }>(
    `/api/auth/password-reset-confirm/${uid}/${token}/`,
    {
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    },
  );

  return response.data.detail;
}

export async function registerUser(
  data: RegisterData,
): Promise<RegisteredUser> {
  const response = await api.post<RegisteredUser>(
    "/api/auth/register/",
    data,
  );

  return response.data;
}

export async function logoutUser(): Promise<void> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return;
  }

  await api.post(
    "/api/auth/logout/",
    {
      refresh: refreshToken,
    },
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  );
}