import axios from "axios";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await loginUser({
        email,
        password,
        rememberMe,
      });

      setSuccessMessage("Login successful.");
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | {
              non_field_errors?: string[];
              detail?: string;
              email?: string[];
              password?: string[];
            }
          | undefined;

        const apiMessage =
          responseData?.non_field_errors?.[0] ??
          responseData?.detail ??
          responseData?.email?.[0] ??
          responseData?.password?.[0] ??
          "Unable to sign in. Please check your email and password.";

        setErrorMessage(apiMessage);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <header className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your account.</p>
        </header>

        <form
          className="login-form"
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
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-field">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                disabled={isLoading}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                disabled={isLoading}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked,
                  )
                }
                disabled={isLoading}
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                navigate("/forgot-password")
              }
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <button
            className="register-link"
            type="button"
            onClick={() =>
              navigate("/register")
            }
            disabled={isLoading}
          >
            Create account
          </button>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;