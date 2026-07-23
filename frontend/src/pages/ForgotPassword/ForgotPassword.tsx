import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { requestPasswordReset } from "../../services/authService";
import "./ForgotPassword.css";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const message = await requestPasswordReset(email);
      setSuccessMessage(message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | {
              email?: string[];
              detail?: string;
            }
          | undefined;

        const apiMessage =
          responseData?.email?.[0] ??
          responseData?.detail ??
          "Unable to request a password reset.";

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
    <main className="forgot-password-page">
      <section className="forgot-password-container">
        <header className="forgot-password-header">
          <h1>Forgot your password?</h1>
          <p>
            Enter your email address and we’ll send you instructions
            to reset your password.
          </p>
        </header>

        <form
          className="forgot-password-form"
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
            <label htmlFor="reset-email">Email address</label>

            <input
              id="reset-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            className="forgot-password-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Sending instructions..."
              : "Send reset instructions"}
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

export default ForgotPasswordPage;