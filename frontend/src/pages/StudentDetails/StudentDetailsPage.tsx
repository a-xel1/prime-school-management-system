import axios from "axios";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";
import "./StudentDetailsPage.css";

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
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  admission_date: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
};

function formatDate(date: string): string {
  if (!date) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function StudentDetailsPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStudent() {
      if (!studentId) {
        setErrorMessage("Student ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<Student>(
          `/api/students/${studentId}/`,
        );

        if (isMounted) {
          setStudent(response.data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorMessage("Student record not found.");
          } else {
            const detail = error.response?.data?.detail;

            setErrorMessage(
              typeof detail === "string"
                ? detail
                : "Unable to load the student record.",
            );
          }
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading the student.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (isLoading) {
    return (
      <main className="student-details-page">
        <div className="student-details-message">
          Loading student details...
        </div>
      </main>
    );
  }

  if (errorMessage || !student) {
    return (
      <main className="student-details-page">
        <div
          className="student-details-message student-details-error"
          role="alert"
        >
          <h1>Unable to display student</h1>
          <p>
            {errorMessage || "Student record not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/students")}
          >
            Back to Students
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="student-details-page">
      <section className="student-details-container">
        <header className="student-details-header">
          <div className="student-details-identity">
            <span className="student-details-avatar">
              {student.first_name.charAt(0).toUpperCase()}
            </span>

            <div>
              <p className="student-details-eyebrow">
                Student Profile
              </p>

              <h1>{student.full_name}</h1>

              <p>{student.admission_number}</p>
            </div>
          </div>

          <div className="student-details-header-actions">
            <button
              type="button"
              className="student-details-secondary-button"
              onClick={() => navigate("/students")}
            >
              Back to Students
            </button>

            <button
              type="button"
              className="student-details-primary-button"
              onClick={() =>
                navigate(`/students/${student.id}/edit`)
              }
            >
              Edit Student
            </button>
          </div>
        </header>

        <section className="student-details-summary">
          <div>
            <span>Admission number</span>
            <strong>{student.admission_number}</strong>
          </div>

          <div>
            <span>Admission date</span>
            <strong>
              {formatDate(student.admission_date)}
            </strong>
          </div>

          <div>
            <span>Gender</span>
            <strong className="student-details-capitalize">
              {student.gender}
            </strong>
          </div>

          <div>
            <span>Status</span>

            <strong
              className={
                `student-details-status ` +
                `student-details-status-${student.status}`
              }
            >
              {student.status}
            </strong>
          </div>
        </section>

        <div className="student-details-grid">
          <section className="student-details-card">
            <div className="student-details-card-heading">
              <h2>Personal Information</h2>
              <p>
                Student identity and contact information.
              </p>
            </div>

            <dl className="student-details-list">
              <div>
                <dt>First name</dt>
                <dd>{student.first_name}</dd>
              </div>

              <div>
                <dt>Last name</dt>
                <dd>{student.last_name}</dd>
              </div>

              <div>
                <dt>Other names</dt>
                <dd>
                  {student.other_names || "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Date of birth</dt>
                <dd>{formatDate(student.date_of_birth)}</dd>
              </div>

              <div>
                <dt>Email address</dt>
                <dd>{student.email || "Not provided"}</dd>
              </div>

              <div>
                <dt>Phone number</dt>
                <dd>
                  {student.phone_number || "Not provided"}
                </dd>
              </div>

              <div className="student-details-list-full">
                <dt>Residential address</dt>
                <dd>{student.address || "Not provided"}</dd>
              </div>
            </dl>
          </section>

          <section className="student-details-card">
            <div className="student-details-card-heading">
              <h2>Guardian Information</h2>
              <p>
                Parent or guardian contact information.
              </p>
            </div>

            <dl className="student-details-list">
              <div>
                <dt>Guardian name</dt>
                <dd>{student.guardian_name}</dd>
              </div>

              <div>
                <dt>Guardian phone</dt>
                <dd>{student.guardian_phone}</dd>
              </div>

              <div className="student-details-list-full">
                <dt>Guardian email</dt>
                <dd>
                  {student.guardian_email ||
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

export default StudentDetailsPage;