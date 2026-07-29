import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import AddStudentPage from "./pages/AddStudent/AddStudentPage";
import AddTeacherPage from "./pages/AddTeacher/AddTeacherPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import EditStudentPage from "./pages/EditStudent/EditStudentPage";
import EditTeacherPage from "./pages/EditTeacher/EditTeacherPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPassword";
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import ResetPasswordPage from "./pages/ResetPassword/ResetPassword";
import StudentDetailsPage from "./pages/StudentDetails/StudentDetailsPage";
import StudentsPage from "./pages/Students/StudentsPage";
import TeacherDetailsPage from "./pages/TeacherDetails/TeacherDetailsPage";
import TeachersPage from "./pages/Teachers/TeachersPage";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route element={<GuestRoute />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPasswordPage />}
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            element={
              <RoleRoute allowedRoles={["admin"]} />
            }
          >
            <Route
              path="/students"
              element={<StudentsPage />}
            />

            <Route
              path="/students/add"
              element={<AddStudentPage />}
            />

            <Route
              path="/students/:studentId"
              element={<StudentDetailsPage />}
            />

            <Route
              path="/students/:studentId/edit"
              element={<EditStudentPage />}
            />

            <Route
              path="/teachers"
              element={<TeachersPage />}
            />

            <Route
              path="/teachers/add"
              element={<AddTeacherPage />}
            />

            <Route
              path="/teachers/:teacherId"
              element={<TeacherDetailsPage />}
            />

            <Route
              path="/teachers/:teacherId/edit"
              element={<EditTeacherPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;