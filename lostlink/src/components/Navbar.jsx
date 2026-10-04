import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [notifUnread, setNotifUnread] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let cancelled = false;
    const load = () =>
      api.getUnreadCount()
        .then(({ data }) => !cancelled && setUnread(data.unreadCount))
        .catch(() => {});
    const loadNotifs = () =>
      api.getNotificationUnreadCount()
        .then(({ data }) => !cancelled && setNotifUnread(data.unreadCount))
        .catch(() => {});
    load();
    loadNotifs();
    const interval = setInterval(() => { load(); loadNotifs(); }, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isAuthenticated, location.pathname]);

  const openNotifs = async () => {
    setShowNotifs((v) => !v);
    if (!showNotifs) {
      try {
        const { data } = await api.getNotifications();
        setNotifs(data);
      } catch { /* ignore */ }
    }
  };

  const handleNotifClick = async (n) => {
    try { await api.markNotificationRead(n.id); } catch { /* ignore */ }
    setShowNotifs(false);
    setNotifUnread((c) => Math.max(0, c - (n.isRead ? 0 : 1)));
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotifUnread(0);
    } catch { /* ignore */ }
  };

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
            to="/map"
            className={`transition ${
              isActive("/map") ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Map
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
              <Link
                to="/profile"
                className="rounded-lg px-4 py-2 text-gray-300 transition hover:text-white"
              >
                Profile
              </Link>
              <div className="relative">
                <button
                  onClick={openNotifs}
                  className={`relative rounded-lg px-3 py-2 transition hover:text-white ${
                    showNotifs ? "text-white" : "text-gray-300"
                  }`}
                  title="Notifications"
                >
                  🔔
                  {notifUnread > 0 && (
                    <span className="ml-1.5 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                      {notifUnread}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900 shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                      <p className="font-semibold text-white">Notifications</p>
                      <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</p>
                      ) : (
                        notifs.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`block w-full border-b border-gray-800 px-4 py-3 text-left text-sm transition hover:bg-gray-800 ${
                              n.isRead ? "text-gray-400" : "bg-blue-500/5 text-white"
                            }`}
                          >
                            {n.message}
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/messages"
                className={`relative rounded-lg px-4 py-2 transition hover:text-white ${
                  isActive("/messages") ? "text-white" : "text-gray-300"
                }`}
              >
                Messages
                {unread > 0 && (
                  <span className="ml-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {unread}
                  </span>
                )}
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