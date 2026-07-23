import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
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

        <nav
          className="dashboard-navigation"
          aria-label="Main navigation"
        >
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </aside>

      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;