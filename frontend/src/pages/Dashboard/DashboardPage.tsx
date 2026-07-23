import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/dashboard/StatCard";
import { logoutUser } from "../../services/authService";
import {
  getCurrentUser,
  type UserProfile,
} from "../../services/profileService";
import { clearTokens } from "../../utils/authStorage";
import "./DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await getCurrentUser();

        if (isMounted) {
          setUser(profile);
        }
      } catch {
        clearTokens();
        navigate("/login", { replace: true });
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Clear the local session even if the API request fails.
    } finally {
      clearTokens();
      navigate("/login", { replace: true });
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Prime Dashboard</h1>

            <p>
              {isLoadingProfile
                ? "Loading your account..."
                : user
                  ? `Welcome back, ${user.username}.`
                  : "Welcome to Prime School Management System."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        <section
          className="dashboard-stats"
          aria-label="School statistics"
        >
          <StatCard
            title="Total Students"
            value="0"
            description="Registered students"
          />

          <StatCard
            title="Total Teachers"
            value="0"
            description="Active teaching staff"
          />

          <StatCard
            title="Classes"
            value="0"
            description="Available classes"
          />

          <StatCard
            title="Outstanding Fees"
            value="GHS 0.00"
            description="Pending fee payments"
          />
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;