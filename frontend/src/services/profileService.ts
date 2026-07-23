import api from "../api/axios";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
};

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfile>(
    "/api/auth/profile/",
  );

  return response.data;
}