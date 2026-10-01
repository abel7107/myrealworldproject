import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemsContext";

function UserDashboard() {
  const { user } = useAuth();
  const { items } = useItems();

  // For now, show all items as "your items" — will filter by owner when backend is connected
  const myItems = items.slice(0, 4);
  const lostCount = myItems.filter((i) => i.type === "Lost").length;
  const foundCount = myItems.filter((i) => i.type === "Found").length;

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-gray-400">Manage your lost & found reports</p>
          </div>
          <Link
            to="/report"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + New Report
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Total Reports</p>
            <p className="mt-2 text-3xl font-bold text-white">{myItems.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Lost Items</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{lostCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Found Items</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{foundCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">0</p>
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-white">Your Recent Reports</h2>
          {myItems.length > 0 ? (
            <div className="grid gap-4">
              {myItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {item.type === "Lost" ? "🔍" : "🤝"}
                    </span>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.location} · {item.date}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.type === "Lost"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {item.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center">
              <p className="text-4xl">📋</p>
              <p className="mt-4 text-gray-400">No reports yet</p>
              <Link
                to="/report"
                className="mt-4 inline-block text-blue-500 hover:text-blue-400"
              >
                Create your first report →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserDashboard;