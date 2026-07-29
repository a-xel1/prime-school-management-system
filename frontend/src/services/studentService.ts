import api from "../api/axios";

export type StudentStats = {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  suspended: number;
};

export async function getStudentStats(): Promise<StudentStats> {
  const response = await api.get<StudentStats>(
    "/api/students/stats/",
  );

  return response.data;
}