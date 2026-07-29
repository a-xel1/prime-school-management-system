import axios from "axios";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "./StudentsPage.css";

type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "suspended";

type Student = {
  id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  other_names: string;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  email: string;
  phone_number: string;
  guardian_name: string;
  guardian_phone: string;
  admission_date: string;
  status: StudentStatus;
};

type StudentListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
};

const PAGE_SIZE = 10;

function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StudentStatus | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [
    studentPendingDelete,
    setStudentPendingDelete,
  ] = useState<Student | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get<StudentListResponse>(
          "/api/students/",
          {
            params: {
              page: currentPage,
              search:
                debouncedSearchTerm || undefined,
              status: statusFilter || undefined,
            },
          },
        );

        if (isMounted) {
          setStudents(response.data.results);
          setTotalStudents(response.data.count);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data as
            | { detail?: string }
            | undefined;

          setErrorMessage(
            responseData?.detail ??
              "Unable to load students.",
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading students.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    debouncedSearchTerm,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalStudents / PAGE_SIZE),
  );

  const firstRecord =
    totalStudents === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastRecord = Math.min(
    currentPage * PAGE_SIZE,
    totalStudents,
  );

  function handleStatusChange(
    status: StudentStatus | "",
  ) {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  function openDeleteDialog(student: Student) {
    setDeleteError("");
    setStudentPendingDelete(student);
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setDeleteError("");
    setStudentPendingDelete(null);
  }

  async function handleDeleteStudent() {
    if (!studentPendingDelete || isDeleting) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await api.delete(
        `/api/students/${studentPendingDelete.id}/`,
      );

      const remainingStudents = students.filter(
        (student) =>
          student.id !== studentPendingDelete.id,
      );

      setStudents(remainingStudents);
      setTotalStudents((currentTotal) =>
        Math.max(0, currentTotal - 1),
      );

      if (
        remainingStudents.length === 0 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (currentPageValue) =>
            currentPageValue - 1,
        );
      }

      setStudentPendingDelete(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { detail?: string }
          | undefined;

        setDeleteError(
          responseData?.detail ??
            "Unable to delete this student.",
        );
      } else {
        setDeleteError(
          "An unexpected error occurred while deleting the student.",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="students-page">
      <section className="students-container">
        <header className="students-header">
          <div>
            <p className="students-eyebrow">
              Student Management
            </p>

            <h1>Students</h1>

            <p>
              View and manage all registered students.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/students/add")
            }
          >
            Add Student
          </button>
        </header>

        <section className="students-panel">
          <div className="students-toolbar">
            <input
              type="search"
              placeholder="Search by name or admission number"
              aria-label="Search students"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as
                    | StudentStatus
                    | "",
                )
              }
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">
                Inactive
              </option>
              <option value="graduated">
                Graduated
              </option>
              <option value="suspended">
                Suspended
              </option>
            </select>
          </div>

          {isLoading && (
            <p className="students-message">
              Loading students...
            </p>
          )}

          {!isLoading && errorMessage && (
            <p
              className="students-message students-error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          {!isLoading &&
            !errorMessage &&
            students.length === 0 && (
              <div className="students-empty-state">
                <h2>No matching students</h2>

                <p>
                  Try changing your search or status
                  filter, or add a new student.
                </p>
              </div>
            )}

          {!isLoading &&
            !errorMessage &&
            students.length > 0 && (
              <>
                <div className="students-table-wrapper">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Admission No.</th>
                        <th>Gender</th>
                        <th>Guardian</th>
                        <th>Admission Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="student-name-cell">
                              <span className="student-avatar">
                                {student.first_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <div>
                                <strong>
                                  {student.full_name}
                                </strong>

                                <span>
                                  {student.email ||
                                    "No email"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            {
                              student.admission_number
                            }
                          </td>

                          <td className="student-capitalize">
                            {student.gender}
                          </td>

                          <td>
                            <div className="student-guardian">
                              <strong>
                                {
                                  student.guardian_name
                                }
                              </strong>

                              <span>
                                {
                                  student.guardian_phone
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            {
                              student.admission_date
                            }
                          </td>

                          <td>
                            <span
                              className={
                                `student-status ` +
                                `student-status-${student.status}`
                              }
                            >
                              {student.status}
                            </span>
                          </td>

                          <td>
                            <div className="student-actions">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/students/${student.id}`,
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/students/${student.id}/edit`,
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="student-delete-button"
                                onClick={() =>
                                  openDeleteDialog(student)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <footer className="students-pagination">
                  <p>
                    Showing {firstRecord}–{lastRecord} of{" "}
                    {totalStudents} students
                  </p>

                  <div className="students-pagination-controls">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) => page - 1,
                        )
                      }
                      disabled={
                        currentPage === 1 ||
                        isLoading
                      }
                    >
                      Previous
                    </button>

                    <span>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) => page + 1,
                        )
                      }
                      disabled={
                        currentPage >= totalPages ||
                        isLoading
                      }
                    >
                      Next
                    </button>
                  </div>
                </footer>
              </>
            )}
        </section>
      </section>

      {studentPendingDelete && (
        <div
          className="student-delete-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeDeleteDialog();
            }
          }}
        >
          <section
            className="student-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-student-title"
          >
            <div className="student-delete-icon">
              !
            </div>

            <h2 id="delete-student-title">
              Delete student?
            </h2>

            <p>
              You are about to permanently delete{" "}
              <strong>
                {studentPendingDelete.full_name}
              </strong>
              . This action cannot be undone.
            </p>

            {deleteError && (
              <div
                className="student-delete-error"
                role="alert"
              >
                {deleteError}
              </div>
            )}

            <div className="student-delete-actions">
              <button
                type="button"
                className="student-delete-cancel"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="student-delete-confirm"
                onClick={handleDeleteStudent}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Student"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default StudentsPage;