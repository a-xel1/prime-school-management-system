import axios from "axios";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTeacher,
  type EmploymentType,
  type Teacher,
  type TeacherStatus,
} from "../../services/teacherService";
import "./TeacherDetailsPage.css";

const employmentTypeLabels: Record<
  EmploymentType,
  string
> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

const statusLabels: Record<TeacherStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
  terminated: "Terminated",
};

function formatDate(date: string): string {
  if (!date) {
    return "Not provided";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return (
      "An unexpected error occurred while " +
      "loading the teacher."
    );
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  if (error.response.status === 404) {
    return "Teacher record not found.";
  }

  const responseData = error.response.data as
    | { detail?: string }
    | undefined;

  return (
    responseData?.detail ??
    "Unable to load the teacher record."
  );
}

function TeacherDetailsPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const [teacher, setTeacher] =
    useState<Teacher | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTeacher() {
      if (!teacherId) {
        setErrorMessage("Teacher ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const teacherData = await getTeacher(
          teacherId,
        );

        if (isMounted) {
          setTeacher(teacherData);
        }
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

    void loadTeacher();

    return () => {
      isMounted = false;
    };
  }, [teacherId]);

  if (isLoading) {
    return (
      <main className="teacher-details-page">
        <div className="teacher-details-message">
          Loading teacher details...
        </div>
      </main>
    );
  }

  if (errorMessage || !teacher) {
    return (
      <main className="teacher-details-page">
        <div
          className="teacher-details-message teacher-details-error"
          role="alert"
        >
          <h1>Unable to display teacher</h1>

          <p>
            {errorMessage ||
              "Teacher record not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/teachers")}
          >
            Back to Teachers
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="teacher-details-page">
      <section className="teacher-details-container">
        <header className="teacher-details-header">
          <div className="teacher-details-identity">
            <span className="teacher-details-avatar">
              {teacher.first_name
                .charAt(0)
                .toUpperCase()}
            </span>

            <div>
              <p className="teacher-details-eyebrow">
                Teacher Profile
              </p>

              <h1>{teacher.full_name}</h1>

              <p>{teacher.staff_number}</p>
            </div>
          </div>

          <div className="teacher-details-header-actions">
            <button
              type="button"
              className="teacher-details-secondary-button"
              onClick={() => navigate("/teachers")}
            >
              Back to Teachers
            </button>

            <button
              type="button"
              className="teacher-details-primary-button"
              onClick={() =>
                navigate(
                  `/teachers/${teacher.id}/edit`,
                )
              }
            >
              Edit Teacher
            </button>
          </div>
        </header>

        <section className="teacher-details-summary">
          <div>
            <span>Staff number</span>
            <strong>{teacher.staff_number}</strong>
          </div>

          <div>
            <span>Employment date</span>

            <strong>
              {formatDate(teacher.employment_date)}
            </strong>
          </div>

          <div>
            <span>Employment type</span>

            <strong>
              {
                employmentTypeLabels[
                  teacher.employment_type
                ]
              }
            </strong>
          </div>

          <div>
            <span>Status</span>

            <strong
              className={
                `teacher-details-status ` +
                `teacher-details-status-${teacher.status}`
              }
            >
              {statusLabels[teacher.status]}
            </strong>
          </div>
        </section>

        <div className="teacher-details-grid">
          <section className="teacher-details-card">
            <div className="teacher-details-card-heading">
              <h2>Personal Information</h2>

              <p>
                Teacher identity and contact
                information.
              </p>
            </div>

            <dl className="teacher-details-list">
              <div>
                <dt>First name</dt>
                <dd>{teacher.first_name}</dd>
              </div>

              <div>
                <dt>Last name</dt>
                <dd>{teacher.last_name}</dd>
              </div>

              <div>
                <dt>Other names</dt>

                <dd>
                  {teacher.other_names ||
                    "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Date of birth</dt>

                <dd>
                  {formatDate(teacher.date_of_birth)}
                </dd>
              </div>

              <div>
                <dt>Gender</dt>

                <dd className="teacher-details-capitalize">
                  {teacher.gender}
                </dd>
              </div>

              <div>
                <dt>Email address</dt>

                <dd>
                  {teacher.email || "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Phone number</dt>

                <dd>
                  {teacher.phone_number ||
                    "Not provided"}
                </dd>
              </div>

              <div className="teacher-details-list-full">
                <dt>Residential address</dt>

                <dd>
                  {teacher.address ||
                    "Not provided"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="teacher-details-card">
            <div className="teacher-details-card-heading">
              <h2>Professional Information</h2>

              <p>
                Academic qualification and teaching
                specialization.
              </p>
            </div>

            <dl className="teacher-details-list teacher-details-list-single">
              <div>
                <dt>Highest qualification</dt>

                <dd>
                  {teacher.qualification ||
                    "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Specialization</dt>

                <dd>
                  {teacher.specialization ||
                    "Not provided"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="teacher-details-card">
            <div className="teacher-details-card-heading">
              <h2>Emergency Contact</h2>

              <p>
                Contact information for emergencies.
              </p>
            </div>

            <dl className="teacher-details-list teacher-details-list-single">
              <div>
                <dt>Contact name</dt>

                <dd>
                  {teacher.emergency_contact_name ||
                    "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Contact phone</dt>

                <dd>
                  {teacher.emergency_contact_phone ||
                    "Not provided"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}

export default TeacherDetailsPage;