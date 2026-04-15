import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p className="text-white p-6">Loading...</p>;

  if (!user) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <p className="text-white p-6">Access Denied</p>;
  }

  return <Outlet />;
};

export default PrivateRoute;