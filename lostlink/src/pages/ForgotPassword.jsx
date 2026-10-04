import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [devToken, setDevToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setDevToken("");
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setMsg(res.message);
      if (res.devToken) setDevToken(res.devToken);
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-white">Reset Password</h1>
        <p className="mt-2 text-center text-gray-400">
          Enter your email to get a reset token
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {msg && <p className="mb-6 text-sm text-green-400">{msg}</p>}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
          {devToken && (
            <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300 break-all">
              <p className="font-medium">Dev token (email would normally send this):</p>
              <p className="mt-1">{devToken}</p>
              <Link
                to={`/reset-password?token=${devToken}`}
                className="mt-3 inline-block text-blue-400 hover:text-blue-300"
              >
                Go to reset page →
              </Link>
            </div>
          )}
          <p className="mt-6 text-center text-sm text-gray-400">
            Remembered it?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
