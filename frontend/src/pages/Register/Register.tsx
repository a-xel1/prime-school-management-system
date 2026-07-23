import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import "./Register.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting to login...",
      );

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | {
              username?: string[];
              email?: string[];
              password?: string[];
              password_confirm?: string[];
              non_field_errors?: string[];
              detail?: string;
            }
          | undefined;

        const apiMessage =
          responseData?.username?.[0] ??
          responseData?.email?.[0] ??
          responseData?.password?.[0] ??
          responseData?.password_confirm?.[0] ??
          responseData?.non_field_errors?.[0] ??
          responseData?.detail ??
          "Unable to create your account.";

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
    <main className="register-page">
      <section className="register-container">
        <header className="register-header">
          <h1>Create your account</h1>
          <p>Register to start using Prime.</p>
        </header>

        <form className="register-form" onSubmit={handleSubmit}>
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
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>

            <input
              id="register-email"
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

          <div className="form-group">
            <label htmlFor="register-password">Password</label>

            <div className="password-field">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                disabled={isSubmitting}
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                disabled={isSubmitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-confirm">
              Confirm password
            </label>

            <input
              id="password-confirm"
              name="password_confirm"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={passwordConfirm}
              onChange={(event) =>
                setPasswordConfirm(event.target.value)
              }
              autoComplete="new-password"
              disabled={isSubmitting}
              minLength={8}
              required
            />
          </div>

          <button
            className="register-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <button
            className="login-link"
            type="button"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;