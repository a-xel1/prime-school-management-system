import api from "../api/axios";
import type { UserRole } from "../utils/authStorage";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
};

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfile>(
    "/api/auth/profile/",
  );

  return response.data;
}