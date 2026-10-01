import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-white">
            Lost<span className="text-blue-500">Link</span>
          </h1>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`transition ${
              isActive("/") ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/items"
            className={`transition ${
              isActive("/items")
                ? "text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Browse Items
          </Link>
          <Link
            to="/report"
            className={`transition ${
              isActive("/report")
                ? "text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Report Item
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="rounded-lg px-4 py-2 text-gray-300 transition hover:text-white"
              >
                {user?.name?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-gray-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;