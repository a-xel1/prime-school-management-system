import axios from "axios";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteTeacher,
  getTeachers,
  type EmploymentType,
  type Teacher,
  type TeacherStatus,
} from "../../services/teacherService";
import "./TeachersPage.css";

const PAGE_SIZE = 10;

const employmentTypeLabels: Record<
  EmploymentType,
  string
> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

const statusLabels: Record<
  TeacherStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
  terminated: "Terminated",
};

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred.";
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  const responseData = error.response.data as
    | { detail?: string }
    | undefined;

  return (
    responseData?.detail ??
    "Unable to complete the request."
  );
}

function TeachersPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  ] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<TeacherStatus | "">("");

  const [
    employmentTypeFilter,
    setEmploymentTypeFilter,
  ] = useState<EmploymentType | "">("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalTeachers, setTotalTeachers] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    teacherPendingDelete,
    setTeacherPendingDelete,
  ] = useState<Teacher | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(
        searchTerm.trim(),
      );

      setCurrentPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    async function loadTeachers() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getTeachers({
          page: currentPage,
          search: debouncedSearchTerm,
          status: statusFilter,
          employment_type:
            employmentTypeFilter,
        });

        if (!isMounted) {
          return;
        }

        setTeachers(response.results);
        setTotalTeachers(response.count);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getErrorMessage(error),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTeachers();

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    debouncedSearchTerm,
    employmentTypeFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalTeachers / PAGE_SIZE),
  );

  const firstRecord =
    totalTeachers === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastRecord = Math.min(
    currentPage * PAGE_SIZE,
    totalTeachers,
  );

  function handleStatusChange(
    status: TeacherStatus | "",
  ) {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  function handleEmploymentTypeChange(
    employmentType: EmploymentType | "",
  ) {
    setEmploymentTypeFilter(employmentType);
    setCurrentPage(1);
  }

  function openDeleteDialog(
    teacher: Teacher,
  ) {
    setDeleteError("");
    setTeacherPendingDelete(teacher);
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setDeleteError("");
    setTeacherPendingDelete(null);
  }

  async function handleDeleteTeacher() {
    if (
      !teacherPendingDelete ||
      isDeleting
    ) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteTeacher(
        teacherPendingDelete.id,
      );

      const remainingTeachers =
        teachers.filter(
          (teacher) =>
            teacher.id !==
            teacherPendingDelete.id,
        );

      setTeachers(remainingTeachers);

      setTotalTeachers(
        (currentTotal) =>
          Math.max(
            0,
            currentTotal - 1,
          ),
      );

      if (
        remainingTeachers.length === 0 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (page) => page - 1,
        );
      }

      setTeacherPendingDelete(null);
    } catch (error) {
      setDeleteError(
        getErrorMessage(error),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="teachers-page">
      <section className="teachers-container">
        <header className="teachers-header">
          <div>
            <p className="teachers-eyebrow">
              Teacher Management
            </p>

            <h1>Teachers</h1>

            <p>
              View and manage teaching staff
              records.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/teachers/add")
            }
          >
            Add Teacher
          </button>
        </header>

        <section className="teachers-panel">
          <div className="teachers-toolbar">
            <input
              type="search"
              placeholder="Search by name, staff number or specialization"
              aria-label="Search teachers"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
            />

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as
                    | TeacherStatus
                    | "",
                )
              }
            >
              <option value="">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

              <option value="on_leave">
                On Leave
              </option>

              <option value="terminated">
                Terminated
              </option>
            </select>

            <select
              aria-label="Filter by employment type"
              value={employmentTypeFilter}
              onChange={(event) =>
                handleEmploymentTypeChange(
                  event.target.value as
                    | EmploymentType
                    | "",
                )
              }
            >
              <option value="">
                All employment types
              </option>

              <option value="full_time">
                Full Time
              </option>

              <option value="part_time">
                Part Time
              </option>

              <option value="contract">
                Contract
              </option>
            </select>
          </div>

          {isLoading && (
            <p className="teachers-message">
              Loading teachers...
            </p>
          )}

          {!isLoading &&
            errorMessage && (
              <p
                className="teachers-message teachers-error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

          {!isLoading &&
            !errorMessage &&
            teachers.length === 0 && (
              <div className="teachers-empty-state">
                <h2>No teachers found</h2>

                <p>
                  Change your search or filters,
                  or add a new teacher.
                </p>
              </div>
            )}

          {!isLoading &&
            !errorMessage &&
            teachers.length > 0 && (
              <>
                <div className="teachers-table-wrapper">
                  <table className="teachers-table">
                    <thead>
                      <tr>
                        <th>Teacher</th>
                        <th>Staff No.</th>
                        <th>Specialization</th>
                        <th>Employment</th>
                        <th>Employment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {teachers.map(
                        (teacher) => (
                          <tr key={teacher.id}>
                            <td>
                              <div className="teacher-name-cell">
                                <span className="teacher-avatar">
                                  {teacher.first_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>

                                <div>
                                  <strong>
                                    {
                                      teacher.full_name
                                    }
                                  </strong>

                                  <span>
                                    {teacher.email ||
                                      "No email"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              {
                                teacher.staff_number
                              }
                            </td>

                            <td>
                              {teacher.specialization ||
                                "Not provided"}
                            </td>

                            <td>
                              <span className="teacher-employment-type">
                                {
                                  employmentTypeLabels[
                                    teacher
                                      .employment_type
                                  ]
                                }
                              </span>
                            </td>

                            <td>
                              {
                                teacher.employment_date
                              }
                            </td>

                            <td>
                              <span
                                className={
                                  `teacher-status ` +
                                  `teacher-status-${teacher.status}`
                                }
                              >
                                {
                                  statusLabels[
                                    teacher.status
                                  ]
                                }
                              </span>
                            </td>

                            <td>
                              <div className="teacher-actions">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/teachers/${teacher.id}`,
                                    )
                                  }
                                >
                                  View
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(`/teachers/${teacher.id}/edit`)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="teacher-delete-button"
                                  onClick={() =>
                                    openDeleteDialog(
                                      teacher,
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                <footer className="teachers-pagination">
                  <p>
                    Showing {firstRecord}–
                    {lastRecord} of{" "}
                    {totalTeachers} teachers
                  </p>

                  <div className="teachers-pagination-controls">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            page - 1,
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
                      Page {currentPage} of{" "}
                      {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            page + 1,
                        )
                      }
                      disabled={
                        currentPage >=
                          totalPages ||
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

      {teacherPendingDelete && (
        <div
          className="teacher-delete-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDeleteDialog();
            }
          }}
        >
          <section
            className="teacher-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-teacher-title"
          >
            <div className="teacher-delete-icon">
              !
            </div>

            <h2 id="delete-teacher-title">
              Delete teacher?
            </h2>

            <p>
              You are about to permanently
              delete{" "}
              <strong>
                {
                  teacherPendingDelete.full_name
                }
              </strong>
              . This action cannot be undone.
            </p>

            {deleteError && (
              <div
                className="teacher-delete-error"
                role="alert"
              >
                {deleteError}
              </div>
            )}

            <div className="teacher-delete-actions">
              <button
                type="button"
                className="teacher-delete-cancel"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="teacher-delete-confirm"
                onClick={
                  handleDeleteTeacher
                }
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Teacher"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default TeachersPage;