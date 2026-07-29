import axios from "axios";
import {
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  createTeacher,
  type EmploymentType,
  type TeacherGender,
  type TeacherStatus,
} from "../../services/teacherService";
import "./AddTeacherPage.css";

type TeacherFormData = {
  first_name: string;
  last_name: string;
  other_names: string;
  date_of_birth: string;
  gender: TeacherGender | "";
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

const initialFormData: TeacherFormData = {
  first_name: "",
  last_name: "",
  other_names: "",
  date_of_birth: "",
  gender: "",
  email: "",
  phone_number: "",
  address: "",
  qualification: "",
  specialization: "",
  employment_date: "",
  employment_type: "full_time",
  status: "active",
  emergency_contact_name: "",
  emergency_contact_phone: "",
};

const today = new Date().toISOString().slice(0, 10);

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
    return "Unable to create the teacher.";
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

  return "Unable to create the teacher. Check the form and try again.";
}

function AddTeacherPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<TeacherFormData>(initialFormData);

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

    if (!formData.gender) {
      setErrorMessage("Please select the teacher's gender.");
      return;
    }

    if (
      formData.date_of_birth &&
      formData.employment_date &&
      formData.employment_date <= formData.date_of_birth
    ) {
      setErrorMessage(
        "Employment date must be after the teacher's date of birth.",
      );
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const teacher = await createTeacher({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        other_names: formData.other_names.trim(),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        qualification: formData.qualification.trim(),
        specialization: formData.specialization.trim(),
        employment_date: formData.employment_date,
        employment_type: formData.employment_type,
        status: formData.status,
        emergency_contact_name:
          formData.emergency_contact_name.trim(),
        emergency_contact_phone:
          formData.emergency_contact_phone.trim(),
      });

      navigate(`/teachers/${teacher.id}`, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="add-teacher-page">
      <section className="add-teacher-container">
        <header className="add-teacher-header">
          <div>
            <p className="add-teacher-eyebrow">
              Teacher Management
            </p>

            <h1>Add Teacher</h1>

            <p>
              Enter the teacher&apos;s personal,
              professional, and employment information.
            </p>
          </div>

          <button
            type="button"
            className="add-teacher-back-button"
            onClick={() => navigate("/teachers")}
            disabled={isSubmitting}
          >
            Back to Teachers
          </button>
        </header>

        <form
          className="add-teacher-form"
          onSubmit={handleSubmit}
        >
          {errorMessage && (
            <div
              className="add-teacher-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <section className="add-teacher-section">
            <div className="add-teacher-section-heading">
              <h2>Employment Information</h2>

              <p>
                The staff number will be generated
                automatically when the teacher is created.
              </p>
            </div>

            <div className="add-teacher-grid">
              <div className="add-teacher-field">
                <label htmlFor="employment_date">
                  Employment date
                </label>

                <input
                  id="employment_date"
                  name="employment_date"
                  type="date"
                  max={today}
                  value={formData.employment_date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-teacher-field">
                <label htmlFor="employment_type">
                  Employment type
                </label>

                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
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

              <div className="add-teacher-field">
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

                  <option value="on_leave">
                    On Leave
                  </option>

                  <option value="terminated">
                    Terminated
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="add-teacher-section">
            <div className="add-teacher-section-heading">
              <h2>Personal Information</h2>

              <p>
                Enter the teacher&apos;s identity and
                contact details.
              </p>
            </div>

            <div className="add-teacher-grid">
              <div className="add-teacher-field">
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

              <div className="add-teacher-field">
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

              <div className="add-teacher-field">
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

              <div className="add-teacher-field">
                <label htmlFor="date_of_birth">
                  Date of birth
                </label>

                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  max={today}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="add-teacher-field">
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

              <div className="add-teacher-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teacher@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-teacher-field">
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

              <div className="add-teacher-field add-teacher-field-full">
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

          <section className="add-teacher-section">
            <div className="add-teacher-section-heading">
              <h2>Professional Information</h2>

              <p>
                Provide the teacher&apos;s academic
                qualification and teaching specialization.
              </p>
            </div>

            <div className="add-teacher-grid">
              <div className="add-teacher-field">
                <label htmlFor="qualification">
                  Highest qualification
                </label>

                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  placeholder="Example: B.Ed Mathematics"
                  value={formData.qualification}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-teacher-field">
                <label htmlFor="specialization">
                  Specialization
                </label>

                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  placeholder="Example: Mathematics"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <section className="add-teacher-section">
            <div className="add-teacher-section-heading">
              <h2>Emergency Contact</h2>

              <p>
                Add someone who can be contacted during an
                emergency.
              </p>
            </div>

            <div className="add-teacher-grid">
              <div className="add-teacher-field">
                <label htmlFor="emergency_contact_name">
                  Contact name
                </label>

                <input
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  type="text"
                  placeholder="Enter emergency contact name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="add-teacher-field">
                <label htmlFor="emergency_contact_phone">
                  Contact phone
                </label>

                <input
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  type="tel"
                  placeholder="0200000000"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <div className="add-teacher-actions">
            <button
              type="button"
              className="add-teacher-cancel-button"
              onClick={() => navigate("/teachers")}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-teacher-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating teacher..."
                : "Create Teacher"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddTeacherPage;