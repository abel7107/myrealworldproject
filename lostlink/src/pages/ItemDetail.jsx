import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem, setItemStatus } = useItems();
  const { isAuthenticated, user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", description: "" });
  const [reportMsg, setReportMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const handleToggleStatus = async () => {
    setStatusMsg("");
    try {
      await setItemStatus(item.id, item.status === "RESOLVED" ? "ACTIVE" : "RESOLVED");
      const updated = await getItem(id);
      setItem(updated);
      setStatusMsg(item.status === "RESOLVED" ? "Item reopened." : "Item marked as resolved. 🎉");
    } catch (err) {
      setStatusMsg(err.message || "Failed to update status.");
    }
  };

  const contactOwner = async () => {
    // Reuse an existing conversation if one already exists for this item + owner
    try {
      const { data } = await api.getConversations();
      const existing = data.find(
        (c) => c.item?.id === item.id && c.otherUser.id === item.ownerId
      );
      navigate(existing ? `/messages/${existing.conversationId}` : `/messages/${item.id}:${item.ownerId}`);
    } catch {
      navigate(`/messages/${item.id}:${item.ownerId}`);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getItem(id)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, getItem]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!item) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-6xl">😕</p>
          <h2 className="mt-6 text-3xl font-bold text-white">Item Not Found</h2>
          <p className="mt-3 text-gray-400">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/items"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            ← Back to Items
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 transition hover:text-white"
        >
          ← Go Back
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          {/* Image */}
          <div className="flex h-64 items-center justify-center bg-gray-800 md:h-96">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <span className="text-8xl">
                {item.type === "Lost" ? "🔍" : "🤝"}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">{item.title}</h1>
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  item.type === "Lost"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {item.type}
              </span>
            </div>

            {item.status && item.status !== "ACTIVE" && (
              <div className="mb-4">
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    item.status === "RESOLVED"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {item.status === "RESOLVED" ? "✅ Resolved" : item.status}
                </span>
              </div>
            )}

            <div className="mb-6 grid gap-4 border-b border-gray-800 pb-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">📍 Location</p>
                <p className="mt-1 text-white">{item.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">🏷️ Category</p>
                <p className="mt-1 text-white">{item.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">📅 Date Reported</p>
                <p className="mt-1 text-white">{item.date}</p>
              </div>
              {item.contactName && (
                <div>
                  <p className="text-sm text-gray-500">👤 Contact</p>
                  <p className="mt-1 text-white">{item.contactName}</p>
                </div>
              )}
            </div>

            {item.description && (
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-500">Description</p>
                <p className="leading-relaxed text-gray-300">
                  {item.description}
                </p>
              </div>
            )}

            {item.contactPhone && (
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                <p className="text-sm text-gray-500">📞 Contact Phone</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {item.contactPhone}
                </p>
              </div>
            )}

            {/* Owner: resolve / reopen */}
            {isAuthenticated && item.ownerId === user?.id && (
              <div className="mb-6">
                <button
                  onClick={handleToggleStatus}
                  className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
                    item.status === "RESOLVED"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {item.status === "RESOLVED" ? "↩ Reopen this item" : "✅ Mark as Resolved"}
                </button>
                {statusMsg && <p className="mt-2 text-sm text-gray-400">{statusMsg}</p>}
              </div>
            )}

            {/* Contact the item owner */}
            {item.ownerId !== user?.id && (
              <div className="mb-6">
                {isAuthenticated ? (
                  <button
                    onClick={contactOwner}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    💬 Contact User
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-block rounded-xl border border-blue-500/40 px-6 py-3 font-semibold text-blue-400 transition hover:bg-blue-500/10"
                  >
                    Log in to contact the owner
                  </Link>
                )}

              </div>
            )}

            {/* Report this item */}
            <div className="mt-6">
              {isAuthenticated ? (
                <button
                  onClick={() => setReportOpen((v) => !v)}
                  className="text-sm text-gray-500 transition hover:text-red-400"
                >
                  🚩 Report this item
                </button>
              ) : (
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-400">
                  Log in to report this item
                </Link>
              )}
              {reportMsg && (
                <p className="mt-2 text-sm text-gray-400">{reportMsg}</p>
              )}
              {reportOpen && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setReportMsg("");
                    try {
                      await api.reportItem(id, reportForm);
                      setReportMsg("Report submitted. Thank you.");
                      setReportOpen(false);
                      setReportForm({ reason: "", description: "" });
                    } catch (err) {
                      setReportMsg(err.message || "Failed to submit report.");
                    }
                  }}
                  className="mt-4 grid gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
                >
                  <select
                    required
                    value={reportForm.reason}
                    onChange={(e) => setReportForm((p) => ({ ...p, reason: e.target.value }))}
                    className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="Spam">Spam</option>
                    <option value="Inappropriate">Inappropriate content</option>
                    <option value="Scam">Scam or fraud</option>
                    <option value="Duplicate">Duplicate post</option>
                    <option value="Other">Other</option>
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Details (optional)"
                    value={reportForm.description}
                    onChange={(e) => setReportForm((p) => ({ ...p, description: e.target.value }))}
                    className="resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                  <button className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
                    Submit Report
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemDetail;
