import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/dashboard/StatCard";
import { logoutUser } from "../../services/authService";
import {
  getCurrentUser,
  type UserProfile,
} from "../../services/profileService";
import {
  getStudentStats,
  type StudentStats,
} from "../../services/studentService";
import {
  clearAuthStorage,
  getStoredUser,
  type UserRole,
} from "../../utils/authStorage";
import "./DashboardPage.css";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

function DashboardPage() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [studentStats, setStudentStats] =
    useState<StudentStats | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  const [
    isLoadingStudentStats,
    setIsLoadingStudentStats,
  ] = useState(false);

  const [studentStatsError, setStudentStatsError] =
    useState("");

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const profile = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(profile);

        if (profile.role === "admin") {
          setIsLoadingStudentStats(true);
          setStudentStatsError("");

          try {
            const stats = await getStudentStats();

            if (isMounted) {
              setStudentStats(stats);
            }
          } catch {
            if (isMounted) {
              setStudentStatsError(
                "Unable to load student statistics.",
              );
            }
          } finally {
            if (isMounted) {
              setIsLoadingStudentStats(false);
            }
          }
        }
      } catch {
        clearAuthStorage();
        navigate("/login", { replace: true });
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadDashboardData();

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
      // The local session is still cleared below.
    } finally {
      clearAuthStorage();
      navigate("/login", { replace: true });
    }
  }

  const role = user?.role ?? storedUser?.role;

  const roleLabel = role
    ? roleLabels[role]
    : "User";

  const totalStudentsValue = isLoadingStudentStats
    ? "..."
    : studentStats
      ? String(studentStats.total)
      : "—";

  const studentDescription = studentStatsError
    ? studentStatsError
    : studentStats
      ? `${studentStats.active} active students`
      : "Registered students";

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

            {!isLoadingProfile && role && (
              <p>
                Signed in as:{" "}
                <strong>{roleLabel}</strong>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </header>

        {role === "admin" && (
          <section
            className="dashboard-stats"
            aria-label="School statistics"
          >
            <StatCard
              title="Total Students"
              value={totalStudentsValue}
              description={studentDescription}
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
        )}

        {role === "teacher" && (
          <section
            className="dashboard-stats"
            aria-label="Teacher statistics"
          >
            <StatCard
              title="My Classes"
              value="0"
              description="Assigned classes"
            />

            <StatCard
              title="My Students"
              value="0"
              description="Students under your classes"
            />

            <StatCard
              title="Attendance"
              value="0%"
              description="Today's attendance"
            />

            <StatCard
              title="Assessments"
              value="0"
              description="Pending assessments"
            />
          </section>
        )}

        {role === "student" && (
          <section
            className="dashboard-stats"
            aria-label="Student statistics"
          >
            <StatCard
              title="My Class"
              value="Not assigned"
              description="Current class"
            />

            <StatCard
              title="Attendance"
              value="0%"
              description="Your attendance rate"
            />

            <StatCard
              title="Assessments"
              value="0"
              description="Available assessments"
            />

            <StatCard
              title="Outstanding Fees"
              value="GHS 0.00"
              description="Pending school fees"
            />
          </section>
        )}

        {role === "parent" && (
          <section
            className="dashboard-stats"
            aria-label="Parent statistics"
          >
            <StatCard
              title="Children"
              value="0"
              description="Linked students"
            />

            <StatCard
              title="Attendance"
              value="0%"
              description="Children's attendance"
            />

            <StatCard
              title="Assessments"
              value="0"
              description="Recent results"
            />

            <StatCard
              title="Outstanding Fees"
              value="GHS 0.00"
              description="Pending fee payments"
            />
          </section>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;