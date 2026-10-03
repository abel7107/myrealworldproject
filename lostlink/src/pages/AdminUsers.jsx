import { useState, useEffect } from "react";
import { api } from "../api/client";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getUsers()
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (user) => {
    try {
      const { data } = await api.updateUserStatus(user.id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? data : u)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
        <p className="mt-1 mb-8 text-gray-400">View, suspend, or activate users</p>

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
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 last:border-0">
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs ${user.role === "ADMIN" ? "bg-blue-500/10 text-blue-400" : "bg-gray-700 text-gray-300"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs ${user.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleStatus(user)}
                        disabled={user.role === "ADMIN"}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-gray-800 disabled:opacity-40"
                      >
                        {user.isActive ? "Suspend" : "Activate"}
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

export default AdminUsers;
