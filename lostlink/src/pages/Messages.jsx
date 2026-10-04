import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getConversations()
      .then(({ data }) => !cancelled && setConversations(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.otherUser.name.toLowerCase().includes(q) ||
      c.item.title.toLowerCase().includes(q) ||
      c.lastMessage.content.toLowerCase().includes(q)
    );
  });

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="mt-1 mb-8 text-gray-400">Your conversations about lost &amp; found items</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center">
            <p className="text-4xl">💬</p>
            <h2 className="mt-4 text-xl font-semibold text-white">No messages yet</h2>
            <p className="mt-2 text-sm text-gray-500">Start a conversation with someone about a lost or found item.</p>
            <Link to="/items" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Browse Items
            </Link>
          </div>
        ) : (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              aria-label="Search conversations"
              className="mb-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No conversations match "{search}".</p>
            ) : (
              <div className="grid gap-3">
                {filtered.map((c) => (
                  <Link
                    key={c.conversationId}
                    to={`/messages/${c.conversationId}`}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition hover:border-gray-600 ${
                      c.unreadCount > 0 ? "border-blue-500/40 bg-blue-500/5" : "border-gray-800 bg-gray-900"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-lg font-bold text-blue-400">
                      {c.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate ${c.unreadCount > 0 ? "font-bold text-white" : "font-medium text-white"}`}>
                          {c.otherUser.name}
                        </p>
                        <p className="shrink-0 text-xs text-gray-500">
                          {new Date(c.lastMessage.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-blue-400">{c.item.title}</p>
                      <p className={`truncate text-sm ${c.unreadCount > 0 ? "text-gray-200" : "text-gray-500"}`}>
                        {c.lastMessage.content}
                      </p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Messages;
