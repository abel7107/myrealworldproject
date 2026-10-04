import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemsContext";
import { api } from "../api/client";

function Profile() {
  const { user, updateProfile } = useAuth();
  const { items } = useItems();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const myItems = items.filter((i) => i.ownerId === user?.id);

  const [watchlist, setWatchlist] = useState([]);
  useEffect(() => {
    api.getFavorites().then(({ data }) => setWatchlist(data)).catch(() => {});
  }, []);

  const removeFromWatchlist = async (id) => {
    try {
      await api.toggleFavorite(id);
      setWatchlist((prev) => prev.filter((i) => i.id !== id));
    } catch { /* ignore */ }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await updateProfile(form);
      setMsg("Profile updated.");
      setEditing(false);
    } catch (err) {
      setMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="mt-1 mb-8 text-gray-400">View and manage your account details</p>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-2xl font-bold text-blue-400">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing((v) => !v)}
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {msg && <p className="mt-4 text-sm text-gray-400">{msg}</p>}

          {editing ? (
            <form onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name"
                required
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone"
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <button
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:col-span-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <dl className="mt-6 grid gap-4 border-t border-gray-800 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="mt-1 text-white">{user?.phone || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Role</dt>
                <dd className="mt-1 text-white">{user?.role}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Member since</dt>
                <dd className="mt-1 text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Items reported</dt>
                <dd className="mt-1 text-white">{myItems.length}</dd>
              </div>
            </dl>
          )}
        </div>

        <Link to="/dashboard" className="mt-6 inline-block text-blue-500 hover:text-blue-400">
          ← Back to Dashboard
        </Link>

        {/* Watchlist */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">❤️ My Watchlist</h2>
          {watchlist.length > 0 ? (
            <div className="grid gap-4">
              {watchlist.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
                  <Link to={`/item/${item.id}`} className="flex items-center gap-4">
                    <span className="text-2xl">{item.type === "LOST" ? "🔍" : "🤝"}</span>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.location} · {item.status}
                      </p>
                    </div>
                  </Link>
                  <button onClick={() => removeFromWatchlist(item.id)} className="text-sm text-red-400 hover:text-red-300">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-gray-800 bg-gray-900 py-8 text-center text-gray-500">
              No saved items yet. Tap 🤍 on any item to watch it.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
