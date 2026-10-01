import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Requires admin but user is not admin → redirect to home
  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // All good → render the protected page
  return children;
}

export default ProtectedRoute;