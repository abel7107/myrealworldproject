import { useState } from "react";

function MessageComposer({ onSend, disabled, placeholder = "Write a message..." }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setError("");
    setSending(true);
    try {
      await onSend(trimmed);
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-gray-800 bg-gray-950 p-4">
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <div className="flex items-end gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          aria-label="Message input"
          className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={disabled || sending || !content.trim()}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}

export default MessageComposer;
