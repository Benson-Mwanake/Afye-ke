// src/hooks/layouts/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect =
      user.role === "patient"
        ? "/patient-dashboard"
        : user.role === "clinic"
        ? "/clinic-dashboard"
        : user.role === "admin"
        ? "/admin-dashboard"
        : "/";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
