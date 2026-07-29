import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  getStoredUser,
  type UserRole,
} from "../utils/authStorage";

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;