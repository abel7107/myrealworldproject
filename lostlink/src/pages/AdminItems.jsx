import { useState, useEffect } from "react";
import { api } from "../api/client";

const STATUSES = ["PENDING", "ACTIVE", "RESOLVED", "REMOVED"];

function AdminItems() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminItems()
      .then(({ data }) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const { data } = await api.updateAdminItemStatus(id, status);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: data.status } : i)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">Manage Items</h1>
        <p className="mt-1 mb-8 text-gray-400">Review and moderate item reports</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 last:border-0">
                    <td className="p-4 text-white">{item.title}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs ${item.type === "LOST" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{item.owner?.name}</td>
                    <td className="p-4">
                      <select
                        value={item.status}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => remove(item.id)}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminItems;
