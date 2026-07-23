import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { confirmPasswordReset } from "../../services/authService";
import "./ResetPassword.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { uid, token } = useParams<{
    uid: string;
    token: string;
  }>();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!uid || !token) {
      setErrorMessage("This password reset link is invalid.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const message = await confirmPasswordReset(
        uid,
        token,
        newPassword,
        newPasswordConfirm,
      );

      setSuccessMessage(
        `${message} Redirecting to sign in...`,
      );

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | {
              detail?: string | string[];
              new_password?: string[];
              new_password_confirm?: string[];
              non_field_errors?: string[];
            }
          | undefined;

        const detailMessage = Array.isArray(
          responseData?.detail,
        )
          ? responseData.detail[0]
          : responseData?.detail;

        const apiMessage =
          responseData?.new_password?.[0] ??
          responseData?.new_password_confirm?.[0] ??
          responseData?.non_field_errors?.[0] ??
          detailMessage ??
          "Unable to reset your password.";

        setErrorMessage(apiMessage);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="reset-password-page">
      <section className="reset-password-container">
        <header className="reset-password-header">
          <h1>Create a new password</h1>
          <p>
            Enter and confirm the new password for your Prime
            account.
          </p>
        </header>

        <form
          className="reset-password-form"
          onSubmit={handleSubmit}
        >
          {errorMessage && (
            <div
              className="form-message form-message-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="form-message form-message-success"
              role="status"
            >
              {successMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="new-password">New password</label>

            <div className="password-field">
              <input
                id="new-password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide passwords"
                    : "Show passwords"
                }
                disabled={isSubmitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-password-confirm">
              Confirm new password
            </label>

            <input
              id="new-password-confirm"
              name="new_password_confirm"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your new password"
              value={newPasswordConfirm}
              onChange={(event) =>
                setNewPasswordConfirm(event.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            className="reset-password-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Resetting password..."
              : "Reset password"}
          </button>
        </form>

        <button
          className="back-to-login"
          type="button"
          onClick={() => navigate("/login")}
          disabled={isSubmitting}
        >
          Back to sign in
        </button>
      </section>
    </main>
  );
}

export default ResetPasswordPage;