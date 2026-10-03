import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemsContext";

function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const { items, deleteItem } = useItems();

  const myItems = items.filter((i) => i.ownerId === user?.id);
  const lostCount = myItems.filter((i) => i.type === "Lost").length;
  const foundCount = myItems.filter((i) => i.type === "Found").length;

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [actionError, setActionError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      await updateProfile(profileForm);
      setProfileMsg("Profile updated.");
      setEditingProfile(false);
    } catch (err) {
      setProfileMsg(err.message || "Failed to update profile.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteItem(id);
    } catch (err) {
      setActionError(err.message || "Failed to delete item.");
    }
  };

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
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {myItems.filter((i) => i.status === "RESOLVED").length}
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Profile</h2>
            <button
              onClick={() => setEditingProfile((v) => !v)}
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              {editingProfile ? "Cancel" : "Edit"}
            </button>
          </div>
          {profileMsg && <p className="mt-3 text-sm text-gray-400">{profileMsg}</p>}
          {editingProfile ? (
            <form onSubmit={handleProfileSave} className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name"
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone"
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
              <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:col-span-2">
                Save Profile
              </button>
            </form>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              {user?.name} · {user?.email} · {user?.phone || "No phone"}
            </p>
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-white">Your Reports</h2>
          {actionError && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {actionError}
            </div>
          )}
          {myItems.length > 0 ? (
            <div className="grid gap-4">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700"
                >
                  <Link to={`/item/${item.id}`} className="flex items-center gap-4">
                    <span className="text-2xl">
                      {item.type === "Lost" ? "🔍" : "🤝"}
                    </span>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.location} · {item.date} · {item.status}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/item/${item.id}/edit`}
                      className="text-sm text-blue-500 hover:text-blue-400"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        item.type === "Lost"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
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
