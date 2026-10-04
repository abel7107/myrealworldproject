import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MessageComposer from "../components/MessageComposer";

function Conversation() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await api.getConversation(conversationId);
      setConversation(data);
      setError("");
      // Opening a conversation marks received messages as read
      api.markConversationAsRead(conversationId).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to load conversation.");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleSend = async (content) => {
    const { data } = await api.sendMessage(conversation.otherUser.id, conversation.item.id, content);
    setConversation((prev) => ({ ...prev, messages: [...prev.messages, data] }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-5xl">😕</p>
          <h2 className="mt-4 text-2xl font-bold text-white">{error || "Conversation not found"}</h2>
          <Link to="/messages" className="mt-6 inline-block text-blue-500 hover:text-blue-400">← Back to Messages</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[80vh] flex-col bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <button onClick={() => navigate("/messages")} className="text-gray-400 transition hover:text-white" aria-label="Back to conversations">
            ←
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 font-bold text-blue-400">
            {conversation.otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white">{conversation.otherUser.name}</p>
            <p className="text-xs text-blue-400">{conversation.item.title}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-6 py-6">
        {conversation.messages.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No messages yet. Start the conversation.</p>
        ) : (
          conversation.messages.map((m) => {
            const mine = m.senderId === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${mine ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}>
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p className={`mt-1 text-[11px] ${mine ? "text-blue-200" : "text-gray-500"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <MessageComposer onSend={handleSend} />
      </div>
    </section>
  );
}

export default Conversation;
