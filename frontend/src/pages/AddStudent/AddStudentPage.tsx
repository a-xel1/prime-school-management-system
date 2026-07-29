import axios from "axios";
import {
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "./AddStudentPage.css";

type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "suspended";

type StudentGender =
  | "male"
  | "female"
  | "other";

type StudentFormData = {
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

type CreatedStudent = {
  id: number;
  admission_number: string;
};

const initialFormData: StudentFormData = {
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
    return "Unable to create the student.";
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

  return "Unable to create the student. Check the form and try again.";
}

function AddStudentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<StudentFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

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

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post<CreatedStudent>(
        "/api/students/",
        {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          other_names: formData.other_names.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          email: formData.email.trim(),
          phone_number: formData.phone_number.trim(),
          address: formData.address.trim(),
          guardian_name: formData.guardian_name.trim(),
          guardian_phone:
            formData.guardian_phone.trim(),
          guardian_email:
            formData.guardian_email.trim(),
          admission_date: formData.admission_date,
          status: formData.status,
        },
      );

      navigate(`/students/${response.data.id}`, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="add-student-page">
      <section className="add-student-container">
        <header className="add-student-header">
          <div>
            <p className="add-student-eyebrow">
              Student Management
            </p>

            <h1>Add Student</h1>

            <p>
              Enter the student&apos;s personal,
              admission, and guardian information.
            </p>
          </div>

          <button
            type="button"
            className="add-student-back-button"
            onClick={() => navigate("/students")}
            disabled={isSubmitting}
          >
            Back to Students
          </button>
        </header>

        <form
          className="add-student-form"
          onSubmit={handleSubmit}
        >
          {errorMessage && (
            <div
              className="add-student-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <section className="add-student-section">
            <div className="add-student-section-heading">
              <h2>Admission Information</h2>

              <p>
                The admission number will be generated
                automatically after the student is created.
              </p>
            </div>

            <div className="add-student-grid">
              <div className="add-student-field">
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

              <div className="add-student-field">
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

          <section className="add-student-section">
            <div className="add-student-section-heading">
              <h2>Personal Information</h2>

              <p>
                Enter the student&apos;s identity and
                contact details.
              </p>
            </div>

            <div className="add-student-grid">
              <div className="add-student-field">
                <label htmlFor="first_name">
                  First name
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-student-field">
                <label htmlFor="last_name">
                  Last name
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-student-field">
                <label htmlFor="other_names">
                  Other names
                </label>

                <input
                  id="other_names"
                  name="other_names"
                  type="text"
                  placeholder="Enter other names"
                  value={formData.other_names}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-student-field">
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

              <div className="add-student-field">
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

              <div className="add-student-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-student-field">
                <label htmlFor="phone_number">
                  Phone number
                </label>

                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="0240000000"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-student-field add-student-field-full">
                <label htmlFor="address">
                  Residential address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="Enter residential address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <section className="add-student-section">
            <div className="add-student-section-heading">
              <h2>Guardian Information</h2>

              <p>
                Add the details of the student&apos;s
                parent or guardian.
              </p>
            </div>

            <div className="add-student-grid">
              <div className="add-student-field">
                <label htmlFor="guardian_name">
                  Guardian name
                </label>

                <input
                  id="guardian_name"
                  name="guardian_name"
                  type="text"
                  placeholder="Enter guardian name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-student-field">
                <label htmlFor="guardian_phone">
                  Guardian phone
                </label>

                <input
                  id="guardian_phone"
                  name="guardian_phone"
                  type="tel"
                  placeholder="0200000000"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-student-field">
                <label htmlFor="guardian_email">
                  Guardian email
                </label>

                <input
                  id="guardian_email"
                  name="guardian_email"
                  type="email"
                  placeholder="guardian@example.com"
                  value={formData.guardian_email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <div className="add-student-actions">
            <button
              type="button"
              className="add-student-cancel-button"
              onClick={() => navigate("/students")}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-student-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating student..."
                : "Create Student"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddStudentPage;