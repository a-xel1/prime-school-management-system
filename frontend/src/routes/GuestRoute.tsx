import { Navigate, Outlet } from "react-router-dom";

import { getAccessToken } from "../utils/authStorage";

function GuestRoute() {
  const accessToken = getAccessToken();

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;