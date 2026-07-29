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

import {
  getTeacher,
  updateTeacher,
  type EmploymentType,
  type TeacherGender,
  type TeacherStatus,
} from "../../services/teacherService";
import "./EditTeacherPage.css";

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

  if (error.response.status === 404) {
    return "Teacher record not found.";
  }

  const responseData = error.response.data as
    | Record<string, string | string[]>
    | undefined;

  if (!responseData) {
    return "Unable to update the teacher.";
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

  return (
    "Unable to update the teacher. " +
    "Check the form and try again."
  );
}

function EditTeacherPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const [formData, setFormData] =
    useState<TeacherFormData>(initialFormData);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTeacher() {
      if (!teacherId) {
        setLoadError("Teacher ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const teacher = await getTeacher(teacherId);

        if (!isMounted) {
          return;
        }

        setFormData({
          first_name: teacher.first_name ?? "",
          last_name: teacher.last_name ?? "",
          other_names: teacher.other_names ?? "",
          date_of_birth: teacher.date_of_birth ?? "",
          gender: teacher.gender ?? "",
          email: teacher.email ?? "",
          phone_number: teacher.phone_number ?? "",
          address: teacher.address ?? "",
          qualification: teacher.qualification ?? "",
          specialization: teacher.specialization ?? "",
          employment_date:
            teacher.employment_date ?? "",
          employment_type:
            teacher.employment_type ?? "full_time",
          status: teacher.status ?? "active",
          emergency_contact_name:
            teacher.emergency_contact_name ?? "",
          emergency_contact_phone:
            teacher.emergency_contact_phone ?? "",
        });
      } catch (error) {
        if (isMounted) {
          setLoadError(getApiErrorMessage(error));
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

    if (!teacherId || isSubmitting) {
      return;
    }

    if (!formData.gender) {
      setSubmitError(
        "Please select the teacher's gender.",
      );
      return;
    }

    if (
      formData.date_of_birth &&
      formData.employment_date &&
      formData.employment_date <=
        formData.date_of_birth
    ) {
      setSubmitError(
        "Employment date must be after the " +
          "teacher's date of birth.",
      );
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await updateTeacher(teacherId, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        other_names: formData.other_names.trim(),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        qualification: formData.qualification.trim(),
        specialization:
          formData.specialization.trim(),
        employment_date: formData.employment_date,
        employment_type: formData.employment_type,
        status: formData.status,
        emergency_contact_name:
          formData.emergency_contact_name.trim(),
        emergency_contact_phone:
          formData.emergency_contact_phone.trim(),
      });

      navigate(`/teachers/${teacherId}`, {
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
      <main className="edit-teacher-page">
        <div className="edit-teacher-message">
          Loading teacher information...
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="edit-teacher-page">
        <div
          className="edit-teacher-message edit-teacher-load-error"
          role="alert"
        >
          <h1>Unable to edit teacher</h1>

          <p>{loadError}</p>

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
    <main className="edit-teacher-page">
      <section className="edit-teacher-container">
        <header className="edit-teacher-header">
          <div>
            <p className="edit-teacher-eyebrow">
              Teacher Management
            </p>

            <h1>Edit Teacher</h1>

            <p>
              Update the teacher&apos;s personal,
              professional, and employment information.
            </p>
          </div>

          <button
            type="button"
            className="edit-teacher-back-button"
            onClick={() =>
              navigate(`/teachers/${teacherId}`)
            }
            disabled={isSubmitting}
          >
            Back to Profile
          </button>
        </header>

        <form
          className="edit-teacher-form"
          onSubmit={handleSubmit}
        >
          {submitError && (
            <div
              className="edit-teacher-error"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <section className="edit-teacher-section">
            <div className="edit-teacher-section-heading">
              <h2>Employment Information</h2>

              <p>
                Update the teacher&apos;s employment
                details and current status.
              </p>
            </div>

            <div className="edit-teacher-grid">
              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

          <section className="edit-teacher-section">
            <div className="edit-teacher-section-heading">
              <h2>Personal Information</h2>

              <p>
                Update the teacher&apos;s identity and
                contact details.
              </p>
            </div>

            <div className="edit-teacher-grid">
              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field">
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

              <div className="edit-teacher-field edit-teacher-field-full">
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

          <section className="edit-teacher-section">
            <div className="edit-teacher-section-heading">
              <h2>Professional Information</h2>

              <p>
                Update the teacher&apos;s academic
                qualification and specialization.
              </p>
            </div>

            <div className="edit-teacher-grid">
              <div className="edit-teacher-field">
                <label htmlFor="qualification">
                  Highest qualification
                </label>

                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  value={formData.qualification}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="edit-teacher-field">
                <label htmlFor="specialization">
                  Specialization
                </label>

                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <section className="edit-teacher-section">
            <div className="edit-teacher-section-heading">
              <h2>Emergency Contact</h2>

              <p>
                Update the teacher&apos;s emergency
                contact information.
              </p>
            </div>

            <div className="edit-teacher-grid">
              <div className="edit-teacher-field">
                <label htmlFor="emergency_contact_name">
                  Contact name
                </label>

                <input
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  type="text"
                  value={
                    formData.emergency_contact_name
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="edit-teacher-field">
                <label htmlFor="emergency_contact_phone">
                  Contact phone
                </label>

                <input
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  type="tel"
                  value={
                    formData.emergency_contact_phone
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          <div className="edit-teacher-actions">
            <button
              type="button"
              className="edit-teacher-cancel-button"
              onClick={() =>
                navigate(`/teachers/${teacherId}`)
              }
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-teacher-submit-button"
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

export default EditTeacherPage;