import { Link } from "react-router-dom";
import { useItems } from "../context/ItemsContext";

function AdminDashboard() {
  const { items } = useItems();

  const lostCount = items.filter((i) => i.type === "Lost").length;
  const foundCount = items.filter((i) => i.type === "Found").length;

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-400">Platform overview and management</p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-white">2</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="mt-2 text-3xl font-bold text-white">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Lost Items</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{lostCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Found Items</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{foundCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/users"
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700"
          >
            <p className="text-2xl">👥</p>
            <p className="mt-3 font-semibold text-white">Manage Users</p>
            <p className="mt-1 text-sm text-gray-500">
              View, suspend, or activate users
            </p>
          </Link>
          <Link
            to="/admin/items"
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700"
          >
            <p className="text-2xl">📦</p>
            <p className="mt-3 font-semibold text-white">Manage Items</p>
            <p className="mt-1 text-sm text-gray-500">
              Review and moderate item reports
            </p>
          </Link>
          <Link
            to="/admin/reports"
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700"
          >
            <p className="text-2xl">🚩</p>
            <p className="mt-3 font-semibold text-white">View Reports</p>
            <p className="mt-1 text-sm text-gray-500">
              Review flagged content and reports
            </p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-white">Recent Activity</h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-800 p-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {item.type === "Lost" ? "🔍" : "🤝"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    item.type === "Lost"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;