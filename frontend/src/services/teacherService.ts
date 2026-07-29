import api from "../api/axios";

export type TeacherGender =
  | "male"
  | "female"
  | "other";

export type TeacherStatus =
  | "active"
  | "inactive"
  | "on_leave"
  | "terminated";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract";

export type Teacher = {
  id: number;
  user: number | null;
  staff_number: string;
  first_name: string;
  last_name: string;
  other_names: string;
  full_name: string;
  date_of_birth: string;
  gender: TeacherGender;
  email: string;
  phone_number: string;
  address: string;
  qualification: string;
  specialization: string;
  employment_date: string;
  employment_type: EmploymentType;
  status: TeacherStatus;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
};

export type TeacherListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Teacher[];
};

export type TeacherListParams = {
  page?: number;
  search?: string;
  status?: TeacherStatus | "";
  employment_type?: EmploymentType | "";
};

export type TeacherFormPayload = {
  first_name: string;
  last_name: string;
  other_names: string;
  date_of_birth: string;
  gender: TeacherGender;
  email: string;
  phone_number: string;
  address: string;
  qualification: string;
  specialization: string;
  employment_date: string;
  employment_type: EmploymentType;
  status: TeacherStatus;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

export type TeacherStats = {
  total: number;
  active: number;
  inactive: number;
  on_leave: number;
  terminated: number;
  full_time: number;
  part_time: number;
  contract: number;
};

export async function getTeachers(
  params: TeacherListParams = {},
): Promise<TeacherListResponse> {
  const response = await api.get<TeacherListResponse>(
    "/api/teachers/",
    {
      params: {
        page: params.page,
        search: params.search || undefined,
        status: params.status || undefined,
        employment_type:
          params.employment_type || undefined,
      },
    },
  );

  return response.data;
}

export async function getTeacher(
  teacherId: number | string,
): Promise<Teacher> {
  const response = await api.get<Teacher>(
    `/api/teachers/${teacherId}/`,
  );

  return response.data;
}

export async function getTeacherStats(): Promise<TeacherStats> {
  const response = await api.get<TeacherStats>(
    "/api/teachers/stats/",
  );

  return response.data;
}

export async function createTeacher(
  data: TeacherFormPayload,
): Promise<Teacher> {
  const response = await api.post<Teacher>(
    "/api/teachers/",
    data,
  );

  return response.data;
}

export async function updateTeacher(
  teacherId: number | string,
  data: TeacherFormPayload,
): Promise<Teacher> {
  const response = await api.patch<Teacher>(
    `/api/teachers/${teacherId}/`,
    data,
  );

  return response.data;
}

export async function deleteTeacher(
  teacherId: number,
): Promise<void> {
  await api.delete(`/api/teachers/${teacherId}/`);
}