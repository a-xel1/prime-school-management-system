import { NavLink, Outlet } from "react-router-dom";
import { getStoredUser } from "../../utils/authStorage";
import "./DashboardLayout.css";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Students", path: "/students" },
  { label: "Teachers", path: "/teachers" },
  { label: "Classes", path: "/classes" },
  { label: "Attendance", path: "/attendance" },
  { label: "Fees", path: "/fees" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
];

function DashboardLayout() {
  const user = getStoredUser();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">P</span>

          <div>
            <strong>Prime</strong>
            <span>School Management</span>
          </div>
        </div>

        <div className="dashboard-user">
          <span className="dashboard-user-avatar">
            {user?.username?.charAt(0).toUpperCase() ?? "U"}
          </span>

          <div>
            <strong>{user?.username ?? "User"}</strong>
            <span>{user?.role ?? "authenticated user"}</span>
          </div>
        </div>

        <nav
          className="dashboard-navigation"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "active" : undefined
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;