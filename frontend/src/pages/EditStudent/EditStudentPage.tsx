import axios from "axios";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";
import "./EditStudentPage.css";

type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "suspended";

type StudentGender =
  | "male"
  | "female"
  | "other";

type Student = {
  id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  other_names: string;
  date_of_birth: string;
  gender: StudentGender;
  email: string;
  phone_number: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  admission_date: string;
  status: StudentStatus;
};

type StudentFormData = {
  admission_number: string;
  first_name: string;
  last_name: string;
  other_names: string;
  date_of_birth: string;
  gender: StudentGender | "";
  email: string;
  phone_number: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  admission_date: string;
  status: StudentStatus;
};

const initialFormData: StudentFormData = {
  admission_number: "",
  first_name: "",
  last_name: "",
  other_names: "",
  date_of_birth: "",
  gender: "",
  email: "",
  phone_number: "",
  address: "",
  guardian_name: "",
  guardian_phone: "",
  guardian_email: "",
  admission_date: "",
  status: "active",
};

function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please try again.";
  }

  const responseData = error.response.data as
    | Record<string, string | string[]>
    | undefined;

  if (!responseData) {
    return "Unable to update the student.";
  }

  const detail = responseData.detail;

  if (typeof detail === "string") {
    return detail;
  }

  for (const value of Object.values(responseData)) {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }

    if (typeof value === "string") {
      return value;
    }
  }

  return "Unable to update the student. Check the form and try again.";
}

function EditStudentPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [formData, setFormData] =
    useState<StudentFormData>(initialFormData);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStudent() {
      if (!studentId) {
        setLoadError("Student ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<Student>(
          `/api/students/${studentId}/`,
        );

        if (!isMounted) {
          return;
        }

        const student = response.data;

        setFormData({
          admission_number:
            student.admission_number ?? "",
          first_name: student.first_name ?? "",
          last_name: student.last_name ?? "",
          other_names: student.other_names ?? "",
          date_of_birth: student.date_of_birth ?? "",
          gender: student.gender ?? "",
          email: student.email ?? "",
          phone_number: student.phone_number ?? "",
          address: student.address ?? "",
          guardian_name: student.guardian_name ?? "",
          guardian_phone:
            student.guardian_phone ?? "",
          guardian_email:
            student.guardian_email ?? "",
          admission_date:
            student.admission_date ?? "",
          status: student.status ?? "active",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setLoadError("Student record not found.");
        } else {
          setLoadError(getApiErrorMessage(error));
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

  function handleChange(
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!studentId || isSubmitting) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await api.patch(
        `/api/students/${studentId}/`,
        {
          admission_number:
            formData.admission_number.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          other_names: formData.other_names.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          email: formData.email.trim(),
          phone_number:
            formData.phone_number.trim(),
          address: formData.address.trim(),
          guardian_name:
            formData.guardian_name.trim(),
          guardian_phone:
            formData.guardian_phone.trim(),
          guardian_email:
            formData.guardian_email.trim(),
          admission_date: formData.admission_date,
          status: formData.status,
        },
      );

      navigate(`/students/${studentId}`, {
        replace: true,
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="edit-student-page">
        <div className="edit-student-message">
          Loading student information...
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="edit-student-page">
        <div
          className="edit-student-message edit-student-load-error"
          role="alert"
        >
          <h1>Unable to edit student</h1>
          <p>{loadError}</p>

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
    <main className="edit-student-page">
      <section className="edit-student-container">
        <header className="edit-student-header">
          <div>
            <p className="edit-student-eyebrow">
              Student Management
            </p>

            <h1>Edit Student</h1>

            <p>
              Update the student&apos;s admission,
              personal, and guardian information.
            </p>
          </div>

          <button
            type="button"
            className="edit-student-back-button"
            onClick={() =>
              navigate(`/students/${studentId}`)
            }
            disabled={isSubmitting}
          >
            Back to Profile
          </button>
        </header>

        <form
          className="edit-student-form"
          onSubmit={handleSubmit}
        >
          {submitError && (
            <div
              className="edit-student-error"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <section className="edit-student-section">
            <div className="edit-student-section-heading">
              <h2>Admission Information</h2>

              <p>
                Update the admission details and current
                student status.
              </p>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="admission_number">
                  Admission number
                </label>

                <input
                  id="admission_number"
                  name="admission_number"
                  type="text"
                  value={formData.admission_number}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="admission_date">
                  Admission date
                </label>

                <input
                  id="admission_date"
                  name="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="active">
                    Active
                  </option>

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
            </div>
          </section>

          <section className="edit-student-section">
            <div className="edit-student-section-heading">
              <h2>Personal Information</h2>

              <p>
                Update the student&apos;s identity and
                contact details.
              </p>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="first_name">
                  First name
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="last_name">
                  Last name
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="other_names">
                  Other names
                </label>

                <input
                  id="other_names"
                  name="other_names"
                  type="text"
                  value={formData.other_names}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="date_of_birth">
                  Date of birth
                </label>

                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div className="edit-student-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="phone_number">
                  Phone number
                </label>

                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="edit-student-field edit-student-field-full">
                <label htmlFor="address">
                  Residential address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <section className="edit-student-section">
            <div className="edit-student-section-heading">
              <h2>Guardian Information</h2>

              <p>
                Update the student&apos;s parent or guardian
                details.
              </p>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="guardian_name">
                  Guardian name
                </label>

                <input
                  id="guardian_name"
                  name="guardian_name"
                  type="text"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="guardian_phone">
                  Guardian phone
                </label>

                <input
                  id="guardian_phone"
                  name="guardian_phone"
                  type="tel"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="guardian_email">
                  Guardian email
                </label>

                <input
                  id="guardian_email"
                  name="guardian_email"
                  type="email"
                  value={formData.guardian_email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <div className="edit-student-actions">
            <button
              type="button"
              className="edit-student-cancel-button"
              onClick={() =>
                navigate(`/students/${studentId}`)
              }
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-student-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditStudentPage;